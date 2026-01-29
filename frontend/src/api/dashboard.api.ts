import api from "./index";

export async function fetchAdminDashboard() {
  const response = await api.get("/dashboard/admin");
  return response.data;
}

export async function fetchProfessionalDashboard() {
  const response = await api.get("/dashboard/professional");
  return response.data;
}
