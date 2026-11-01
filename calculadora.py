#!/usr/bin/env python3
"""
Programa: calculadora.py
Descrição: Calculadora Básica Interativa em Linha de Comando (CLI) em Python.
Suporte: Quatro Operações Matemáticas Fundamentais (+, -, *, /)
Autor: Google AI Studio
Python: 3.8+

Uso:
    python3 calculadora.py
"""

import sys
from operacoes import somar, subtrair, multiplicar, dividir


def exibir_cabecalho() -> None:
    """Exibe o cabeçalho estilizado do programa."""
    print("\n" + "=" * 46)
    print("        CALCULADORA BÁSICA EM PYTHON          ")
    print("      Quatro Operações Fundamentais          ")
    print("=" * 46)


def exibir_menu() -> None:
    """Apresenta as opções de operação disponíveis para o usuário."""
    print(" [1] Adição        ( + )")
    print(" [2] Subtração     ( - )")
    print(" [3] Multiplicação ( * )")
    print(" [4] Divisão       ( / )")
    print(" [5] Sair do programa")
    print("-" * 46)


def obter_numero(mensagem: str) -> float:
    """
    Solicita um número ao usuário e valida se a entrada é válida.

    Trata conversão de vírgula para ponto (padrão brasileiro/internacional)
    e captura exceções ValueError para evitar que o programa quebre com texto inválido.

    Parâmetros:
        mensagem (str): O texto de orientação exibido no input.

    Retorna:
        float: O número validado digitado pelo usuário.
    """
    while True:
        try:
            entrada = input(mensagem).strip().replace(',', '.')
            return float(entrada)
        except ValueError:
            print(" [!] Entrada inválida! Digite um número inteiro ou decimal válido.")


def executar_calculo(opcao: str, num1: float, num2: float) -> None:
    """
    Executa a operação matemática correspondente à opção escolhida.

    Parâmetros:
        opcao (str): '1', '2', '3' ou '4'.
        num1 (float): Primeiro operando.
        num2 (float): Segundo operando.
    """
    try:
        if opcao == '1':
            resultado = somar(num1, num2)
            simbolo = "+"
            nome_op = "Adição"
        elif opcao == '2':
            resultado = subtrair(num1, num2)
            simbolo = "-"
            nome_op = "Subtração"
        elif opcao == '3':
            resultado = multiplicar(num1, num2)
            simbolo = "*"
            nome_op = "Multiplicação"
        elif opcao == '4':
            resultado = dividir(num1, num2)
            simbolo = "/"
            nome_op = "Divisão"
        else:
            print(" [!] Opção não reconhecida.")
            return

        print("\n" + "-" * 46)
        print(f" >>> Operação: {nome_op}")
        print(f" >>> Expressão: {num1} {simbolo} {num2}")
        print(f" >>> RESULTADO: {resultado}")
        print("-" * 46)

    except ZeroDivisionError as erro:
        print(f"\n [ERRO MATEMÁTICO] {erro}")


def main() -> None:
    """
    Loop principal de execução do aplicativo.
    Mantém a calculadora em funcionamento até que o usuário escolha sair.
    """
    exibir_cabecalho()

    while True:
        exibir_menu()
        opcao = input(" Escolha uma opção (1-5): ").strip()

        if opcao == '5':
            print("\n Encerrando a Calculadora Python. Até logo!\n")
            sys.exit(0)

        if opcao not in ('1', '2', '3', '4'):
            print("\n [!] Opção inválida. Por favor, escolha um número de 1 a 5.\n")
            continue

        print("\n --- Entrada de Dados ---")
        num1 = obter_numero(" Digite o 1º número: ")
        num2 = obter_numero(" Digite o 2º número: ")

        executar_calculo(opcao, num1, num2)


if __name__ == '__main__':
    main()
