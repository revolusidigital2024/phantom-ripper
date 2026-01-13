
import React, { useState } from 'react';
import { PromptResult, TabType, PromptVariant } from './types';

interface Props {
  result: PromptResult | null;
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
  isAnalyzing: boolean;
  isMixing: boolean;
  error: string | null;
  onGenerateVariants: () => void;
}

const ResultZone: React.FC<Props> = ({ result, activeTab, setActiveTab, isAnalyzing, isMixing, error, onGenerateVariants }) => {
  const [copyStatus, setCopyStatus] = useState<string>('IDLE');

  const handleCopy = (text: string, id: string = 'MAIN') => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus('IDLE'), 2000);
  };

  const copyShotJson = (variant: PromptVariant) => {
    handleCopy(JSON.stringify(variant, null, 2), `JSON_${variant.shot_number}`);
  };

  return (
    <div className="glass-panel rounded-[2rem] min-h-full flex flex-col overflow-hidden border-[#00f0ff]/20">
      {/* TAB HEADER */}
      <div className="flex p-3 bg-black/60 gap-3 border-b border-white/5">
        <button 
          onClick={() => setActiveTab(TabType.PREVIEW)} 
          className={`flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === TabType.PREVIEW ? 'bg-[#00f0ff] text-black' : 'text-zinc-500 hover:text-white'}`}
        >
          Visual Breakdown
        </button>
        <button 
          onClick={() => setActiveTab(TabType.JSON)} 
          className={`flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === TabType.JSON ? 'bg-white/10 text-white border border-white/10' : 'text-zinc-500 hover:text-white'}`}
        >
          Raw Source JSON
        </button>
      </div>

      <div className="p-8 flex-1 custom-scrollbar overflow-auto max-h-[1200px]">
        {error && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#ff007a]/30 rounded-3xl">
            <div className="w-16 h-16 bg-[#ff007a]/10 rounded-full flex items-center justify-center mb-6 text-[#ff007a] font-black text-2xl italic">!</div>
            <h3 className="text-xl font-black text-white mb-2 uppercase italic">RIP FAILED</h3>
            <p className="text-zinc-500 text-xs mono leading-relaxed mb-6">Error Log: {error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#ff007a]/10 text-[#ff007a] rounded-full text-[10px] font-bold uppercase hover:bg-[#ff007a]/20 transition-all border border-[#ff007a]/30">Try Again</button>
          </div>
        )}

        {isAnalyzing && (
          <div className="space-y-10">
            <div className="flex justify-between">
              <div className="h-12 bg-white/5 rounded-xl animate-pulse w-3/4"></div>
              <div className="h-12 bg-white/5 rounded-xl animate-pulse w-1/5"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-32 bg-white/5 rounded-3xl animate-pulse"></div>
              <div className="h-32 bg-white/5 rounded-3xl animate-pulse"></div>
            </div>
            <div className="h-64 bg-[#ff007a]/5 rounded-3xl animate-pulse border border-[#ff007a]/10"></div>
          </div>
        )}

        {!result && !isAnalyzing && !error && (
          <div className="h-full flex flex-col items-center justify-center py-48 opacity-20 group">
            <div className="w-24 h-24 border-2 border-dashed border-zinc-600 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
               <div className="w-12 h-12 bg-zinc-800 rounded-lg animate-bounce"></div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Awaiting Input Signal</p>
          </div>
        )}

        {result && activeTab === TabType.PREVIEW && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Vibe Title Section */}
            <div className="relative">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-5xl font-extrabold tracking-tighter text-white uppercase italic leading-none">{result.vibe_title}</h2>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {result.tags.map((t, i) => (
                      <span key={i} className="bg-[#ff007a]/10 text-[#ff007a] px-3 py-1 rounded-full text-[8px] font-black uppercase border border-[#ff007a]/20 tracking-tighter">#{t.replace('#','')}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end px-6 py-3 bg-[#00f0ff]/10 rounded-2xl border border-[#00f0ff]/20">
                    <span className="text-[8px] text-[#00f0ff] font-black tracking-widest uppercase mb-1">Ratio Format</span>
                    <span className="text-2xl font-black text-white italic">{result.aspect_ratio}</span>
                </div>
              </div>
            </div>

            {/* Spec Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Camera', val: result.camera },
                { label: 'Lens', val: result.lens },
                { label: 'Motion', val: result.motion },
                { label: 'Lighting', val: result.lighting }
              ].map((spec, i) => (
                <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/5 group hover:border-[#00f0ff]/40 transition-colors">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-2">{spec.label}</span>
                  <span className="text-[10px] font-bold text-white group-hover:text-[#00f0ff]">{spec.val}</span>
                </div>
              ))}
            </div>

            {/* Main Prompt Box */}
            <div className="bg-gradient-to-br from-[#ff007a]/5 to-transparent border border-[#ff007a]/20 p-10 rounded-[2.5rem] relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-[8px] font-black text-[#ff007a]/40 uppercase tracking-widest italic">// Master Prompt</div>
              <p className="text-white text-xl leading-relaxed italic mb-10 font-medium">"{result.main_prompt}"</p>
              
              <button 
                onClick={() => handleCopy(result.main_prompt, 'MAIN')} 
                className={`w-full py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 ${copyStatus === 'MAIN' ? 'bg-[#ccff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]' : 'bg-white text-black hover:bg-[#ff007a] hover:text-white'}`}
              >
                {copyStatus === 'MAIN' ? 'DATA SYNCED' : 'COPY PHANTOM PROMPT'}
              </button>
            </div>

            {/* Sequence Logic */}
            <div className="pt-8 border-t border-white/5">
              <h3 className="text-sm font-black text-[#00f0ff] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <span className="w-4 h-[2px] bg-[#00f0ff]"></span> Shot Logic Timeline
              </h3>
              <div className="space-y-4">
                {result.plot_points.map((p, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <span className="text-[#ff007a] font-black text-xs pt-1 opacity-50 group-hover:opacity-100">0{i+1}</span>
                    <p className="text-xs text-zinc-400 leading-relaxed py-2 px-4 glass-panel rounded-xl flex-1 group-hover:text-white transition-colors">{p}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Variant Extender Call to Action */}
            {!result.variants && (
              <button 
                onClick={onGenerateVariants}
                disabled={isMixing}
                className={`w-full py-10 rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-[#00f0ff]/50 transition-all hover:bg-[#00f0ff]/5 ${isMixing ? 'animate-pulse' : ''}`}
              >
                <div className="w-12 h-12 bg-[#00f0ff]/10 text-[#00f0ff] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <div className="text-center">
                  <span className="text-xs font-black text-white uppercase italic">{isMixing ? 'Expander Initializing...' : 'EXPAND SEQUENCE (5 SHOTS)'}</span>
                  <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-[0.2em] mt-1">Unlock 5 technical variants with DNA Lock</p>
                </div>
              </button>
            )}

            {/* Displaying Variants if exist */}
            {result.variants && (
              <div className="space-y-6 pt-10 pb-10">
                <div className="flex items-center justify-between mb-8 gap-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-black text-[#ff007a] uppercase tracking-[0.3em]">DNA Locked Variants</h3>
                    <div className="w-24 h-[1px] bg-[#ff007a]/20"></div>
                  </div>
                  
                  <button 
                    onClick={() => handleCopy(JSON.stringify(result.variants, null, 2), 'ALL_VARIANTS')}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${copyStatus === 'ALL_VARIANTS' ? 'bg-[#ccff00] text-black border-[#ccff00]' : 'bg-white/5 text-zinc-400 border-white/10 hover:border-[#00f0ff] hover:text-[#00f0ff]'}`}
                  >
                    {copyStatus === 'ALL_VARIANTS' ? 'COPIED ALL' : 'COPY ALL VARIANTS JSON'}
                  </button>
                </div>

                {result.variants.map((v, i) => (
                  <div key={i} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-[#ff007a]/40 transition-all group/card">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-[#ff007a] text-white text-[10px] font-black rounded-lg">SHOT 00{v.shot_number}</span>
                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter opacity-60 italic">{v.vibe_title}</span>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleCopy(v.main_prompt, `PROMPT_${v.shot_number}`)}
                          className={`text-[9px] font-black uppercase tracking-widest transition-colors ${copyStatus === `PROMPT_${v.shot_number}` ? 'text-[#ccff00]' : 'text-zinc-500 hover:text-white'}`}
                        >
                          {copyStatus === `PROMPT_${v.shot_number}` ? 'PROMPT COPIED' : 'COPY PROMPT'}
                        </button>
                        <button 
                          onClick={() => copyShotJson(v)}
                          className={`text-[9px] font-black uppercase tracking-widest transition-colors ${copyStatus === `JSON_${v.shot_number}` ? 'text-[#00f0ff]' : 'text-zinc-500 hover:text-white'}`}
                        >
                          {copyStatus === `JSON_${v.shot_number}` ? 'JSON COPIED' : 'COPY JSON'}
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-100 leading-relaxed italic mb-6 border-l-2 border-[#ff007a]/30 pl-4 group-hover/card:border-[#ff007a] transition-all">
                      "{v.main_prompt}"
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {[
                        { l: 'Angle', v: v.technical_specs.angle, c: 'text-[#00f0ff]' },
                        { l: 'Lens', v: v.technical_specs.lens, c: 'text-zinc-400' },
                        { l: 'Motion', v: v.technical_specs.motion, c: 'text-zinc-400' },
                        { l: 'Light', v: v.technical_specs.lighting, c: 'text-zinc-400' },
                        { l: 'Cam', v: v.technical_specs.camera, c: 'text-zinc-400' }
                      ].map((spec, idx) => (
                        <div key={idx} className="bg-black/40 p-3 rounded-xl border border-white/5">
                          <span className="text-[7px] font-black text-zinc-600 uppercase block mb-1">{spec.l}</span>
                          <span className={`text-[9px] font-bold uppercase truncate block ${spec.c}`}>{spec.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {result && activeTab === TabType.JSON && (
          <div className="bg-black/60 p-8 rounded-3xl border border-white/5 mono text-[10px] h-[700px] overflow-auto custom-scrollbar relative">
            <div className="sticky top-0 flex justify-end pb-4 bg-transparent z-10">
              <button 
                onClick={() => handleCopy(JSON.stringify(result, null, 2), 'JSON_TAB')}
                className={`px-4 py-2 rounded-xl text-[9px] font-black transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] ${copyStatus === 'JSON_TAB' ? 'bg-[#ccff00] text-black' : 'bg-[#00f0ff] text-black'}`}
              >
                {copyStatus === 'JSON_TAB' ? 'SOURCE COPIED' : 'COPY FULL SOURCE JSON'}
              </button>
            </div>
            <pre className="text-pink-400/80 leading-relaxed">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultZone;
