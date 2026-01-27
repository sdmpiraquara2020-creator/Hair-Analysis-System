import api from "./index";

export async function createClinicalAnalysis(payload: any) {
  const response = await api.post("/analysis/clinical", payload);
  return response.data;
}
