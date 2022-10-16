use chrono::Datelike;
use chrono::Utc;
use m1::Circuit;
use m1_garble_interop::{check_program, compile_program, serialize_input, Role};
use m1_http_server::HandledRequest;
use m1_http_server::{build, MpcRequest};
use rand::prelude::*;
use rand::SeedableRng;
use std::collections::HashMap;
use std::{env, fmt::Write, iter::zip};

#[macro_use]
extern crate rocket;

#[launch]
fn rocket() -> _ {
    let words: Vec<_> = include_str!("words.txt").trim().split('\n').collect();

    let wordle_code = include_str!("../garble/wordle.garble.rs");

    let prg = check_program(wordle_code).unwrap();
    let circuit = compile_program(&prg, "wordle").unwrap();

    let mut nonce_rng = seed_rng();

    let nonce: u64 = nonce_rng.gen();

    let handler = move |r: MpcRequest| -> Result<HandledRequest, String> {
        let client_program = r.program.chars();
        let server_program = wordle_code.chars();
        let mut differences = zip(client_program, server_program);
        let mismatch_index = differences.position(|(a, b)| a != b);

        if let Some(mismatch_index) = mismatch_index {
            fn extract_snippet(code: &str, index: usize) -> String {
                let snippet: String = code.chars().skip(index).take(10).collect();
                let snippet = snippet.replace('\\', "\\\\").replace('\n', "\\n");
                format!("'{snippet}...'")
            }

            let client = extract_snippet(&r.program, mismatch_index);
            let server = extract_snippet(wordle_code, mismatch_index);

            return Err(format!(
                "Programs differ at character {mismatch_index}: {client}, {server}"
            ));
        }

        let current_date = Utc::today();
        let days_since_unix_epoch = current_date.num_days_from_ce();

        let random_choice = (days_since_unix_epoch as u64 + nonce) as usize % words.len();
        println!("Secret word: {}", words[random_choice]);

        let input = word_as_garble_literal(words[random_choice]);
        let input = serialize_input(Role::Contributor, &prg, &circuit.fn_def, &input)?;
        let mut request_headers = HashMap::new();
        if let Ok(fly_alloc_id) = env::var("FLY_ALLOC_ID") {
            let fly_instance_id = fly_alloc_id.split("-").collect::<Vec<_>>()[0].to_string();
            request_headers.insert("fly-force-instance-id".to_string(), fly_instance_id);
        }
        Ok(HandledRequest {
            circuit: circuit.gates.clone(),
            input_from_server: input,
            request_headers,
        })
    };

    println!("Starting MPC Wordle server...");
    build(Box::new(handler))
}

fn seed_rng() -> StdRng {
    let env_seed = env::var("RNG_SEED");

    match env_seed {
        Ok(env_seed) if env_seed.chars().count() == 64 => {
            let mut rng_seed = [0; 32];

            for i in 0..32 {
                // Divides string into pairs of characters, each pair being a hexadecimal number
                let hex_pair = &env_seed[i * 2..i * 2 + 2];
                if let Ok(byte) = u8::from_str_radix(hex_pair, 16) {
                    rng_seed[i] = byte;
                } else {
                    return StdRng::from_entropy();
                }
            }
            println!("Initializing RNG using $RNG_SEED...");
            StdRng::from_seed(rng_seed)
        }
        _ => StdRng::from_entropy(),
    }
}

fn word_as_garble_literal(word: &str) -> String {
    let word = word.trim();
    let input_as_ascii: Vec<u8> = word
        .to_lowercase()
        .chars()
        .into_iter()
        .map(|c| c as u8)
        .collect();

    let mut input_as_garble_literal = "[".to_string();
    for (i, char) in input_as_ascii.iter().enumerate() {
        if i == 0 {
            write!(input_as_garble_literal, "{char}u8").unwrap();
        } else {
            write!(input_as_garble_literal, ", {char}u8").unwrap();
        }
    }
    input_as_garble_literal += "]";
    input_as_garble_literal
}
