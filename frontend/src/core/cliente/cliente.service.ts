import { api } from "../../lib/api";

export interface Cliente {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
}

export interface CriarClienteDTO {
  nome: string;
  telefone?: string;
  email?: string;
}

export interface AtualizarClienteDTO {
  nome: string;
  telefone?: string;
  email?: string;
}

export async function listarClientes(): Promise<Cliente[]> {
  const response = await api.get("/clientes");
  return response.data;
}

export async function obterClientePorId(id: string): Promise<Cliente> {
  const response = await api.get(`/clientes/${id}`);
  return response.data;
}

export async function criarCliente(
  payload: CriarClienteDTO
): Promise<Cliente> {
  const response = await api.post("/clientes", payload);
  return response.data;
}

export async function atualizarCliente(
  id: string,
  payload: AtualizarClienteDTO
): Promise<Cliente> {
  const response = await api.put(`/clientes/${id}`, payload);
  return response.data;
}

export async function excluirCliente(id: string): Promise<void> {
  await api.delete(`/clientes/${id}`);
}
