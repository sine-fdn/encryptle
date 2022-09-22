use chrono::Datelike;
use chrono::Utc;
use m1::Circuit;
use m1_garble_interop::{check_program, compile_program, serialize_input, Role};
use m1_http_server::{build, MpcRequest};
use rand::prelude::*;
use rand::SeedableRng;

#[macro_use]
extern crate rocket;

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

#[launch]
fn rocket() -> _ {
    let words: Vec<&str> = include_str!("words.txt").trim().split('\n').collect();
    println!("{:?}", words);

    let prg = check_program(include_str!("wordle.garble.rs")).unwrap();
    let circuit = compile_program(&prg, &"wordle").unwrap();

    let current_date = Utc::today();
    let days_since = current_date.num_days_from_ce();

    let mut first_rng = StdRng::seed_from_u64(days_since as u64);
    let first_random_number = first_rng.gen::<u64>();
    println!("{first_random_number}");

    let mut second_rng = StdRng::seed_from_u64(first_random_number);
    let second_random_number = second_rng.gen::<u64>();
    println!("{second_random_number}");

    let random_index = second_random_number as usize % words.len();
    println!("{}", words[random_index]);

    let handler = move |_: MpcRequest| -> Result<(Circuit, Vec<bool>), String> {
        let input = serialize_input(
            Role::Contributor,
            &prg,
            &circuit.fn_def,
            &word_as_garble_literal(words[random_index]),
        )?;
        Ok((circuit.gates.clone(), input))
    };

    build(Box::new(handler))
}
