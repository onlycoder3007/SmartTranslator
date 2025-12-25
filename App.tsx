import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
type Language = 'UZ' | 'RU' | 'EN';
type Tone = 'natural' | 'formal' | 'slang';

interface TranslationRecord {
  id: string;
  from: string;
  to: string;
  original: string;
  translated: string;
  tone: Tone;
  timestamp: number;
}

const App: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLang, setTargetLang] = useState<Language>('RU');
  const [tone, setTone] = useState<Tone>('natural');
  const [history, setHistory] = useState<TranslationRecord[]>([]);
  const [view, setView] = useState<'translate' | 'history'>('translate');
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);

  // Persistence: Restore history from local buffer
  useEffect(() => {
    const saved = localStorage.getItem('stp_elite_vault_v3');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error("Vault corruption."); }
    }
  }, []);

  // Persistence: Sync history
  useEffect(() => {
    localStorage.setItem('stp_elite_vault_v3', JSON.stringify(history.slice(0, 50)));
  }, [history]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    setTranslatedText("");
    setErrorDetails(null);

    try {
      const key = process.env.API_KEY;
      if (!key) throw new Error("API_KEY_MISSING");

      const ai = new GoogleGenAI({ apiKey: key });
      const targetFull = targetLang === 'RU' ? 'Russian' : 'English';
      
      const toneMap = {
        natural: "conversational, warm, and perfect for social apps like Telegram.",
        formal: "highly professional, respectful, and suitable for formal business documentation.",
        slang: "urban, casual, youth-oriented with relevant slang expressions."
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: inputText,
        config: {
          systemInstruction: `Linguistic Mode: Elite Translator. 
          Goal: Translate Uzbek to ${targetFull}. 
          Tone: ${toneMap[tone]}. 
          Constraint: Output ONLY the translated text. Do not provide meta-commentary, quotes, or notes.`,
          temperature: 0.8,
        },
      });

      const result = response.text?.trim() || "Empty buffer.";
      
      // Simulate "Thinking" time for better UX
      setTimeout(() => {
        setTranslatedText(result);
        setHistory(prev => [{
          id: crypto.randomUUID(),
          from: 'UZ',
          to: targetLang,
          original: inputText,
          translated: result,
          tone: tone,
          timestamp: Date.now()
        }, ...prev]);
        setIsTranslating(false);
      }, 600);

    } catch (err: any) {
      console.error(err);
      setErrorDetails(err.message === "API_KEY_MISSING" 
        ? "Neural Core Offline: API_KEY is missing from environment. check Netlify settings." 
        : `Linguistic Error: ${err.message}`);
      setIsTranslating(false);
    }
  };

  const copy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#010206] text-slate-100 selection:bg-indigo-500/40 relative">
      
      {/* Cinematic Atmosphere Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full animate-[float_12s_infinite_ease-in-out]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[130px] rounded-full animate-[float_10s_infinite_ease-in-out_2s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,#010206_100%)] opacity-80"></div>
      </div>

      {/* Premium Header */}
      <nav className="relative z-50 border-b border-white/[0.03] backdrop-blur-2xl sticky top-0 bg-[#010206]/40">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-5 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-30 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-800 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-3xl font-black italic tracking-tighter">S</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter leading-none flex items-baseline">
                SmartTranslate <span className="ml-2 text-indigo-400 font-medium tracking-normal text-sm opacity-80">ELITE v3.0</span>
              </h1>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-[neuralPulse_2s_infinite]"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Neural Grid Sync</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.05] shadow-inner">
            <button 
              onClick={() => setView('translate')}
              className={`px-10 py-2.5 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-500 ${view === 'translate' ? 'bg-indigo-600 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.5)]' : 'text-slate-500 hover:text-slate-200'}`}
            >
              Linguistic Engine
            </button>
            <button 
              onClick={() => setView('history')}
              className={`px-10 py-2.5 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-500 ${view === 'history' ? 'bg-indigo-600 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.5)]' : 'text-slate-500 hover:text-slate-200'}`}
            >
              Neural Vault
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto p-8 md:p-16 lg:p-24">
        {view === 'translate' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Main Interactive Zone */}
            <div className="lg:col-span-7 space-y-12 stagger-1">
              
              {/* Strategy Controller */}
              <div className="flex flex-wrap items-center gap-6 bg-white/[0.01] backdrop-blur-xl border border-white/[0.04] p-3 rounded-[2rem] shadow-2xl">
                <div className="flex items-center bg-black/40 p-1.5 rounded-2xl border border-white/[0.06]">
                  <div className="px-6 py-2 text-[11px] font-black uppercase text-slate-400 tracking-widest">Uzbek</div>
                  <div className="w-10 h-10 flex items-center justify-center text-indigo-500 animate-pulse">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7" /></svg>
                  </div>
                  <div className="flex bg-slate-900/80 p-1 rounded-xl">
                    <button onClick={() => setTargetLang('RU')} className={`px-6 py-2 text-[10px] font-black rounded-lg transition-all ${targetLang === 'RU' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-600 hover:text-slate-300'}`}>RU</button>
                    <button onClick={() => setTargetLang('EN')} className={`px-6 py-2 text-[10px] font-black rounded-lg transition-all ${targetLang === 'EN' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-600 hover:text-slate-300'}`}>EN</button>
                  </div>
                </div>

                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/[0.06] ml-auto">
                   {(['natural', 'formal', 'slang'] as Tone[]).map(t => (
                     <button key={t} onClick={() => setTone(t)} className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${tone === t ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-600 hover:text-slate-400'}`}>
                       {t}
                     </button>
                   ))}
                </div>
              </div>

              {/* Workspace Container */}
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-violet-700 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-10 transition duration-1000"></div>
                <div className="relative bg-[#080a10] border border-white/[0.06] rounded-[3.5rem] overflow-hidden min-h-[500px] flex flex-col shadow-2xl">
                  
                  <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Describe your intent in Uzbek..."
                    className="flex-1 w-full bg-transparent p-12 text-2xl md:text-4xl text-white font-medium resize-none focus:outline-none placeholder:text-slate-800 placeholder:italic leading-tight tracking-tight custom-scrollbar"
                  />
                  
                  <div className="p-12 border-t border-white/[0.03] bg-black/30 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-2">Linguistic Mass</span>
                      <span className="text-2xl font-black text-indigo-400/80 tracking-tighter font-mono">{inputText.length}</span>
                    </div>
                    
                    <button 
                      onClick={handleTranslate}
                      disabled={isTranslating || !inputText.trim()}
                      className={`relative overflow-hidden group px-16 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.4em] transition-all active:scale-95 flex items-center space-x-5 ${isTranslating || !inputText.trim() ? 'bg-slate-900 text-slate-700' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_30px_60px_-15px_rgba(79,70,229,0.4)]'}`}
                    >
                      {isTranslating ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <span>Synthesizing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          <span>Execute Strategy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status & Error Display */}
              {errorDetails && (
                <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] text-red-400 text-xs font-bold leading-relaxed animate-in fade-in slide-in-from-top-4">
                   <div className="flex items-center space-x-4 mb-3">
                     <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                     </div>
                     <span className="uppercase tracking-[0.3em] text-red-500/80">Linguistic Exception Protocol</span>
                   </div>
                   <p className="pl-14">{errorDetails}</p>
                </div>
              )}

              {/* Output Visualization */}
              {translatedText && (
                <div className="animate-in fade-in slide-in-from-top-12 duration-1000">
                  <div className="bg-gradient-to-br from-[#111625] to-[#010206] border border-white/[0.08] rounded-[3.5rem] p-12 relative shadow-2xl group overflow-hidden">
                    <div className="flex justify-between items-start mb-10">
                       <span className="px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Neural Projection</span>
                       <button onClick={() => copy(translatedText)} className="p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-2xl text-slate-500 hover:text-white transition-all active:scale-90 flex items-center space-x-3">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                         <span className="text-[10px] font-black uppercase tracking-widest">Duplicate</span>
                       </button>
                    </div>
                    <p className="text-3xl md:text-5xl text-white font-bold leading-[1.15] tracking-tight selection:bg-indigo-500/50">
                       {translatedText}
                    </p>
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/5 blur-[100px] rounded-full"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Neural Mirror (Right Sidebar) */}
            <div className="lg:col-span-5 space-y-12 stagger-2">
               {/* Mobile UI Mirror */}
               <div className="relative mx-auto max-w-[340px] aspect-[9/18.5] bg-[#000] border-[14px] border-[#18181b] rounded-[4.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col group">
                 {/* Dynamic Island */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-9 bg-[#18181b] rounded-b-3xl z-20 flex items-center justify-center">
                    <div className="w-10 h-1 bg-white/5 rounded-full"></div>
                 </div>
                 
                 {/* Mirror Interface */}
                 <div className="flex-1 bg-[#050505] flex flex-col pt-12">
                   <div className="px-8 pb-6 border-b border-white/[0.03] flex items-center space-x-4 bg-white/[0.01]">
                     <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-600 p-0.5">
                          <div className="w-full h-full bg-[#050505] rounded-full flex items-center justify-center overflow-hidden">
                            <span className="text-[12px] font-black italic text-indigo-400">NP</span>
                          </div>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#050505] rounded-full"></div>
                     </div>
                     <div>
                       <p className="text-[11px] font-black text-white uppercase tracking-wider">Neural Mirror</p>
                       <p className="text-[9px] text-emerald-500/80 font-bold uppercase tracking-[0.2em]">Synchronized</p>
                     </div>
                   </div>

                   <div className="flex-1 p-7 space-y-8 overflow-y-auto scrollbar-hide">
                     <div className="flex flex-col items-start animate-in slide-in-from-left-6">
                        <div className="max-w-[85%] bg-[#1a1c22] p-5 rounded-3xl rounded-tl-none text-[13px] text-slate-300 leading-relaxed border border-white/[0.05]">
                          {inputText || "Waiting for signal..."}
                        </div>
                        <span className="text-[9px] font-black text-slate-700 mt-3 ml-1 uppercase tracking-widest">User Trace</span>
                     </div>

                     {(translatedText || isTranslating) && (
                       <div className="flex flex-col items-end animate-in slide-in-from-right-6">
                         <div className="max-w-[85%] bg-indigo-600 p-5 rounded-3xl rounded-tr-none text-[13px] text-white leading-relaxed shadow-2xl shadow-indigo-600/30">
                           {isTranslating ? (
                             <div className="flex space-x-2 py-1.5">
                               <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                               <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                               <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                             </div>
                           ) : translatedText}
                         </div>
                         <span className="text-[9px] font-black text-indigo-400 mt-3 mr-1 uppercase tracking-widest">Neural Agent</span>
                       </div>
                     )}
                   </div>
                   
                   <div className="p-7 border-t border-white/[0.03] bg-black">
                      <div className="h-12 bg-[#121418] rounded-full px-6 flex items-center justify-between border border-white/[0.02]">
                         <div className="w-24 h-2.5 bg-slate-800/50 rounded-full"></div>
                         <div className="w-8 h-8 bg-indigo-500/80 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                         </div>
                      </div>
                   </div>
                 </div>
               </div>

               {/* Engine Visualizer Cards */}
               <div className="glass-card rounded-[3rem] p-10 space-y-10 shadow-2xl">
                 <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] text-center">Neural Telemetry</h4>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/[0.04]">
                       <p className="text-[9px] font-black text-slate-600 uppercase mb-2">Model</p>
                       <p className="text-white font-bold tracking-tighter">Gemini 3-F</p>
                    </div>
                    <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/[0.04]">
                       <p className="text-[9px] font-black text-slate-600 uppercase mb-2">Confidence</p>
                       <p className="text-indigo-400 font-bold tracking-tighter">99.98%</p>
                    </div>
                 </div>
                 <div className="space-y-6">
                    {['Linguistic Depth', 'Tone Stability', 'Semantic Match'].map(metric => (
                      <div key={metric} className="space-y-2.5">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                           <span>{metric}</span>
                           <span className="text-white italic">Optimal</span>
                        </div>
                        <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.01] p-0.5">
                           <div className="h-full bg-indigo-500 rounded-full w-full opacity-40 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        ) : (
          /* Archive / The Neural Vault */
          <div className="max-w-6xl mx-auto space-y-16 stagger-1">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/[0.01] p-12 rounded-[4rem] border border-white/[0.03]">
               <div className="text-center md:text-left">
                 <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Neural Vault</h2>
                 <p className="text-slate-500 text-xl mt-4 font-medium max-w-xl">Historical linguistic snapshots stored in your local neural buffer.</p>
               </div>
               <button 
                onClick={() => { if(confirm("Initiate data wipe?")) { setHistory([]); localStorage.removeItem('stp_elite_vault_v3'); } }}
                className="px-14 py-5 bg-red-500/5 border border-red-500/20 text-red-500 text-[11px] font-black uppercase tracking-[0.3em] rounded-3xl hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-2xl"
               >
                 Purge Archive
               </button>
             </div>

             {history.length === 0 ? (
               <div className="py-60 text-center border-2 border-dashed border-white/[0.05] rounded-[4rem] bg-white/[0.005]">
                 <p className="text-slate-800 text-lg font-black uppercase tracking-[1em] animate-pulse">Archive Void Detected</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {history.map((item, idx) => (
                   <div key={item.id} className="bg-[#080a10] border border-white/[0.06] p-12 rounded-[4rem] group hover:border-indigo-500/40 transition-all shadow-2xl animate-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <div className="flex justify-between items-center mb-12">
                        <div className="flex items-center space-x-4">
                          <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-indigo-500/20 shadow-inner">
                            {item.from} ➔ {item.to}
                          </span>
                          <span className="px-4 py-2 bg-fuchsia-500/5 text-fuchsia-400/60 text-[9px] font-black uppercase tracking-widest rounded-full">{item.tone}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-700 tracking-tighter">{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="space-y-10">
                        <div>
                          <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-4">Input Fragment</p>
                          <p className="text-slate-400 italic text-xl leading-relaxed font-medium">"{item.original}"</p>
                        </div>
                        <div className="relative pt-10 border-t border-white/[0.03]">
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Neural Projection</p>
                          <p className="text-white font-bold text-2xl md:text-3xl leading-snug pr-16">{item.translated}</p>
                          <button onClick={() => copy(item.translated)} className="absolute bottom-0 right-0 p-5 bg-white/[0.02] hover:bg-white/[0.08] rounded-3xl text-slate-700 hover:text-indigo-400 transition-all border border-white/[0.02] active:scale-90">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
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

      {/* Persistence Feedback Toast */}
      <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) transform ${showCopyToast ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-indigo-600/90 backdrop-blur-3xl text-white px-14 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.5em] shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] flex items-center space-x-5 border border-white/10">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
          </div>
          <span className="text-shimmer">Buffer Synchronized</span>
        </div>
      </div>

      <footer className="mt-60 py-40 border-t border-white/[0.03] text-center relative z-10">
         <div className="max-w-2xl mx-auto px-10">
            <p className="text-slate-800 text-[11px] font-black uppercase tracking-[1.2em] mb-12 animate-pulse">Linguistic Interface Module • v3.0.0-ELITE</p>
            <div className="flex justify-center space-x-16 opacity-30">
               {['Protocols', 'Sync Stat', 'Neural Health'].map(l => (
                 <span key={l} className="text-[10px] font-black text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer uppercase tracking-widest">{l}</span>
               ))}
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;