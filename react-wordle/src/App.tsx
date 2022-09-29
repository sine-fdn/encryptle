import './App.css'

import { ClockIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'

import { AlertContainer } from './components/alerts/AlertContainer'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { DatePickerModal } from './components/modals/DatePickerModal'
import { InfoModal } from './components/modals/InfoModal'
import { MigrateStatsModal } from './components/modals/MigrateStatsModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { StatsModal } from './components/modals/StatsModal'
import { Navbar } from './components/navbar/Navbar'
import {
    DATE_LOCALE,
    DISCOURAGE_INAPP_BROWSERS,
    LONG_ALERT_TIME_MS,
    MAX_CHALLENGES,
    REVEAL_TIME_MS,
    WELCOME_INFO_MODAL_MS,
} from './constants/settings'
import {
    CORRECT_WORD_MESSAGE,
    DISCOURAGE_INAPP_BROWSER_TEXT,
    GAME_COPIED_MESSAGE,
    HARD_MODE_ALERT_MESSAGE,
    NOT_ENOUGH_LETTERS_MESSAGE,
    SHARE_FAILURE_TEXT,
    WIN_MESSAGES,
    WORD_NOT_FOUND_MESSAGE,
} from './constants/strings'
import { useAlert } from './context/AlertContext'
import { isInAppBrowser } from './lib/browser'
import {
    getStoredIsHighContrastMode,
    loadGameStateFromLocalStorage,
    saveGameStateToLocalStorage,
    setStoredIsHighContrastMode,
} from './lib/localStorage'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import {
    findFirstUnusedReveal,
    getGameDate,
    getIsLatestGame,
    isWinningWord,
    isWordInWordList,
    setGameDate,
    solution,
    solutionGameDate,
    unicodeLength,
} from './lib/words'
import init, { MpcData, MpcProgram, compute } from './pkg/m1_http_client'

// import * as mpc from "./pkg/m1_http_client";

localStorage.clear()

const source_code = `pub fn wordle(secret_word: [u8; 5], user_attempt: [u8; 5]) -> [Guess; 5] {
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
`

function App() {
    const isLatestGame = getIsLatestGame()
    const gameDate = getGameDate()
    const prefersDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches

    const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
        useAlert()
    const [currentGuess, setCurrentGuess] = useState('')
    const [isGameWon, setIsGameWon] = useState(false)
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
    const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
    const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false)
    const [isMigrateStatsModalOpen, setIsMigrateStatsModalOpen] = useState(false)
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
    const [currentRowClass, setCurrentRowClass] = useState('')
    const [isGameLost, setIsGameLost] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme')
            ? localStorage.getItem('theme') === 'dark'
            : prefersDarkMode
                ? true
                : false
    )
    const [isHighContrastMode, setIsHighContrastMode] = useState(
        getStoredIsHighContrastMode()
    )
    const [isRevealing, setIsRevealing] = useState(false)
    const [guesses, setGuesses] = useState<string[]>(() => {
        const loaded = loadGameStateFromLocalStorage(isLatestGame)
        if (loaded?.solution !== solution) {
            return []
        }
        const gameWasWon = loaded.guesses.includes(solution)
        if (gameWasWon) {
            setIsGameWon(true)
        }
        if (loaded.guesses.length === MAX_CHALLENGES && !gameWasWon) {
            setIsGameLost(true)
            showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
                persist: true,
            })
        }
        return loaded.guesses
    })

    const [stats, setStats] = useState(() => loadStats())

    const [isHardMode, setIsHardMode] = useState(
        localStorage.getItem('gameMode')
            ? localStorage.getItem('gameMode') === 'hard'
            : false
    )

    useEffect(() => {
        // if no game state on load,
        // show the user the how-to info modal
        if (!loadGameStateFromLocalStorage(true)) {
            setTimeout(() => {
                setIsInfoModalOpen(true)
            }, WELCOME_INFO_MODAL_MS)
        }
    })

    useEffect(() => {
        DISCOURAGE_INAPP_BROWSERS &&
            isInAppBrowser() &&
            showErrorAlert(DISCOURAGE_INAPP_BROWSER_TEXT, {
                persist: false,
                durationMs: 7000,
            })
    }, [showErrorAlert])

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        if (isHighContrastMode) {
            document.documentElement.classList.add('high-contrast')
        } else {
            document.documentElement.classList.remove('high-contrast')
        }
    }, [isDarkMode, isHighContrastMode])

    const handleDarkMode = (isDark: boolean) => {
        setIsDarkMode(isDark)
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
    }

    const handleHardMode = (isHard: boolean) => {
        if (guesses.length === 0 || localStorage.getItem('gameMode') === 'hard') {
            setIsHardMode(isHard)
            localStorage.setItem('gameMode', isHard ? 'hard' : 'normal')
        } else {
            showErrorAlert(HARD_MODE_ALERT_MESSAGE)
        }
    }

    const handleHighContrastMode = (isHighContrast: boolean) => {
        setIsHighContrastMode(isHighContrast)
        setStoredIsHighContrastMode(isHighContrast)
    }

    const clearCurrentRowClass = () => {
        setCurrentRowClass('')
    }

    useEffect(() => {
        saveGameStateToLocalStorage(getIsLatestGame(), { guesses, solution })
    }, [guesses])

    useEffect(() => {
        if (isGameWon) {
            const winMessage =
                WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
            const delayMs = REVEAL_TIME_MS * solution.length

            showSuccessAlert(winMessage, {
                delayMs,
                onClose: () => setIsStatsModalOpen(true),
            })
        }

        if (isGameLost) {
            setTimeout(() => {
                setIsStatsModalOpen(true)
            }, (solution.length + 1) * REVEAL_TIME_MS)
        }
    }, [isGameWon, isGameLost, showSuccessAlert])

    const onChar = (value: string) => {
        if (
            unicodeLength(`${currentGuess}${value}`) <= solution.length &&
            guesses.length < MAX_CHALLENGES &&
            !isGameWon
        ) {
            setCurrentGuess(`${currentGuess}${value}`)
        }
    }

    const onDelete = () => {
        setCurrentGuess(
            new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
        )
    }

    const onEnter = async () => {
        if (isGameWon || isGameLost) {
            return
        }

        if (!(unicodeLength(currentGuess) === solution.length)) {
            setCurrentRowClass('jiggle')
            return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
                onClose: clearCurrentRowClass,
            })
        }

        if (!isWordInWordList(currentGuess)) {
            setCurrentRowClass('jiggle')
            return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
                onClose: clearCurrentRowClass,
            })
        }

        // enforce hard mode - all guesses must contain all previously revealed letters
        if (isHardMode) {
            const firstMissingReveal = findFirstUnusedReveal(currentGuess, guesses)
            if (firstMissingReveal) {
                setCurrentRowClass('jiggle')
                return showErrorAlert(firstMissingReveal, {
                    onClose: clearCurrentRowClass,
                })
            }
        }

        setIsRevealing(true)
        // turn this back off after all
        // chars have been revealed
        setTimeout(() => {
            setIsRevealing(false)
        }, REVEAL_TIME_MS * solution.length)

        const winningWord = await checkGuess(currentGuess)

        if (
            unicodeLength(currentGuess) === solution.length &&
            guesses.length < MAX_CHALLENGES &&
            !isGameWon
        ) {
            setGuesses([...guesses, currentGuess])
            setCurrentGuess('')

            if (winningWord) {
                if (isLatestGame) {
                    setStats(addStatsForCompletedGame(stats, guesses.length))
                }
                return setIsGameWon(true)
            }

            if (guesses.length === MAX_CHALLENGES - 1) {
                if (isLatestGame) {
                    setStats(addStatsForCompletedGame(stats, guesses.length + 1))
                }
                setIsGameLost(true)
                showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
                    persist: true,
                    delayMs: REVEAL_TIME_MS * solution.length + 1,
                })
            }
        }
    }

    return (
        <Div100vh>
            <div className="flex h-full flex-col">
                <Navbar
                    setIsInfoModalOpen={setIsInfoModalOpen}
                    setIsStatsModalOpen={setIsStatsModalOpen}
                    setIsDatePickerModalOpen={setIsDatePickerModalOpen}
                    setIsSettingsModalOpen={setIsSettingsModalOpen}
                />

                {!isLatestGame && (
                    <div className="flex items-center justify-center">
                        <ClockIcon className="h-6 w-6 stroke-gray-600 dark:stroke-gray-300" />
                        <p className="text-base text-gray-600 dark:text-gray-300">
                            {format(gameDate, 'd MMMM yyyy', { locale: DATE_LOCALE })}
                        </p>
                    </div>
                )}

                <div className="mx-auto flex w-full grow flex-col px-1 pt-2 pb-8 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
                    <div className="flex grow flex-col justify-center pb-6 short:pb-2">
                        <Grid
                            solution={solution}
                            guesses={guesses}
                            currentGuess={currentGuess}
                            isRevealing={isRevealing}
                            currentRowClassName={currentRowClass}
                        />
                    </div>
                    <Keyboard
                        onChar={onChar}
                        onDelete={onDelete}
                        onEnter={onEnter}
                        solution={solution}
                        guesses={guesses}
                        isRevealing={isRevealing}
                    />
                    <InfoModal
                        isOpen={isInfoModalOpen}
                        handleClose={() => setIsInfoModalOpen(false)}
                    />
                    <StatsModal
                        isOpen={isStatsModalOpen}
                        handleClose={() => setIsStatsModalOpen(false)}
                        solution={solution}
                        guesses={guesses}
                        gameStats={stats}
                        isLatestGame={isLatestGame}
                        isGameLost={isGameLost}
                        isGameWon={isGameWon}
                        handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
                        handleShareFailure={() =>
                            showErrorAlert(SHARE_FAILURE_TEXT, {
                                durationMs: LONG_ALERT_TIME_MS,
                            })
                        }
                        handleMigrateStatsButton={() => {
                            setIsStatsModalOpen(false)
                            setIsMigrateStatsModalOpen(true)
                        }}
                        isHardMode={isHardMode}
                        isDarkMode={isDarkMode}
                        isHighContrastMode={isHighContrastMode}
                        numberOfGuessesMade={guesses.length}
                    />
                    <DatePickerModal
                        isOpen={isDatePickerModalOpen}
                        initialDate={solutionGameDate}
                        handleSelectDate={(d) => {
                            setIsDatePickerModalOpen(false)
                            setGameDate(d)
                        }}
                        handleClose={() => setIsDatePickerModalOpen(false)}
                    />
                    <MigrateStatsModal
                        isOpen={isMigrateStatsModalOpen}
                        handleClose={() => setIsMigrateStatsModalOpen(false)}
                    />
                    <SettingsModal
                        isOpen={isSettingsModalOpen}
                        handleClose={() => setIsSettingsModalOpen(false)}
                        isHardMode={isHardMode}
                        handleHardMode={handleHardMode}
                        isDarkMode={isDarkMode}
                        handleDarkMode={handleDarkMode}
                        isHighContrastMode={isHighContrastMode}
                        handleHighContrastMode={handleHighContrastMode}
                    />
                    <AlertContainer />
                </div>
            </div>
        </Div100vh>
    )
}

function word_to_literal(word: string) {
    const chars = word
        .toLowerCase()
        .split('')
        .map((char) => {
            const char_as_ascii = char.charCodeAt(0)
            return { NumUnsigned: [char_as_ascii, 'U8'] }
        })
    return { Array: chars }
}

async function checkGuess(guess: string): Promise<boolean> {
    await init()

    console.log('Ready for running Multi-Party Computation from WASM...')
    const mpc_program = new MpcProgram(source_code, 'wordle')
    console.log(mpc_program.report_gates())

    const mpc_input = MpcData.from_object(mpc_program, word_to_literal(guess))
    console.log(mpc_input.to_literal_string())
    console.log(mpc_input.to_literal())
    const url = 'http://127.0.0.1:8000'

    const result = (await compute(url, "", mpc_program, mpc_input)).to_literal_string()

    console.log(result)
    return !result.includes("Wrong")
}

export default App
