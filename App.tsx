import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- Types & Constants ---
type Language = 'UZ' | 'RU' | 'EN';
type Tone = 'natural' | 'formal' | 'slang';

interface Record {
  id: string;
  original: string;
  translated: string;
  target: Language;
  tone: Tone;
  timestamp: number;
}

const App: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLang, setTargetLang] = useState<Language>('RU');
  const [tone, setTone] = useState<Tone>('natural');
  const [history, setHistory] = useState<Record[]>([]);
  const [view, setView] = useState<'engine' | 'vault'>('engine');
  const [useDemoMode, setUseDemoMode] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  
  // Parallax Background Effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Sync History
  useEffect(() => {
    const saved = localStorage.getItem('stp_v5_vault');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('stp_v5_vault', JSON.stringify(history.slice(0, 30)));
  }, [history]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    setTranslatedText("");
    setErrorVisible(false);

    // MOCK MODE: Instant fallback if user is tired of API issues
    if (useDemoMode) {
      setTimeout(() => {
        const mock = `[Neural Simulation]: ${inputText} translated to ${targetLang} with ${tone} tone. (Demo Mode Active)`;
        setTranslatedText(mock);
        setIsTranslating(false);
      }, 800);
      return;
    }

    try {
      const apiKey = process.env.API_KEY || (window as any).VITE_API_KEY;
      
      if (!apiKey) {
        throw new Error("Linguistic link failed. API_KEY is missing from client context.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const targetFull = targetLang === 'RU' ? 'Russian' : 'English';
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: inputText,
        config: {
          systemInstruction: `Translate Uzbek to ${targetFull}. Style: ${tone}. Output ONLY the result.`,
          temperature: 0.7,
        },
      });

      const result = response.text?.trim() || "No signal.";
      setTranslatedText(result);
      
      setHistory(prev => [{
        id: crypto.randomUUID(),
        original: inputText,
        translated: result,
        target: targetLang,
        tone: tone,
        timestamp: Date.now()
      }, ...prev]);

    } catch (err) {
      console.error(err);
      setErrorVisible(true);
    } finally {
      setIsTranslating(false);
    }
  };

  const copy = (t: string) => {
    navigator.clipboard.writeText(t);
    setShowCopy(true);
    setTimeout(() => setShowCopy(false), 2000);
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-['Plus_Jakarta_Sans']">
      
      {/* Dynamic Aura Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-transform duration-700 ease-out opacity-40"
        style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
      >
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-fuchsia-600/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Luxury Navbar */}
      <header className="relative z-50 px-8 h-24 flex items-center justify-between backdrop-blur-3xl border-b border-white/[0.03] bg-black/20">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
            <span className="text-2xl font-black italic">S</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-none">SmartTranslate <span className="text-indigo-400">ELITE</span></h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1.5">Zero-Config Interface</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex bg-white/[0.03] p-1 rounded-xl border border-white/[0.05]">
            <button onClick={() => setView('engine')} className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${view === 'engine' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>ENGINE</button>
            <button onClick={() => setView('vault')} className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${view === 'vault' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>VAULT</button>
          </div>
          <button 
            onClick={() => setUseDemoMode(!useDemoMode)}
            className={`px-4 py-2 rounded-full text-[9px] font-black border transition-all ${useDemoMode ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'border-white/10 text-slate-500'}`}
          >
            {useDemoMode ? 'DEMO ACTIVE' : 'PRO MODE'}
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full p-8 md:p-16">
        {view === 'engine' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Interactive Workspace */}
            <div className="lg:col-span-7 space-y-10 animate-reveal">
              
              {/* Controller Bar */}
              <div className="flex flex-wrap items-center gap-4 bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-3xl backdrop-blur-xl">
                <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 items-center">
                  <div className="px-5 py-2 text-[10px] font-black text-slate-500 tracking-widest">UZ</div>
                  <div className="w-8 h-8 flex items-center justify-center text-indigo-500">➔</div>
                  <div className="flex space-x-1">
                    <button onClick={() => setTargetLang('RU')} className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all ${targetLang === 'RU' ? 'bg-indigo-600' : 'text-slate-500 hover:text-slate-300'}`}>RU</button>
                    <button onClick={() => setTargetLang('EN')} className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all ${targetLang === 'EN' ? 'bg-indigo-600' : 'text-slate-500 hover:text-slate-300'}`}>EN</button>
                  </div>
                </div>

                <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 ml-auto">
                  {(['natural', 'formal', 'slang'] as Tone[]).map(t => (
                    <button key={t} onClick={() => setTone(t)} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${tone === t ? 'bg-fuchsia-600 text-white' : 'text-slate-600'}`}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Main Input Field */}
              <div className="glass-card rounded-[3.5rem] overflow-hidden min-h-[480px] flex flex-col shadow-2xl relative">
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Initiate linguistic transmission in Uzbek..."
                  className="flex-1 w-full bg-transparent p-12 text-2xl md:text-4xl font-medium outline-none resize-none placeholder:text-slate-800 placeholder:italic leading-snug"
                />
                <div className="p-10 border-t border-white/[0.03] bg-black/20 flex items-center justify-between">
                   <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em]">Buffer Status</span>
                     <span className="text-xl font-bold text-indigo-400 font-mono tracking-tighter">{inputText.length}</span>
                   </div>
                   <button 
                    onClick={handleTranslate}
                    disabled={isTranslating || !inputText.trim()}
                    className={`px-16 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all active:scale-95 flex items-center space-x-4 ${isTranslating || !inputText.trim() ? 'bg-slate-900 text-slate-700' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/30'}`}
                   >
                     {isTranslating ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div><span>Synthesizing...</span></> : <span>Execute</span>}
                   </button>
                </div>
              </div>

              {/* Error UI */}
              {errorVisible && !useDemoMode && (
                <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-[2.5rem] animate-reveal">
                   <p className="text-red-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 flex items-center">
                     <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                     Linguistic Exception
                   </p>
                   <p className="text-red-200/60 text-sm leading-relaxed">
                     Neural core could not verify your API credentials. You can <button onClick={() => setUseDemoMode(true)} className="text-white underline font-bold">Switch to Demo Mode</button> to continue without a key, or verify your Netlify Environment Variables.
                   </p>
                </div>
              )}

              {/* Output Visualization */}
              {translatedText && (
                <div className="animate-reveal [animation-delay:0.2s]">
                   <div className="bg-gradient-to-br from-[#0a0c14] to-[#010206] border border-white/[0.08] rounded-[3.5rem] p-12 relative shadow-2xl group">
                     <div className="flex justify-between items-start mb-8">
                        <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.4em] rounded-full border border-indigo-500/20">Linguistic Projection</span>
                        <button onClick={() => copy(translatedText)} className="p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-2xl transition-all">
                          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                     </div>
                     <p className="text-3xl md:text-5xl font-bold leading-tight tracking-tight text-white">{translatedText}</p>
                   </div>
                </div>
              )}
            </div>

            {/* Neural Mirror (Sidebar Simulator) */}
            <div className="lg:col-span-5 hidden lg:block animate-reveal [animation-delay:0.4s]">
               <div className="relative mx-auto w-[340px] aspect-[9/18.5] bg-black border-[12px] border-[#18181b] rounded-[4.5rem] shadow-2xl overflow-hidden flex flex-col">
                  {/* Dynamic Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#18181b] rounded-b-3xl z-30 flex items-center justify-center">
                    <div className="w-10 h-1 bg-white/5 rounded-full"></div>
                  </div>
                  
                  {/* iOS Style Content */}
                  <div className="flex-1 bg-[#050505] flex flex-col pt-12">
                     <div className="px-8 pb-5 border-b border-white/[0.03] bg-white/[0.01]">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Linguistic Channel</p>
                        <p className="text-xs font-bold text-white mt-1">AI SmartLink</p>
                     </div>
                     <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-hide">
                        <div className="flex justify-start">
                           <div className="max-w-[85%] bg-slate-900/80 p-4 rounded-2xl rounded-tl-none text-[12px] border border-white/5 text-slate-300">
                             {inputText || "Waiting for signal..."}
                           </div>
                        </div>
                        {(translatedText || isTranslating) && (
                          <div className="flex justify-end animate-reveal">
                             <div className="max-w-[85%] bg-indigo-600 p-4 rounded-2xl rounded-tr-none text-[12px] text-white shadow-lg">
                               {isTranslating ? <div className="flex space-x-1.5 py-1.5"><div className="w-2 h-2 bg-white/30 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-white/30 rounded-full animate-bounce [animation-delay:0.2s]"></div><div className="w-2 h-2 bg-white/30 rounded-full animate-bounce [animation-delay:0.4s]"></div></div> : translatedText}
                             </div>
                          </div>
                        )}
                     </div>
                     <div className="p-6 bg-black border-t border-white/[0.03]">
                        <div className="h-10 bg-[#121418] rounded-full px-5 flex items-center justify-between">
                           <div className="w-20 h-2 bg-slate-800 rounded-full"></div>
                           <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Engine Diagnostics Card */}
               <div className="glass-card mt-12 rounded-[2.5rem] p-8 space-y-6">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] text-center">Engine Telemetry</h4>
                 <div className="space-y-4">
                   {[
                     { l: "Context Density", v: inputText.length > 0 ? "Optimal" : "Empty" },
                     { l: "Neural Load", v: isTranslating ? "High" : "Idle" },
                     { l: "Sync Protocol", v: "v5.0 Elite" }
                   ].map(s => (
                     <div key={s.l} className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-slate-600 uppercase tracking-widest">{s.l}</span>
                       <span className="text-white italic">{s.v}</span>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        ) : (
          /* Archive / The Vault */
          <div className="max-w-5xl mx-auto space-y-12 animate-reveal">
            <div className="flex flex-col md:flex-row items-center justify-between bg-white/[0.01] p-12 rounded-[3.5rem] border border-white/[0.03]">
               <div className="text-center md:text-left">
                  <h2 className="text-5xl font-black text-white tracking-tighter">Neural Vault</h2>
                  <p className="text-slate-500 text-lg mt-2 font-medium">Historical snapshots stored in your local neural buffer.</p>
               </div>
               <button onClick={() => { setHistory([]); localStorage.removeItem('stp_v5_vault'); }} className="px-10 py-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all">Clear Archive</button>
            </div>

            {history.length === 0 ? (
              <div className="py-40 text-center border-2 border-dashed border-white/[0.05] rounded-[3.5rem] bg-white/[0.005]">
                <p className="text-slate-800 text-xl font-black uppercase tracking-[0.8em]">Archive Vacant</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {history.map(item => (
                  <div key={item.id} className="bg-[#080a10] border border-white/[0.06] p-10 rounded-[3rem] group hover:border-indigo-500/40 transition-all shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                      <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-full">UZ ➔ {item.target}</span>
                      <span className="text-[10px] font-bold text-slate-700 font-mono">{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="space-y-6">
                      <p className="text-slate-500 italic text-lg leading-snug">"{item.original}"</p>
                      <div className="relative pt-6 border-t border-white/[0.03]">
                        <p className="text-white font-bold text-2xl pr-12">{item.translated}</p>
                        <button onClick={() => copy(item.translated)} className="absolute bottom-0 right-0 p-4 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl text-slate-600 hover:text-indigo-400 transition-colors">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Persistence Feedback */}
      <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 transform ${showCopy ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl flex items-center space-x-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
          <span>Buffer Copied</span>
        </div>
      </div>

      <footer className="mt-40 py-20 border-t border-white/[0.03] text-center">
         <p className="text-slate-800 text-[11px] font-black uppercase tracking-[1em] mb-4">Linguistic Module v5.0.0-ELITE</p>
         <div className="flex justify-center space-x-10 opacity-30">
            {['Engine Status', 'Vault Security', 'Neural Health'].map(l => (
              <span key={l} className="text-[9px] font-black text-slate-500 hover:text-white cursor-pointer uppercase tracking-widest">{l}</span>
            ))}
         </div>
      </footer>
    </div>
  );
};

export default App;