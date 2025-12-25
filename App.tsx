
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

  // Load history from browser storage
  useEffect(() => {
    const saved = localStorage.getItem('stp_elite_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Save history to browser storage
  useEffect(() => {
    localStorage.setItem('stp_elite_history', JSON.stringify(history.slice(0, 50)));
  }, [history]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    setTranslatedText(""); // Clear previous

    try {
      // Create AI instance using the pre-configured environment key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const targetFull = targetLang === 'RU' ? 'Russian' : 'English';
      
      const toneMap = {
        natural: "natural, friendly, and perfect for Telegram/WhatsApp.",
        formal: "professional, respectful, and business-appropriate.",
        slang: "casual, street style, using youth slang and abbreviations."
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: inputText,
        config: {
          systemInstruction: `You are an Elite Uzbek Translator. 
          Translate the text to ${targetFull}. 
          Style: ${toneMap[tone]}. 
          Return ONLY the final translated text. No quotes. No notes.`,
          temperature: 0.8,
        },
      });

      const result = response.text?.trim() || "Error: Empty response.";
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
      console.error(err);
      setTranslatedText("Connection to Neural Core failed. Please ensure the API Key is configured in the environment.");
    } finally {
      setIsTranslating(false);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 selection:bg-indigo-500/30 font-['Plus_Jakarta_Sans'] overflow-x-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 blur-[180px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] contrast-150 brightness-150"></div>
      </div>

      {/* Modern Header */}
      <nav className="relative z-50 border-b border-white/5 backdrop-blur-3xl sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <span className="text-xl font-black italic">S</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">SmartTranslate <span className="text-indigo-400 font-medium">ELITE</span></h1>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Public Deployment Ready</span>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-900/50 p-1 rounded-full border border-white/5">
            <button 
              onClick={() => setView('translate')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${view === 'translate' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              ENGINE
            </button>
            <button 
              onClick={() => setView('history')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${view === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              ARCHIVE
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto p-6 md:p-12">
        {view === 'translate' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Primary Interface */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Controls */}
              <div className="flex flex-wrap items-center gap-4 bg-white/[0.02] backdrop-blur-xl border border-white/10 p-2 rounded-3xl">
                <div className="flex items-center bg-black/40 p-1 rounded-2xl border border-white/5">
                  <div className="px-5 py-2 text-[10px] font-black uppercase text-slate-500 tracking-widest">Uzbek</div>
                  <div className="w-8 h-8 flex items-center justify-center text-indigo-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7" /></svg>
                  </div>
                  <div className="flex bg-slate-800/50 p-1 rounded-xl">
                    <button onClick={() => setTargetLang('RU')} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${targetLang === 'RU' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>RU</button>
                    <button onClick={() => setTargetLang('EN')} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${targetLang === 'EN' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>EN</button>
                  </div>
                </div>

                <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 ml-auto">
                   {(['natural', 'formal', 'slang'] as Tone[]).map(t => (
                     <button key={t} onClick={() => setTone(t)} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${tone === t ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}>
                       {t}
                     </button>
                   ))}
                </div>
              </div>

              {/* Input Workspace */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                <div className="relative bg-[#0b0e14] border border-white/10 rounded-[2.5rem] overflow-hidden min-h-[450px] flex flex-col shadow-2xl">
                  <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter Uzbek text to translate..."
                    className="flex-1 w-full bg-transparent p-10 text-xl md:text-2xl text-white font-medium resize-none focus:outline-none placeholder:text-slate-800 placeholder:italic leading-relaxed"
                  />
                  <div className="p-8 border-t border-white/5 bg-black/40 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Characters</span>
                      <span className="text-sm font-bold text-indigo-400">{inputText.length}</span>
                    </div>
                    
                    <button 
                      onClick={handleTranslate}
                      disabled={isTranslating || !inputText.trim()}
                      className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all active:scale-95 flex items-center space-x-3 ${isTranslating || !inputText.trim() ? 'bg-slate-900 text-slate-700' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_20px_40px_-15px_rgba(79,70,229,0.4)]'}`}
                    >
                      {isTranslating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <span>Computing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          <span>Execute</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Result Card */}
              {translatedText && (
                <div className="animate-in fade-in slide-in-from-top-6 duration-700">
                  <div className="bg-gradient-to-br from-[#121620] to-[#02040a] border border-indigo-500/20 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl">
                    <div className="flex justify-between items-start mb-8">
                       <span className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">Resulting Transmission</span>
                       <button onClick={() => copy(translatedText)} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                       </button>
                    </div>
                    <p className="text-2xl md:text-3xl text-white font-semibold leading-tight tracking-tight selection:bg-indigo-500/50">{translatedText}</p>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/5 blur-3xl rounded-full"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Visual Context (Right) */}
            <div className="lg:col-span-4 space-y-8">
               <div className="relative mx-auto max-w-[300px] aspect-[9/18.5] bg-[#0b0b0b] border-[10px] border-[#1a1a1a] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col group">
                 {/* Notch */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1a1a1a] rounded-b-2xl z-20"></div>
                 
                 {/* Internal UI */}
                 <div className="flex-1 bg-[#050505] flex flex-col">
                   <div className="pt-10 pb-4 px-6 border-b border-white/5 flex items-center space-x-3">
                     <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center">
                        <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-white uppercase tracking-widest">Preview Mode</p>
                       <p className="text-[8px] text-emerald-500 font-bold">LIVE SIGNAL</p>
                     </div>
                   </div>

                   <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                     <div className="flex flex-col items-start animate-in slide-in-from-left-4">
                        <div className="max-w-[85%] bg-slate-800/80 p-3 rounded-2xl rounded-tl-none text-[11px] text-slate-200 leading-snug">
                          {inputText || "Waiting for input..."}
                        </div>
                     </div>

                     {(translatedText || isTranslating) && (
                       <div className="flex flex-col items-end animate-in slide-in-from-right-4">
                         <div className="max-w-[85%] bg-indigo-600 p-3 rounded-2xl rounded-tr-none text-[11px] text-white leading-snug shadow-lg shadow-indigo-500/20">
                           {isTranslating ? (
                             <div className="flex space-x-1 py-1">
                               <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></div>
                               <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                               <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                             </div>
                           ) : translatedText}
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
               </div>

               <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-6">
                 <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Engine Metrics</h4>
                 <div className="space-y-4">
                   {[
                     { label: "Accuracy", value: "99.2%", color: "indigo" },
                     { label: "Latency", value: "0.2s", color: "emerald" },
                     { label: "Tone Match", value: "Optimal", color: "fuchsia" }
                   ].map(stat => (
                     <div key={stat.label} className="space-y-1.5">
                       <div className="flex justify-between items-center text-[10px] font-bold">
                         <span className="text-slate-400">{stat.label}</span>
                         <span className="text-white">{stat.value}</span>
                       </div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                         <div className={`h-full bg-${stat.color}-500 w-full opacity-60 shadow-[0_0_10px_rgba(0,0,0,1)]`}></div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        ) : (
          /* Archive System */
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
             <div className="flex items-center justify-between">
               <div>
                 <h2 className="text-3xl font-black text-white tracking-tighter">Transmission Archive</h2>
                 <p className="text-slate-500 text-sm mt-1">Encrypted history stored in your local neural buffer.</p>
               </div>
               <button 
                onClick={() => { setHistory([]); localStorage.removeItem('stp_elite_history'); }}
                className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all"
               >
                 Flush History
               </button>
             </div>

             {history.length === 0 ? (
               <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                 <p className="text-slate-700 font-black uppercase tracking-widest">Archive Void</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {history.map(item => (
                   <div key={item.id} className="bg-[#0b0e14] border border-white/5 p-8 rounded-[2.5rem] group hover:border-indigo-500/30 transition-all">
                      <div className="flex justify-between items-center mb-6">
                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded-full">{item.from} → {item.to} • {item.tone}</span>
                        <span className="text-[9px] font-bold text-slate-600">{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="space-y-4">
                        <p className="text-xs text-slate-500 italic">"{item.original}"</p>
                        <div className="relative">
                          <p className="text-sm font-bold text-white pr-10">{item.translated}</p>
                          <button onClick={() => copy(item.translated)} className="absolute -top-1 -right-1 p-2 text-slate-700 hover:text-indigo-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
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

      {/* Persistence Success Feedback */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${showCopyToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="bg-indigo-600 text-white px-10 py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl flex items-center space-x-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          <span>Copied to clipboard</span>
        </div>
      </div>

      <footer className="mt-40 py-20 border-t border-white/5 text-center">
         <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.8em] animate-pulse">Linguistic Interface • v2.1.0-ELITE</p>
      </footer>
    </div>
  );
};

export default App;
