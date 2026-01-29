import axios from "axios";

export interface DashboardSummaryResponse {
  totalAnalyses: number;
  activeClients: number;
  averageEvolution: number;
  activeAlerts: number;
  trichology?: {
    scalpType?: string;
    sensitivity?: string;
    density?: string;
    risk?: "normal" | "alerta" | "critico";
    recommendation?: string;
  };
}

export async function getDashboardSummary(period = 30) {
  const response = await axios.get<DashboardSummaryResponse>(
    `/api/dashboard/summary?period=${period}`
  );

  return response.data;
}
