export type NivelRisco = "Baixo" | "Médio" | "Alto";
export type ViewMode = "cliente" | "tecnico";

export interface ResultadoCapilar {
  id: string;

  clienteNome: string;
  profissionalNome: string;
  dataAnalise: string;

  diagnosticoGeral: string;
  scoreSaude: number;
  nivelRisco: NivelRisco;

  alertas?: string[] | null;
  tratamentosRecomendados?: string[] | null;

  observacoesTecnicas?: string;
}

