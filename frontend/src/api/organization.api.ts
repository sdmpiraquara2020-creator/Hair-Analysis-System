import api from "./index";

export async function fetchOrganizations() {
  const response = await api.get("/organizations");
  return response.data;
}

export async function switchOrganization(orgId: string) {
  const response = await api.post(`/organizations/${orgId}/switch`);
  return response.data;
}
