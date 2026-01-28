import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/layout/TopBar";
import { useCliente } from "../../context/ClienteProvider";

const NovoCliente: React.FC = () => {
  const navigate = useNavigate();
  const { setClienteSelecionado } = useCliente();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      const response = await fetch("http://localhost:3000/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          telefone,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar cliente");
      }

      const clienteCriado = await response.json();

      // ✅ cliente ativo na sessão
      setClienteSelecionado(clienteCriado);

      // 🔁 volta para o dashboard
      navigate("/");
    } catch (error) {
      setErro("Não foi possível criar o cliente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar />

      <main
        style={{
          padding: "32px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>
          Criar novo cliente
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "4px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Telefone</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "4px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "4px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          {erro && (
            <p style={{ color: "#dc2626", marginBottom: "16px" }}>{erro}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#047857",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {loading ? "Salvando..." : "Criar cliente"}
          </button>
        </form>
      </main>
    </>
  );
};

export default NovoCliente;
