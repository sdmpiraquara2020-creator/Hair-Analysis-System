import api from "./api";

export type AnalysisType = "tricologica" | "capilar";

export interface AnalysisHistory {
  id: string;
  clientId: string;
  analysisType: AnalysisType;
  signals: Record<string, string>;
  score: number;
  flags: string[];
  interpretation: string;
  createdAt: string;
}

/**
 * Retorna o histórico completo de análises de um cliente
 */
export async function getHistoryByClient(
  clientId: string
): Promise<AnalysisHistory[]> {
  const response = await api.get<AnalysisHistory[]>(
    `/history/client/${clientId}`
  );
  return response.data;
}

/**
 * Retorna uma análise específica pelo ID
 */
export async function getHistoryById(
  historyId: string
): Promise<AnalysisHistory> {
  const response = await api.get<AnalysisHistory>(
    `/history/${historyId}`
  );
  return response.data;
}
