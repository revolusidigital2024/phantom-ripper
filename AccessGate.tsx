
import React, { useState } from 'react';

interface Props {
  onUnlock: () => void;
}

const AccessGate: React.FC<Props> = ({ onUnlock }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);
  const [isBypassing, setIsBypassing] = useState(false);

  // KUNCI PINTU (Ganti di sini kalau mau ubah kuncinya, Boss!)
  const SECRET_KEY = "PHANTOM_RIPPER_2025";

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.toUpperCase() === SECRET_KEY) {
      setIsBypassing(true);
      setTimeout(() => {
        onUnlock();
      }, 1000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
      setKey('');
    }
  };

  return (
    <div className={`fixed inset-0 z-[999] bg-[#050507] flex items-center justify-center p-6 transition-all duration-1000 ${isBypassing ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
      <div className="max-w-md w-full glass-panel p-10 rounded-[2.5rem] border-[#ff007a]/30 relative overflow-hidden text-center">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff007a] to-transparent"></div>
        <div className="mb-8">
          <div className="w-20 h-20 bg-[#ff007a]/10 border-2 border-[#ff007a]/40 rounded-full flex items-center justify-center mx-auto mb-6 group">
            <svg className={`w-10 h-10 ${error ? 'text-red-500 animate-bounce' : 'text-[#ff007a]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase italic">SYSTEM LOCKED</h1>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.4em] mt-2 italic">Requires Phantom Access Key</p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-6">
          <div className="relative group">
            <input 
              type="password"
              placeholder="ENTER SECRET KEY..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className={`w-full bg-black/40 border ${error ? 'border-red-500 animate-shake' : 'border-white/10'} rounded-2xl py-5 px-6 text-center text-xs tracking-[0.5em] text-[#00f0ff] outline-none focus:border-[#00f0ff]/50 transition-all font-black`}
              autoFocus
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-[#ff007a] hover:text-white transition-all shadow-xl active:scale-95"
          >
            {isBypassing ? 'BYPASSING...' : 'INITIATE ACCESS'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-[8px] text-zinc-700 uppercase font-bold tracking-widest">Unauthorized access is logged // Vibe Ripper v2.5</p>
        </div>

        {error && (
          <div className="absolute inset-0 bg-red-900/20 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
            <span className="text-red-500 font-black text-xl italic tracking-tighter uppercase">ACCESS DENIED</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};

export default AccessGate;
