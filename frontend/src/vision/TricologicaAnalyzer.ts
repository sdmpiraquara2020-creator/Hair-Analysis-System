import { VisionFrame } from "./types";
import {
  TricologicaFinding,
  SeverityLevel,
} from "./tricologica.types";
import { buildTricologicaFinding } from "./tricologica.heuristics";

export function analyzeTricologicaFrame(
  frame: VisionFrame
): {
  findings: TricologicaFinding[];
  totalScore: number;
  riskLevel: "BAIXO" | "MODERADO" | "ALTO";
} {
  const findings: TricologicaFinding[] = [];

  // 🔍 Heurísticas simuladas (substituíveis por IA real)
  if (Math.random() > 0.6) {
    findings.push(
      buildTricologicaFinding(
        "OLEOSIDADE",
        "MEDIO",
        "Presença de brilho excessivo em áreas pontuais."
      )
    );
  }

  if (Math.random() > 0.7) {
    findings.push(
      buildTricologicaFinding(
        "DESCAMACAO",
        "ALTO",
        "Descamação visível compatível com caspa aderente."
      )
    );
  }

  if (Math.random() > 0.5) {
    findings.push(
      buildTricologicaFinding(
        "RAREFACAO",
        "MEDIO",
        "Densidade reduzida em regiões específicas."
      )
    );
  }

  if (Math.random() > 0.8) {
    findings.push(
      buildTricologicaFinding(
        "INFLAMACAO",
        "ALTO",
        "Áreas avermelhadas compatíveis com inflamação."
      )
    );
  }

  const totalScore = findings.reduce(
    (sum, f) => sum + f.score,
    0
  );

  const riskLevel =
    totalScore <= 6
      ? "BAIXO"
      : totalScore <= 12
      ? "MODERADO"
      : "ALTO";

  return {
    findings,
    totalScore,
    riskLevel,
  };
}
