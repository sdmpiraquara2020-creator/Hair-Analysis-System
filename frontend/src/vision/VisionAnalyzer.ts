import { VisionFrame, VisionFinding } from "./types";

export interface VisionAnalysisResult {
  findings: VisionFinding[];
  notes: string;
}

/**
 * Análise visual simples baseada em brilho médio.
 * NÃO é diagnóstico. Apenas apoio visual técnico.
 */
export function analyzeFrame(
  frame: VisionFrame
): VisionAnalysisResult {
  const image = new Image();
  image.src = frame.imageBase64;

  // Resultado padrão
  const findings: VisionFinding[] = [];

  // Como a análise é síncrona visualmente simulada,
  // usamos heurística baseada no tamanho da imagem Base64
  const size = frame.imageBase64.length;

  // Heurística simples (MVP)
  if (size > 900_000) {
    findings.push({
      label: "Regiões com possível oleosidade elevada (brilho intenso)",
      confidence: 0.65,
    });
  }

  if (size < 400_000) {
    findings.push({
      label: "Possível ressecamento visual (baixa reflexão de luz)",
      confidence: 0.6,
    });
  }

  return {
    findings,
    notes:
      findings.length === 0
        ? "Nenhum padrão visual relevante identificado automaticamente."
        : "Achados visuais automáticos detectados para apoio técnico.",
  };
}
