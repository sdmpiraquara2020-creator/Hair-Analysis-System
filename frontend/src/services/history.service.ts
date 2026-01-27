import { api } from './api';

export async function obterHistoricoCliente(
  clienteId: string | number
) {
  const response = await api.get(`/clientes/${clienteId}/historico`);
  return response.data;
}
