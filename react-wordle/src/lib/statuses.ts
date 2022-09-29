import { GuessedWord } from './localStorage'
import { unicodeSplit } from './words'

export type CharStatus = 'absent' | 'present' | 'correct'

export const getStatuses = (
    guesses: GuessedWord[]
): { [key: string]: CharStatus } => {
    const charObj: { [key: string]: CharStatus } = {}

    guesses.forEach((word) => {
        word.forEach((guessedChar) => {
            if (guessedChar.mpcResult === "wrong") {
                // make status absent
                return (charObj[guessedChar.char] = 'absent')
            }

            if (guessedChar.mpcResult === "correct") {
                //make status correct
                return (charObj[guessedChar.char] = 'correct')
            }

            if (guessedChar.mpcResult === "wrongPosition") {
                //make status present
                return (charObj[guessedChar.char] = 'present')
            }
        })
    })

    return charObj
}

export const getGuessStatuses = (
    guess: GuessedWord
): CharStatus[] => {
    return guess.map((guessedChar) => {
        switch (guessedChar.mpcResult) {
            case "correct":
                return 'correct' as CharStatus
            case "wrongPosition":
                return 'present' as CharStatus
            default:
                return 'absent' as CharStatus
        }
    })
}
