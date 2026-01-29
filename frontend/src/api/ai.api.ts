import api from "./index";

export async function generateClinicalReport(payload: any) {
  const response = await api.post("/ai/clinical-report", payload);
  return response.data;
}
