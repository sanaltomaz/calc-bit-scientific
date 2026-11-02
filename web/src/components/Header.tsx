import React from 'react';
import { Download, Volume2, VolumeX, Gamepad2, BookOpen } from 'lucide-react';
import { ConsoleMode } from '../types/calculator';
import { soundManager } from '../utils/audio';
import logoUrl from '../assets/calc_bit_logo.svg';

interface HeaderProps {
  consoleMode: ConsoleMode;
  onSelectConsoleMode: (mode: ConsoleMode) => void;
  onDownloadScript: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  consoleMode,
  onSelectConsoleMode,
  onDownloadScript,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b-4 border-[#12111c] bg-[#1d1b2b] sticky top-0 z-50">
      {/* Brand Title & Logo */}
      <div className="flex items-center gap-2.5 min-w-0">
        <img
          src={logoUrl}
          alt="Calc Bit Logo"
          className="w-7 h-7 shrink-0 border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000]"
        />
        <span className="font-arcade text-xs sm:text-sm text-white tracking-wider truncate">
          CALC BIT
        </span>
      </div>

      {/* Retro Console Mode Switcher (Calculadora Portátil vs. Lousa Switch) */}
      <nav
        aria-label="Seleção de Modo de Console"
        className="flex items-center gap-2 bg-[#141320] p-1 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000000]"
      >
        <button
          onClick={() => {
            soundManager.playKeyClick('operator');
            onSelectConsoleMode('calculator');
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-arcade text-[9px] sm:text-[10px] transition-all cursor-pointer ${
            consoleMode === 'calculator'
              ? 'bg-[#6366f1] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000000]'
              : 'text-[#a5a1c2] hover:text-white border-2 border-transparent'
          }`}
          title="Console Portátil Clássico + Aba Científica"
        >
          <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
          <span>CALCULADORA</span>
        </button>

        <button
          onClick={() => {
            soundManager.playKeyClick('operator');
            onSelectConsoleMode('learning');
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-arcade text-[9px] sm:text-[10px] transition-all cursor-pointer ${
            consoleMode === 'learning'
              ? 'bg-[#10b981] text-[#052e16] font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000000]'
              : 'text-[#a5a1c2] hover:text-white border-2 border-transparent'
          }`}
          title="Modo Aprendizado: Joy-Con + Lousa Digital Passo a Passo"
        >
          <BookOpen className="w-3.5 h-3.5 shrink-0" />
          <span>APRENDIZADO</span>
        </button>
      </nav>

      {/* Sound Control & Download Action */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Desativar áudio 16-bit' : 'Ativar áudio 16-bit'}
          className="p-1.5 text-[#a5a1c2] hover:text-white bg-[#252338] border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          aria-label={soundEnabled ? 'Mudo' : 'Som ativado'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={onDownloadScript}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-pixel text-black bg-[#fbbf24] hover:bg-[#f59e0b] border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap shrink-0 uppercase cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Baixar .py</span>
        </button>
      </div>
    </header>
  );
};
