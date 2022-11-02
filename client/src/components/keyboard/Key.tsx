import classnames from 'classnames'
import { ReactNode } from 'react'

import { REVEAL_TIME_MS } from '../../constants/settings'
import { getStoredIsHighContrastMode } from '../../lib/localStorage'
import { CharStatus } from '../../lib/statuses'
import { solution } from '../../lib/words'

type Props = {
  children?: ReactNode
  value: string
  width?: number
  status?: CharStatus
  onClick: (value: string) => void
  isRevealing?: boolean
}

export const Key = ({
  children,
  status,
  width = 40,
  value,
  onClick,
  isRevealing,
}: Props) => {
  const keyDelayMs = REVEAL_TIME_MS * solution.length
  const isHighContrast = getStoredIsHighContrastMode()

  const classes = classnames(
    'xxshort:h-8 xxshort:w-8 xxshort:text-xxs xshort:w-10 xshort:h-10 flex short:h-12 h-14 items-center justify-center rounded mx-0.5 text-xs font-bold border cursor-pointer select-none',
    {
      'transition ease-in-out': isRevealing,
      'bg-slate-200 dark:bg-neutral-600 hover:bg-slate-300 active:bg-slate-400 border-slate-700 dark:border-white dark:text-white':
        !status,
      'bg-slate-400 dark:bg-neutral-800 text-slate-700 border-slate-700 dark:text-white dark:border-white': status === 'absent',
      'bg-orange-200 hover:bg-orange-300 active:bg-orange-300 border-slate-700 text-orange-700 dark:text-orange-700 dark:border-white':
        status === 'correct' && isHighContrast,
      'bg-cyan-200 hover:bg-cyan-300 active:bg-cyan-700 text-cyan-700 border-slate-700 dark:text-cyan-700 dark:border-white':
        status === 'present' && isHighContrast,
      'bg-green-200 hover:bg-green-300 active:bg-green-200 text-green-700 border-slate-700 dark:text-green-700 dark:border-white':
        status === 'correct' && !isHighContrast,
      'bg-yellow-100 hover:bg-yellow-200 active:bg-yellow-100 text-yellow-700 border-slate-700 dark:text-yellow-700 dark:border-white':
        status === 'present' && !isHighContrast,
    }
  )

  const styles = {
    transitionDelay: isRevealing ? `${keyDelayMs}ms` : 'unset',
    width: `${width}px`,
  }

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(value)
    event.currentTarget.blur()
  }

  return (
    <button
      style={styles}
      aria-label={`${value}${status ? ' ' + status : ''}`}
      className={classes}
      onClick={handleClick}
    >
      {children || value}
    </button>
  )
}
