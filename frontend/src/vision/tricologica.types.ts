export type TricologicaFactor =
  | "OLEOSIDADE"
  | "DESCAMACAO"
  | "RAREFACAO"
  | "SENSIBILIDADE"
  | "INFLAMACAO";

export type SeverityLevel = "BAIXO" | "MEDIO" | "ALTO";

export interface TricologicaFinding {
  factor: TricologicaFactor;
  severity: SeverityLevel;
  score: number;
  description: string;
}
