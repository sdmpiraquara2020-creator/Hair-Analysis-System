import { PesosIA } from "./pesosIA";
import { FeedbackRegistro } from "./historicoFeedback";

export interface SugestaoAjuste {
  campo: keyof PesosIA;
  ajustePercentual: number;
  motivo: string;
}

/**
 * Analisa feedback acumulado e sugere ajustes.
 * NÃO aplica nada automaticamente.
 */
export function gerarSugestoes(
  pesos: PesosIA,
  feedbacks: FeedbackRegistro[]
): SugestaoAjuste[] {
  if (feedbacks.length < 5) return [];

  const positivos = feedbacks.filter((f) => f.positivo).length;
  const negativos = feedbacks.filter((f) => !f.positivo).length;

  const taxaPositiva = positivos / feedbacks.length;

  const sugestoes: SugestaoAjuste[] = [];

  if (taxaPositiva > 0.75) {
    sugestoes.push({
      campo: "severidadeCritica",
      ajustePercentual: +10,
      motivo:
        "Alta taxa de feedback positivo indica boa priorização de casos críticos.",
    });
  }

  if (taxaPositiva < 0.4) {
    sugestoes.push({
      campo: "scoreBaixo",
      ajustePercentual: -10,
      motivo:
        "Feedback negativo recorrente sugere excesso de peso para score baixo.",
    });
  }

  if (negativos > positivos) {
    sugestoes.push({
      campo: "alertasMultiplos",
      ajustePercentual: -5,
      motivo:
        "Muitos alertas similares sendo marcados como pouco relevantes.",
    });
  }

  return sugestoes;
}
