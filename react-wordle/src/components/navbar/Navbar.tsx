import {
    CalendarIcon,
    ChartBarIcon,
    CogIcon,
    InformationCircleIcon,
} from '@heroicons/react/outline'

import { ENABLE_ARCHIVED_GAMES } from '../../constants/settings'
import { GAME_TITLE } from '../../constants/strings'
import { GAME_DESCRIPTION } from '../../constants/strings'

type Props = {
    setIsInfoModalOpen: (value: boolean) => void
    setIsStatsModalOpen: (value: boolean) => void
    setIsDatePickerModalOpen: (value: boolean) => void
    setIsSettingsModalOpen: (value: boolean) => void
}

export const Navbar = ({
    setIsInfoModalOpen,
    setIsStatsModalOpen,
    setIsDatePickerModalOpen,
    setIsSettingsModalOpen,
}: Props) => {
    return (
        <div className="navbar">
            <div className="navbar-content px-5 py-8">
                <div className="flex">
                    <InformationCircleIcon
                        className="h-6 w-6 cursor-pointer dark:stroke-white"
                        onClick={() => setIsInfoModalOpen(true)}
                    />
                    {ENABLE_ARCHIVED_GAMES && (
                        <CalendarIcon
                            className="ml-3 h-6 w-6 cursor-pointer dark:stroke-white"
                            onClick={() => setIsDatePickerModalOpen(true)}
                        />
                    )}
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold dark:text-white pl-9">{GAME_TITLE}</p>
                    <p className="text-sm dark:text-white pl-9">{GAME_DESCRIPTION} developed by <a
                        href="https://sine.foundation/" target="_blank" rel="noreferrer" className="underline">
                            SINE foundation
                        </a>
                    </p>
                </div>
                <div className="right-icons">
                    <ChartBarIcon
                        className="mr-3 h-6 w-6 cursor-pointer dark:stroke-white"
                        onClick={() => setIsStatsModalOpen(true)}
                    />
                    <CogIcon
                        className="h-6 w-6 cursor-pointer dark:stroke-white"
                        onClick={() => setIsSettingsModalOpen(true)}
                    />
                </div>
            </div>
            <hr></hr>
        </div>
    )
}
