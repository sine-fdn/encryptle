



pub fn wordle(secret_word: [u8; 5], user_attempt: [u8; 5]) -> [Guess; 5] {
    let mut intermediate_score = [Guess::Wrong(0u8); 5];

    for i in 0usize..5usize {
        if secret_word[i] == user_attempt[i] {
            intermediate_score[i] = Guess::Correct(user_attempt[i])
        } else if character_exists(user_attempt[i], secret_word) {
            intermediate_score[i] = Guess::WrongPosition(user_attempt[i])
        } else {
            intermediate_score[i] = Guess::Wrong(user_attempt[i])
        }
    }

    intermediate_score
}

fn character_exists(character: u8, word: [u8; 5]) -> bool {
    let mut exists = false;
    for i in 0usize..5usize {
        if word[i] == character {
            exists = true;
        }
    }
    exists
}

enum Guess {
    Wrong(u8),
    WrongPosition(u8),
    Correct(u8),
}
