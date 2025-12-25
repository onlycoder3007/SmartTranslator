
import React, { useState, useRef } from 'react';
import { AppSettings, AppStatus, TranslationResult } from '../types';
import { translateText } from '../geminiService';

interface TranslationPlaygroundProps {
  settings: AppSettings;
  status: AppStatus;
  setStatus: (status: AppStatus) => void;
  setErrorMessage: (msg: string | null) => void;
}

const TranslationPlayground: React.FC<TranslationPlaygroundProps> = ({ settings, status, setStatus, setErrorMessage }) => {
  const [inputText, setInputText] = useState("Salom, yaxshimisiz? Ishlaringiz qanday ketmoqda?");
  const [history, setHistory] = useState<TranslationResult[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    if (!settings.apiKey) {
      setErrorMessage("Please set an API Key in Settings first.");
      return;
    }

    setStatus('TRANSLATING');
    try {
      const translated = await translateText(inputText, settings.mode, settings.apiKey);
      
      const result: TranslationResult = {
        original: inputText,
        translated,
        timestamp: Date.now()
      };

      // Simulation effect: Replace text in the box (mocking the in-place replacement)
      setInputText(translated);
      setHistory(prev => [result, ...prev].slice(0, 5));
      setStatus('SUCCESS');
      setTimeout(() => setStatus('READY'), 2000);
    } catch (error: any) {
      setStatus('ERROR');
      setErrorMessage(error.message || "Failed to translate");
      setTimeout(() => setStatus('READY'), 5000);
    }
  };

  const simulateHotkey = () => {
    // Focus and highlight text to simulate selection then trigger translation
    if (textareaRef.current) {
      textareaRef.current.select();
      setTimeout(handleTranslate, 500);
    }
  };

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Simulator</h1>
          <p className="text-slate-400">Test the "In-Place" translation logic here.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-slate-300">
            Hotkey Listener: <span className="text-green-500">ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[500px]">
        {/* Input Simulation */}
        <div className="flex flex-col space-y-4">
          <div className="flex-1 glass-card p-6 rounded-3xl relative flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Active Textbox</span>
              <span className="text-xs text-slate-500">Simulation Mode: {settings.mode === 'UZ_RU' ? 'UZ ➔ RU' : 'UZ ➔ EN'}</span>
            </div>
            
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent border-none text-slate-100 resize-none focus:outline-none text-lg leading-relaxed placeholder:text-slate-700"
              placeholder="Type some Uzbek text here..."
            />

            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <p className="text-xs text-slate-500">Press the button below to simulate <kbd className="bg-slate-700 px-1 rounded">Alt + T</kbd></p>
              <button
                onClick={simulateHotkey}
                disabled={status === 'TRANSLATING'}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 ${
                  status === 'TRANSLATING' 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20'
                }`}
              >
                {status === 'TRANSLATING' ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Simulate Alt+T</span>
                  </>
                )}
              </button>
            </div>

            {status === 'TRANSLATING' && (
              <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[2px] rounded-3xl flex items-center justify-center">
                 <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl flex items-center space-x-3">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <p className="font-bold text-sm">Translating...</p>
                      <p className="text-xs text-slate-500">Gemini AI is crafting translation</p>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Translation History/Logs */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Recent Translations</h3>
          <div className="flex-1 flex flex-col space-y-4">
            {history.length === 0 ? (
              <div className="flex-1 glass-card rounded-3xl border-dashed border-2 flex flex-col items-center justify-center p-8 opacity-50">
                <svg className="w-12 h-12 text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-500 font-medium">No activity logged yet.</p>
                <p className="text-xs text-slate-600 text-center">Translation history will appear here once you use the simulator.</p>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.timestamp} className="glass-card p-4 rounded-2xl animate-in slide-in-from-right-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Done</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">From Uzbek:</p>
                      <p className="text-sm text-slate-300">{item.original}</p>
                    </div>
                    <div className="p-2 bg-indigo-900/10 rounded-lg border border-indigo-500/10">
                      <p className="text-xs text-indigo-400/70 mb-1">To {settings.mode === 'UZ_RU' ? 'Russian' : 'English'}:</p>
                      <p className="text-sm font-medium text-slate-200">{item.translated}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationPlayground;
