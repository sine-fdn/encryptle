import classnames from 'classnames'

import { REVEAL_TIME_MS } from '../../constants/settings'
import { getStoredIsHighContrastMode } from '../../lib/localStorage'
import { CharStatus } from '../../lib/statuses'

type Props = {
  value?: string
  status?: CharStatus
  isRevealing?: boolean
  isCompleted?: boolean
  position?: number
}

export const Cell = ({
  value,
  status,
  isRevealing,
  isCompleted,
  position = 0,
}: Props) => {
  const isFilled = value && !isCompleted
  const shouldReveal = isRevealing && isCompleted
  const animationDelay = `${position * REVEAL_TIME_MS}ms`
  const isHighContrast = getStoredIsHighContrastMode()

  const classes = classnames(
    'xxshort:w-11 xxshort:h-11 short:text-2xl short:w-12 short:h-12 w-14 h-14 border-solid border flex items-center justify-center mx-0.5 text-4xl font-normal rounded',
    {
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600 dark:text-white':
        !status,
      'border-black dark:border-slate-100': value && !status,
      'absent bg-slate-300 dark:bg-slate-700 text-slate-700 border-slate-700 dark:border-white dark:text-white':
        status === 'absent',
      'correct bg-orange-200 text-orange-700 border-slate-700 dark:border-white':
        status === 'correct' && isHighContrast,
      'present bg-cyan-200 text-cyan-700 border-slate-700 dark:border-white':
        status === 'present' && isHighContrast,
      'correct bg-green-200 text-green-700 border-slate-700 dark:text-green-700 dark:border-white':
        status === 'correct' && !isHighContrast,
      'present bg-yellow-100 text-yellow-700 border-slate-700 dark:text-yellow-700 dark:border-white':
        status === 'present' && !isHighContrast,
      'cell-fill-animation': isFilled,
      'cell-reveal': shouldReveal,
    }
  )

  return (
    <div className={classes} style={{ animationDelay }}>
      <div className="letter-container" style={{ animationDelay }}>
        {value}
      </div>
    </div>
  )
}
