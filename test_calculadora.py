"""
Módulo de Testes Unitários: test_calculadora.py
Descrição: Suíte de testes automatizados utilizando a biblioteca padrão 'unittest'
para validar as quatro operações matemáticas e o tratamento de exceções.

Execução:
    python3 -m unittest test_calculadora.py -v
"""

import unittest
from operacoes import somar, subtrair, multiplicar, dividir


class TesteOperacoesFundamentais(unittest.TestCase):
    """Casos de teste para cada uma das quatro operações fundamentais."""

    # ------------------ TESTES DE ADIÇÃO (+) ------------------
    def test_somar_numeros_positivos(self):
        """Testa a soma entre dois números positivos."""
        self.assertEqual(somar(10, 5), 15)
        self.assertEqual(somar(100, 250), 350)

    def test_somar_decimais(self):
        """Testa a soma com números de ponto flutuante (float)."""
        self.assertAlmostEqual(somar(2.5, 4.3), 6.8, places=7)
        self.assertAlmostEqual(somar(0.1, 0.2), 0.3, places=7)

    def test_somar_negativos(self):
        """Testa a soma envolvendo números negativos."""
        self.assertEqual(somar(-5, -10), -15)
        self.assertEqual(somar(-8, 12), 4)

    def test_somar_com_zero(self):
        """Testa o elemento neutro da adição (soma com zero)."""
        self.assertEqual(somar(42, 0), 42)
        self.assertEqual(somar(0, 0), 0)

    # ---------------- TESTES DE SUBTRAÇÃO (-) -----------------
    def test_subtrair_minuendo_maior(self):
        """Testa a subtração convencional com resultado positivo."""
        self.assertEqual(subtrair(20, 8), 12)

    def test_subtrair_minuendo_menor(self):
        """Testa a subtração que resulta em valor negativo."""
        self.assertEqual(subtrair(5, 15), -10)

    def test_subtrair_decimais(self):
        """Testa a subtração com números decimais."""
        self.assertAlmostEqual(subtrair(10.5, 3.2), 7.3, places=7)

    def test_subtrair_negativos(self):
        """Testa subtração com números negativos (regra de sinais: a - (-b) == a + b)."""
        self.assertEqual(subtrair(10, -5), 15)
        self.assertEqual(subtrair(-10, -5), -5)

    # -------------- TESTES DE MULTIPLICAÇÃO (*) ---------------
    def test_multiplicar_positivos(self):
        """Testa a multiplicação simples entre inteiros positivos."""
        self.assertEqual(multiplicar(6, 7), 42)
        self.assertEqual(multiplicar(12, 12), 144)

    def test_multiplicar_elemento_nulo_zero(self):
        """Valida que qualquer número multiplicado por zero deve ser zero."""
        self.assertEqual(multiplicar(999, 0), 0)
        self.assertEqual(multiplicar(0, -50), 0)

    def test_multiplicar_regra_de_sinais(self):
        """Valida multiplicação com fatores de sinais opostos e iguais."""
        self.assertEqual(multiplicar(-4, 5), -20)
        self.assertEqual(multiplicar(-3, -3), 9)

    def test_multiplicar_decimais(self):
        """Testa multiplicação de valores de ponto flutuante."""
        self.assertAlmostEqual(multiplicar(2.5, 4.0), 10.0, places=7)

    # ----------------- TESTES DE DIVISÃO (/) ------------------
    def test_dividir_exata(self):
        """Testa divisão exata (em Python 3 o retorno é float)."""
        self.assertEqual(dividir(10, 2), 5.0)
        self.assertEqual(dividir(100, 4), 25.0)

    def test_dividir_com_decimais(self):
        """Testa divisões não inteiras e dízimas."""
        self.assertEqual(dividir(7, 2), 3.5)
        self.assertAlmostEqual(dividir(1, 3), 0.3333333333, places=7)

    def test_divisao_por_zero_lanca_excecao(self):
        """Verifica se dividir por zero levanta a exceção ZeroDivisionError."""
        with self.assertRaises(ZeroDivisionError):
            dividir(10, 0)

        with self.assertRaises(ZeroDivisionError):
            dividir(0, 0)


if __name__ == '__main__':
    unittest.main()
