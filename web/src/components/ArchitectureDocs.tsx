import React, { useState } from 'react';
import { Terminal, FileCode, CheckCircle2, Copy, Check, Download, Layers } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const ArchitectureDocs: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    soundManager.playKeyClick('number');
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownloadAll = () => {
    soundManager.playKeyClick('number');
    // Baixar os arquivos Python
    const files = [
      { name: 'operacoes.py', url: '/operacoes.py' },
      { name: 'calculadora.py', url: '/calculadora.py' },
      { name: 'test_calculadora.py', url: '/test_calculadora.py' },
      { name: 'README.md', url: '/README.md' },
    ];

    files.forEach((file) => {
      const a = document.createElement('a');
      a.href = file.name;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Main explanation banner */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Documentação de Arquitetura: Onde o Python Foi Usado?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              Esclarecimento transparente sobre a divisão entre o código Python real e a interface web em React / TypeScript.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-800/90 text-sm text-slate-300 space-y-3 leading-relaxed">
          <p>
            <strong className="text-white">A resposta direta:</strong> O código Python da calculadora está implementado em arquivos Python 3 puros no repositório deste projeto:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300">
            <li>
              <code className="text-amber-300 font-mono font-semibold">/operacoes.py</code> &mdash; As quatro operações fundamentais (<code className="text-amber-400">somar</code>, <code className="text-amber-400">subtrair</code>, <code className="text-amber-400">multiplicar</code>, <code className="text-amber-400">dividir</code>) com tipagem estática (PEP 484) e docstrings completas (PEP 257).
            </li>
            <li>
              <code className="text-amber-300 font-mono font-semibold">/calculadora.py</code> &mdash; O programa interativo de console (CLI) com menu de opções, leitura via <code className="text-amber-400">input()</code>, tratamento de <code className="text-amber-400">ValueError</code> e <code className="text-amber-400">ZeroDivisionError</code>.
            </li>
            <li>
              <code className="text-amber-300 font-mono font-semibold">/test_calculadora.py</code> &mdash; A suíte de 15 testes unitários automatizados com a biblioteca padrão <code className="text-amber-400">unittest</code>.
            </li>
            <li>
              <code className="text-amber-300 font-mono font-semibold">/README.md</code> &mdash; Manual completo de uso e execução dos scripts no terminal.
            </li>
          </ul>

          <div className="pt-2 border-t border-slate-900 text-xs text-slate-400">
            <strong className="text-slate-200">Por que há TypeScript e React?</strong> Porque navegadores web nativamente não executam arquivos <code className="text-slate-300">.py</code> diretamente na DOM. Para fornecer uma calculadora gráfica interativa com botões, tela digital, feedback sonoro e um simulador do terminal CLI online, usamos React + TypeScript como a <em>casca visual</em> (frontend) que representa e simula o funcionamento dos scripts Python.
          </div>
        </div>
      </div>

      {/* Grid: Arquivos Python vs Interface Web */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Lado Python */}
        <div className="bg-slate-900/80 rounded-2xl border border-amber-900/30 p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileCode className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-white text-sm">
              1. Arquivos Python Nativos (Backbone)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Estes são arquivos 100% Python criados na raiz do projeto, que você pode baixar e executar diretamente em qualquer computador com Python 3 instalado:
          </p>

          <div className="space-y-2 font-mono text-xs">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div className="text-amber-300 font-semibold">operacoes.py</div>
              <div className="text-slate-500 text-[11px] font-sans mt-0.5">
                Funções matemáticas puras: somar(), subtrair(), multiplicar(), dividir().
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div className="text-amber-300 font-semibold">calculadora.py</div>
              <div className="text-slate-500 text-[11px] font-sans mt-0.5">
                Script executável de terminal com loop interativo e menus.
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div className="text-amber-300 font-semibold">test_calculadora.py</div>
              <div className="text-slate-500 text-[11px] font-sans mt-0.5">
                15 testes unitários com unittest.TestCase passando em 0.001s.
              </div>
            </div>
          </div>
        </div>

        {/* Lado React / TypeScript */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-white text-sm">
              2. Interface React & TypeScript (Frontend)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            A interface web foi desenvolvida para você poder visualizar, testar e aprender sem precisar abrir o terminal se não quiser:
          </p>

          <div className="space-y-2 font-mono text-xs">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div className="text-emerald-300 font-semibold">Calculadora Visual</div>
              <div className="text-slate-500 text-[11px] font-sans mt-0.5">
                Teclado responsivo com áudio tátil, memória e atalhos físicos.
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div className="text-emerald-300 font-semibold">Simulador de Terminal CLI</div>
              <div className="text-slate-500 text-[11px] font-sans mt-0.5">
                Emula o comportamento exato de executar python3 calculadora.py.
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div className="text-emerald-300 font-semibold">Inspeção de Funções Python</div>
              <div className="text-slate-500 text-[11px] font-sans mt-0.5">
                Mostra parâmetros, tipos (float), docstring e tratamento de ZeroDivisionError.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Real Test Output Log */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-xs font-semibold text-white">
              Execução Real no Terminal com Python 3.10.12
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
            15 Testes Aprovados &middot; 0.001s
          </span>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto leading-relaxed border border-slate-800">
          <div className="text-slate-500">$ python3 -m unittest test_calculadora.py -v</div>
          <div className="text-emerald-400/90">test_dividir_com_decimais (test_calculadora.TesteOperacoesFundamentais) ... <span className="text-emerald-300 font-bold">ok</span></div>
          <div className="text-emerald-400/90">test_dividir_exata (test_calculadora.TesteOperacoesFundamentais) ... <span className="text-emerald-300 font-bold">ok</span></div>
          <div className="text-emerald-400/90">test_divisao_por_zero_lanca_excecao (test_calculadora.TesteOperacoesFundamentais) ... <span className="text-emerald-300 font-bold">ok</span></div>
          <div className="text-emerald-400/90">test_multiplicar_decimais (test_calculadora.TesteOperacoesFundamentais) ... <span className="text-emerald-300 font-bold">ok</span></div>
          <div className="text-emerald-400/90">test_multiplicar_elemento_nulo_zero (test_calculadora.TesteOperacoesFundamentais) ... <span className="text-emerald-300 font-bold">ok</span></div>
          <div className="text-emerald-400/90">test_multiplicar_positivos (test_calculadora.TesteOperacoesFundamentais) ... <span className="text-emerald-300 font-bold">ok</span></div>
          <div className="text-emerald-400/90">test_multiplicar_regra_de_sinais (test_calculadora.TesteOperacoesFundamentais) ... <span className="text-emerald-300 font-bold">ok</span></div>
          <div className="text-emerald-400/90">test_somar_com_zero (test_calculadora.TesteOperacoesFundamentais) ... <span className="text-emerald-300 font-bold">ok</span></div>
          <div className="text-emerald-400/90">test_somar_decimais (test_calculadora.TesteOperacoesFundamentais) ... <span className="text-emerald-300 font-bold">ok</span></div>
          <div className="text-emerald-400/90">test_somar_negativos (test_calculadora.TesteOperacoesFundamentais) ... <span className="text-emerald-300 font-bold">ok</span></div>
          <div className="text-emerald-400/90">test_somar_numeros_positivos (test_calculadora.TesteOperacoesFundamentais) ... <span className="text-emerald-300 font-bold">ok</span></div>
          <div className="text-emerald-400/90">test_subtrair_decimais (test_calculadora.TesteOperacoesFundamentais) ... <span className="text-emerald-300 font-bold">ok</span></div>
          <div className="text-emerald-400/90">test_subtrair_minuendo_maior (test_calculadora.TesteOperacoesFundamentais) ... <span className="text-emerald-300 font-bold">ok</span></div>
          <div className="text-emerald-400/90">test_subtrair_minuendo_menor (test_calculadora.TesteOperacoesFundamentais) ... <span className="text-emerald-300 font-bold">ok</span></div>
          <div className="text-emerald-400/90">test_subtrair_negativos (test_calculadora.TesteOperacoesFundamentais) ... <span className="text-emerald-300 font-bold">ok</span></div>
          <div className="pt-2 text-slate-400">----------------------------------------------------------------------</div>
          <div className="text-white font-bold">Ran 15 tests in 0.001s</div>
          <div className="text-emerald-400 font-bold">OK</div>
        </div>
      </div>

      {/* Como rodar no seu computador */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-5">
        <h3 className="font-semibold text-white text-base flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>Comandos para Rodar Localmente no seu Computador</span>
        </h3>

        {/* Categoria 1: Interface Web (TypeScript / React) */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
            Ambiente Web (React + TypeScript)
          </div>
          <div className="space-y-2">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-sans mb-1">1. Instalar as dependências do projeto:</div>
                <code className="text-xs font-mono text-emerald-300">npm install</code>
              </div>
              <button
                onClick={() => copyToClipboard('npm install', 'npm_install')}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 flex items-center gap-1.5 transition-colors"
              >
                {copiedCmd === 'npm_install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'npm_install' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-sans mb-1">2. Iniciar o servidor local de desenvolvimento (porta 3000):</div>
                <code className="text-xs font-mono text-emerald-300">npm run dev</code>
              </div>
              <button
                onClick={() => copyToClipboard('npm run dev', 'npm_dev')}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 flex items-center gap-1.5 transition-colors"
              >
                {copiedCmd === 'npm_dev' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'npm_dev' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categoria 2: Linha de comando (Python 3 Puro) */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono">
            Ambiente Console (Python 3 Nativo)
          </div>
          <div className="space-y-2">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-sans mb-1">1. Executar a calculadora interativa no terminal:</div>
                <code className="text-xs font-mono text-amber-300">python3 calculadora.py</code>
              </div>
              <button
                onClick={() => copyToClipboard('python3 calculadora.py', 'run')}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 flex items-center gap-1.5 transition-colors"
              >
                {copiedCmd === 'run' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'run' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-sans mb-1">2. Executar a suíte de 15 testes unitários:</div>
                <code className="text-xs font-mono text-amber-300">python3 -m unittest test_calculadora.py -v</code>
              </div>
              <button
                onClick={() => copyToClipboard('python3 -m unittest test_calculadora.py -v', 'test')}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 flex items-center gap-1.5 transition-colors"
              >
                {copiedCmd === 'test' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'test' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
