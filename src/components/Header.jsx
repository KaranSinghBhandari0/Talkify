import { Mic, Volume2, Github } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header({ activeTab, setActiveTab }) {
    return (
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                        <Volume2 className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                        Talkify
                    </h1>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4">
                    <nav className="hidden sm:flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('tts')}
                            className={`px-3 py-2 text-sm rounded-md flex items-center space-x-2 transition-all ${activeTab === 'tts'
                                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Volume2 className="w-4 h-4" />
                            <span>Text to Speech</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('stt')}
                            className={`px-3 py-2 text-sm rounded-md flex items-center space-x-2 transition-all ${activeTab === 'stt'
                                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Mic className="w-4 h-4" />
                            <span>Speech to Text</span>
                        </button>
                    </nav>

                    <div className="flex items-center space-x-2">
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* Mobile tabs */}
            <div className="sm:hidden bg-gray-100 dark:bg-gray-800 p-1">
                <div className="flex justify-center space-x-1">
                    <button
                        onClick={() => setActiveTab('tts')}
                        className={`flex-1 py-2 text-sm rounded flex items-center justify-center space-x-2 ${activeTab === 'tts'
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400'
                            : 'text-gray-600 dark:text-gray-300'
                            }`}
                    >
                        <Volume2 className="w-4 h-4" />
                        <span>TTS</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('stt')}
                        className={`flex-1 py-2 text-sm rounded flex items-center justify-center space-x-2 ${activeTab === 'stt'
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400'
                            : 'text-gray-600 dark:text-gray-300'
                            }`}
                    >
                        <Mic className="w-4 h-4" />
                        <span>STT</span>
                    </button>
                </div>
            </div>
        </header>
    );
}