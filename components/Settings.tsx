
import React, { useState } from 'react';
import { AppSettings, TranslationMode } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (newSettings: Partial<AppSettings>) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ apiKey });
    setSaveMessage("Settings saved successfully!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configuration</h1>
        <p className="text-slate-400">Manage your translation preferences and API credentials.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Default Translation Mode</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onUpdate({ mode: TranslationMode.UZ_RU })}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  settings.mode === TranslationMode.UZ_RU 
                    ? 'border-indigo-600 bg-indigo-600/10 text-indigo-400' 
                    : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-700'
                }`}
              >
                <span className="text-lg font-bold">UZ ➔ RU</span>
                <span className="text-xs opacity-70">Uzbek to Russian</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ mode: TranslationMode.UZ_EN })}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  settings.mode === TranslationMode.UZ_EN 
                    ? 'border-indigo-600 bg-indigo-600/10 text-indigo-400' 
                    : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-700'
                }`}
              >
                <span className="text-lg font-bold">UZ ➔ EN</span>
                <span className="text-xs opacity-70">Uzbek to English</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-semibold text-slate-300 flex justify-between">
              <span>Gemini AI API Key</span>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline text-xs">Get a key from Google AI Studio</a>
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your API key here..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder:text-slate-600"
              />
              {settings.apiKey && !saveMessage && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500">The key is stored locally in your browser/config file. It is never sent to our servers.</p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            {saveMessage && <span className="text-green-400 text-sm font-medium animate-pulse">{saveMessage}</span>}
            <button
              type="submit"
              className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </form>

      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-bold mb-4">Advance Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <div>
               <p className="text-slate-200 font-medium">Minimize to Tray on Close</p>
               <p className="text-xs text-slate-500">Keep the application running in background for hotkeys.</p>
             </div>
             <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1">
               <div className="w-4 h-4 bg-white rounded-full translate-x-6 transition-transform"></div>
             </div>
          </div>
          <div className="flex items-center justify-between">
             <div>
               <p className="text-slate-200 font-medium">Auto-start with Windows</p>
               <p className="text-xs text-slate-500">Launch SmartTranslate Pro when you log in.</p>
             </div>
             <div className="w-12 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center px-1">
               <div className="w-4 h-4 bg-slate-500 rounded-full transition-transform"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
