import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useFeedback } from "../../context/FeedbackContext";

export default function CriarCliente() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useFeedback();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/clientes", {
        nome,
        telefone,
        email,
      });

      showSuccess("Cliente criado com sucesso!");

      setTimeout(() => {
        navigate("/clientes");
      }, 1500);
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      showError("Erro ao criar cliente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancelar() {
    navigate("/clientes");
  }

  return (
    <div>
      <h1>Criar Cliente</h1>
      <p>Cadastre um novo cliente</p>

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
