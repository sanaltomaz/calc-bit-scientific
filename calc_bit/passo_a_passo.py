"""
Módulo: calc_bit.passo_a_passo
Descrição: Avaliador de expressões matemáticas com suporte a parênteses,
funções científicas e geração detalhada do passo a passo de resolução (PEMDAS).
"""

from dataclasses import dataclass, field
import re
from typing import List, Optional, Tuple

from calc_bit.operacoes import dividir, multiplicar, somar, subtrair
from calc_bit.cientifica import (
    EULER,
    PI,
    cosseno,
    fatorial,
    ln,
    log10,
    modulo,
    potencia,
    quadrado,
    raiz_quadrada,
    seno,
    tangente,
)


@dataclass
class EtapaResolucao:
    """Representa um único passo didático na resolução de uma expressão."""

    ordem: int
    expressao_antes: str
    operacao_atual: str
    regra_aplicada: str
    dica_python: str
    resultado_parcial: float
    expressao_depois: str


@dataclass
class RelatorioResolucao:
    """Relatório completo da resolução passo a passo de uma expressão."""

    expressao_original: str
    resultado_final: Optional[float] = None
    etapas: List[EtapaResolucao] = field(default_factory=list)
    sucesso: bool = True
    erro: Optional[str] = None
    explicacao_erro: Optional[str] = None


def formatar_num(valor: float) -> str:
    """Formata um número removendo casas decimais desnecessárias (.0)."""
    if isinstance(valor, float) and valor.is_integer():
        return str(int(valor))
    arredondado = round(float(valor), 8)
    if arredondado.is_integer():
        return str(int(arredondado))
    return str(arredondado)


_PADRAO_NUMERO = r"-?\d+(?:\.\d+)?"
_PADRAO_FUNCAO = re.compile(
    rf"\b(sqrt|raiz_quadrada|quadrado|fatorial|fat|sin|seno|cos|cosseno|tan|tangente|log10|log|ln)\(\s*({_PADRAO_NUMERO})\s*\)",
    re.IGNORECASE,
)
_PADRAO_POTENCIA = re.compile(rf"({_PADRAO_NUMERO})\s*(?:\^|\*\*)\s*({_PADRAO_NUMERO})")
_PADRAO_MULT_DIV = re.compile(rf"({_PADRAO_NUMERO})\s*(\*|/|%)\s*({_PADRAO_NUMERO})")
_PADRAO_SOMA_SUB = re.compile(rf"({_PADRAO_NUMERO})\s*(\+|-)\s*({_PADRAO_NUMERO})")
_PADRAO_PARENTESES_INTERNOS = re.compile(r"\(([^()]+)\)")
_PADRAO_PARENTESES_NUMERO = re.compile(rf"\(\s*({_PADRAO_NUMERO})\s*\)")


def _executar_funcao_unaria(nome: str, valor: float) -> Tuple[float, str, str]:
    """Executa uma função científica unária e retorna (resultado, regra, dica_python)."""
    fn = nome.lower()
    val_str = formatar_num(valor)
    if fn in ("sqrt", "raiz_quadrada"):
        return (
            raiz_quadrada(valor),
            "Funções científicas e raízes têm prioridade antes das operações básicas",
            f"raiz_quadrada({val_str})",
        )
    if fn == "quadrado":
        return (
            float(quadrado(valor)),
            "Elevação ao quadrado resolvida antes das operações aritméticas",
            f"quadrado({val_str})",
        )
    if fn in ("fatorial", "fat"):
        return (
            float(fatorial(valor)),
            f"Fatorial multiplica os inteiros de {val_str} até 1",
            f"fatorial({val_str})",
        )
    if fn in ("sin", "seno"):
        return (
            seno(valor),
            f"Seno trigonométrico converte {val_str}° para radianos",
            f"seno({val_str})",
        )
    if fn in ("cos", "cosseno"):
        return (
            cosseno(valor),
            f"Cosseno trigonométrico converte {val_str}° para radianos",
            f"cosseno({val_str})",
        )
    if fn in ("tan", "tangente"):
        return (
            tangente(valor),
            f"Tangente trigonométrica calculada para o ângulo de {val_str}°",
            f"tangente({val_str})",
        )
    if fn in ("log10", "log"):
        return (
            log10(valor),
            f"Logaritmo na base 10 busca o expoente de 10 que resulta em {val_str}",
            f"log10({val_str})",
        )
    if fn == "ln":
        return (
            ln(valor),
            f"Logaritmo natural (base e) calculado para {val_str}",
            f"ln({val_str})",
        )
    raise ValueError(f"Erro: Função '{nome}' não reconhecida.")


def _avaliar_um_passo_sem_parenteses(
    sub_expr: str, dentro_parenteses: bool
) -> Optional[Tuple[int, int, str, float, str, str]]:
    """
    Localiza a próxima operação de maior precedência dentro de `sub_expr` (sem parênteses).
    Retorna (inicio, fim, texto_operacao, resultado, regra, dica_python) ou None se já for número.
    """
    prefixo_regra = "Dentro dos parênteses: " if dentro_parenteses else "Precedência PEMDAS: "

    # 1.Potenciação (^ ou **)
    match_pot = _PADRAO_POTENCIA.search(sub_expr)
    if match_pot:
        a = float(match_pot.group(1))
        b = float(match_pot.group(2))
        res = potencia(a, b)
        return (
            match_pot.start(),
            match_pot.end(),
            match_pot.group(0).strip(),
            res,
            f"{prefixo_regra}Potenciação (expoentes) é calculada antes de multiplicação, divisão, soma e subtração",
            f"potencia({formatar_num(a)}, {formatar_num(b)}) -> {formatar_num(res)}",
        )

    # 2. Multiplicação, Divisão ou Módulo (*, /, %)
    match_md = _PADRAO_MULT_DIV.search(sub_expr)
    if match_md:
        a = float(match_md.group(1))
        op = match_md.group(2)
        b = float(match_md.group(3))
        if op == "*":
            res = float(multiplicar(a, b))
            regra = f"{prefixo_regra}Multiplicação tem prioridade sobre adição e subtração"
            dica = f"multiplicar({formatar_num(a)}, {formatar_num(b)}) -> {formatar_num(res)}"
        elif op == "/":
            res = dividir(a, b)
            regra = f"{prefixo_regra}Divisão tem prioridade sobre adição e subtração"
            dica = f"dividir({formatar_num(a)}, {formatar_num(b)}) -> {formatar_num(res)}"
        else:
            res = float(modulo(a, b))
            regra = f"{prefixo_regra}Resto da divisão (módulo) tem mesma prioridade que divisão"
            dica = f"modulo({formatar_num(a)}, {formatar_num(b)}) -> {formatar_num(res)}"
        return (
            match_md.start(),
            match_md.end(),
            match_md.group(0).strip(),
            res,
            regra,
            dica,
        )

    # 3. Adição ou Subtração (+, -), ignorando o sinal negativo inicial do primeiro número
    match_as = _PADRAO_SOMA_SUB.search(sub_expr)
    if match_as:
        a = float(match_as.group(1))
        op = match_as.group(2)
        b = float(match_as.group(3))
        if op == "+":
            res = float(somar(a, b))
            regra = f"{prefixo_regra}Adição resolvida da esquerda para a direita"
            dica = f"somar({formatar_num(a)}, {formatar_num(b)}) -> {formatar_num(res)}"
        else:
            res = float(subtrair(a, b))
            regra = f"{prefixo_regra}Subtração resolvida da esquerda para a direita"
            dica = f"subtrair({formatar_num(a)}, {formatar_num(b)}) -> {formatar_num(res)}"
        return (
            match_as.start(),
            match_as.end(),
            match_as.group(0).strip(),
            res,
            regra,
            dica,
        )

    return None


def _validar_parenteses(expressao: str) -> None:
    """Verifica se todos os parênteses abertos e fechados estão balanceados."""
    saldo = 0
    for char in expressao:
        if char == "(":
            saldo += 1
        elif char == ")":
            saldo -= 1
            if saldo < 0:
                raise ValueError("Erro de Sintaxe: Parêntese ')' fechado sem um '(' correspondente!")
    if saldo > 0:
        raise ValueError(f"Erro de Sintaxe: Faltou fechar {saldo} parêntese(s) ')' na expressão!")
    if "()" in expressao.replace(" ", ""):
        raise ValueError("Erro de Sintaxe: Parênteses vazios '()' não são permitidos!")


def resolver_passo_a_passo(expressao: str) -> RelatorioResolucao:
    """
    Resolve uma expressão matemática passo a passo seguindo a ordem PEMDAS,
    registrando cada etapa intermediária para exibição didática na lousa.
    """
    limpa = expressao.strip().replace("×", "*").replace("÷", "/")
    if not limpa:
        return RelatorioResolucao(
            expressao_original=expressao,
            sucesso=False,
            erro="Expressão vazia",
            explicacao_erro="Digite uma expressão matemática na calculadora para ver o passo a passo.",
        )

    etapas: List[EtapaResolucao] = []
    atual = limpa
    ordem = 1

    try:
        _validar_parenteses(atual)

        # Substituição inicial de constantes pi e e se presentes como palavras/símbolos isolados
        if re.search(r"(?:π|\bpi\b|\be\b)", atual, re.IGNORECASE):
            antes_const = atual
            atual = re.sub(r"π|\bpi\b", formatar_num(PI), atual, flags=re.IGNORECASE)
            atual = re.sub(r"\be\b", formatar_num(EULER), atual, flags=re.IGNORECASE)
            if atual != antes_const:
                etapas.append(
                    EtapaResolucao(
                        ordem=ordem,
                        expressao_antes=antes_const,
                        operacao_atual="Constantes (π / e)",
                        regra_aplicada="Substituímos as constantes matemáticas pelos seus valores numéricos reais",
                        dica_python=f"math.pi = {formatar_num(PI)}, math.e = {formatar_num(EULER)}",
                        resultado_parcial=PI if "pi" in antes_const.lower() or "π" in antes_const else EULER,
                        expressao_depois=atual,
                    )
                )
                ordem += 1

        # Loop de redução passo a passo (limite de segurança de 30 passos)
        for _ in range(30):
            # 1. Funções científicas com um número já resolvido no argumento: ex: sqrt(144)
            match_fn = _PADRAO_FUNCAO.search(atual)
            if match_fn:
                nome_fn = match_fn.group(1)
                arg_val = float(match_fn.group(2))
                res, regra, dica = _executar_funcao_unaria(nome_fn, arg_val)
                res_str = formatar_num(res)
                depois = (atual[: match_fn.start()] + res_str + atual[match_fn.end() :]).strip()
                etapas.append(
                    EtapaResolucao(
                        ordem=ordem,
                        expressao_antes=atual,
                        operacao_atual=match_fn.group(0),
                        regra_aplicada=regra,
                        dica_python=f"{dica} -> {res_str}",
                        resultado_parcial=res,
                        expressao_depois=depois,
                    )
                )
                atual = depois
                ordem += 1
                continue

            # 2. Simplifica parênteses que já contêm apenas um único número: ex: (6) -> 6
            match_par_num = _PADRAO_PARENTESES_NUMERO.search(atual)
            if match_par_num:
                # Verifica se não é argumento de uma função ainda não resolvida
                inicio_p = match_par_num.start()
                prefixo = atual[:inicio_p].rstrip()
                if not re.search(r"[a-zA-Z0-9_]$", prefixo):
                    atual = (
                        atual[: match_par_num.start()]
                        + match_par_num.group(1)
                        + atual[match_par_num.end() :]
                    ).strip()
                    continue

            # 3. Procura o par de parênteses mais interno que contenha operações
            match_par = _PADRAO_PARENTESES_INTERNOS.search(atual)
            if match_par:
                conteudo = match_par.group(1)
                passo = _avaliar_um_passo_sem_parenteses(conteudo, dentro_parenteses=True)
                if passo:
                    ini, fim, op_str, res, regra, dica = passo
                    res_str = formatar_num(res)
                    novo_conteudo = conteudo[:ini] + res_str + conteudo[fim:]
                    # Se o novo conteúdo já é um número único e não é argumento de função, remove os parênteses
                    prefixo_par = atual[: match_par.start()].rstrip()
                    eh_arg_funcao = bool(re.search(r"[a-zA-Z_][a-zA-Z0-9_]*$", prefixo_par))
                    if re.fullmatch(rf"\s*{_PADRAO_NUMERO}\s*", novo_conteudo) and not eh_arg_funcao:
                        substituto = novo_conteudo.strip()
                    else:
                        substituto = f"({novo_conteudo.strip()})"

                    depois = (
                        atual[: match_par.start()] + substituto + atual[match_par.end() :]
                    ).strip()
                    etapas.append(
                        EtapaResolucao(
                            ordem=ordem,
                            expressao_antes=atual,
                            operacao_atual=f"({op_str})" if op_str == conteudo.strip() else op_str,
                            regra_aplicada=regra,
                            dica_python=dica,
                            resultado_parcial=res,
                            expressao_depois=depois,
                        )
                    )
                    atual = depois
                    ordem += 1
                    continue

            # 4. Avalia a próxima operação fora de parênteses segundo PEMDAS
            passo_global = _avaliar_um_passo_sem_parenteses(atual, dentro_parenteses=False)
            if passo_global:
                ini, fim, op_str, res, regra, dica = passo_global
                res_str = formatar_num(res)
                depois = (atual[:ini] + res_str + atual[fim:]).strip()
                etapas.append(
                    EtapaResolucao(
                        ordem=ordem,
                        expressao_antes=atual,
                        operacao_atual=op_str,
                        regra_aplicada=regra,
                        dica_python=dica,
                        resultado_parcial=res,
                        expressao_depois=depois,
                    )
                )
                atual = depois
                ordem += 1
                continue

            break

        # Valida se sobrou um único número final
        valor_final = float(atual.strip())
        return RelatorioResolucao(
            expressao_original=limpa,
            resultado_final=valor_final,
            etapas=etapas,
            sucesso=True,
        )

    except ZeroDivisionError as erro:
        return RelatorioResolucao(
            expressao_original=limpa,
            etapas=etapas,
            sucesso=False,
            erro=str(erro),
            explicacao_erro=(
                "Na matemática, dividir qualquer número por zero é indefinido porque não existe "
                "nenhum número que multiplicado por 0 resulte no dividendo. Em Python, isso dispara "
                "a exceção nativa ZeroDivisionError."
            ),
        )
    except ValueError as erro:
        msg = str(erro)
        if "could not convert" in msg:
            msg = "Erro de Sintaxe: Verifique se há operadores duplicados ou caracteres inválidos."
        return RelatorioResolucao(
            expressao_original=limpa,
            etapas=etapas,
            sucesso=False,
            erro=msg,
            explicacao_erro=(
                "Essa operação está fora do domínio dos números reais ou possui parênteses/operadores "
                "incompletos. Em Python, validamos a entrada e levantamos ValueError para proteger o cálculo."
            ),
        )
