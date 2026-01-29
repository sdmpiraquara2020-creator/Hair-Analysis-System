import { AlertaInteligente } from "../rules/alertas";
import { ResultadoCapilar } from "../types/ResultadoCapilar";
import { carregarPesos, salvarPesos } from "./storagePesos";
import { PesosIA } from "./pesosIA";

export interface AlertaPriorizado extends AlertaInteligente {
  prioridade: number;
  motivoIA: string[];
}

export function priorizarAlertas(
  alertas: AlertaInteligente[],
  resultados: ResultadoCapilar[]
): AlertaPriorizado[] {
  const pesos = carregarPesos();

  return alertas
    .map((alerta) => {
      const resultado = resultados.find(
        (r) => r.id === alerta.id.split("-")[0]
      );

      let prioridade = 0;
      const motivos: string[] = [];

      // Severidade
      if (alerta.severidade === "critico") {
        prioridade += pesos.severidadeCritica;
        motivos.push("Severidade crítica");
      } else if (alerta.severidade === "atencao") {
        prioridade += pesos.severidadeAtencao;
        motivos.push("Severidade de atenção");
      } else {
        prioridade += pesos.severidadeInfo;
        motivos.push("Severidade informativa");
      }

      // Score
      if (resultado && resultado.scoreSaude < 50) {
        prioridade += pesos.scoreBaixo;
        motivos.push("Score abaixo de 50%");
      } else if (resultado && resultado.scoreSaude < 70) {
        prioridade += pesos.scoreMedio;
        motivos.push("Score abaixo de 70%");
      }

      // Risco
      if (resultado?.nivelRisco === "Alto") {
        prioridade += pesos.riscoAlto;
        motivos.push("Risco técnico alto");
      }

      // Alertas múltiplos
      if ((resultado?.alertas?.length ?? 0) >= 3) {
        prioridade += pesos.alertasMultiplos;
        motivos.push("Múltiplos alertas");
      }

      // Recência
      const dias =
        resultado &&
        (Date.now() - new Date(resultado.dataAnalise).getTime()) /
          (1000 * 60 * 60 * 24);

      if (dias !== undefined && dias <= 7) {
        prioridade += pesos.analiseRecente;
        motivos.push("Análise recente");
      }

      return { ...alerta, prioridade, motivoIA: motivos };
    })
    .sort((a, b) => b.prioridade - a.prioridade);
}

/**
 * Feedback supervisionado:
 * positivo = true  → aumenta pesos relevantes
 * positivo = false → reduz pesos relevantes
 */
export function aplicarFeedbackIA(
  pesos: PesosIA,
  positivo: boolean
): PesosIA {
  const fator = positivo ? 1.05 : 0.95;

  const novosPesos: PesosIA = {
    severidadeCritica: Math.round(pesos.severidadeCritica * fator),
    severidadeAtencao: Math.round(pesos.severidadeAtencao * fator),
    severidadeInfo: Math.round(pesos.severidadeInfo * fator),

    scoreBaixo: Math.round(pesos.scoreBaixo * fator),
    scoreMedio: Math.round(pesos.scoreMedio * fator),

    riscoAlto: Math.round(pesos.riscoAlto * fator),
    alertasMultiplos: Math.round(pesos.alertasMultiplos * fator),
    analiseRecente: Math.round(pesos.analiseRecente * fator),
  };

  salvarPesos(novosPesos);
  return novosPesos;
}
