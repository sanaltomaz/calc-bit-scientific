"""
Módulo de Testes Unitários: tests/test_passo_a_passo.py
Descrição: Valida o motor de resolução passo a passo com parênteses,
precedência PEMDAS, funções científicas e explicações didáticas de erros.
"""

import unittest
from calc_bit.passo_a_passo import resolver_passo_a_passo


class TestePassoAPasso(unittest.TestCase):
    """Testes automatizados para o motor da Lousa de Aprendizado."""

    def test_precedencia_pemdas_multiplicacao_antes_da_soma(self):
        """Verifica se 5 + 2 * 6 resolve primeiro 2 * 6 e depois soma 5."""
        relatorio = resolver_passo_a_passo("5 + 2 * 6")
        self.assertTrue(relatorio.sucesso)
        self.assertEqual(relatorio.resultado_final, 17.0)
        self.assertEqual(len(relatorio.etapas), 2)
        self.assertEqual(relatorio.etapas[0].operacao_atual, "2 * 6")
        self.assertEqual(relatorio.etapas[0].expressao_depois, "5 + 12")
        self.assertEqual(relatorio.etapas[1].operacao_atual, "5 + 12")

    def test_parenteses_alteram_precedencia(self):
        """Verifica se (5 + 2) * 6 resolve primeiro os parênteses (5 + 2)."""
        relatorio = resolver_passo_a_passo("5 + 2 * (10 - 4)")
        self.assertTrue(relatorio.sucesso)
        self.assertEqual(relatorio.resultado_final, 17.0)
        self.assertEqual(len(relatorio.etapas), 3)
        self.assertEqual(relatorio.etapas[0].expressao_depois, "5 + 2 * 6")
        self.assertEqual(relatorio.etapas[1].expressao_depois, "5 + 12")
        self.assertEqual(relatorio.etapas[2].expressao_depois, "17")

    def test_parenteses_aninhados_e_potencia(self):
        """Testa parênteses múltiplos e potenciação: (12 + 8) / (2 ^ 2)."""
        relatorio = resolver_passo_a_passo("(12 + 8) / (2 ^ 2)")
        self.assertTrue(relatorio.sucesso)
        self.assertEqual(relatorio.resultado_final, 5.0)
        self.assertEqual(len(relatorio.etapas), 3)

    def test_funcoes_cientificas_na_expressao(self):
        """Testa funções científicas combinadas com aritmética: sqrt(144) + fatorial(4)."""
        relatorio = resolver_passo_a_passo("sqrt(144) + fatorial(4)")
        self.assertTrue(relatorio.sucesso)
        self.assertEqual(relatorio.resultado_final, 36.0)
        self.assertEqual(len(relatorio.etapas), 3)

    def test_erro_divisao_por_zero_didatico(self):
        """Verifica se divisão por zero após resolver parênteses gera explicação didática."""
        relatorio = resolver_passo_a_passo("10 / (5 - 5)")
        self.assertFalse(relatorio.sucesso)
        self.assertEqual(len(relatorio.etapas), 1)
        self.assertEqual(relatorio.etapas[0].expressao_depois, "10 / 0")
        self.assertIsNotNone(relatorio.explicacao_erro)

    def test_erro_parenteses_desbalanceados(self):
        """Verifica se parênteses abertos sem fechar retornam erro amigável."""
        relatorio = resolver_passo_a_passo("2 * (3 + 4")
        self.assertFalse(relatorio.sucesso)
        self.assertIn("parêntese", relatorio.erro.lower())


if __name__ == "__main__":
    unittest.main()
