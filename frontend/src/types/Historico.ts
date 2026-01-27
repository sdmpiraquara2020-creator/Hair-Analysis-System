export type TipoHistorico = "ANALISE" | "EVOLUCAO";

export interface HistoricoItem {
  id: string;
  clienteId: string;
  tipo: TipoHistorico;
  titulo: string;
  descricao: string;
  criadoEm: string;
}
