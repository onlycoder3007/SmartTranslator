
import React from 'react';
import { AppStatus } from '../types';

interface HeaderProps {
  status: AppStatus;
  errorMessage: string | null;
}

const Header: React.FC<HeaderProps> = ({ status, errorMessage }) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0f172a]/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-widest">Workspace</h2>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800">
           <span className={`w-2 h-2 rounded-full ${
             status === 'READY' ? 'bg-green-500' :
             status === 'TRANSLATING' ? 'bg-yellow-500 animate-pulse' :
             status === 'ERROR' ? 'bg-red-500' : 'bg-green-400'
           }`}></span>
           <span className="text-xs font-semibold text-slate-300">
             {status === 'READY' ? 'Ready' : 
              status === 'TRANSLATING' ? 'Translating...' : 
              status === 'ERROR' ? 'Error' : 'Success'}
           </span>
        </div>
        
        <button className="text-slate-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
          AD
        </div>
      </div>
    </header>
  );
};

export default Header;
