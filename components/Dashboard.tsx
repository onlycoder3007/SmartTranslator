
import React from 'react';
import { AppSettings, AppStatus } from '../types';

interface DashboardProps {
  settings: AppSettings;
  status: AppStatus;
  onNavigate: (tab: 'dashboard' | 'playground' | 'settings') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ settings, status, onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 shadow-2xl shadow-indigo-500/20">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to SmartTranslate Pro</h1>
          <p className="text-indigo-100 max-w-2xl text-lg mb-6 opacity-90">
            Natural, social-media ready translations from Uzbek to English and Russian. Use the global hotkey <kbd className="bg-white/20 px-2 py-0.5 rounded border border-white/30 text-white font-mono">Alt + T</kbd> in any app to translate in-place.
          </p>
          <button 
            onClick={() => onNavigate('playground')}
            className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg flex items-center space-x-2"
          >
            <span>Try Translation Simulator</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 mr-12 -mb-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Translation Engine</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Powered by Gemini 3 Flash. Specialized in colloquial and social media friendly tone.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-4 border border-purple-500/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Active Config</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Mode: <span className="text-slate-200 font-medium">{settings.mode === 'UZ_RU' ? 'Uzbek to Russian' : 'Uzbek to English'}</span>. 
            API Status: <span className={settings.apiKey ? 'text-green-400' : 'text-red-400'}>{settings.apiKey ? 'Configured' : 'Missing API Key'}</span>.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-4 border border-amber-500/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Background Task</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            The app runs in the system tray, listening for hotkeys without interrupting your workflow.
          </p>
        </div>
      </div>

      <div className="glass-card p-8 rounded-2xl border-l-4 border-l-indigo-500">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Hotkeys & Workflow
        </h3>
        <ul className="space-y-4">
          <li className="flex items-start space-x-3">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></div>
             <div>
               <p className="text-slate-200 font-medium mb-1"><kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-xs">Alt + T</kbd> (Translate & Replace)</p>
               <p className="text-sm text-slate-400">Select text in any app, press the key. Original is replaced with translation instantly.</p>
             </div>
          </li>
          <li className="flex items-start space-x-3">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></div>
             <div>
               <p className="text-slate-200 font-medium mb-1"><kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-xs">Alt + S</kbd> (Settings)</p>
               <p className="text-sm text-slate-400">Bring the dashboard to focus from the tray.</p>
             </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
