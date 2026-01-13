
import React, { useRef, useState } from 'react';

interface Props {
  onFileSelect: (file: File) => void;
  onReset: () => void;
  onAnalyze: () => void;
  previewUrl: string | null;
  isVideo: boolean;
  isAnalyzing: boolean;
  context: string;
  setContext: (ctx: string) => void;
  disabled: boolean;
}

const InputZone: React.FC<Props> = ({ 
  onFileSelect, onReset, onAnalyze, previewUrl, isVideo, isAnalyzing, context, setContext, disabled 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-8">
      {/* DRAG AND DROP AREA */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if(f) onFileSelect(f); }}
        className={`relative glass-panel rounded-3xl transition-all duration-500 overflow-hidden ${previewUrl ? 'p-2' : 'p-16 border-dashed'} ${isDragging ? 'border-[#00f0ff] bg-[#00f0ff]/5' : ''} group`}
        onClick={() => !previewUrl && fileInputRef.current?.click()}
      >
        {isAnalyzing && <div className="scanner-effect"></div>}

        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} />
        
        {previewUrl ? (
          <div className="relative h-full w-full rounded-2xl overflow-hidden group">
            {isVideo ? (
              <video src={previewUrl} className="w-full h-auto max-h-[500px] object-contain" controls autoPlay muted loop />
            ) : (
              <img src={previewUrl} className="w-full h-auto max-h-[500px] object-contain" alt="Source" />
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); onReset(); }} 
              className="absolute top-6 right-6 z-20 bg-black/60 hover:bg-[#ff007a] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all border border-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="absolute bottom-6 left-6 px-4 py-2 glass-panel text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest border-[#00f0ff]/30">
              Asset Loaded
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 cursor-pointer">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-[#ff007a]/10 transition-all border border-white/5">
              <svg className="w-10 h-10 text-zinc-600 group-hover:text-[#ff007a] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Feed the Phantom</h3>
            <p className="text-zinc-500 text-[9px] tracking-[0.4em] uppercase font-bold">Drop Image or Video to Rip the Vibe</p>
          </div>
        )}
      </div>

      {/* CONTEXT AREA */}
      <div className="glass-panel rounded-3xl p-8 border-l-4 border-l-[#ff007a]">
        <div className="flex justify-between items-center mb-4">
          <label className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">// RIPPER FOCUS</label>
          <div className="w-2 h-2 bg-[#ff007a] rounded-full animate-pulse"></div>
        </div>
        <textarea 
          className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm focus:border-[#ff007a]/50 outline-none h-32 text-pink-100 placeholder:text-zinc-800 transition-all resize-none" 
          placeholder="E.g. 'Focus on the glitchy lighting', 'Capture the fast motion sequences'..." 
          value={context} 
          onChange={(e) => setContext(e.target.value)} 
        />
      </div>

      {/* ACTION BUTTON */}
      <button 
        disabled={disabled} 
        onClick={onAnalyze} 
        className={`w-full py-6 rounded-full text-sm font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden group ${isAnalyzing ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed' : 'bg-[#ff007a] hover:bg-[#ff007a]/90 text-white shadow-[0_0_30px_rgba(255,0,122,0.4)] active:scale-[0.98]'}`}
      >
        <span className="relative z-10 italic">{isAnalyzing ? "SCRAPING DATA..." : "RIP THE VIBE"}</span>
        {!isAnalyzing && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>}
      </button>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default InputZone;
