import { useEffect, useState } from 'react'
import { solution, unicodeSplit } from '../../lib/words'
import { Cell } from './Cell'

type Props = {
    guess: string,
    className: string,
}

function pickLetter(rand: number, index: number): string {
    const greek = ['β', 'Γ', 'Δ', 'δ', 'ε', 'ζ', 'η', 'Θ', 'θ', 'κ', 'Λ', 'λ', 'μ', 'Ξ', 'ξ', 'Π', 'π', 'Σ', 'ς', 'τ', 'Φ', 'φ', 'χ', 'Ψ', 'ψ', 'Ω', 'ω'];
    const hebrew = ['א', 'ב', 'ג', 'ד', 'ה', 'ז', 'ח', 'ך', 'כ', 'ל', 'ם', 'מ', 'נ', 'ע', 'ף', 'פ', 'ץ', 'צ', 'ק', 'ר', 'ש', 'ת', 'װ', 'ױ'];
    const georgian = ['ა', 'ბ', 'გ', 'დ', 'ე', 'ვ', 'ზ', 'თ', 'ი', 'კ', 'ლ', 'მ', 'ნ', 'ო', 'პ', 'ჟ', 'რ', 'ს', 'ტ', 'უ', 'ფ', 'ქ', 'ღ', 'შ', 'ჩ', 'ც', 'ძ', 'წ', 'ჭ', 'ხ', 'ჯ', 'ჰ'];
    const arabic = ['غ', 'ظ', 'ض', 'ذ', 'خ', 'ث', 'ت', 'ش', 'ر', 'ق', 'ص', 'ف', 'ع', 'س', 'ن', 'م', 'ل', 'ك', 'ي', 'ط', 'ح', 'ز', 'و', 'د', 'ج', 'ب']
    const alphabets = greek.concat(hebrew).concat(georgian).concat(arabic);
    return alphabets[Math.floor(rand * alphabets.length + index) % alphabets.length];
}

export const CurrentRow = ({ guess, className }: Props) => {
    const splitGuess = unicodeSplit(guess)
    const emptyCells = Array.from(Array(solution.length - splitGuess.length))
    const classes = `flex justify-center mb-1 ${className}`


    const [rand, setRand] = useState(Math.random());

    useEffect(() => {
        setTimeout(() => {
            setRand(Math.random());
        }, 10);
    });

    return (
        <div className={classes}>
            {splitGuess.map((letter, i) => (
                <Cell key={i} value={className.includes('checking') ? pickLetter(rand, i) : letter} />
            ))}
            {emptyCells.map((_, i) => (
                <Cell key={i} />
            ))}
        </div>
    )
}
