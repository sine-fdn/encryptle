use chrono::Datelike;
use chrono::Utc;
use m1::Circuit;
use m1_garble_interop::{check_program, compile_program, serialize_input, Role};
use m1_http_server::{build, MpcRequest};
use rand::prelude::*;
use rand::SeedableRng;
use std::iter::zip;

#[macro_use]
extern crate rocket;

#[launch]
fn rocket() -> _ {
    let words: Vec<&str> = include_str!("words.txt").trim().split('\n').collect();
    let wordle_code = include_str!("wordle.garble.rs").trim();
    let prg = check_program(wordle_code).unwrap();
    let circuit = compile_program(&prg, &"wordle").unwrap();

    let mut nonce_rng = StdRng::from_entropy();
    let nonce: u64 = nonce_rng.gen();

    let handler = move |r: MpcRequest| -> Result<(Circuit, Vec<bool>), String> {
        let client_program = r.program.chars();
        let server_program = wordle_code.chars();
        let mut differences = zip(client_program, server_program);
        let mismatch_index = differences.position(|(a, b)| a != b);

        if let Some(mismatch_index) = mismatch_index {
            fn extract_snippet(code: &str, index: usize) -> String {
                let snippet: String = code.chars().skip(index).take(10).collect();
                let snippet = snippet.replace("\\", "\\\\").replace("\n", "\\n");
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
        Ok((circuit.gates.clone(), input))
    };

    build(Box::new(handler))
}

fn word_as_garble_literal(word: &str) -> String {
    let word = word.trim();
    if word.len() != 5 {
        panic!("A guess must have exactly 5 letters!");
    }
    let input_as_ascii: Vec<u8> = word
        .to_lowercase()
        .chars()
        .into_iter()
        .map(|c| c as u8)
        .collect();

    let mut input_as_garble_literal = "[".to_string();
    for (i, char) in input_as_ascii.iter().enumerate() {
        if i == 0 {
            input_as_garble_literal += &format!("{char}u8");
        } else {
            input_as_garble_literal += &format!(", {char}u8");
        }
    }
    input_as_garble_literal += "]";
    input_as_garble_literal
}
