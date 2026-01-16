
import React, { useState, useEffect } from 'react';
import { TabType, AppState, PromptResult } from './types';
import { analyzeMedia, generateVariants } from './geminiService';
import Header from './Header';
import InputZone from './InputZone';
import ResultZone from './ResultZone';
import AccessGate from './AccessGate';

const App: React.FC = () => {
  const [hasAccess, setHasAccess] = useState<boolean>(() => localStorage.getItem('phantom_access_granted') === 'true');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('phantom_api_key') || process.env.API_KEY || '');
  const [state, setState] = useState<AppState>({
    isAnalyzing: false,
    isMixing: false,
    error: null,
    result: null,
    selectedFile: null,
    previewUrl: null,
    context: '',
  });

  const [history, setHistory] = useState<PromptResult[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.PREVIEW);
  const [showSettings, setShowSettings] = useState(false);

  // Sync state to global process.env for the service to consume
  useEffect(() => {
    if (apiKey) {
      process.env.API_KEY = apiKey;
      localStorage.setItem('phantom_api_key', apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    const saved = localStorage.getItem('phantom_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleGrantAccess = () => {
    setHasAccess(true);
    localStorage.setItem('phantom_access_granted', 'true');
  };

  const handleLockSystem = () => {
    localStorage.removeItem('phantom_access_granted');
    setHasAccess(false);
    setShowSettings(false);
  };

  const handleFileSelect = (file: File) => {
    if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
    const url = URL.createObjectURL(file);
    setState(prev => ({ ...prev, selectedFile: file, previewUrl: url, error: null, result: null }));
  };

  const handleReset = () => {
    if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
    setState({ 
      isAnalyzing: false, 
      isMixing: false,
      error: null, 
      result: null, 
      selectedFile: null, 
      previewUrl: null, 
      context: '' 
    });
  };

  const startAnalysis = async () => {
    if (!state.selectedFile) return;
    if (!apiKey) {
      setState(prev => ({ ...prev, error: "API Key missing. Enter it in System Config." }));
      setShowSettings(true);
      return;
    }

    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    try {
      const result = await analyzeMedia(state.selectedFile, state.context);
      setState(prev => ({ ...prev, result, isAnalyzing: false }));
      
      const newHistory = [result, ...history.slice(0, 9)];
      setHistory(newHistory);
      localStorage.setItem('phantom_history', JSON.stringify(newHistory));
    } catch (err: any) {
      setState(prev => ({ ...prev, isAnalyzing: false, error: err.message || "Rip failed. L rizz. 💀" }));
    }
  };

  const handleGenerateVariants = async () => {
    if (!state.result || !state.selectedFile) return;
    setState(prev => ({ ...prev, isMixing: true }));
    try {
      const variants = await generateVariants(state.result, state.selectedFile);
      setState(prev => ({
        ...prev,
        result: { ...prev.result!, variants },
        isMixing: false
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isMixing: false, error: "Variant mix failed. 💀" }));
    }
  };

  if (!hasAccess) {
    return <AccessGate onUnlock={handleGrantAccess} />;
  }

  return (
    <div className="min-h-screen pb-32 pt-24 selection:bg-[#ff007a] selection:text-white animate-in fade-in duration-1000">
      <Header onOpenSettings={() => setShowSettings(true)} onLock={handleLockSystem} />
      
      <main className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-8">
          <InputZone 
            onFileSelect={handleFileSelect}
            onReset={handleReset}
            onAnalyze={startAnalysis}
            previewUrl={state.previewUrl}
            isVideo={state.selectedFile?.type.startsWith('video/') || false}
            isAnalyzing={state.isAnalyzing}
            context={state.context}
            setContext={(ctx) => setState(prev => ({ ...prev, context: ctx }))}
            disabled={!state.selectedFile || state.isAnalyzing}
          />
          
          <div className="glass-panel p-8 rounded-[2rem] border-white/5 hidden xl:block">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-6">// RECENT RIP LOGS</h4>
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-[9px] text-zinc-700 italic">No history yet...</p>
              ) : (
                history.slice(0, 3).map((h, i) => (
                  <button 
                    key={i} 
                    onClick={() => setState(prev => ({ ...prev, result: h }))}
                    className="w-full text-left p-4 rounded-2xl hover:bg-white/5 transition-all group flex justify-between items-center"
                  >
                    <span className="text-[10px] font-bold text-zinc-400 group-hover:text-[#00f0ff] truncate pr-4">{h.vibe_title}</span>
                    <span className="text-[8px] text-zinc-700 group-hover:text-zinc-500 uppercase">View Details</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ResultZone 
            result={state.result}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isAnalyzing={state.isAnalyzing}
            isMixing={state.isMixing}
            error={state.error}
            onGenerateVariants={handleGenerateVariants}
          />
        </div>
      </main>

      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-panel max-w-lg w-full p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden">
            <button onClick={() => setShowSettings(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase mb-8">System Config</h2>
            
            <div className="space-y-8">
              <div className="bg-[#0a0a0c] p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[#00f0ff]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </span>
                  <h3 className="text-[11px] font-black text-[#00f0ff] uppercase tracking-[0.2em]">INTEGRATION STATUS</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">GEMINI API KEY:</label>
                    <input 
                      type="password"
                      placeholder="ENTER API KEY..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-[#00f0ff] focus:border-[#00f0ff]/50 outline-none transition-all font-mono"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest">Connection:</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded ${apiKey ? 'bg-[#ccff00]/10 text-[#ccff00]' : 'bg-red-500/10 text-red-500'}`}>
                      {apiKey ? 'LINKED' : 'AWAITING KEY'}
                    </span>
                  </div>
                  
                  <p className="text-[9px] text-zinc-600 leading-relaxed italic mt-2">
                    Manual key entry enabled. Key is stored locally for session persistence.
                  </p>

                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-center text-[8px] text-[#00f0ff] hover:underline uppercase tracking-widest font-bold mt-2"
                  >
                    Get API Key from Google AI Studio
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="w-full py-4 bg-[#ff007a] text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-full hover:bg-[#ff007a]/80 transition-all shadow-[0_0_20px_rgba(255,0,122,0.3)]"
                >
                  SAVE CONFIG
                </button>
                
                <button 
                  onClick={handleLockSystem}
                  className="w-full py-3 bg-white/5 text-zinc-500 hover:text-red-500 border border-white/5 hover:border-red-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all"
                >
                  WIPE SESSION & LOCK SYSTEM
                </button>

                <p className="text-center text-[8px] text-zinc-600 uppercase font-bold tracking-widest">Interface Optimized // 120Hz Enabled</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
