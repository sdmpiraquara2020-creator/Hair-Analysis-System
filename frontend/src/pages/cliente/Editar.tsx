import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useFeedback } from "../../context/FeedbackContext";

export default function EditarCliente() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showSuccess, showError } = useFeedback();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarCliente() {
      try {
        const response = await api.get(`/clientes/${id}`);
        setNome(response.data.nome);
        setTelefone(response.data.telefone || "");
        setEmail(response.data.email || "");
      } catch (error) {
        console.error("Erro ao carregar cliente:", error);
        showError("Erro ao carregar cliente.");
        navigate("/clientes");
      } finally {
        setCarregando(false);
      }
    }

    if (id) carregarCliente();
  }, [id, navigate, showError]);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/clientes/${id}`, {
        nome,
        telefone,
        email,
      });

      showSuccess("Cliente atualizado com sucesso!");

      setTimeout(() => {
        navigate("/clientes");
      }, 1500);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      showError("Erro ao atualizar cliente.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancelar() {
    navigate("/clientes");
  }

  if (carregando) {
    return <p>Carregando cliente...</p>;
  }

  return (
    <div>
      <h1>Editar Cliente</h1>
      <p>Atualize os dados do cliente</p>

      <form onSubmit={handleSalvar} style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: 12 }}>
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Telefone</label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </button>

          <button type="button" onClick={handleCancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
