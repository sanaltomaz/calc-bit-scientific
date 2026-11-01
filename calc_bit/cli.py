#!/usr/bin/env python3
"""
Módulo: calc_bit.cli
Descrição: Calculadora Interativa Básica e Científica em Linha de Comando (CLI) em Python.
Autor: Google AI Studio / sanaltomaz
Python: 3.8+

Uso:
    python3 main.py
"""

import sys
from calc_bit.operacoes import dividir, multiplicar, somar, subtrair
from calc_bit.cientifica import (
    EULER,
    PI,
    cosseno,
    fatorial,
    ln,
    log10,
    modulo,
    porcentagem,
    potencia,
    quadrado,
    raiz_quadrada,
    seno,
    tangente,
)


def exibir_cabecalho() -> None:
    """Exibe o cabeçalho estilizado do programa."""
    print("\n" + "=" * 54)
    print("           CALC BIT SCIENTIFIC - PYTHON CLI           ")
    print("      Operações Básicas e Científicas Integradas      ")
    print("=" * 54)


def exibir_menu() -> None:
    """Apresenta as opções de operação disponíveis para o usuário."""
    print(" --- OPERAÇÕES BÁSICAS (2 números) ---")
    print("  [1] Adição          ( a + b )   [2] Subtração       ( a - b )")
    print("  [3] Multiplicação   ( a * b )   [4] Divisão         ( a / b )")
    print("\n --- OPERAÇÕES CIENTÍFICAS (2 números) ---")
    print("  [5] Potência        ( a ^ b )   [6] Módulo / Resto  ( a % b )")
    print("  [7] Porcentagem     ( b% de a )")
    print("\n --- OPERAÇÕES CIENTÍFICAS (1 número) ---")
    print("  [8] Quadrado        ( x² )      [9] Raiz Quadrada   ( √x )")
    print(" [10] Fatorial        ( n! )     [11] Seno            ( sin x° )")
    print(" [12] Cosseno         ( cos x° ) [13] Tangente        ( tan x° )")
    print(" [14] Logaritmo 10    ( log x )  [15] Log Natural     ( ln x )")
    print("-" * 54)
    print(f"  Constantes: pi = {PI:.6f} | e = {EULER:.6f}")
    print("  [0] Sair do programa")
    print("-" * 54)


def obter_numero(mensagem: str) -> float:
    """
    Solicita um número ao usuário (ou as constantes 'pi' / 'e') e valida a entrada.
    """
    while True:
        try:
            entrada = input(mensagem).strip().lower().replace(",", ".")
            if entrada == "pi":
                return PI
            if entrada == "e":
                return EULER
            return float(entrada)
        except ValueError:
            print(" [!] Entrada inválida! Digite um número válido (ou 'pi' / 'e').")


def executar_calculo_binario(opcao: str, num1: float, num2: float) -> None:
    """Executa operações que recebem dois operandos (num1 e num2)."""
    try:
        if opcao == "1":
            resultado = somar(num1, num2)
            expressao = f"{num1} + {num2}"
            nome_op = "Adição"
        elif opcao == "2":
            resultado = subtrair(num1, num2)
            expressao = f"{num1} - {num2}"
            nome_op = "Subtração"
        elif opcao == "3":
            resultado = multiplicar(num1, num2)
            expressao = f"{num1} * {num2}"
            nome_op = "Multiplicação"
        elif opcao == "4":
            resultado = dividir(num1, num2)
            expressao = f"{num1} / {num2}"
            nome_op = "Divisão"
        elif opcao == "5":
            resultado = potencia(num1, num2)
            expressao = f"{num1} ^ {num2}"
            nome_op = "Potenciação"
        elif opcao == "6":
            resultado = modulo(num1, num2)
            expressao = f"{num1} mod {num2}"
            nome_op = "Módulo (Resto)"
        elif opcao == "7":
            resultado = porcentagem(num1, num2)
            expressao = f"{num2}% de {num1}"
            nome_op = "Porcentagem"
        else:
            return

        print("\n" + "-" * 54)
        print(f" >>> Operação : {nome_op}")
        print(f" >>> Expressão: {expressao}")
        print(f" >>> RESULTADO: {resultado}")
        print("-" * 54)

    except (ZeroDivisionError, ValueError) as erro:
        print(f"\n [ERRO MATEMÁTICO] {erro}\n")


def executar_calculo_unario(opcao: str, x: float) -> None:
    """Executa operações científicas que recebem apenas um operando (x)."""
    try:
        if opcao == "8":
            resultado = quadrado(x)
            expressao = f"{x}²"
            nome_op = "Quadrado"
        elif opcao == "9":
            resultado = raiz_quadrada(x)
            expressao = f"√({x})"
            nome_op = "Raiz Quadrada"
        elif opcao == "10":
            resultado = fatorial(x)
            expressao = f"{int(x)}!"
            nome_op = "Fatorial"
        elif opcao == "11":
            resultado = seno(x)
            expressao = f"sin({x}°)"
            nome_op = "Seno (Graus)"
        elif opcao == "12":
            resultado = cosseno(x)
            expressao = f"cos({x}°)"
            nome_op = "Cosseno (Graus)"
        elif opcao == "13":
            resultado = tangente(x)
            expressao = f"tan({x}°)"
            nome_op = "Tangente (Graus)"
        elif opcao == "14":
            resultado = log10(x)
            expressao = f"log10({x})"
            nome_op = "Logaritmo Base 10"
        elif opcao == "15":
            resultado = ln(x)
            expressao = f"ln({x})"
            nome_op = "Logaritmo Natural"
        else:
            return

        print("\n" + "-" * 54)
        print(f" >>> Operação : {nome_op}")
        print(f" >>> Expressão: {expressao}")
        print(f" >>> RESULTADO: {resultado}")
        print("-" * 54)

    except (ZeroDivisionError, ValueError) as erro:
        print(f"\n [ERRO MATEMÁTICO] {erro}\n")


def main() -> None:
    """Loop principal de execução da calculadora."""
    exibir_cabecalho()

    opcoes_binarias = {"1", "2", "3", "4", "5", "6", "7"}
    opcoes_unarias = {"8", "9", "10", "11", "12", "13", "14", "15"}

    while True:
        exibir_menu()
        opcao = input(" Escolha uma opção (0-15): ").strip()

        if opcao == "0":
            print("\n Encerrando a Calc Bit Scientific. Até logo!\n")
            sys.exit(0)

        if opcao in opcoes_binarias:
            print("\n --- Entrada de Dados (2 números) ---")
            num1 = obter_numero(" Digite o 1º número: ")
            num2 = obter_numero(" Digite o 2º número: ")
            executar_calculo_binario(opcao, num1, num2)
        elif opcao in opcoes_unarias:
            print("\n --- Entrada de Dados (1 número) ---")
            x = obter_numero(" Digite o valor (ou 'pi' / 'e'): ")
            executar_calculo_unario(opcao, x)
        else:
            print("\n [!] Opção inválida. Escolha um número entre 0 e 15.\n")


if __name__ == "__main__":
    main()
