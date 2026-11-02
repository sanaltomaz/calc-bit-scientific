# ADR 0002: Modo de Aprendizado com Lousa Didática e Resolução Passo a Passo

* **Status:** Aceito
* **Data:** 01/11/2026
* **Decisores:** sanaltomaz (Autor), Antigravity (AI Assistant)

---

## 1. Contexto e Motivação
Calculadoras tradicionais operam como "caixas-pretas": o usuário insere uma expressão ou sequência de operandos e obtém imediatamente um número final. Em contextos pedagógicos (estudantes de exatas, programação e ciência de dados), a simples resposta não elucida:
1. Qual a ordem de precedência aplicada (PEMDAS).
2. Como os parênteses e operadores unários/científicos transformam a equação em estágios intermediários.
3. Quais regras matemáticas ou exceções de runtime foram acionadas.

---

## 2. Decisão Arquitetural
Implementar um **Modo de Aprendizado** com:
1. **Design de Hardware Temático Retrô:** Um console inspirado no Nintendo Switch (Joy-Con único com teclado numérico acoplado à esquerda) integrado a uma tela ampla à direita representando uma **Lousa Digital / Tablet Retrô**.
2. **Motor de Etapas no Backend Python (`calc_bit/passo_a_passo.py`):** Avaliação com decomposição sintática que gera uma lista ordenada de etapas (`EtapaResolucao`).
3. **Consumo no Frontend com Renderização em Cascata:** A interface web recebe a sequência de passos e os exibe de uma só vez, aplicando animação sequencial em cascata com tipografia estilo giz digital / fósforo verde.

---

## 3. Como Será Implementada
* **Estrutura de Dados do Passo a Passo:**
  ```python
  class EtapaResolucao:
      ordem: int
      expressao_antes: str
      operacao_atual: str       # Ex: "(10 - 4)"
      regra_aplicada: str       # Ex: "Prioridade aos parênteses mais internos"
      resultado_parcial: float   # Ex: 6.0
      expressao_depois: str     # Ex: "5 + 2 * 6"
  ```
* **Navegação Temática no Header:**
  * O cabeçalho terá seletores de modo representados por "consoles/máquinas retrô":
    * *Modo Portátil (Calculadora Básica + Científica)*
    * *Modo Lousa (Aprendizado e Passo a Passo)*
* **Componente `LearningBoard.tsx`:**
  * Chassis com textura de console retrô.
  * Lousa com efeito de quadro de ardósia e scanlines sutis.
  * Painel de passos com cartões animados em ordem cronológica de resolução.

---

## 4. Consequências e Impactos
* **Pontos Positivos (+):**
  * Diferencial competitivo forte em feiras, portfólios e avaliações de código.
  * Garante que o motor de matemática Python continue sendo a única fonte da verdade.
  * Permite entender na prática a árvore de análise sintática e a ordem das operações.
* **Compromissos / Desafios (-):**
  * O parser precisa decompor expressões com parênteses e funções sem perder a rastreabilidade visual de cada substituição.

---

## 5. Alternativas Consideradas e Motivo do Descarte
* **Alternativa A: Exibição passo a passo apenas por botões manuais (`[Próximo Passo]`):**
  * *Motivo do descarte:* A visualização completa de uma vez com animação em cascata dá visão holística da resolução sem exigir cliques repetitivos do usuário.
* **Alternativa B: Fazer a lógica de passos unicamente no JavaScript:**
  * *Motivo do descarte:* Quebraria a proposta do projeto em Python puro, impossibilitando que a versão de terminal (CLI) oferecesse o mesmo recurso educacional.
