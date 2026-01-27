import api from "./index";

export async function fetchHistory(clientId: string) {
  const res = await api.get(`/history/${clientId}`);
  return res.data;
}

export async function compareHistory(baseId: string, targetId: string) {
  const res = await api.get(
    `/history/compare?baseId=${baseId}&targetId=${targetId}`
  );
  return res.data;
}
