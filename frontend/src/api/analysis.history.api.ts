import api from "./index";

export async function fetchClientAnalyses(clientId: string) {
  const response = await api.get(`/clients/${clientId}/analyses`);
  return response.data;
}
