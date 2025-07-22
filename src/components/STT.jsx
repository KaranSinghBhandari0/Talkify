// components/STT.jsx
import { Mic, Copy, StopCircle, Waves } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function STT() {
    const [isListening, setIsListening] = useState(false);
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
                setIsProcessing(true);
            };

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                setText(transcript);
                setIsProcessing(false);
            };

            recognition.onerror = (event) => {
                console.error('Recognition error:', event.error);
                setIsListening(false);
                setIsProcessing(false);
            };

            recognition.onend = () => {
                if (isListening) {
                    // Restart recognition if it ended unexpectedly
                    recognition.start();
                } else {
                    setIsProcessing(false);
                }
            };

            setRecognition(recognition);
        }

        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    }, []);

    const startListening = () => {
        if (recognition) {
            recognition.start();
        } else {
            alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
        }
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
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

    const clearText = () => {
        setText('');
    };

    return (
        <div className="max-w-4xl mx-auto mt-6 px-4 sm:px-6 pb-20">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                        <Mic className="w-5 h-5 mr-2 text-primary-500" />
                        Speech to Text Converter
                    </h2>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="mb-6">
                        <label htmlFor="stt-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Transcription
                        </label>
                        <div className="relative">
                            <textarea
                                id="stt-text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full min-h-[200px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all"
                                placeholder="Your transcribed text will appear here..."
                            />
                            {isProcessing && (
                                <div className="absolute bottom-4 right-4 flex items-center space-x-1">
                                    <Waves className="w-5 h-5 text-primary-500 animate-pulse" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Listening...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {!isListening ? (
                            <button
                                onClick={startListening}
                                className="px-4 py-2.5 rounded-lg flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white transition-colors"
                            >
                                <Mic className="w-5 h-5" />
                                <span>Start Listening</span>
                            </button>
                        ) : (
                            <button
                                onClick={stopListening}
                                className="px-4 py-2.5 rounded-lg flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white transition-colors"
                            >
                                <StopCircle className="w-5 h-5" />
                                <span>Stop Listening</span>
                            </button>
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

                        <button
                            onClick={clearText}
                            disabled={!text.trim()}
                            className={`px-4 py-2.5 rounded-lg flex items-center space-x-2 border ${!text.trim()
                                    ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : 'border-gray-500 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                                } transition-colors`}
                        >
                            <span>Clear</span>
                        </button>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tips for best results:</h3>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• Use Chrome or Edge for best compatibility</li>
                            <li>• Speak clearly and at a moderate pace</li>
                            <li>• Reduce background noise when possible</li>
                            <li>• Ensure your microphone has proper permissions</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}