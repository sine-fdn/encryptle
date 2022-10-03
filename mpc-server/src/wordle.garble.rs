pub fn wordle(secret_word: [u8; 5], guess: [u8; 5]) -> [Guess; 5] {
    let mut intermediate_score = [Guess::Wrong(0u8); 5];

    for i in 0usize..5usize {
        if secret_word[i] == guess[i] {
            intermediate_score[i] = Guess::Correct(guess[i])
        } else if is_present(secret_word, guess, i) {
            intermediate_score[i] = Guess::WrongPosition(guess[i])
        }
    }
    intermediate_score
}

enum Guess {
    Wrong(u8),
    WrongPosition(u8),
    Correct(u8),
}

fn is_present(secret_word: [u8; 5], guess: [u8; 5], i: usize) -> bool {
    let character = guess[i];

    let mut char_occurrences_in_secret_word = 0u8;
    for j in 0usize..5usize {
        let is_correct = secret_word[j] == guess[j];
        if secret_word[j] == character && !is_correct {
            char_occurrences_in_secret_word = char_occurrences_in_secret_word + 1u8
        }
    }

    let mut nth_occurrence_in_guess = 0u8;
    for j in 0usize..5usize {
        let is_correct = secret_word[j] == guess[j];
        if j <= i && guess[j] == character && !is_correct {
            nth_occurrence_in_guess = nth_occurrence_in_guess + 1u8;
        }
    }

    char_occurrences_in_secret_word >= nth_occurrence_in_guess
}
