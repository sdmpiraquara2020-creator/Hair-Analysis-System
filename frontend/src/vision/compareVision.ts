import { VisionHistoryItem } from "./VisionHistory.types";

export type VisualStatus = "melhora" | "estavel" | "piora";

export interface VisualComparisonResult {
  status: VisualStatus;
  resumo: string;
}

export function compararVision(
  anterior: VisionHistoryItem,
  atual: VisionHistoryItem
): VisualComparisonResult {
  const a = anterior.findings.length;
  const b = atual.findings.length;

  if (b < a) {
    return {
      status: "melhora",
      resumo: "Redução de achados visuais em relação ao registro anterior.",
    };
  }

  if (b > a) {
    return {
      status: "piora",
      resumo: "Aumento de achados visuais em relação ao registro anterior.",
    };
  }

  return {
    status: "estavel",
    resumo: "Quantidade de achados visuais mantida entre os registros.",
  };
}
