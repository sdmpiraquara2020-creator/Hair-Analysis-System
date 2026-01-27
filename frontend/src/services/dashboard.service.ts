import { api } from "../lib/api";

export interface DashboardAdminDTO {
  totalClientes: number;
  totalAnalises: number;
  totalEvolucoes: number;
}

export async function obterDashboardAdmin(): Promise<DashboardAdminDTO> {
  const response = await api.get("/dashboard/admin");
  return response.data;
}
