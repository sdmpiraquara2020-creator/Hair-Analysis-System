import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/layout/TopBar";

interface Cliente {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  cpf?: string;
}

const EditarCliente: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/api/clientes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCliente(data);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!cliente) return;
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const salvarCliente = async () => {
    if (!cliente) return;

    setSalvando(true);

    await fetch(`http://localhost:3000/api/clientes/${cliente.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
    });

    setSalvando(false);
    navigate("/clientes");
  };

  if (loading) {
    return (
      <>
        <TopBar />
        <main style={{ padding: "32px" }}>Carregando cliente...</main>
      </>
    );
  }

  return (
    <>
      <TopBar />

      <main
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "32px",
        }}
      >
        {/* VOLTAR */}
        <button
          onClick={() => navigate("/clientes")}
          style={{
            marginBottom: "24px",
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            background: "#fff",
            color: "#2563eb",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Voltar para clientes
        </button>

        <h1 style={{ marginBottom: "24px" }}>Editar cliente</h1>

        <div style={{ display: "grid", gap: "16px" }}>
          <div>
            <label>Nome</label>
            <input
              name="nome"
              value={cliente?.nome || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label>Telefone</label>
            <input
              name="telefone"
              value={cliente?.telefone || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label>Email</label>
            <input
              name="email"
              value={cliente?.email || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label>CPF</label>
            <input
              name="cpf"
              value={cliente?.cpf || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <button
            onClick={salvarCliente}
            disabled={salvando}
            style={{
              marginTop: "16px",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: "#16a34a",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </main>
    </>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

export default EditarCliente;
