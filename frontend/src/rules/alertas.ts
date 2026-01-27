import { ResultadoCapilar } from "../types/ResultadoCapilar";

export type SeveridadeAlerta = "info" | "atencao" | "critico";

export interface AlertaInteligente {
  id: string;
  titulo: string;
  descricao: string;
  severidade: SeveridadeAlerta;
  clienteNome: string;
  dataAnalise: string;
}

/**
 * Motor determinístico de alertas.
 * Fácil de auditar, explicar e evoluir.
 */
export function gerarAlertas(
  resultados: ResultadoCapilar[]
): AlertaInteligente[] {
  const alertas: AlertaInteligente[] = [];

  resultados.forEach((r) => {
    // Regra 1: Score crítico
    if (r.scoreSaude <= 45) {
      alertas.push({
        id: `${r.id}-score-critico`,
        titulo: "Score crítico de saúde capilar",
        descricao:
          "Score abaixo de 45%. Alto risco de quebra ou dano severo.",
        severidade: "critico",
        clienteNome: r.clienteNome,
        dataAnalise: r.dataAnalise,
      });
    }

    // Regra 2: Risco alto
    if (r.nivelRisco === "Alto") {
      alertas.push({
        id: `${r.id}-risco-alto`,
        titulo: "Risco técnico elevado",
        descricao:
          "Classificação de risco alto identificada na análise.",
        severidade: "atencao",
        clienteNome: r.clienteNome,
        dataAnalise: r.dataAnalise,
      });
    }

    // Regra 3: Muitos alertas técnicos
    if ((r.alertas?.length ?? 0) >= 3) {
      alertas.push({
        id: `${r.id}-multiplos-alertas`,
        titulo: "Múltiplos danos identificados",
        descricao:
          "Três ou mais alertas técnicos detectados no mesmo fio.",
        severidade: "atencao",
        clienteNome: r.clienteNome,
        dataAnalise: r.dataAnalise,
      });
    }

    // Regra 4: Tratamento ausente
    if ((r.tratamentosRecomendados?.length ?? 0) === 0) {
      alertas.push({
        id: `${r.id}-sem-tratamento`,
        titulo: "Tratamento não definido",
        descricao:
          "Nenhum plano de tratamento foi definido para esta análise.",
        severidade: "info",
        clienteNome: r.clienteNome,
        dataAnalise: r.dataAnalise,
      });
    }
  });

  return alertas;
}
