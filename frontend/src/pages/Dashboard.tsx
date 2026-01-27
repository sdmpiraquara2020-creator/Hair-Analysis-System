import { useNavigate } from "react-router-dom";
import { useAnalysisHistory } from "../context/AnalysisHistoryContext";
import { useCliente } from "../context/ClienteContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { historico } = useAnalysisHistory();
  const { cliente } = useCliente();

  const totalAnalises = historico.length;

  return (
    <section style={{ padding: 32, maxWidth: 1200 }}>
      {/* Cabeçalho */}
      <header style={{ marginBottom: 24 }}>
        <h1>Dashboard</h1>
        <p style={{ color: "#6b7280", maxWidth: 720 }}>
          Painel de acompanhamento do Hair Analysis System. Inicie novas análises
          e acompanhe avaliações recentes realizadas no salão.
        </p>
      </header>

      {/* Cliente ativo */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 20,
          background: "#ffffff",
          marginBottom: 32,
          maxWidth: 720,
        }}
      >
        <strong>Cliente ativa na sessão</strong>
        <p style={{ color: "#6b7280", marginTop: 6 }}>
          Atendimento em andamento com histórico vinculado à cliente atual.
        </p>

        <p style={{ marginTop: 12 }}>
          <strong>Análises realizadas:</strong>{" "}
          {totalAnalises === 0 ? "nenhuma até o momento" : totalAnalises}
        </p>

        <button
          onClick={() => navigate("/relatorio-cliente")}
          disabled={!cliente}
          style={{
            marginTop: 16,
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            background: cliente ? "#047857" : "#9ca3af",
            color: "#ffffff",
            cursor: cliente ? "pointer" : "not-allowed",
          }}
        >
          Ver relatório da cliente
        </button>

        {!cliente && (
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
            O relatório estará disponível após a realização de uma análise.
          </p>
        )}
      </div>

      {/* Ações principais */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
          marginBottom: 40,
        }}
      >
        {/* Card Tricológica */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 24,
            background: "#ffffff",
          }}
        >
          <h3>Análise Tricológica</h3>
          <p style={{ color: "#6b7280", margin: "8px 0 20px" }}>
            Avaliação do couro cabeludo para garantir segurança, saúde capilar e
            melhores resultados nos procedimentos.
          </p>

          <button
            onClick={() => navigate("/analise-tricologica")}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "none",
              background: "#047857",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            Nova Análise Tricológica
          </button>
        </div>

        {/* Card Capilar */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 24,
            background: "#ffffff",
          }}
        >
          <h3>Análise Capilar</h3>
          <p style={{ color: "#6b7280", margin: "8px 0 20px" }}>
            Avaliação do fio para definição de tratamentos, alisamentos e
            manutenções de forma segura e personalizada.
          </p>

          <button
            onClick={() => navigate("/analise-capilar")}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "none",
              background: "#000080",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            Nova Análise Capilar
          </button>
        </div>
      </div>

      {/* Histórico */}
      <section>
        <h2>Atendimentos recentes</h2>

        {historico.length === 0 ? (
          <div
            style={{
              marginTop: 16,
              padding: 20,
              borderRadius: 10,
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              maxWidth: 720,
            }}
          >
            <p style={{ color: "#6b7280" }}>
              Nenhuma análise registrada ainda. Inicie uma avaliação para começar
              o acompanhamento da cliente.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 16,
              marginTop: 16,
              maxWidth: 900,
            }}
          >
            {historico.slice(0, 5).map((item, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: 16,
                  background: "#ffffff",
                }}
              >
                <strong style={{ textTransform: "capitalize" }}>
                  Análise {item.tipo}
                </strong>
                <p style={{ marginTop: 6 }}>{item.descricao}</p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    marginTop: 4,
                  }}
                >
                  {item.data}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
