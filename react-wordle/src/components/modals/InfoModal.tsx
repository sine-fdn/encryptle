import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'

type Props = {
    isOpen: boolean
    handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
    return (
        <BaseModal title="How to play" isOpen={isOpen} handleClose={handleClose}>
            <p className="text-sm text-gray-500 dark:text-gray-300">
                Guess the word in 6 tries. After each guess, the color of the tiles will
                change to show how close your guess was to the word.
            </p>

            <div className="mb-1 mt-4 flex justify-center">
                <Cell
                    isRevealing={true}
                    isCompleted={true}
                    value="W"
                    status="correct"
                />
                <Cell value="E" isCompleted={true} />
                <Cell value="A" isCompleted={true} />
                <Cell value="R" isCompleted={true} />
                <Cell value="Y" isCompleted={true} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-300">
                The letter W is in the word and in the correct spot.
            </p>

            <div className="mb-1 mt-4 flex justify-center">
                <Cell value="P" isCompleted={true} />
                <Cell value="I" isCompleted={true} />
                <Cell
                    isRevealing={true}
                    isCompleted={true}
                    value="L"
                    status="present"
                />
                <Cell value="O" isCompleted={true} />
                <Cell value="T" isCompleted={true} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-300">
                The letter L is in the word but in the wrong spot.
            </p>

            <div className="mb-1 mt-4 flex justify-center">
                <Cell value="V" isCompleted={true} />
                <Cell value="A" isCompleted={true} />
                <Cell value="G" isCompleted={true} />
                <Cell isRevealing={true} isCompleted={true} value="U" status="absent" />
                <Cell value="E" isCompleted={true} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-300">
                The letter U is not in the word in any spot.
            </p>

            <div className="mb-1 mt-4 flex justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-300">
                    <span
                        className="font-bold"
                    >
                        Please note:
                    </span> This version of Wordle uses <a
                        href="https://github.com/sine-fdn"
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold underline"
                    >
                        SINE's Multiparty Computation (MPC) engine
                    </a>.
                    It is privacy preserving because the server has no access to the user's guesses,
                    just as the user has no access to the secret word (except by solving it).
                    The MPC engine runs after each guess, taking a few seconds to output a response.
                    The letters in your guess will become transparent while the MPC engine is running.
                    Please be patient!
                </p>
            </div>

            <p className="mt-6 text-sm italic text-gray-500 dark:text-gray-300">
                This is based on an open source version of the word guessing game we all know and
                love -{' '}
                <a
                    href="https://github.com/cwackerfuss/react-wordle"
                    className="font-bold underline"
                >
                    check out the code here
                </a>{' '}
            </p>
        </BaseModal>
    )
}
