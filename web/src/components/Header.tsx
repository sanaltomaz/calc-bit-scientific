import React from 'react';
import { ActiveTab } from '../types/calculator';
import { Terminal, Code2, Calculator, BookOpen, Download, Volume2, VolumeX, Layers } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onDownloadScript: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onDownloadScript,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b-4 border-[#12111c] bg-[#1d1b2b] sticky top-0 z-50">
      {/* Zone 1: Brand title, one line */}
      <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
        <img
          src="/calc_bit_logo.svg"
          alt="Calc Bit Logo"
          className="w-7 h-7 border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000]"
        />
        <span className="font-arcade text-xs sm:text-sm text-white tracking-wider whitespace-nowrap">
          CALC BIT
        </span>
      </div>

      {/* Zone 2: 4 nav links, single-line labels */}
      <nav className="hidden md:flex items-center gap-2 text-xs font-pixel">
        <button
          onClick={() => {
            soundManager.playKeyClick('number');
            setActiveTab('calculator');
          }}
          className={`px-3 py-1.5 border-2 border-black rounded transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'calculator'
              ? 'bg-[#fbbf24] text-black font-bold shadow-[2px_2px_0px_0px_#000000]'
              : 'text-[#a5a1c2] hover:text-white hover:bg-[#252338]'
          }`}
        >
          Calculadora
        </button>

        <button
          onClick={() => {
            soundManager.playKeyClick('number');
            setActiveTab('terminal');
          }}
          className={`px-3 py-1.5 border-2 border-black rounded transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'terminal'
              ? 'bg-[#fbbf24] text-black font-bold shadow-[2px_2px_0px_0px_#000000]'
              : 'text-[#a5a1c2] hover:text-white hover:bg-[#252338]'
          }`}
        >
          Terminal CLI
        </button>

        <button
          onClick={() => {
            soundManager.playKeyClick('number');
            setActiveTab('code');
          }}
          className={`px-3 py-1.5 border-2 border-black rounded transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'code'
              ? 'bg-[#fbbf24] text-black font-bold shadow-[2px_2px_0px_0px_#000000]'
              : 'text-[#a5a1c2] hover:text-white hover:bg-[#252338]'
          }`}
        >
          Código Python
        </button>

        <button
          onClick={() => {
            soundManager.playKeyClick('number');
            setActiveTab('guide');
          }}
          className={`px-3 py-1.5 border-2 border-black rounded transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'guide'
              ? 'bg-[#fbbf24] text-black font-bold shadow-[2px_2px_0px_0px_#000000]'
              : 'text-[#a5a1c2] hover:text-white hover:bg-[#252338]'
          }`}
        >
          4 Operações
        </button>

        <button
          onClick={() => {
            soundManager.playKeyClick('number');
            setActiveTab('docs');
          }}
          className={`px-3 py-1.5 border-2 border-black rounded transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'docs'
              ? 'bg-[#fbbf24] text-black font-bold shadow-[2px_2px_0px_0px_#000000]'
              : 'text-[#a5a1c2] hover:text-white hover:bg-[#252338]'
          }`}
        >
          Arquitetura
        </button>
      </nav>

      {/* Zone 3: 1 primary action button + sound control */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Desativar áudio 16-bit' : 'Ativar áudio 16-bit'}
          className="p-1.5 text-[#a5a1c2] hover:text-white bg-[#252338] border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none transition-all"
          aria-label={soundEnabled ? 'Mudo' : 'Som ativado'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={onDownloadScript}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-pixel text-black bg-[#fbbf24] hover:bg-[#f59e0b] border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap shrink-0 uppercase"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Baixar .py</span>
        </button>
      </div>
    </header>
  );
};
