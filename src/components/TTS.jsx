// components/TTS.jsx
import { Volume2, Copy, RotateCw, StopCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TTS() {
    const [text, setText] = useState('');
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0 && !selectedVoice) {
                setSelectedVoice(availableVoices.find(v => v.default) || availableVoices[0]);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    const speak = () => {
        if (!text.trim()) return;

        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = rate;
        utterance.pitch = pitch;

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utterance.onpause = () => setIsPaused(true);
        utterance.onresume = () => setIsPaused(false);

        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    const togglePause = () => {
        if (isPaused) {
            window.speechSynthesis.resume();
        } else {
            window.speechSynthesis.pause();
        }
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-6 px-4 sm:px-6 pb-20">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                        <Volume2 className="w-5 h-5 mr-2 text-primary-500" />
                        Text to Speech Converter
                    </h2>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="mb-6">
                        <label htmlFor="tts-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Enter your text
                        </label>
                        <textarea
                            id="tts-text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full min-h-[200px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all"
                            placeholder="Type or paste your text here..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Voice
                            </label>
                            <select
                                id="voice-select"
                                value={selectedVoice?.name || ''}
                                onChange={(e) => {
                                    const voice = voices.find(v => v.name === e.target.value);
                                    setSelectedVoice(voice);
                                }}
                                className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                                disabled={voices.length === 0}
                            >
                                {voices.length === 0 ? (
                                    <option value="">Loading voices...</option>
                                ) : (
                                    voices.map((voice) => (
                                        <option key={voice.name} value={voice.name}>
                                            {voice.name} ({voice.lang}) {voice.default && '— Default'}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Speed: {rate.toFixed(1)}
                                </label>
                                <input
                                    id="rate"
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={rate}
                                    onChange={(e) => setRate(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="pitch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Pitch: {pitch.toFixed(1)}
                                </label>
                                <input
                                    id="pitch"
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={pitch}
                                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {!isSpeaking ? (
                            <button
                                onClick={speak}
                                disabled={!text.trim()}
                                className={`px-4 py-2.5 rounded-lg flex items-center space-x-2 ${!text.trim()
                                        ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                                        : 'bg-primary-500 hover:bg-primary-600 text-white'
                                    } transition-colors`}
                            >
                                <Volume2 className="w-5 h-5" />
                                <span>Speak</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={togglePause}
                                    className="px-4 py-2.5 rounded-lg flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
                                >
                                    {isPaused ? (
                                        <>
                                            <RotateCw className="w-5 h-5" />
                                            <span>Resume</span>
                                        </>
                                    ) : (
                                        <>
                                            <StopCircle className="w-5 h-5" />
                                            <span>Pause</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={stopSpeaking}
                                    className="px-4 py-2.5 rounded-lg flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white transition-colors"
                                >
                                    <StopCircle className="w-5 h-5" />
                                    <span>Stop</span>
                                </button>
                            </>
                        )}

                        <button
                            onClick={copyToClipboard}
                            disabled={!text.trim()}
                            className={`px-4 py-2.5 rounded-lg flex items-center space-x-2 border ${!text.trim()
                                    ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : 'border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-gray-700'
                                } transition-colors`}
                        >
                            <Copy className="w-5 h-5" />
                            <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}