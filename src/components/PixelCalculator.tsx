import React, { useState } from 'react';
import { OperationType, CalculationRecord } from '../types/calculator';
import { getOperatorSymbol, getFunctionName, formatPythonNumber } from '../utils/pythonEngine';
import { soundManager } from '../utils/audio';
import { History, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface PixelCalculatorProps {
  currentValue: string;
  previousValue: number | null;
  activeOperator: OperationType | null;
  expression: string;
  error: string | null;
  onDigit: (digit: string) => void;
  onOperator: (op: OperationType) => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  history: CalculationRecord[];
  onSelectRecord: (record: CalculationRecord) => void;
}

type PaletteMode = 'gameboy' | 'amber' | 'cyber';

export const PixelCalculator: React.FC<PixelCalculatorProps> = ({
  currentValue,
  previousValue,
  activeOperator,
  expression,
  error,
  onDigit,
  onOperator,
  onEquals,
  onClear,
  onBackspace,
  onToggleSign,
  history,
  onSelectRecord,
}) => {
  const [palette, setPalette] = useState<PaletteMode>('gameboy');
  const [showHistory, setShowHistory] = useState(false);

  // Paleta de cores 16-bit para a tela LCD
  const lcdStyles = {
    gameboy: {
      bg: 'bg-[#9bbc0f]',
      text: 'text-[#0f380f]',
      dimText: 'text-[#306230]',
      border: 'border-[#8bac0f]',
      label: 'Game Boy',
      cursor: 'bg-[#0f380f]',
    },
    amber: {
      bg: 'bg-[#1c140a]',
      text: 'text-[#fbbf24]',
      dimText: 'text-[#b45309]',
      border: 'border-[#78350f]',
      label: 'CRT Âmbar',
      cursor: 'bg-[#fbbf24]',
    },
    cyber: {
      bg: 'bg-[#081820]',
      text: 'text-[#38bdf8]',
      dimText: 'text-[#0369a1]',
      border: 'border-[#0c4a6e]',
      label: 'Cyber Bit',
      cursor: 'bg-[#38bdf8]',
    },
  }[palette];

  const currentPythonFunc = activeOperator ? getFunctionName(activeOperator) : null;

  return (
    <div className="flex flex-col items-center justify-center w-full py-4 select-none">
      {/* Retro Handheld Chassis */}
      <div className="w-full max-w-[380px] sm:max-w-[420px] bg-[#2d2b42] border-4 border-[#12111c] rounded-2xl p-4 sm:p-6 shadow-[8px_8px_0px_0px_#0e0d16] flex flex-col gap-4 relative">
        {/* Device Top Plate: Brand & power LED */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              <span className="w-2 h-2 bg-[#e11d48] border border-black inline-block" />
              <span className="w-2 h-2 bg-[#fbbf24] border border-black inline-block" />
              <span className="w-2 h-2 bg-[#38bdf8] border border-black inline-block" />
            </div>
            <span className="font-arcade text-[10px] sm:text-xs text-[#a5a1c2] tracking-wider">
              CALC BIT
            </span>
          </div>

          {/* LCD Screen Palette Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="font-pixel text-[9px] text-[#7d799b] uppercase">LCD:</span>
            <button
              onClick={() => {
                soundManager.playKeyClick('number');
                setPalette((p) => (p === 'gameboy' ? 'amber' : p === 'amber' ? 'cyber' : 'gameboy'));
              }}
              className="font-pixel text-[9px] px-2 py-0.5 bg-[#1b1a29] text-[#fbbf24] border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none transition-all uppercase"
              title="Alternar paleta da tela LCD"
            >
              {lcdStyles.label}
            </button>
          </div>
        </div>

        {/* 16-bit LCD Screen Frame */}
        <div className="bg-[#181724] border-4 border-[#0c0c14] rounded-xl p-3 shadow-inner">
          <div
            className={`w-full ${lcdStyles.bg} border-2 ${lcdStyles.border} rounded-lg p-3 sm:p-4 min-h-[110px] flex flex-col justify-between relative overflow-hidden scanlines shadow-inner`}
          >
            {/* Top row: Status ticker & expression */}
            <div className="flex items-center justify-between font-arcade text-[9px] sm:text-[10px]">
              <span className={`${lcdStyles.dimText} uppercase truncate max-w-[140px]`}>
                {error
                  ? '! ERRO !'
                  : currentPythonFunc
                  ? `[${currentPythonFunc}]`
                  : 'READY'}
              </span>
              <span className={`${lcdStyles.dimText} tracking-wider truncate max-w-[180px]`}>
                {expression || '\u00A0'}
              </span>
            </div>

            {/* Main Value Display */}
            <div className="text-right py-1">
              {error ? (
                <div className="font-arcade text-xs sm:text-sm text-[#e11d48] font-bold tracking-tight">
                  ZERO DIVISION
                </div>
              ) : (
                <div
                  className={`font-arcade font-bold tracking-tighter ${lcdStyles.text} transition-all ${
                    currentValue.length > 11
                      ? 'text-lg sm:text-xl'
                      : currentValue.length > 8
                      ? 'text-xl sm:text-2xl'
                      : 'text-2xl sm:text-3xl'
                  }`}
                >
                  {currentValue}
                </div>
              )}
            </div>

            {/* Bottom LCD Ticker: Python Real-Time Operation */}
            <div className="border-t border-black/20 pt-1 flex items-center justify-between font-pixel text-[9px] sm:text-[10px]">
              <span className={`${lcdStyles.dimText}`}>PY 3.10</span>
              <span className={`${lcdStyles.text} font-bold truncate max-w-[240px]`}>
                {activeOperator && previousValue !== null
                  ? `${getFunctionName(activeOperator)}(${formatPythonNumber(previousValue)}, ${currentValue})`
                  : '4 OPERACOES BASICAS'}
              </span>
            </div>
          </div>
        </div>

        {/* Conventional 4x5 Keypad Grid with 16-bit Pixel Buttons */}
        <div className="grid grid-cols-4 gap-2.5 pt-1">
          {/* Row 1: Clear, DEL, Sign, Divide */}
          <button
            onClick={onClear}
            className="h-12 sm:h-14 bg-[#be123c] hover:bg-[#9f1239] text-[#ffe4e6] border-2 border-black rounded-lg font-arcade text-xs sm:text-sm pixel-btn-action flex flex-col items-center justify-center"
            title="Limpar tudo (AC)"
          >
            <span>C</span>
          </button>

          <button
            onClick={onBackspace}
            className="h-12 sm:h-14 bg-[#3f3c56] hover:bg-[#343147] text-[#e2e0ed] border-2 border-black rounded-lg font-arcade text-xs sm:text-sm pixel-btn-action flex flex-col items-center justify-center"
            title="Apagar dígito"
          >
            <span>DEL</span>
          </button>

          <button
            onClick={onToggleSign}
            className="h-12 sm:h-14 bg-[#3f3c56] hover:bg-[#343147] text-[#e2e0ed] border-2 border-black rounded-lg font-arcade text-xs sm:text-sm pixel-btn-action flex flex-col items-center justify-center"
            title="Inverter sinal (±)"
          >
            <span>+/-</span>
          </button>

          <button
            onClick={() => onOperator('divide')}
            className={`h-12 sm:h-14 border-2 border-black rounded-lg font-arcade text-sm sm:text-base pixel-btn-action flex items-center justify-center ${
              activeOperator === 'divide'
                ? 'bg-[#fbbf24] text-black font-bold'
                : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
            }`}
            title="Divisão (dividir)"
          >
            /
          </button>

          {/* Row 2: 7, 8, 9, Multiply */}
          {['7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => onDigit(digit)}
              className="h-12 sm:h-14 bg-[#e2e0ed] hover:bg-[#d1cfe0] text-[#1e1b2e] border-2 border-black rounded-lg font-arcade text-base sm:text-lg pixel-btn-action flex items-center justify-center font-bold"
            >
              {digit}
            </button>
          ))}

          <button
            onClick={() => onOperator('multiply')}
            className={`h-12 sm:h-14 border-2 border-black rounded-lg font-arcade text-sm sm:text-base pixel-btn-action flex items-center justify-center ${
              activeOperator === 'multiply'
                ? 'bg-[#fbbf24] text-black font-bold'
                : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
            }`}
            title="Multiplicação (multiplicar)"
          >
            *
          </button>

          {/* Row 3: 4, 5, 6, Subtract */}
          {['4', '5', '6'].map((digit) => (
            <button
              key={digit}
              onClick={() => onDigit(digit)}
              className="h-12 sm:h-14 bg-[#e2e0ed] hover:bg-[#d1cfe0] text-[#1e1b2e] border-2 border-black rounded-lg font-arcade text-base sm:text-lg pixel-btn-action flex items-center justify-center font-bold"
            >
              {digit}
            </button>
          ))}

          <button
            onClick={() => onOperator('subtract')}
            className={`h-12 sm:h-14 border-2 border-black rounded-lg font-arcade text-sm sm:text-base pixel-btn-action flex items-center justify-center ${
              activeOperator === 'subtract'
                ? 'bg-[#fbbf24] text-black font-bold'
                : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
            }`}
            title="Subtração (subtrair)"
          >
            -
          </button>

          {/* Row 4: 1, 2, 3, Add */}
          {['1', '2', '3'].map((digit) => (
            <button
              key={digit}
              onClick={() => onDigit(digit)}
              className="h-12 sm:h-14 bg-[#e2e0ed] hover:bg-[#d1cfe0] text-[#1e1b2e] border-2 border-black rounded-lg font-arcade text-base sm:text-lg pixel-btn-action flex items-center justify-center font-bold"
            >
              {digit}
            </button>
          ))}

          <button
            onClick={() => onOperator('add')}
            className={`h-12 sm:h-14 border-2 border-black rounded-lg font-arcade text-sm sm:text-base pixel-btn-action flex items-center justify-center ${
              activeOperator === 'add'
                ? 'bg-[#fbbf24] text-black font-bold'
                : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
            }`}
            title="Adição (somar)"
          >
            +
          </button>

          {/* Row 5: 0 (col-span-2), Decimal, Equals */}
          <button
            onClick={() => onDigit('0')}
            className="col-span-2 h-12 sm:h-14 bg-[#e2e0ed] hover:bg-[#d1cfe0] text-[#1e1b2e] border-2 border-black rounded-lg font-arcade text-base sm:text-lg pixel-btn-action flex items-center justify-center font-bold"
          >
            0
          </button>

          <button
            onClick={() => onDigit('.')}
            className="h-12 sm:h-14 bg-[#e2e0ed] hover:bg-[#d1cfe0] text-[#1e1b2e] border-2 border-black rounded-lg font-arcade text-base sm:text-lg pixel-btn-action flex items-center justify-center font-bold"
            title="Ponto decimal"
          >
            .
          </button>

          <button
            onClick={onEquals}
            className="h-12 sm:h-14 bg-[#10b981] hover:bg-[#059669] text-white border-2 border-black rounded-lg font-arcade text-base sm:text-lg pixel-btn-action flex items-center justify-center font-bold shadow-[0_4px_0_0_#064e3b]"
            title="Calcular (Enter)"
          >
            =
          </button>
        </div>

        {/* Collapsible History Drawer Bar */}
        <div className="border-t-2 border-[#1c1a2c] pt-2">
          <button
            onClick={() => {
              soundManager.playKeyClick('number');
              setShowHistory(!showHistory);
            }}
            className="w-full flex items-center justify-between text-[#a5a1c2] hover:text-white font-pixel text-xs py-1 px-1 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>Histórico ({history.length})</span>
            </div>
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showHistory && (
            <div className="mt-2 bg-[#1b1928] border-2 border-black rounded-lg p-2 max-h-36 overflow-y-auto space-y-1.5">
              {history.length === 0 ? (
                <div className="text-center py-3 text-[11px] text-[#7d799b] font-pixel">
                  Nenhuma conta realizada ainda.
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      soundManager.playKeyClick('number');
                      onSelectRecord(item);
                    }}
                    className="p-1.5 bg-[#252336] hover:bg-[#302c46] border border-black rounded flex items-center justify-between cursor-pointer font-pixel text-xs"
                  >
                    <span className="text-[#a5a1c2] truncate max-w-[140px]">{item.expression}</span>
                    <span className="font-bold text-[#10b981]">
                      {item.error ? '!ERRO!' : `= ${item.result}`}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
