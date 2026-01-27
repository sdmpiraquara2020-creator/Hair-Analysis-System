import axios from "axios";

const API_URL = "http://localhost:3333/api";

export interface ClinicalReport {
  id: string;
  clientName: string;
  createdAt: string;
  summary: {
    hairHealthScore: number;
    scalpHealthScore?: number;
    alerts: string[];
  };
}

export interface SignClinicalReportPayload {
  reportId: string;
  professionalName: string;
  professionalDocument?: string;
}

export async function getClinicalReports(): Promise<ClinicalReport[]> {
  const response = await axios.get(`${API_URL}/reports`);
  return response.data ?? [];
}

export async function getClinicalReportById(
  reportId: string
): Promise<ClinicalReport> {
  const response = await axios.get(`${API_URL}/reports/${reportId}`);
  return response.data;
}

export async function signClinicalReport(
  payload: SignClinicalReportPayload
): Promise<{ success: boolean; qrCodeUrl: string }> {
  const response = await axios.post(
    `${API_URL}/reports/sign`,
    payload
  );
  return response.data;
}
