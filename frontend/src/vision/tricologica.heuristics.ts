import {
  TricologicaFinding,
  TricologicaFactor,
  SeverityLevel,
} from "./tricologica.types";

const FACTOR_WEIGHTS: Record<TricologicaFactor, number> = {
  OLEOSIDADE: 2,
  DESCAMACAO: 2,
  RAREFACAO: 3,
  SENSIBILIDADE: 1,
  INFLAMACAO: 3,
};

const SEVERITY_SCORE: Record<SeverityLevel, number> = {
  BAIXO: 1,
  MEDIO: 2,
  ALTO: 3,
};

export function buildTricologicaFinding(
  factor: TricologicaFactor,
  severity: SeverityLevel,
  description: string
): TricologicaFinding {
  const weight = FACTOR_WEIGHTS[factor];
  const baseScore = SEVERITY_SCORE[severity];

  return {
    factor,
    severity,
    description,
    score: weight * baseScore,
  };
}
