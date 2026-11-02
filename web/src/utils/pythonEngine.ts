import {
  OperationType,
  UnaryOperationType,
  ResolutionReport,
  ResolutionStep,
} from '../types/calculator';

export const PYTHON_CONSTANTS = {
  PI: Math.PI,
  EULER: Math.E,
};

/**
 * Funções Python para as operações básicas e científicas.
 */
export const pythonOperations = {
  somar: (a: number, b: number): number => a + b,
  subtrair: (a: number, b: number): number => a - b,
  multiplicar: (a: number, b: number): number => a * b,
  dividir: (a: number, b: number): number => {
    if (b === 0) {
      throw new Error('ZeroDivisionError: Impossível dividir por zero!');
    }
    return a / b;
  },
  potencia: (base: number, expoente: number): number => {
    if (base === 0 && expoente < 0) {
      throw new Error('ZeroDivisionError: Zero não pode ser elevado a expoente negativo!');
    }
    if (base < 0 && !Number.isInteger(expoente)) {
      throw new Error('ValueError: Base negativa com expoente fracionário!');
    }
    return Math.pow(base, expoente);
  },
  modulo: (a: number, b: number): number => {
    if (b === 0) {
      throw new Error('ZeroDivisionError: Impossível calcular módulo por zero!');
    }
    return a % b;
  },
  porcentagem: (valor: number, percentual: number): number => {
    return (valor * percentual) / 100.0;
  },
  quadrado: (x: number): number => x * x,
  raiz_quadrada: (x: number): number => {
    if (x < 0) {
      throw new Error('ValueError: Não existe raiz quadrada real de número negativo!');
    }
    return Math.sqrt(x);
  },
  fatorial: (n: number): number => {
    if (!Number.isInteger(n)) {
      throw new Error('ValueError: Fatorial é definido apenas para inteiros!');
    }
    if (n < 0) {
      throw new Error('ValueError: Não existe fatorial de número negativo!');
    }
    if (n > 170) {
      throw new Error('ValueError: Overflow! Número muito grande para fatorial.');
    }
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  },
  seno: (graus: number): number => {
    const rad = (graus * Math.PI) / 180;
    return Number(Math.sin(rad).toFixed(10)) + 0;
  },
  cosseno: (graus: number): number => {
    const rad = (graus * Math.PI) / 180;
    return Number(Math.cos(rad).toFixed(10)) + 0;
  },
  tangente: (graus: number): number => {
    const cosVal = pythonOperations.cosseno(graus);
    if (Math.abs(cosVal) < 1e-10) {
      throw new Error(`ValueError: Tangente indefinida para ${graus}°!`);
    }
    const rad = (graus * Math.PI) / 180;
    return Number(Math.tan(rad).toFixed(10)) + 0;
  },
  log10: (x: number): number => {
    if (x <= 0) {
      throw new Error('ValueError: Logaritmo requer x > 0!');
    }
    return Math.log10(x);
  },
  ln: (x: number): number => {
    if (x <= 0) {
      throw new Error('ValueError: Logaritmo natural requer x > 0!');
    }
    return Math.log(x);
  },
};

export const getOperatorSymbol = (op: OperationType): string => {
  switch (op) {
    case 'add': return '+';
    case 'subtract': return '-';
    case 'multiply': return '×';
    case 'divide': return '÷';
    case 'power': return '^';
    case 'modulo': return 'mod';
    case 'percent': return '%';
  }
};

export const getFunctionName = (op: OperationType | UnaryOperationType): string => {
  switch (op) {
    case 'add': return 'somar';
    case 'subtract': return 'subtrair';
    case 'multiply': return 'multiplicar';
    case 'divide': return 'dividir';
    case 'power': return 'potencia';
    case 'modulo': return 'modulo';
    case 'percent': return 'porcentagem';
    case 'square': return 'quadrado';
    case 'sqrt': return 'raiz_quadrada';
    case 'factorial': return 'fatorial';
    case 'sin': return 'seno';
    case 'cos': return 'cosseno';
    case 'tan': return 'tangente';
    case 'log10': return 'log10';
    case 'ln': return 'ln';
  }
};

export const formatPythonNumber = (n: number): string => {
  if (!Number.isFinite(n)) return String(n);
  const rounded = Number(n.toFixed(8));
  if (Number.isInteger(rounded)) {
    return rounded.toString();
  }
  return rounded.toString();
};

const NUM_PATTERN = '-?\\d+(?:\\.\\d+)?';
const FN_REGEX = new RegExp(
  `\\b(sqrt|raiz_quadrada|quadrado|fatorial|fat|sin|seno|cos|cosseno|tan|tangente|log10|log|ln)\\(\\s*(${NUM_PATTERN})\\s*\\)`,
  'i'
);
const POW_REGEX = new RegExp(`(${NUM_PATTERN})\\s*(?:\\^|\\*\\*)\\s*(${NUM_PATTERN})`);
const MD_REGEX = new RegExp(`(${NUM_PATTERN})\\s*(\\*|\\/|%)\\s*(${NUM_PATTERN})`);
const AS_REGEX = new RegExp(`(${NUM_PATTERN})\\s*(\\+|-)\\s*(${NUM_PATTERN})`);
const INNER_PARENS_REGEX = /\(([^()]+)\)/;
const SINGLE_NUM_PARENS_REGEX = new RegExp(`\\(\\s*(${NUM_PATTERN})\\s*\\)`);

function executarFuncaoUnaria(
  nome: string,
  valor: number
): { res: number; regra: string; dica: string } {
  const fn = nome.toLowerCase();
  const valStr = formatPythonNumber(valor);
  if (fn === 'sqrt' || fn === 'raiz_quadrada') {
    return {
      res: pythonOperations.raiz_quadrada(valor),
      regra: 'Funções científicas e raízes têm prioridade antes das operações aritméticas',
      dica: `raiz_quadrada(${valStr})`,
    };
  }
  if (fn === 'quadrado') {
    return {
      res: pythonOperations.quadrado(valor),
      regra: 'Elevação ao quadrado resolvida antes das operações básicas',
      dica: `quadrado(${valStr})`,
    };
  }
  if (fn === 'fatorial' || fn === 'fat') {
    return {
      res: pythonOperations.fatorial(valor),
      regra: `Fatorial multiplica todos os inteiros de ${valStr} até 1`,
      dica: `fatorial(${valStr})`,
    };
  }
  if (fn === 'sin' || fn === 'seno') {
    return {
      res: pythonOperations.seno(valor),
      regra: `Seno trigonométrico converte ${valStr}° para radianos`,
      dica: `seno(${valStr})`,
    };
  }
  if (fn === 'cos' || fn === 'cosseno') {
    return {
      res: pythonOperations.cosseno(valor),
      regra: `Cosseno trigonométrico converte ${valStr}° para radianos`,
      dica: `cosseno(${valStr})`,
    };
  }
  if (fn === 'tan' || fn === 'tangente') {
    return {
      res: pythonOperations.tangente(valor),
      regra: `Tangente trigonométrica calculada para o ângulo de ${valStr}°`,
      dica: `tangente(${valStr})`,
    };
  }
  if (fn === 'log10' || fn === 'log') {
    return {
      res: pythonOperations.log10(valor),
      regra: `Logaritmo na base 10 busca o expoente de 10 que resulta em ${valStr}`,
      dica: `log10(${valStr})`,
    };
  }
  if (fn === 'ln') {
    return {
      res: pythonOperations.ln(valor),
      regra: `Logaritmo natural (base e) calculado para ${valStr}`,
      dica: `ln(${valStr})`,
    };
  }
  throw new Error(`ValueError: Função '${nome}' não reconhecida.`);
}

function avaliarUmPassoSemParenteses(
  subExpr: string,
  dentroParenteses: boolean
): {
  start: number;
  end: number;
  opStr: string;
  res: number;
  regra: string;
  dica: string;
} | null {
  const prefixo = dentroParenteses ? 'Dentro dos parênteses: ' : 'Precedência PEMDAS: ';

  // 1. Potenciação
  const matchPot = POW_REGEX.exec(subExpr);
  if (matchPot && matchPot.index !== undefined) {
    const a = parseFloat(matchPot[1]);
    const b = parseFloat(matchPot[2]);
    const res = pythonOperations.potencia(a, b);
    return {
      start: matchPot.index,
      end: matchPot.index + matchPot[0].length,
      opStr: matchPot[0].trim(),
      res,
      regra: `${prefixo}Potenciação (expoentes) é calculada antes de multiplicação, divisão, soma e subtração`,
      dica: `potencia(${formatPythonNumber(a)}, ${formatPythonNumber(b)}) -> ${formatPythonNumber(res)}`,
    };
  }

  // 2. Multiplicação, Divisão ou Módulo
  const matchMd = MD_REGEX.exec(subExpr);
  if (matchMd && matchMd.index !== undefined) {
    const a = parseFloat(matchMd[1]);
    const op = matchMd[2];
    const b = parseFloat(matchMd[3]);
    let res = 0;
    let regra = '';
    let dica = '';

    if (op === '*') {
      res = pythonOperations.multiplicar(a, b);
      regra = `${prefixo}Multiplicação tem prioridade sobre adição e subtração`;
      dica = `multiplicar(${formatPythonNumber(a)}, ${formatPythonNumber(b)}) -> ${formatPythonNumber(res)}`;
    } else if (op === '/') {
      res = pythonOperations.dividir(a, b);
      regra = `${prefixo}Divisão tem prioridade sobre adição e subtração`;
      dica = `dividir(${formatPythonNumber(a)}, ${formatPythonNumber(b)}) -> ${formatPythonNumber(res)}`;
    } else {
      res = pythonOperations.modulo(a, b);
      regra = `${prefixo}Resto da divisão (módulo) tem mesma prioridade que divisão`;
      dica = `modulo(${formatPythonNumber(a)}, ${formatPythonNumber(b)}) -> ${formatPythonNumber(res)}`;
    }

    return {
      start: matchMd.index,
      end: matchMd.index + matchMd[0].length,
      opStr: matchMd[0].trim(),
      res,
      regra,
      dica,
    };
  }

  // 3. Adição ou Subtração
  const matchAs = AS_REGEX.exec(subExpr);
  if (matchAs && matchAs.index !== undefined) {
    const a = parseFloat(matchAs[1]);
    const op = matchAs[2];
    const b = parseFloat(matchAs[3]);
    let res = 0;
    let regra = '';
    let dica = '';

    if (op === '+') {
      res = pythonOperations.somar(a, b);
      regra = `${prefixo}Adição resolvida da esquerda para a direita`;
      dica = `somar(${formatPythonNumber(a)}, ${formatPythonNumber(b)}) -> ${formatPythonNumber(res)}`;
    } else {
      res = pythonOperations.subtrair(a, b);
      regra = `${prefixo}Subtração resolvida da esquerda para a direita`;
      dica = `subtrair(${formatPythonNumber(a)}, ${formatPythonNumber(b)}) -> ${formatPythonNumber(res)}`;
    }

    return {
      start: matchAs.index,
      end: matchAs.index + matchAs[0].length,
      opStr: matchAs[0].trim(),
      res,
      regra,
      dica,
    };
  }

  return null;
}

/**
 * Espelha `calc_bit.passo_a_passo.resolver_passo_a_passo` gerando a lista de etapas
 * didáticas para exibição na Lousa de Aprendizado.
 */
export function resolverPassoAPasso(expressao: string): ResolutionReport {
  const limpa = expressao.trim().replace(/×/g, '*').replace(/÷/g, '/');
  if (!limpa) {
    return {
      expressaoOriginal: expressao,
      resultadoFinal: null,
      etapas: [],
      sucesso: false,
      erro: 'Expressão vazia',
      explicacaoErro: 'Digite uma expressão matemática no Joy-Con para visualizar o passo a passo.',
    };
  }

  const etapas: ResolutionStep[] = [];
  let atual = limpa;
  let ordem = 1;

  try {
    // Validação de parênteses
    let saldo = 0;
    for (const ch of atual) {
      if (ch === '(') saldo++;
      else if (ch === ')') {
        saldo--;
        if (saldo < 0) {
          throw new Error("Erro de Sintaxe: Parêntese ')' fechado sem um '(' correspondente!");
        }
      }
    }
    if (saldo > 0) {
      throw new Error(`Erro de Sintaxe: Faltou fechar ${saldo} parêntese(s) ')' na expressão!`);
    }
    if (atual.replace(/\s+/g, '').includes('()')) {
      throw new Error("Erro de Sintaxe: Parênteses vazios '()' não são permitidos!");
    }

    // Substituição de constantes (π, pi, e)
    if (/(?:π|\bpi\b|\be\b)/i.test(atual)) {
      const antesConst = atual;
      atual = atual
        .replace(/π|\bpi\b/gi, formatPythonNumber(PYTHON_CONSTANTS.PI))
        .replace(/\be\b/gi, formatPythonNumber(PYTHON_CONSTANTS.EULER));
      if (atual !== antesConst) {
        etapas.push({
          ordem,
          expressaoAntes: antesConst,
          operacaoAtual: 'Constantes (π / e)',
          regraAplicada: 'Substituímos as constantes matemáticas pelos seus valores numéricos reais',
          dicaPython: `math.pi = ${formatPythonNumber(PYTHON_CONSTANTS.PI)}, math.e = ${formatPythonNumber(PYTHON_CONSTANTS.EULER)}`,
          resultadoParcial: PYTHON_CONSTANTS.PI,
          expressaoDepois: atual,
        });
        ordem++;
      }
    }

    for (let iter = 0; iter < 30; iter++) {
      // 1. Funções científicas com argumento já resolvido
      const matchFn = FN_REGEX.exec(atual);
      if (matchFn && matchFn.index !== undefined) {
        const nomeFn = matchFn[1];
        const argVal = parseFloat(matchFn[2]);
        const { res, regra, dica } = executarFuncaoUnaria(nomeFn, argVal);
        const resStr = formatPythonNumber(res);
        const depois = (
          atual.slice(0, matchFn.index) +
          resStr +
          atual.slice(matchFn.index + matchFn[0].length)
        ).trim();

        etapas.push({
          ordem,
          expressaoAntes: atual,
          operacaoAtual: matchFn[0],
          regraAplicada: regra,
          dicaPython: `${dica} -> ${resStr}`,
          resultadoParcial: res,
          expressaoDepois: depois,
        });
        atual = depois;
        ordem++;
        continue;
      }

      // 2. Remove parênteses redundantes em torno de um número único
      const matchSingle = SINGLE_NUM_PARENS_REGEX.exec(atual);
      if (matchSingle && matchSingle.index !== undefined) {
        const prefixo = atual.slice(0, matchSingle.index).trimEnd();
        if (!/[a-zA-Z0-9_]$/.test(prefixo)) {
          atual = (
            atual.slice(0, matchSingle.index) +
            matchSingle[1] +
            atual.slice(matchSingle.index + matchSingle[0].length)
          ).trim();
          continue;
        }
      }

      // 3. Parênteses mais internos
      const matchPar = INNER_PARENS_REGEX.exec(atual);
      if (matchPar && matchPar.index !== undefined) {
        const conteudo = matchPar[1];
        const passo = avaliarUmPassoSemParenteses(conteudo, true);
        if (passo) {
          const resStr = formatPythonNumber(passo.res);
          const novoConteudo =
            conteudo.slice(0, passo.start) + resStr + conteudo.slice(passo.end);
          const prefixoPar = atual.slice(0, matchPar.index).trimEnd();
          const ehArgFuncao = /[a-zA-Z_][a-zA-Z0-9_]*$/.test(prefixoPar);
          const onlyNum = new RegExp(`^\\s*${NUM_PATTERN}\\s*$`).test(novoConteudo);
          const substituto =
            onlyNum && !ehArgFuncao ? novoConteudo.trim() : `(${novoConteudo.trim()})`;

          const depois = (
            atual.slice(0, matchPar.index) +
            substituto +
            atual.slice(matchPar.index + matchPar[0].length)
          ).trim();

          etapas.push({
            ordem,
            expressaoAntes: atual,
            operacaoAtual:
              passo.opStr === conteudo.trim() ? `(${passo.opStr})` : passo.opStr,
            regraAplicada: passo.regra,
            dicaPython: passo.dica,
            resultadoParcial: passo.res,
            expressaoDepois: depois,
          });
          atual = depois;
          ordem++;
          continue;
        }
      }

      // 4. Operações fora de parênteses segundo PEMDAS
      const passoGlobal = avaliarUmPassoSemParenteses(atual, false);
      if (passoGlobal) {
        const resStr = formatPythonNumber(passoGlobal.res);
        const depois = (
          atual.slice(0, passoGlobal.start) +
          resStr +
          atual.slice(passoGlobal.end)
        ).trim();

        etapas.push({
          ordem,
          expressaoAntes: atual,
          operacaoAtual: passoGlobal.opStr,
          regraAplicada: passoGlobal.regra,
          dicaPython: passoGlobal.dica,
          resultadoParcial: passoGlobal.res,
          expressaoDepois: depois,
        });
        atual = depois;
        ordem++;
        continue;
      }

      break;
    }

    const validFinal = new RegExp(`^\\s*${NUM_PATTERN}\\s*$`).test(atual);
    if (!validFinal) {
      throw new Error(
        'Erro de Sintaxe: Expressão incompleta ou operadores seguidos sem operandos.'
      );
    }

    return {
      expressaoOriginal: limpa,
      resultadoFinal: parseFloat(atual.trim()),
      etapas,
      sucesso: true,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const isZeroDiv = msg.includes('ZeroDivisionError') || msg.includes('zero');
    return {
      expressaoOriginal: limpa,
      resultadoFinal: null,
      etapas,
      sucesso: false,
      erro: msg,
      explicacaoErro: isZeroDiv
        ? 'Na matemática, dividir qualquer número por zero é indefinido porque não existe nenhum valor que multiplicado por 0 resulte no dividendo. Em Python, isso dispara a exceção ZeroDivisionError.'
        : 'A expressão contém um erro de domínio matemático (ex: raiz negativa ou log <= 0) ou parênteses/operadores incompletos. Em Python, capturamos isso via ValueError.',
    };
  }
}

export const pythonSourceFiles = {
  'calc_bit/cientifica.py': `"""
Módulo: calc_bit.cientifica
Descrição: Implementação das operações de calculadora científica em Python.
"""
import math

PI: float = math.pi
EULER: float = math.e

def potencia(base: float, expoente: float) -> float:
    if base == 0 and expoente < 0:
        raise ZeroDivisionError("Erro: Zero não pode ser elevado a um expoente negativo!")
    if base < 0 and not float(expoente).is_integer():
        raise ValueError("Erro: Base negativa com expoente fracionário gera número complexo!")
    return float(math.pow(base, expoente))

def quadrado(x: float) -> float:
    return x * x

def raiz_quadrada(x: float) -> float:
    if x < 0:
        raise ValueError("Erro: Não existe raiz quadrada real de número negativo!")
    return math.sqrt(x)

def fatorial(n: float) -> int:
    if isinstance(n, float) and not n.is_integer():
        raise ValueError("Erro: Fatorial é definido apenas para números inteiros!")
    inteiro = int(n)
    if inteiro < 0:
        raise ValueError("Erro: Não existe fatorial de número negativo!")
    return math.factorial(inteiro)

def modulo(dividendo: float, divisor: float) -> float:
    if divisor == 0:
        raise ZeroDivisionError("Erro: Impossível calcular módulo por zero!")
    return dividendo % divisor

def porcentagem(valor: float, percentual: float) -> float:
    return float((valor * percentual) / 100.0)

def seno(graus: float) -> float:
    return round(math.sin(math.radians(graus)), 10) + 0.0

def cosseno(graus: float) -> float:
    return round(math.cos(math.radians(graus)), 10) + 0.0

def tangente(graus: float) -> float:
    if abs(cosseno(graus)) < 1e-10:
        raise ValueError(f"Erro: Tangente indefinida para o ângulo de {graus}°!")
    return round(math.tan(math.radians(graus)), 10) + 0.0

def log10(x: float) -> float:
    if x <= 0:
        raise ValueError("Erro: Logaritmo requer um número estritamente positivo (x > 0)!")
    return math.log10(x)

def ln(x: float) -> float:
    if x <= 0:
        raise ValueError("Erro: Logaritmo natural requer um número estritamente positivo (x > 0)!")
    return math.log(x)
`,
  'calc_bit/passo_a_passo.py': `"""
Módulo: calc_bit.passo_a_passo
Descrição: Avaliador de expressões matemáticas com suporte a parênteses,
funções científicas e geração detalhada do passo a passo de resolução (PEMDAS).
"""
# Código completo disponível na pasta calc_bit/passo_a_passo.py do repositório!
`,
};
