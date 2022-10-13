export const wordle_code: string = `pub fn wordle(secret_word: [u8; 5], guess: [u8; 5]) -> [Guess; 5] {
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

// Checks whether there are still occurrences of each character to be guessed
fn is_present(secret_word: [u8; 5], guess: [u8; 5], i: usize) -> bool {
  let character = guess[i];

  let mut char_occurrences_in_secret_word = 0u8;
  for j in 0usize..5usize {
      let is_correct = secret_word[j] == guess[j];
      // Counts the number of occurrences of each not-yet-guessed character
      if secret_word[j] == character && !is_correct {
          char_occurrences_in_secret_word = char_occurrences_in_secret_word + 1u8
      }
  }

  let mut nth_occurrence_in_guess = 0u8;
  for j in 0usize..5usize {
      let is_correct = secret_word[j] == guess[j];
      // Sets the ordinality of each not-yet-guessed character
      if j <= i && guess[j] == character && !is_correct {
          nth_occurrence_in_guess = nth_occurrence_in_guess + 1u8;
      }
  }
  // Yields false if the ordinality of a not-yet-guessed character is bigger than the number of
  // occurrences of that character and true otherwise. Thus, if the secret word has e.g. one 't'
  // (as in 'otter') and the guess is 'paint' or 'that', yields true, but false if the guess has
  // three 't'. Hence, if the secret word is 'otter' and the guess 'that', both 't' will be yellow
  // (WrongPosition), but if the secret word is 'paint' and the guess 'otter', only one will be
  // yellow (WrongPosition)
  char_occurrences_in_secret_word >= nth_occurrence_in_guess
}
`

export default wordle_code;
