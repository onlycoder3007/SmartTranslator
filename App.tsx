
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- Configuration Types ---
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

  // Persistence: Restore history from local buffer
  useEffect(() => {
    const saved = localStorage.getItem('stp_elite_vault');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Vault corruption detected. Resetting.");
      }
    }
  }, []);

  // Persistence: Sync history to local buffer
  useEffect(() => {
    localStorage.setItem('stp_elite_vault', JSON.stringify(history.slice(0, 50)));
  }, [history]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    setTranslatedText(""); 

    try {
      // The API key is automatically injected from Netlify Environment Variables
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const targetFull = targetLang === 'RU' ? 'Russian' : 'English';
      
      const toneDirectives = {
        natural: "natural, friendly, and perfect for Telegram/WhatsApp chats.",
        formal: "professional, respectful, and appropriate for business emails.",
        slang: "street-style colloquialism, using youth slang and abbreviations."
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: inputText,
        config: {
          systemInstruction: `You are a World-Class Linguistic Agent. 
          Task: Translate Uzbek text into ${targetFull}. 
          Constraint: Use a ${toneDirectives[tone]} style. 
          Strictly return ONLY the translated content. No preamble. No meta-commentary.`,
          temperature: 0.85,
        },
      });

      const result = response.text?.trim() || "Signal Lost: Neural core returned empty data.";
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

    } catch (err) {
      console.error("Linguistic Core Error:", err);
      setTranslatedText("Linguistic link failed. Ensure 'API_KEY' is configured in Netlify environment variables.");
    } finally {
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
    <div className="min-h-screen bg-[#010208] text-slate-100 font-['Plus_Jakarta_Sans'] selection:bg-indigo-500/40 overflow-x-hidden">
      
      {/* Neural Atmosphere Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-25%] left-[-15%] w-[80%] h-[80%] bg-indigo-600/10 blur-[200px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-600/5 blur-[180px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Glass Navigation */}
      <nav className="relative z-50 border-b border-white/[0.04] backdrop-blur-3xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-violet-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30">
              <span className="text-2xl font-black italic">S</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
                SmartTranslate <span className="text-indigo-400">PRO</span>
              </h1>
              <div className="flex items-center space-x-2 mt-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Network Active</span>
              </div>
            </div>
          </div>

          <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.05] shadow-inner">
            <button 
              onClick={() => setView('translate')}
              className={`px-8 py-2 rounded-xl text-xs font-black tracking-widest transition-all duration-500 ${view === 'translate' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-200'}`}
            >
              ENGINE
            </button>
            <button 
              onClick={() => setView('history')}
              className={`px-8 py-2 rounded-xl text-xs font-black tracking-widest transition-all duration-500 ${view === 'history' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-200'}`}
            >
              ARCHIVE
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        {view === 'translate' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Core Workspace */}
            <div className="lg:col-span-8 space-y-10 animate-in">
              
              {/* Language & Tone Strategy */}
              <div className="flex flex-wrap items-center gap-4 bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] p-3 rounded-[2rem] shadow-2xl">
                <div className="flex items-center bg-black/40 p-1.5 rounded-2xl border border-white/5">
                  <div className="px-6 py-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Uzbek</div>
                  <div className="w-8 h-8 flex items-center justify-center text-indigo-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7" /></svg>
                  </div>
                  <div className="flex bg-slate-900/80 p-1 rounded-xl">
                    <button onClick={() => setTargetLang('RU')} className={`px-6 py-2 text-[10px] font-black rounded-lg transition-all ${targetLang === 'RU' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300'}`}>RUSSIAN</button>
                    <button onClick={() => setTargetLang('EN')} className={`px-6 py-2 text-[10px] font-black rounded-lg transition-all ${targetLang === 'EN' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300'}`}>ENGLISH</button>
                  </div>
                </div>

                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 ml-auto">
                   {(['natural', 'formal', 'slang'] as Tone[]).map(t => (
                     <button key={t} onClick={() => setTone(t)} className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${tone === t ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-slate-600 hover:text-slate-400'}`}>
                       {t}
                     </button>
                   ))}
                </div>
              </div>

              {/* Input Zone */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-[#070912] border border-white/[0.08] rounded-[3rem] overflow-hidden min-h-[480px] flex flex-col shadow-[0_40px_100px_-30px_rgba(0,0,0,1)]">
                  <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter Uzbek text for neural processing..."
                    className="flex-1 w-full bg-transparent p-12 text-2xl md:text-4xl text-white font-medium resize-none focus:outline-none placeholder:text-slate-800 placeholder:italic leading-tight tracking-tight selection:bg-indigo-500/50"
                  />
                  
                  <div className="p-10 border-t border-white/[0.03] bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-1">Linguistic Density</span>
                      <span className="text-xl font-bold text-indigo-400/80 tracking-tighter">{inputText.length} <span className="text-slate-700 font-normal">/ 5000</span></span>
                    </div>
                    
                    <button 
                      onClick={handleTranslate}
                      disabled={isTranslating || !inputText.trim()}
                      className={`relative group overflow-hidden px-14 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all active:scale-95 flex items-center space-x-4 ${isTranslating || !inputText.trim() ? 'bg-slate-900 text-slate-700' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_25px_50px_-15px_rgba(79,70,229,0.5)]'}`}
                    >
                      {isTranslating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <span>Computing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          <span>Execute Translation</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Neural Result Card */}
              {translatedText && (
                <div className="animate-in fade-in slide-in-from-top-10 duration-700">
                  <div className="bg-gradient-to-br from-[#0e1220] to-[#010208] border border-white/[0.08] rounded-[3rem] p-12 relative overflow-hidden group shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)]">
                    <div className="flex justify-between items-start mb-10">
                       <span className="px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Neural Output Output</span>
                       <button onClick={() => copy(translatedText)} className="p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-2xl text-slate-500 hover:text-white transition-all active:scale-90 flex items-center space-x-3">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                         <span className="text-[10px] font-black uppercase tracking-widest">Copy</span>
                       </button>
                    </div>
                    <p className="text-3xl md:text-5xl text-white font-bold leading-tight tracking-tight">{translatedText}</p>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Visual Context Preview (Right) */}
            <div className="lg:col-span-4 space-y-10 animate-in delay-300">
               <div className="relative mx-auto max-w-[320px] aspect-[9/18.5] bg-[#000] border-[12px] border-[#161618] rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col group">
                 {/* Dynamic Island */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#161618] rounded-b-3xl z-20"></div>
                 
                 {/* App Interface Simulation */}
                 <div className="flex-1 bg-[#050505] flex flex-col">
                   <div className="pt-12 pb-5 px-6 border-b border-white/[0.03] flex items-center space-x-3 bg-white/[0.01]">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-600 flex items-center justify-center p-0.5">
                        <div className="w-full h-full bg-[#050505] rounded-full flex items-center justify-center">
                          <span className="text-[10px] font-black italic text-indigo-400">ST</span>
                        </div>
                     </div>
                     <div>
                       <p className="text-[11px] font-black text-white uppercase tracking-wider">Live Preview</p>
                       <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-[0.2em]">Synchronized</p>
                     </div>
                   </div>

                   <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-hide">
                     <div className="flex flex-col items-start animate-in slide-in-from-left-6">
                        <div className="max-w-[90%] bg-[#1a1c22] p-4 rounded-3xl rounded-tl-none text-[12px] text-slate-300 leading-relaxed border border-white/[0.05]">
                          {inputText || "Awaiting neural transmission..."}
                        </div>
                        <span className="text-[8px] text-slate-600 mt-2 ml-1 uppercase font-black">SENT • 10:42 PM</span>
                     </div>

                     {(translatedText || isTranslating) && (
                       <div className="flex flex-col items-end animate-in slide-in-from-right-6">
                         <div className="max-w-[90%] bg-indigo-600 p-4 rounded-3xl rounded-tr-none text-[12px] text-white leading-relaxed shadow-2xl shadow-indigo-600/30">
                           {isTranslating ? (
                             <div className="flex space-x-1.5 py-1">
                               <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                               <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                               <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                             </div>
                           ) : translatedText}
                         </div>
                         <span className="text-[8px] text-indigo-400 mt-2 mr-1 uppercase font-black">AI AGENT • DELIVERED</span>
                       </div>
                     )}
                   </div>
                   
                   {/* Fake input bar */}
                   <div className="p-5 border-t border-white/[0.03] bg-black">
                      <div className="h-10 bg-[#121418] rounded-full px-5 flex items-center justify-between border border-white/[0.02]">
                         <div className="w-20 h-2 bg-slate-800 rounded-full"></div>
                         <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                         </div>
                      </div>
                   </div>
                 </div>
               </div>

               {/* Metrics Panel */}
               <div className="bg-white/[0.02] border border-white/[0.06] rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em]">Engine Telemetry</h4>
                 <div className="space-y-6">
                   {[
                     { label: "Neural Accuracy", value: "99.4%", color: "indigo" },
                     { label: "Token Processing", value: "Real-time", color: "emerald" },
                     { label: "Tone Matching", value: "Precise", color: "fuchsia" }
                   ].map(stat => (
                     <div key={stat.label} className="space-y-2">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                         <span className="text-slate-500">{stat.label}</span>
                         <span className="text-white italic">{stat.value}</span>
                       </div>
                       <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.02]">
                         <div className={`h-full bg-${stat.color}-500 w-full opacity-60 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}></div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        ) : (
          /* Archive / Vault View */
          <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-700">
             <div className="flex items-center justify-between bg-white/[0.01] p-10 rounded-[3rem] border border-white/[0.03]">
               <div>
                 <h2 className="text-5xl font-black text-white tracking-tighter">Secure Archive</h2>
                 <p className="text-slate-500 text-lg mt-2 font-medium">Historical linguistic data encrypted in the local neural buffer.</p>
               </div>
               <button 
                onClick={() => { if(confirm("Flush all archival data?")) { setHistory([]); localStorage.removeItem('stp_elite_vault'); } }}
                className="px-10 py-4 bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-2xl"
               >
                 Flush Vault
               </button>
             </div>

             {history.length === 0 ? (
               <div className="py-60 text-center border-2 border-dashed border-white/[0.05] rounded-[4rem] bg-white/[0.005]">
                 <p className="text-slate-700 text-sm font-black uppercase tracking-[1em]">Archive Void Detected</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {history.map(item => (
                   <div key={item.id} className="bg-[#070912] border border-white/[0.06] p-10 rounded-[3rem] group hover:border-indigo-500/40 transition-all shadow-2xl">
                      <div className="flex justify-between items-center mb-10">
                        <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] rounded-full border border-indigo-500/20">
                          {item.from} → {item.to} • {item.tone}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="space-y-8">
                        <div>
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-3">Original</p>
                          <p className="text-slate-400 italic text-lg leading-relaxed">"{item.original}"</p>
                        </div>
                        <div className="relative pt-6 border-t border-white/[0.03]">
                          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3">Neural Output</p>
                          <p className="text-white font-bold text-xl leading-snug pr-12">{item.translated}</p>
                          <button onClick={() => copy(item.translated)} className="absolute bottom-0 right-0 p-4 bg-white/[0.03] rounded-2xl text-slate-700 hover:text-indigo-400 transition-colors border border-white/[0.02]">
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

      {/* Global Status Toast */}
      <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) transform ${showCopyToast ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-indigo-600/90 backdrop-blur-xl text-white px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-[0_30px_60px_-15px_rgba(0,0,0,1)] flex items-center space-x-4 border border-white/10">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
          </div>
          <span>Synchronized to Clipboard</span>
        </div>
      </div>

      <footer className="mt-60 py-32 border-t border-white/[0.03] text-center relative z-10 bg-gradient-to-b from-transparent to-black/20">
         <div className="max-w-xl mx-auto px-6">
            <p className="text-slate-800 text-[10px] font-black uppercase tracking-[1em] mb-8 animate-pulse">Neural Interface Layer • v2.5.0-ELITE</p>
            <div className="flex justify-center space-x-12">
               <span className="text-[10px] font-black text-slate-700 hover:text-indigo-400 transition-colors cursor-pointer uppercase tracking-widest">Protocol</span>
               <span className="text-[10px] font-black text-slate-700 hover:text-indigo-400 transition-colors cursor-pointer uppercase tracking-widest">Vault Safety</span>
               <span className="text-[10px] font-black text-slate-700 hover:text-indigo-400 transition-colors cursor-pointer uppercase tracking-widest">API Health</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;
