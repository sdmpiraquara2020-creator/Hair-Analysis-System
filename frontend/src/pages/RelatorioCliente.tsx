import { useCliente } from "../context/ClienteContext";
import { useNavigate } from "react-router-dom";

export default function RelatorioCliente() {
  const { cliente } = useCliente();
  const navigate = useNavigate();

  if (!cliente) {
    return (
      <section style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
        <h1>Relatório da Cliente</h1>
        <p style={{ color: "#6b7280", marginTop: 12 }}>
          Nenhuma cliente ativa encontrada nesta sessão.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: 24,
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            background: "#000080",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          Voltar ao Dashboard
        </button>
      </section>
    );
  }

  const analises = cliente.analises;

  return (
    <section style={{ maxWidth: 1000, margin: "0 auto", padding: 32 }}>
      <header style={{ marginBottom: 32 }}>
        <h1>Relatório Técnico da Cliente</h1>
        <p style={{ color: "#6b7280", marginTop: 8 }}>
          Documento técnico-estético de acompanhamento capilar e tricológico.
        </p>
      </header>

      {/* Dados da cliente */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 20,
          background: "#ffffff",
          marginBottom: 32,
        }}
      >
        <p>
          <strong>ID da cliente:</strong> {cliente.id}
        </p>
        <p>
          <strong>Início do atendimento:</strong> {cliente.criadoEm}
        </p>
        <p>
          <strong>Total de análises:</strong> {analises.length}
        </p>
      </div>

      {/* Histórico de análises */}
      <section style={{ marginBottom: 40 }}>
        <h2>Histórico de Análises</h2>

        {analises.length === 0 ? (
          <p style={{ color: "#6b7280", marginTop: 12 }}>
            Nenhuma análise registrada para esta cliente.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
            {analises.map((analise) => (
              <div
                key={analise.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: 16,
                  background: "#ffffff",
                }}
              >
                <strong style={{ textTransform: "capitalize" }}>
                  Análise {analise.tipo}
                </strong>
                <p style={{ marginTop: 6 }}>{analise.descricao}</p>
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  {analise.data}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Protocolos recomendados (estáticos, fase 4.1) */}
      <section>
        <h2>Protocolos Estéticos Recomendados</h2>

        <div
          style={{
            marginTop: 16,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 20,
            background: "#ffffff",
          }}
        >
          <ul>
            <li>
              Avaliar necessidade de tratamentos de reconstrução ou nutrição
              antes de procedimentos químicos.
            </li>
            <li>
              Priorizar protocolos de manutenção para preservação da saúde do
              fio.
            </li>
            <li>
              Procedimentos de alisamento devem respeitar o histórico capilar e
              tricológico registrado.
            </li>
            <li>
              Recomenda-se acompanhamento periódico para evolução segura.
            </li>
          </ul>

          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 16 }}>
            Protocolos sugeridos com base nas análises estéticas realizadas.
            Decisão final cabe ao profissional responsável.
          </p>
        </div>
      </section>

      <div style={{ marginTop: 40 }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            background: "#047857",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          Retornar ao Dashboard
        </button>
      </div>
    </section>
  );
}
