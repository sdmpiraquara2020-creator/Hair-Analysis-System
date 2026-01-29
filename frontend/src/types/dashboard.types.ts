export interface DashboardMetricsDTO {
  totalClients: number;
  totalAnalyses: number;
  totalProfessionals?: number;
  lastAnalyses: number;
}

export interface DashboardResponseDTO {
  metrics: DashboardMetricsDTO;
}
