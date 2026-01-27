import { useCliente } from "../context/ClienteContext";
import { useNavigate } from "react-router-dom";

type Protocolo = {
  titulo: string;
  descricao: string;
  indicacoes: string[];
};

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

  // ===== Protocolos Inteligentes =====
  function gerarProtocolos(): Protocolo[] {
    const protocolos: Protocolo[] = [];

    const possuiCapilar = analises.some((a) => a.tipo === "capilar");
    const possuiTrico = analises.some((a) => a.tipo === "tricológica");
    const totalAnalises = analises.length;

    if (possuiTrico) {
      protocolos.push({
        titulo: "Protocolo de Saúde do Couro Cabeludo",
        descricao:
          "Indicado quando há avaliação tricológica registrada, priorizando segurança e equilíbrio antes de procedimentos químicos.",
        indicacoes: [
          "Tratamentos calmantes e equilibrantes",
          "Controle de oleosidade e sensibilidade",
          "Preparação do couro cabeludo antes de químicas",
        ],
      });
    }

    if (possuiCapilar && !possuiTrico) {
      protocolos.push({
        titulo: "Protocolo de Procedimento Capilar Seguro",
        descricao:
          "Indicado quando a análise capilar demonstra condições compatíveis com procedimentos estéticos.",
        indicacoes: [
          "Alisamentos compatíveis com o histórico do fio",
          "Tratamentos de nutrição e manutenção",
          "Plano de cuidados pós-procedimento",
        ],
      });
    }

    if (possuiCapilar && possuiTrico) {
      protocolos.push({
        titulo: "Protocolo Combinado Saúde + Procedimento",
        descricao:
          "Combinação de cuidados do couro cabeludo com procedimentos capilares, garantindo segurança e melhor performance dos resultados.",
        indicacoes: [
          "Tratamento prévio de saúde do couro cabeludo",
          "Procedimentos capilares progressivos ou alinhamentos",
          "Manutenção periódica personalizada",
        ],
      });
    }

    if (totalAnalises >= 2) {
      protocolos.push({
        titulo: "Protocolo de Acompanhamento Contínuo",
        descricao:
          "Indicado para clientes em acompanhamento, visando evolução gradual e previsibilidade de resultados.",
        indicacoes: [
          "Pacote de tratamentos periódicos",
          "Reavaliações técnicas programadas",
          "Plano de fidelização com foco em saúde e estética",
        ],
      });
    }

    if (protocolos.length === 0) {
      protocolos.push({
        titulo: "Protocolo Preventivo",
        descricao:
          "Indicado quando não há pontos críticos registrados, focando na manutenção da saúde capilar.",
        indicacoes: [
          "Manutenção preventiva",
          "Cuidados domiciliares orientados",
          "Reavaliação periódica",
        ],
      });
    }

    return protocolos;
  }

  const protocolosGerados = gerarProtocolos();

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

      {/* Histórico */}
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

      {/* Protocolos Inteligentes */}
      <section>
        <h2>Protocolos Personalizados Recomendados</h2>

        <div style={{ display: "grid", gap: 20, marginTop: 16 }}>
          {protocolosGerados.map((protocolo, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 20,
                background: "#ffffff",
              }}
            >
              <h3>{protocolo.titulo}</h3>
              <p style={{ marginTop: 8 }}>{protocolo.descricao}</p>

              <ul style={{ marginTop: 12 }}>
                {protocolo.indicacoes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 16 }}>
          Protocolos sugeridos com base no histórico técnico-estético da cliente.
          A decisão final cabe ao profissional responsável.
        </p>
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
