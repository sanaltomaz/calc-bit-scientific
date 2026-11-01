import React, { useState } from 'react';
import {
  OperationType,
  UnaryOperationType,
  ConstantType,
  CalculationRecord,
} from '../types/calculator';
import {
  getFunctionName,
  formatPythonNumber,
  getOperationDocstring,
} from '../utils/pythonEngine';
import { soundManager } from '../utils/audio';
import {
  History,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Cpu,
} from 'lucide-react';

interface PixelCalculatorProps {
  currentValue: string;
  previousValue: number | null;
  activeOperator: OperationType | null;
  lastOperation: OperationType | UnaryOperationType | null;
  expression: string;
  error: string | null;
  onDigit: (digit: string) => void;
  onOperator: (op: OperationType) => void;
  onUnaryOperator: (op: UnaryOperationType) => void;
  onConstant: (constant: ConstantType) => void;
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
  lastOperation,
  expression,
  error,
  onDigit,
  onOperator,
  onUnaryOperator,
  onConstant,
  onEquals,
  onClear,
  onBackspace,
  onToggleSign,
  history,
  onSelectRecord,
}) => {
  const [palette, setPalette] = useState<PaletteMode>('gameboy');
  const [showHistory, setShowHistory] = useState(false);
  const [scientificOpen, setScientificOpen] = useState(false);
  const [hoveredSciOp, setHoveredSciOp] = useState<OperationType | UnaryOperationType | null>(null);

  // Paleta de cores 16-bit para a tela LCD
  const lcdStyles = {
    gameboy: {
      bg: 'bg-[#9bbc0f]',
      text: 'text-[#0f380f]',
      dimText: 'text-[#306230]',
      border: 'border-[#8bac0f]',
      label: 'Game Boy',
    },
    amber: {
      bg: 'bg-[#1c140a]',
      text: 'text-[#fbbf24]',
      dimText: 'text-[#b45309]',
      border: 'border-[#78350f]',
      label: 'CRT Âmbar',
    },
    cyber: {
      bg: 'bg-[#081820]',
      text: 'text-[#38bdf8]',
      dimText: 'text-[#0369a1]',
      border: 'border-[#0c4a6e]',
      label: 'Cyber Bit',
    },
  }[palette];

  const currentPythonFunc = activeOperator ? getFunctionName(activeOperator) : null;
  const inspectedOp = hoveredSciOp || activeOperator || lastOperation || 'power';
  const inspectedDoc = getOperationDocstring(inspectedOp);

  const toggleScientificWing = () => {
    soundManager.playKeyClick('operator');
    setScientificOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-2 sm:py-4 select-none">
      {/* Console Wrapper: Main Unit + Lateral Docked Expansion Wing */}
      <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center w-full max-w-4xl relative">
        {/* ================= UNIDADE PRINCIPAL (HANDHELD CONSOLE) ================= */}
        <div
          className={`w-full max-w-[380px] sm:max-w-[410px] bg-[#2d2b42] border-4 border-[#12111c] p-4 sm:p-6 shadow-[8px_8px_0px_0px_#0e0d16] flex flex-col gap-4 relative z-10 transition-all ${
            scientificOpen ? 'rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none' : 'rounded-2xl'
          }`}
        >
          {/* Top Plate: Brand, Power LEDs, LCD Switcher & SCI Expansion Trigger */}
          <div className="flex items-center justify-between gap-2 px-1 flex-wrap">
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

            <div className="flex items-center gap-1.5">
              {/* LCD Palette Switcher */}
              <button
                onClick={() => {
                  soundManager.playKeyClick('number');
                  setPalette((p) =>
                    p === 'gameboy' ? 'amber' : p === 'amber' ? 'cyber' : 'gameboy'
                  );
                }}
                className="font-pixel text-[9px] px-2 py-0.5 bg-[#1b1a29] text-[#fbbf24] border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none transition-all uppercase"
                title="Alternar paleta da tela LCD"
              >
                {lcdStyles.label}
              </button>

              {/* Top Toggle Button for Scientific Expansion Wing */}
              <button
                onClick={toggleScientificWing}
                className={`font-arcade text-[9px] px-2.5 py-1 border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1 ${
                  scientificOpen
                    ? 'bg-[#10b981] text-[#052e16] font-bold'
                    : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
                }`}
                title="Acoplar/Desacoplar Módulo Científico Lateral"
              >
                <Cpu className="w-3 h-3" />
                <span>SCI</span>
                {scientificOpen ? (
                  <ChevronLeft className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          {/* 16-bit LCD Screen Frame */}
          <div className="bg-[#181724] border-4 border-[#0c0c14] rounded-xl p-3 shadow-inner">
            <div
              className={`w-full ${lcdStyles.bg} border-2 ${lcdStyles.border} rounded-lg p-3 sm:p-4 min-h-[115px] flex flex-col justify-between relative overflow-hidden scanlines shadow-inner`}
            >
              {/* Top row: Status ticker & expression */}
              <div className="flex items-center justify-between font-arcade text-[9px] sm:text-[10px] gap-2">
                <span className={`${lcdStyles.dimText} uppercase truncate max-w-[140px]`}>
                  {error
                    ? '! ERRO !'
                    : currentPythonFunc
                    ? `[${currentPythonFunc}]`
                    : scientificOpen
                    ? 'SCI-LINK ON'
                    : 'READY'}
                </span>
                <span className={`${lcdStyles.dimText} tracking-wider truncate max-w-[190px]`}>
                  {expression || '\u00A0'}
                </span>
              </div>

              {/* Main Value Display */}
              <div className="text-right py-1">
                {error ? (
                  <div className="font-arcade text-[11px] sm:text-xs text-[#e11d48] font-bold tracking-tight truncate">
                    {error.replace(/^(ZeroDivisionError|ValueError):\s*/i, '')}
                  </div>
                ) : (
                  <div
                    className={`font-arcade font-bold tracking-tighter ${lcdStyles.text} transition-all break-all ${
                      currentValue.length > 12
                        ? 'text-base sm:text-lg'
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
                <span className={`${lcdStyles.dimText}`}>
                  {scientificOpen ? 'PY 3.10 + MATH' : 'PY 3.10'}
                </span>
                <span className={`${lcdStyles.text} font-bold truncate max-w-[230px]`}>
                  {activeOperator && previousValue !== null
                    ? `${getFunctionName(activeOperator)}(${formatPythonNumber(
                        previousValue
                      )}, ${currentValue})`
                    : scientificOpen
                    ? 'MODULO CIENTIFICO ATIVO'
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
              title="Limpar tudo (Esc)"
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
              title="Divisão: dividir(a, b)"
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
              title="Multiplicação: multiplicar(a, b)"
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
              title="Subtração: subtrair(a, b)"
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
              title="Adição: somar(a, b)"
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
              {showHistory ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
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
                      className="p-1.5 bg-[#252336] hover:bg-[#302c46] border border-black rounded flex items-center justify-between cursor-pointer font-pixel text-xs gap-2"
                    >
                      <span className="text-[#a5a1c2] truncate max-w-[160px]">
                        {item.pythonSnippet}
                      </span>
                      <span className="font-bold text-[#10b981] shrink-0">
                        {item.error ? '!ERRO!' : `= ${formatPythonNumber(item.result ?? 0)}`}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Physical Side Latch Tab on Desktop when closed */}
          {!scientificOpen && (
            <button
              onClick={toggleScientificWing}
              className="hidden lg:flex flex-col items-center justify-center gap-2 absolute -right-9 top-24 w-9 h-36 bg-[#232136] hover:bg-[#2d2b42] border-4 border-l-0 border-[#12111c] rounded-r-xl shadow-[6px_6px_0px_0px_#0e0d16] text-[#fbbf24] transition-all group cursor-pointer"
              title="Expandir Módulo Científico Lateral"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] border border-black" />
              <span className="font-arcade text-[9px] [writing-mode:vertical-rl] tracking-widest text-[#e2e0ed] group-hover:text-[#fbbf24]">
                SCI-PACK
              </span>
              <ChevronRight className="w-4 h-4 text-[#fbbf24] group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* ================= ABA LATERAL ACOPLADA (CONSOLE PORTÁTIL CIENTÍFICO) ================= */}
        {scientificOpen && (
          <div className="w-full max-w-[380px] sm:max-w-[410px] lg:max-w-[340px] bg-[#232136] border-4 border-t-0 lg:border-t-4 lg:border-l-0 border-[#12111c] rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none p-4 sm:p-5 shadow-[8px_8px_0px_0px_#0e0d16] flex flex-col justify-between gap-4 relative">
            {/* Hardware Connector Seam Graphics (Left Edge on Desktop) */}
            <div className="hidden lg:flex flex-col justify-between items-center absolute -left-1.5 top-10 bottom-10 w-3 pointer-events-none">
              <div className="w-2.5 h-6 bg-[#12111c] border border-black rounded-sm" />
              <div className="w-2.5 h-10 bg-[#fbbf24]/80 border border-black rounded-sm" />
              <div className="w-2.5 h-6 bg-[#12111c] border border-black rounded-sm" />
            </div>

            {/* Wing Header: Cartridge / Expansion Pack Identity */}
            <div className="flex items-center justify-between border-b-2 border-[#181724] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] border border-black animate-pulse" />
                <div>
                  <div className="font-arcade text-[10px] text-[#fbbf24] tracking-wider">
                    EXPANSION // SCI-16
                  </div>
                  <div className="font-pixel text-[10px] text-[#a5a1c2]">
                    calc_bit/cientifica.py
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-arcade text-[8px] px-1.5 py-0.5 bg-[#181724] text-[#38bdf8] border border-black rounded">
                  DEG
                </span>
                <button
                  onClick={toggleScientificWing}
                  className="font-arcade text-[9px] px-2 py-0.5 bg-[#be123c] hover:bg-[#9f1239] text-white border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none"
                  title="Recolher Módulo Científico"
                >
                  X
                </button>
              </div>
            </div>

            {/* Mini Auxiliary LCD: Python Function Signature & Docstring Preview */}
            <div className="bg-[#141320] border-2 border-black rounded-xl p-2.5 font-mono text-xs space-y-1 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-[#7d799b] font-pixel">
                <span>IMPORT MATH</span>
                <span className="text-[#10b981]">PEP 484 READY</span>
              </div>
              <div className="text-[11px] text-[#fbbf24] font-semibold truncate">
                {inspectedDoc.signature}
              </div>
              <div className="text-[10px] text-[#a5a1c2] font-sans truncate">
                {inspectedDoc.doc}
              </div>
              <div className="text-[10px] text-[#38bdf8] truncate pt-0.5 border-t border-white/5">
                Ex: {inspectedDoc.example}
              </div>
            </div>

            {/* Scientific Buttons Grid (3 columns x 4 rows + bottom bar) */}
            <div className="space-y-2">
              <div className="text-[9px] font-arcade text-[#7d799b] uppercase tracking-wider px-0.5">
                Potência, Raiz &amp; Constantes
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => onConstant('pi')}
                  className="h-11 bg-[#3f3c56] hover:bg-[#4e4a69] text-[#fbbf24] border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center"
                  title="Constante Pi (math.pi = 3.14159265...)"
                >
                  <span>π</span>
                  <span className="text-[7px] font-pixel text-[#a5a1c2]">PI</span>
                </button>

                <button
                  onClick={() => onConstant('e')}
                  className="h-11 bg-[#3f3c56] hover:bg-[#4e4a69] text-[#fbbf24] border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center"
                  title="Constante de Euler (math.e = 2.7182818...)"
                >
                  <span>e</span>
                  <span className="text-[7px] font-pixel text-[#a5a1c2]">EULER</span>
                </button>

                <button
                  onMouseEnter={() => setHoveredSciOp('square')}
                  onClick={() => onUnaryOperator('square')}
                  className="h-11 bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center"
                  title="Quadrado: quadrado(x)"
                >
                  <span>x²</span>
                  <span className="text-[7px] font-pixel text-[#94a3b8]">quad</span>
                </button>

                <button
                  onMouseEnter={() => setHoveredSciOp('power')}
                  onClick={() => onOperator('power')}
                  className={`h-11 border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center ${
                    activeOperator === 'power'
                      ? 'bg-[#fbbf24] text-black font-bold'
                      : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
                  }`}
                  title="Potência: potencia(base, exp)"
                >
                  <span>xʸ</span>
                  <span className="text-[7px] font-pixel opacity-80">pow</span>
                </button>

                <button
                  onMouseEnter={() => setHoveredSciOp('sqrt')}
                  onClick={() => onUnaryOperator('sqrt')}
                  className="h-11 bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center"
                  title="Raiz Quadrada: raiz_quadrada(x)"
                >
                  <span>√x</span>
                  <span className="text-[7px] font-pixel text-[#94a3b8]">sqrt</span>
                </button>

                <button
                  onMouseEnter={() => setHoveredSciOp('factorial')}
                  onClick={() => onUnaryOperator('factorial')}
                  className="h-11 bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center"
                  title="Fatorial: fatorial(n)"
                >
                  <span>n!</span>
                  <span className="text-[7px] font-pixel text-[#94a3b8]">fact</span>
                </button>

                <button
                  onMouseEnter={() => setHoveredSciOp('modulo')}
                  onClick={() => onOperator('modulo')}
                  className={`h-11 border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center ${
                    activeOperator === 'modulo'
                      ? 'bg-[#fbbf24] text-black font-bold'
                      : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
                  }`}
                  title="Resto da Divisão: modulo(a, b)"
                >
                  <span>mod</span>
                  <span className="text-[7px] font-pixel opacity-80">a % b</span>
                </button>

                <button
                  onMouseEnter={() => setHoveredSciOp('percent')}
                  onClick={() => onOperator('percent')}
                  className={`h-11 border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center ${
                    activeOperator === 'percent'
                      ? 'bg-[#fbbf24] text-black font-bold'
                      : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
                  }`}
                  title="Porcentagem: porcentagem(valor, taxa)"
                >
                  <span>%</span>
                  <span className="text-[7px] font-pixel opacity-80">perc</span>
                </button>
              </div>

              <div className="text-[9px] font-arcade text-[#7d799b] uppercase tracking-wider px-0.5 pt-1">
                Trigonometria (Graus) &amp; Logaritmos
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                <button
                  onMouseEnter={() => setHoveredSciOp('sin')}
                  onClick={() => onUnaryOperator('sin')}
                  className="h-11 bg-[#0f172a] hover:bg-[#1e293b] text-[#10b981] border-2 border-black rounded-lg font-arcade text-[11px] pixel-btn-action flex flex-col items-center justify-center"
                  title="Seno em Graus: seno(graus)"
                >
                  <span>sin</span>
                  <span className="text-[7px] font-pixel text-[#64748b]">deg</span>
                </button>

                <button
                  onMouseEnter={() => setHoveredSciOp('cos')}
                  onClick={() => onUnaryOperator('cos')}
                  className="h-11 bg-[#0f172a] hover:bg-[#1e293b] text-[#10b981] border-2 border-black rounded-lg font-arcade text-[11px] pixel-btn-action flex flex-col items-center justify-center"
                  title="Cosseno em Graus: cosseno(graus)"
                >
                  <span>cos</span>
                  <span className="text-[7px] font-pixel text-[#64748b]">deg</span>
                </button>

                <button
                  onMouseEnter={() => setHoveredSciOp('tan')}
                  onClick={() => onUnaryOperator('tan')}
                  className="h-11 bg-[#0f172a] hover:bg-[#1e293b] text-[#10b981] border-2 border-black rounded-lg font-arcade text-[11px] pixel-btn-action flex flex-col items-center justify-center"
                  title="Tangente em Graus: tangente(graus)"
                >
                  <span>tan</span>
                  <span className="text-[7px] font-pixel text-[#64748b]">deg</span>
                </button>

                <button
                  onMouseEnter={() => setHoveredSciOp('log10')}
                  onClick={() => onUnaryOperator('log10')}
                  className="h-11 bg-[#0f172a] hover:bg-[#1e293b] text-[#f472b6] border-2 border-black rounded-lg font-arcade text-[11px] pixel-btn-action flex flex-col items-center justify-center"
                  title="Logaritmo Base 10: log10(x)"
                >
                  <span>log</span>
                  <span className="text-[7px] font-pixel text-[#64748b]">b10</span>
                </button>

                <button
                  onMouseEnter={() => setHoveredSciOp('ln')}
                  onClick={() => onUnaryOperator('ln')}
                  className="h-11 bg-[#0f172a] hover:bg-[#1e293b] text-[#f472b6] border-2 border-black rounded-lg font-arcade text-[11px] pixel-btn-action flex flex-col items-center justify-center"
                  title="Logaritmo Natural: ln(x)"
                >
                  <span>ln</span>
                  <span className="text-[7px] font-pixel text-[#64748b]">base e</span>
                </button>
              </div>
            </div>

            {/* Bottom Console Grip / Speaker Grille Slots */}
            <div className="border-t-2 border-[#181724] pt-2.5 flex items-center justify-between">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6].map((slot) => (
                  <span
                    key={slot}
                    className="w-1.5 h-3 bg-[#141320] border border-black rounded-full inline-block"
                  />
                ))}
              </div>
              <span className="font-arcade text-[8px] text-[#7d799b]">
                SCIENTIFIC PORTABLE UNIT
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
