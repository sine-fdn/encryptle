import { REVEAL_TIME_MS } from '../../constants/settings'
import { CharStatus } from '../../lib/statuses'
import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'
import classnames from 'classnames'

type Props = {
    isOpen: boolean
    handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
    return (
        <BaseModal title="How to Play" isOpen={isOpen} handleClose={handleClose}>
            <p className="text-sm text-gray-500 dark:text-gray-300">
                Guess the word in 6 tries.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-300">
                The color of the tiles will show how close your guess was to the word.
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

            <h3 className="text-lg font-medium mt-8 leading-6 text-gray-900 dark:text-gray-100">Privacy-Preserving</h3>

            <div className="mb-1 mt-2 flex justify-center">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                        Your guess is private and kept hidden from the server.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                        The server's daily word is private and kept hidden from you.
                    </p>
                </div>
            </div>

            <div className="mb-1 mt-4 flex justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-300">
                    Made possible by <a
                        href="https://github.com/sine-fdn"
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold underline"
                    >
                        SINE's Secure Multi-Party Computation (SMPC) engine
                    </a>:
                </p>
            </div>

            <div className="mt-8 flex justify-center">
                <AnimCell value="P" piece={0} delay={0} isCompleted={true} role="client" />
                <AnimCell value="A" piece={1} delay={1} isCompleted={true} role="client" status="correct" />
                <AnimCell value="G" piece={2} delay={2} isCompleted={true} role="client" status="correct" />
                <AnimCell value="E" piece={3} delay={3} isCompleted={true} role="client" status="present" />
                <AnimCell value="S" piece={4} delay={4} isCompleted={true} role="client" />
            </div>

            <div className="flex justify-center">
                <AnimCell value="-" piece={0} delay={0} role="invisible" />
            </div>

            <div className="flex justify-center">
                <AnimCell value="-" piece={0} delay={0} role="invisible" />
            </div>

            <div className="flex justify-center">
                <AnimCell value="-" piece={0} delay={0} role="invisible" />
            </div>

            <div className="mb-4 flex justify-center">
                <AnimCell value="V" piece={5} isCompleted={true} role="server" />
                <AnimCell value="A" piece={1} isCompleted={true} role="server" status="correct" />
                <AnimCell value="G" piece={2} isCompleted={true} role="server" status="correct" />
                <AnimCell value="U" piece={6} isCompleted={true} role="server" />
                <AnimCell value="E" piece={3} isCompleted={true} role="server" status="present" />
            </div>


            <p className="text-sm text-gray-500 dark:text-gray-300">
                With SMPC, neither you nor the server have to trust each other. Your guess is never sent directly to the server. Instead, both parties encrypt their data and cooperatively check the guess against the solution, without revealing the guess or the solution.
            </p>

            <p className="mt-8 text-sm italic text-gray-500 dark:text-gray-300">
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

type CellProps = {
    value?: string
    status?: CharStatus
    isRevealing?: boolean
    isCompleted?: boolean
    position?: number
    role: 'client' | 'server' | 'invisible'
    piece: number
    delay?: number
}

const AnimCell = ({
    value,
    status,
    isRevealing,
    isCompleted,
    position = 0,
    role,
    piece,
    delay
}: CellProps) => {
    const isFilled = value && !isCompleted
    const shouldReveal = isRevealing && isCompleted
    const animationDelay = `${position * REVEAL_TIME_MS}ms`

    let animColor = '';
    if (status === 'correct') {
        animColor = 'anim-color-correct';
    } else if (status === 'present') {
        animColor = 'anim-color-present';
    } else {
        animColor = 'anim-color-absent';
    }

    let delayClass = '';
    if (delay === 0) {
        delayClass = 'delay0'
    } else if (delay === 1) {
        delayClass = 'delay1';
    } else if (delay === 2) {
        delayClass = 'delay2';
    } else if (delay === 3) {
        delayClass = 'delay3';
    } else if (delay === 4) {
        delayClass = 'delay4';
    }

    let textColor = '';
    if (status === 'correct') {
        textColor = 'text-color-correct';
    } else if (status === 'present') {
        textColor = 'text-color-present';
    } else {
        textColor = 'text-color-absent';
    }

    const classes = classnames(
        'xxshort:w-11 xxshort:h-11 short:text-2xl short:w-12 short:h-12 w-14 h-14 border-solid border flex items-center justify-center mx-0.5 text-4xl font-normal rounded',
        {
            'bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-500 dark:text-white':
                true,
            'border-black dark:border-slate-100': value,
            'cell-fill-animation': isFilled,
            'cell-reveal': shouldReveal,
        },
        'popup-anim',
        role === 'client' ? 'anim-cell-client' : 'anim-cell-server',
        role === 'invisible' ? 'invisible' : '',
        animColor,
        delayClass,
    )
    const classesPlaceholder = classnames(
        'xxshort:w-11 xxshort:h-11 short:text-2xl short:w-12 short:h-12 w-14 h-14 border-solid border flex items-center justify-center mx-0.5 text-4xl font-normal rounded',
        {
            'bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-600 dark:text-white':
                true,
            'border-gray dark:border-slate-100': value,
            'cell-fill-animation': isFilled,
            'cell-reveal': shouldReveal,
        },
        'popup-cell-placeholder',
        role === 'invisible' ? 'invisible' : '',
        textColor,
        delayClass,
    )

    let pieces = [
        ['out', 'in'],
        ['in', 'out'],
        ['in', 'none'],
        ['none', 'out'],
        ['out', 'out'],
        ['out', 'none'],
        ['in', 'in'],
        ['none', 'in'],
    ];
    let chosenPiece = pieces[piece];

    return (
        <div>
            <div className={classes} style={{ animationDelay }}>
                {chosenPiece[0] === 'in' ? <div className="puzzle puzzle-left puzzle-in" /> : null}
                {chosenPiece[0] === 'out' ? <div className="puzzle puzzle-left puzzle-out" /> : null}
                {chosenPiece[1] === 'in' ? <div className="puzzle puzzle-right puzzle-in" /> : null}
                {chosenPiece[1] === 'out' ? <div className="puzzle puzzle-right puzzle-out" /> : null}
            </div>
            <div className={classesPlaceholder} style={{ animationDelay }}>
                <div className="popup letter-container" style={{ animationDelay }}>
                    {value}
                </div>
            </div>
        </div>
    )
}
