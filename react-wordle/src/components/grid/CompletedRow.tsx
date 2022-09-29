import { GuessedWord } from '@/lib/localStorage'
import { getGuessStatuses } from '../../lib/statuses'
import { Cell } from './Cell'

type Props = {
    // solution: string
    guess: GuessedWord
    isRevealing?: boolean
}

export const CompletedRow = ({ guess, isRevealing }: Props) => {
    const statuses = getGuessStatuses(guess)

    return (
        <div className="mb-1 flex justify-center">
            {guess.map((guessedChar, i) => (
                <Cell
                    key={i}
                    value={guessedChar.char}
                    status={statuses[i]}
                    position={i}
                    isRevealing={isRevealing}
                    isCompleted
                />
            ))}
        </div>
    )
}
