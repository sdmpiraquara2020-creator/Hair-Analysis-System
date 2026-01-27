import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import ConfirmModal from "../../components/ConfirmModal";
import { useFeedback } from "../../context/FeedbackContext";

interface Cliente {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
}

export default function ListagemClientes() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useFeedback();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [clienteParaExcluir, setClienteParaExcluir] =
    useState<Cliente | null>(null);

  async function carregarClientes() {
    try {
      const response = await api.get("/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      showError("Erro ao carregar clientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  async function confirmarExclusao() {
    if (!clienteParaExcluir) return;

    try {
      setExcluindoId(clienteParaExcluir.id);

      await api.delete(`/clientes/${clienteParaExcluir.id}`);

      setClientes((prev) =>
        prev.filter((c) => c.id !== clienteParaExcluir.id)
      );

      showSuccess("Cliente excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      showError("Erro ao excluir cliente.");
    } finally {
      setExcluindoId(null);
      setClienteParaExcluir(null);
    }
  }

  if (loading) {
    return <p>Carregando clientes...</p>;
  }

  return (
    <div>
      <h1>Clientes</h1>
      <p>Gerencie seus clientes cadastrados</p>

      <div style={{ marginBottom: 16 }}>
        <button onClick={() => navigate("/clientes/criar")}>
          Criar Cliente
        </button>
      </div>

      {clientes.length === 0 ? (
        <p>Nenhum cliente encontrado.</p>
      ) : (
        <table
          width="100%"
          cellPadding={8}
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th align="left">Nome</th>
              <th align="left">Telefone</th>
              <th align="left">Email</th>
              <th align="left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.telefone || "-"}</td>
                <td>{cliente.email || "-"}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/clientes/${cliente.id}/editar`)
                    }
                    style={{ marginRight: 8 }}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => setClienteParaExcluir(cliente)}
                    disabled={excluindoId === cliente.id}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {clienteParaExcluir && (
        <ConfirmModal
          title="Excluir cliente"
          message={`Deseja realmente excluir o cliente "${clienteParaExcluir.nome}"?`}
          confirmText="Excluir"
          onCancel={() => setClienteParaExcluir(null)}
          onConfirm={confirmarExclusao}
          loading={excluindoId === clienteParaExcluir.id}
        />
      )}
    </div>
  );
}
