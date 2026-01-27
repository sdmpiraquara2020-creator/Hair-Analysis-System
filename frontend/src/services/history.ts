import { api } from "../lib/api";

export const getClientHistory = async (clientId: string) =>
  (await api.get(`/clients/${clientId}/history`)).data;
