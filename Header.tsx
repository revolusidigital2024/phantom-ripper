
import React from 'react';

interface Props {
  onOpenSettings: () => void;
  onLock: () => void;
}

const Header: React.FC<Props> = ({ onOpenSettings, onLock }) => (
  <header className="fixed top-0 left-0 w-full z-50 p-4">
    <div className="max-w-[1600px] mx-auto flex justify-between items-center glass-panel px-6 py-3 rounded-full border-white/10">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-gradient-to-br from-[#ff007a] to-[#00f0ff] rotate-45 flex items-center justify-center overflow-hidden">
          <span className="text-black font-black -rotate-45 text-lg">P</span>
        </div>
        <div className="leading-tight">
          <h1 className="text-lg font-black tracking-tighter italic glitch-text">
            PHANTOM<span className="text-[#00f0ff]">ARCADE</span>
          </h1>
          <p className="text-[8px] uppercase tracking-[0.5em] text-zinc-500 font-bold">Vibe Ripper // ver 2.5</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:flex gap-4 text-[9px] font-bold">
          <div className="flex flex-col items-end">
            <span className="text-zinc-600">SYSTEM STATUS</span>
            <span className="text-[#ccff00]">ONLINE READY</span>
          </div>
          <div className="w-[1px] h-6 bg-white/10 self-center"></div>
          <div className="flex flex-col items-end">
            <span className="text-zinc-600">CORE ENGINE</span>
            <span className="text-[#ff007a]">GEMINI 3 FLASH</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onLock}
            title="Lock System"
            className="p-2 hover:bg-white/5 rounded-full transition-colors border border-white/5 group"
          >
            <svg className="w-5 h-5 text-zinc-600 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </button>
          
          <button 
            onClick={onOpenSettings}
            title="System Config"
            className="p-2 hover:bg-white/5 rounded-full transition-colors border border-white/5 group"
          >
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
