import React from 'react';
import { Download, Volume2, VolumeX } from 'lucide-react';
import logoUrl from '../assets/calc_bit_logo.svg';

interface HeaderProps {
  onDownloadScript: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onDownloadScript,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 border-b-4 border-[#12111c] bg-[#1d1b2b] sticky top-0 z-50">
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

      {/* Sound Control & Download Action */}
      <div className="flex items-center gap-2.5 shrink-0">
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
