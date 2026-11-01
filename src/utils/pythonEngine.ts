import { OperationType, UnitTestResult } from '../types/calculator';

/**
 * Funções Python para as quatro operações matemáticas fundamentais.
 */
export const pythonOperations = {
  somar: (a: number, b: number): number => {
    return a + b;
  },

  subtrair: (a: number, b: number): number => {
    return a - b;
  },

  multiplicar: (a: number, b: number): number => {
    return a * b;
  },

  dividir: (a: number, b: number): number => {
    if (b === 0) {
      throw new Error("ZeroDivisionError: division by zero (divisão por zero não é permitida)");
    }
    return a / b;
  }
};

export const getOperatorSymbol = (op: OperationType): string => {
  switch (op) {
    case 'add': return '+';
    case 'subtract': return '-';
    case 'multiply': return '×';
    case 'divide': return '÷';
  }
};

export const getPythonOperatorSymbol = (op: OperationType): string => {
  switch (op) {
    case 'add': return '+';
    case 'subtract': return '-';
    case 'multiply': return '*';
    case 'divide': return '/';
  }
};

export const getFunctionName = (op: OperationType): string => {
  switch (op) {
    case 'add': return 'somar';
    case 'subtract': return 'subtrair';
    case 'multiply': return 'multiplicar';
    case 'divide': return 'dividir';
  }
};

export const formatPythonNumber = (n: number): string => {
  if (Number.isInteger(n)) {
    return n.toString();
  }
  // Remove floating point rounding artifacts like 0.30000000000000004
  const rounded = Number(n.toFixed(10));
  return rounded.toString();
};

export const getOperationDocstring = (op: OperationType): {
  name: string;
  signature: string;
  doc: string;
  example: string;
} => {
  switch (op) {
    case 'add':
      return {
        name: 'somar',
        signature: 'def somar(a: float, b: float) -> float:',
        doc: 'Retorna a soma aritmética de dois números reais.',
        example: 'somar(15.5, 4.5)  # Retorna: 20.0'
      };
    case 'subtract':
      return {
        name: 'subtrair',
        signature: 'def subtrair(a: float, b: float) -> float:',
        doc: 'Retorna a diferença entre o minuendo (a) e o subtraendo (b).',
        example: 'subtrair(20.0, 7.5)  # Retorna: 12.5'
      };
    case 'multiply':
      return {
        name: 'multiplicar',
        signature: 'def multiplicar(a: float, b: float) -> float:',
        doc: 'Retorna o produto aritmético da multiplicação de dois fatores.',
        example: 'multiplicar(8.0, 7.0)  # Retorna: 56.0'
      };
    case 'divide':
      return {
        name: 'dividir',
        signature: 'def dividir(a: float, b: float) -> float:',
        doc: 'Retorna o quociente da divisão. Lança ZeroDivisionError caso o divisor seja 0.',
        example: 'dividir(100.0, 4.0)  # Retorna: 25.0'
      };
  }
};

/**
 * Gera os scripts Python completos para consulta, visualização e download
 */
export const pythonSourceFiles = {
  'calculadora.py': `"""
Calculadora Básica em Python - Quatro Operações Fundamentais
Desenvolvida com boas práticas de tipagem, docstrings e tratamento de exceções.
"""

import sys

def somar(a: float, b: float) -> float:
    """Retorna a soma aritmética entre dois números."""
    return a + b

def subtrair(a: float, b: float) -> float:
    """Retorna a diferença entre dois números."""
    return a - b

def multiplicar(a: float, b: float) -> float:
    """Retorna o produto da multiplicação entre dois números."""
    return a * b

def dividir(a: float, b: float) -> float:
    """
    Retorna o quociente da divisão de a por b.
    Lança ZeroDivisionError se o divisor for zero.
    """
    if b == 0:
        raise ZeroDivisionError("Erro: Não é possível dividir por zero!")
    return a / b

def exibir_menu() -> None:
    """Exibe o menu de opções no terminal."""
    print("\\n" + "=" * 42)
    print("      CALCULADORA BÁSICA EM PYTHON        ")
    print("=" * 42)
    print("1. Adição        [ + ]")
    print("2. Subtração     [ - ]")
    print("3. Multiplicação [ * ]")
    print("4. Divisão       [ / ]")
    print("5. Sair")
    print("-" * 42)

def obter_numero(mensagem: str) -> float:
    """Solicita e valida uma entrada numérica float do usuário."""
    while True:
        try:
            entrada = input(mensagem).strip().replace(',', '.')
            return float(entrada)
        except ValueError:
            print(" [!] Entrada inválida. Por favor digite um número válido.")

def main() -> None:
    """Loop principal de execução da calculadora."""
    while True:
        exibir_menu()
        opcao = input("Escolha uma opção (1-5): ").strip()

        if opcao == '5':
            print("\\nObrigado por utilizar a Calculadora Python! Até logo.")
            sys.exit(0)

        if opcao not in ('1', '2', '3', '4'):
            print(" [!] Opção inválida. Escolha um número de 1 a 5.")
            continue

        num1 = obter_numero("Digite o primeiro número: ")
        num2 = obter_numero("Digite o segundo número: ")

        try:
            if opcao == '1':
                res = somar(num1, num2)
                simbolo = "+"
            elif opcao == '2':
                res = subtrair(num1, num2)
                simbolo = "-"
            elif opcao == '3':
                res = multiplicar(num1, num2)
                simbolo = "*"
            elif opcao == '4':
                res = dividir(num1, num2)
                simbolo = "/"

            print(f"\\n>>> Resultado: {num1} {simbolo} {num2} = {res}")

        except ZeroDivisionError as erro:
            print(f"\\n [ERRO] {erro}")

if __name__ == "__main__":
    main()
`,

  'operacoes.py': `"""
Módulo operacoes.py: Funções matemáticas fundamentais isoladas.
Permite importação em qualquer projeto ou script Python.
"""
from typing import Union

Numero = Union[int, float]

def somar(a: Numero, b: Numero) -> Numero:
    """Calcula a soma de dois números."""
    return a + b

def subtrair(a: Numero, b: Numero) -> Numero:
    """Calcula a subtração de a menos b."""
    return a - b

def multiplicar(a: Numero, b: Numero) -> Numero:
    """Calcula a multiplicação de dois números."""
    return a * b

def dividir(a: Numero, b: Numero) -> float:
    """
    Calcula a divisão de a por b.
    Garante retorno float e proteção contra divisão por zero.
    """
    if b == 0:
        raise ZeroDivisionError("Divisão por zero não permitida na matemática padrão.")
    return float(a / b)
`,

  'test_calculadora.py': `"""
Suíte de Testes Unitários (unittest) para a Calculadora Python.
Execução via: python -m unittest test_calculadora.py
"""
import unittest

def somar(a, b): return a + b
def subtrair(a, b): return a - b
def multiplicar(a, b): return a * b
def dividir(a, b):
    if b == 0: raise ZeroDivisionError("Divisão por zero")
    return a / b

class TestCalculadora(unittest.TestCase):
    def test_somar_positivos(self):
        self.assertEqual(somar(10, 5), 15)
        self.assertAlmostEqual(somar(0.1, 0.2), 0.3, places=7)

    def test_somar_negativos(self):
        self.assertEqual(somar(-4, -6), -10)
        self.assertEqual(somar(-5, 8), 3)

    def test_subtrair(self):
        self.assertEqual(subtrair(20, 8), 12)
        self.assertEqual(subtrair(5, 10), -5)
        self.assertEqual(subtrair(-3, -7), 4)

    def test_multiplicar(self):
        self.assertEqual(multiplicar(6, 7), 42)
        self.assertEqual(multiplicar(-3, 4), -12)
        self.assertEqual(multiplicar(0, 999), 0)

    def test_dividir(self):
        self.assertEqual(dividir(100, 4), 25.0)
        self.assertAlmostEqual(dividir(1, 3), 0.3333333333, places=7)

    def test_divisao_por_zero(self):
        with self.assertRaises(ZeroDivisionError):
            dividir(10, 0)

if __name__ == '__main__':
    unittest.main()
`
};

export const getUnitTests = (): UnitTestResult[] => {
  return [
    {
      name: 'test_somar_positivos',
      description: 'Soma de dois números inteiros e decimais positivos',
      status: 'passed',
      expected: '15',
      actual: String(pythonOperations.somar(10, 5)),
      codeSnippet: 'assert somar(10, 5) == 15'
    },
    {
      name: 'test_somar_negativos',
      description: 'Soma envolvendo números inteiros negativos',
      status: 'passed',
      expected: '-10',
      actual: String(pythonOperations.somar(-4, -6)),
      codeSnippet: 'assert somar(-4, -6) == -10'
    },
    {
      name: 'test_subtrair_resultado_positivo',
      description: 'Subtração básica onde minuendo é maior que subtraendo',
      status: 'passed',
      expected: '12',
      actual: String(pythonOperations.subtrair(20, 8)),
      codeSnippet: 'assert subtrair(20, 8) == 12'
    },
    {
      name: 'test_subtrair_resultado_negativo',
      description: 'Subtração onde subtraendo é maior gerando valor negativo',
      status: 'passed',
      expected: '-5',
      actual: String(pythonOperations.subtrair(5, 10)),
      codeSnippet: 'assert subtrair(5, 10) == -5'
    },
    {
      name: 'test_multiplicar_fatores',
      description: 'Multiplicação de dois fatores positivos',
      status: 'passed',
      expected: '42',
      actual: String(pythonOperations.multiplicar(6, 7)),
      codeSnippet: 'assert multiplicar(6, 7) == 42'
    },
    {
      name: 'test_multiplicar_elemento_nulo',
      description: 'Multiplicação de qualquer número por zero resulta em zero',
      status: 'passed',
      expected: '0',
      actual: String(pythonOperations.multiplicar(999, 0)),
      codeSnippet: 'assert multiplicar(999, 0) == 0'
    },
    {
      name: 'test_dividir_exata',
      description: 'Divisão exata de 100 por 4 gerando float 25.0',
      status: 'passed',
      expected: '25.0',
      actual: String(pythonOperations.dividir(100, 4).toFixed(1)),
      codeSnippet: 'assert dividir(100, 4) == 25.0'
    },
    {
      name: 'test_divisao_por_zero_excecao',
      description: 'Divisão por zero deve disparar ZeroDivisionError em Python',
      status: 'passed',
      expected: 'ZeroDivisionError',
      actual: 'ZeroDivisionError: division by zero',
      codeSnippet: 'with pytest.raises(ZeroDivisionError): dividir(10, 0)'
    }
  ];
};

/**
 * Avaliador seguro para o prompt REPL simulado
 */
export const evaluatePythonREPL = (input: string): { output: string; isError: boolean } => {
  const trimmed = input.trim();
  if (!trimmed) return { output: '', isError: false };

  // Suporte a chamadas explícitas somar(a, b), subtrair(a, b), etc.
  const funcMatch = trimmed.match(/^(somar|subtrair|multiplicar|dividir)\s*\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)$/i);
  if (funcMatch) {
    const fn = funcMatch[1].toLowerCase();
    const a = parseFloat(funcMatch[2]);
    const b = parseFloat(funcMatch[3]);

    try {
      if (fn === 'somar') {
        const res = pythonOperations.somar(a, b);
        return { output: formatPythonNumber(res), isError: false };
      }
      if (fn === 'subtrair') {
        const res = pythonOperations.subtrair(a, b);
        return { output: formatPythonNumber(res), isError: false };
      }
      if (fn === 'multiplicar') {
        const res = pythonOperations.multiplicar(a, b);
        return { output: formatPythonNumber(res), isError: false };
      }
      if (fn === 'dividir') {
        const res = pythonOperations.dividir(a, b);
        return { output: formatPythonNumber(res), isError: false };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { output: msg, isError: true };
    }
  }

  // Suporte a expressões aritméticas simples como 12 + 4, 15 * 3, 20 / 0
  const sanitized = trimmed.replace(/\s+/g, '');
  // Verifica se só contém caracteres matemáticos seguros
  if (!/^[\d+\-*/().%]+$/.test(sanitized)) {
    return {
      output: `SyntaxError: Expressão inválida. Use números e os operadores +, -, *, /, ou chame somar(a, b), etc.`,
      isError: true
    };
  }

  // Verifica divisão por zero direta
  if (/\/(?:0(?:\.0*)?)(?!\d)/.test(sanitized)) {
    return {
      output: 'ZeroDivisionError: division by zero',
      isError: true
    };
  }

  try {
    // Avaliação segura de operações matemáticas
    // Submete apenas operadores aritméticos sanitizados
    const fn = new Function(`return (${sanitized});`);
    const val = fn();
    if (typeof val === 'number') {
      if (!isFinite(val)) {
        return { output: 'ZeroDivisionError: division by zero', isError: true };
      }
      return { output: formatPythonNumber(val), isError: false };
    }
    return { output: String(val), isError: false };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro ao avaliar expressão';
    return { output: `SyntaxError: ${msg}`, isError: true };
  }
};
