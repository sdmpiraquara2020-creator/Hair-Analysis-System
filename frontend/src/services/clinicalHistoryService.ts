// frontend/src/services/clinicalHistoryService.ts
import axios from "axios";

export interface ClinicalHistoryItem {
  id: string;
  clientName: string;
  createdAt: string;
  hairHealth: number;
  scalpHealth?: number;
  observations?: string;
}

export interface ClinicalHistoryComparison {
  baseReport: ClinicalHistoryItem;
  comparedReport: ClinicalHistoryItem;
  evolution: {
    hairHealthDiff: number;
    scalpHealthDiff?: number;
  };
}

export async function getClinicalHistory(
  clientId: string
): Promise<ClinicalHistoryItem[]> {
  const response = await axios.get(`/api/reports/history/${clientId}`);
  return Array.isArray(response.data) ? response.data : [];
}

export async function compareClinicalReports(
  baseReportId: string,
  comparedReportId: string
): Promise<ClinicalHistoryComparison> {
  const response = await axios.post("/api/reports/compare", {
    baseReportId,
    comparedReportId,
  });

  return response.data;
}
