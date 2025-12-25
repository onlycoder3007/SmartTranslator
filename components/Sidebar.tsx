
import React from 'react';

interface SidebarProps {
  activeTab: 'dashboard' | 'playground' | 'settings';
  onSelect: (tab: 'dashboard' | 'playground' | 'settings') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelect }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'playground', label: 'Simulation', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <aside className="w-20 md:w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col items-center md:items-stretch py-8 space-y-8 transition-all">
      <div className="px-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="text-xl font-bold">S</span>
        </div>
        <span className="hidden md:block font-bold text-lg tracking-tight">SmartTranslate <span className="text-indigo-400">Pro</span></span>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id as any)}
            className={`w-full flex items-center p-3 rounded-lg transition-all group ${
              activeTab === item.id 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="hidden md:block ml-3 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-3 pt-6 border-t border-slate-800/50">
        <div className="bg-slate-800/50 p-3 rounded-lg hidden md:block">
          <p className="text-xs text-slate-500 mb-1">Status</p>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">Service Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
