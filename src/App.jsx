import { useState } from 'react';
import Header from './components/Header';
import TTS from './components/TTS';
import STT from './components/STT';

function App() {
    const [activeTab, setActiveTab] = useState('tts');

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="container mx-auto px-4 py-8">
                {activeTab === 'tts' ? <TTS /> : <STT />}
            </main>
        </div>
    );
}

export default App;