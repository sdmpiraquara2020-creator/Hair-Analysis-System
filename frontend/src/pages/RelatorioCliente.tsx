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
      <section style={styles.page}>
        <h1>Relatório da Cliente</h1>
        <p style={styles.muted}>
          Nenhuma cliente ativa encontrada nesta sessão.
        </p>

        <button onClick={() => navigate("/dashboard")} style={styles.primaryBtn}>
          Voltar ao Dashboard
        </button>
      </section>
    );
  }

  const analises = cliente.analises;

  function gerarProtocolos(): Protocolo[] {
    const protocolos: Protocolo[] = [];
    const possuiCapilar = analises.some((a) => a.tipo === "capilar");
    const possuiTrico = analises.some((a) => a.tipo === "tricológica");
    const totalAnalises = analises.length;

    if (possuiTrico) {
      protocolos.push({
        titulo: "Protocolo de Saúde do Couro Cabeludo",
        descricao:
          "Prioriza equilíbrio e segurança do couro cabeludo antes de procedimentos químicos.",
        indicacoes: [
          "Tratamentos calmantes e equilibrantes",
          "Controle de oleosidade e sensibilidade",
          "Preparação pré-química",
        ],
      });
    }

    if (possuiCapilar && !possuiTrico) {
      protocolos.push({
        titulo: "Protocolo de Procedimento Capilar Seguro",
        descricao:
          "Indicado quando a análise capilar aponta compatibilidade estética para procedimentos.",
        indicacoes: [
          "Alisamentos compatíveis com o histórico do fio",
          "Nutrição e manutenção",
          "Cuidados pós-procedimento",
        ],
      });
    }

    if (possuiCapilar && possuiTrico) {
      protocolos.push({
        titulo: "Protocolo Combinado Saúde + Procedimento",
        descricao:
          "Integra cuidados do couro cabeludo com procedimentos capilares para maior segurança.",
        indicacoes: [
          "Tratamento prévio do couro cabeludo",
          "Procedimentos capilares progressivos",
          "Manutenção personalizada",
        ],
      });
    }

    if (totalAnalises >= 2) {
      protocolos.push({
        titulo: "Protocolo de Acompanhamento Contínuo",
        descricao:
          "Focado em evolução gradual e previsibilidade de resultados.",
        indicacoes: [
          "Pacote de tratamentos periódicos",
          "Reavaliações técnicas programadas",
          "Plano de fidelização",
        ],
      });
    }

    if (protocolos.length === 0) {
      protocolos.push({
        titulo: "Protocolo Preventivo",
        descricao:
          "Manutenção da saúde capilar com foco preventivo.",
        indicacoes: [
          "Cuidados domiciliares orientados",
          "Manutenção periódica",
          "Reavaliação técnica",
        ],
      });
    }

    return protocolos;
  }

  const protocolosGerados = gerarProtocolos();

  return (
    <section style={styles.page}>
      {/* Cabeçalho do relatório */}
      <header style={styles.header}>
        <h1 style={styles.title}>Relatório Técnico da Cliente</h1>
        <p style={styles.subtitle}>
          Documento técnico-estético de acompanhamento capilar e tricológico
        </p>
      </header>

      {/* Dados da cliente */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Identificação</h2>
        <div style={styles.card}>
          <p><strong>ID da cliente:</strong> {cliente.id}</p>
          <p><strong>Início do atendimento:</strong> {cliente.criadoEm}</p>
          <p><strong>Total de análises:</strong> {analises.length}</p>
        </div>
      </section>

      {/* Histórico */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Histórico de Análises</h2>
        {analises.length === 0 ? (
          <p style={styles.muted}>Nenhuma análise registrada.</p>
        ) : (
          analises.map((a) => (
            <div key={a.id} style={styles.card}>
              <strong>Análise {a.tipo}</strong>
              <p>{a.descricao}</p>
              <span style={styles.small}>{a.data}</span>
            </div>
          ))
        )}
      </section>

      {/* Protocolos */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Protocolos Recomendados</h2>
        {protocolosGerados.map((p, i) => (
          <div key={i} style={styles.card}>
            <h3 style={styles.protocolTitle}>{p.titulo}</h3>
            <p>{p.descricao}</p>
            <ul>
              {p.indicacoes.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
        <p style={styles.disclaimer}>
          Recomendações baseadas no histórico técnico-estético. Decisão final do
          profissional responsável.
        </p>
      </section>

      {/* Rodapé */}
      <footer style={styles.footer}>
        <p style={styles.small}>
          Relatório gerado pelo Hair Analysis System • Uso técnico-profissional
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          style={styles.secondaryBtn}
        >
          Retornar ao Dashboard
        </button>
      </footer>
    </section>
  );
}

/* ===== Estilos Print-Friendly ===== */
const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 32,
    background: "#ffffff",
    color: "#111827",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  header: {
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: 16,
    marginBottom: 24,
  },
  title: { margin: 0 },
  subtitle: { color: "#6b7280", marginTop: 6 },
  section: { marginBottom: 32 },
  sectionTitle: {
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 6,
    marginBottom: 12,
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    pageBreakInside: "avoid",
  },
  protocolTitle: { marginBottom: 6 },
  muted: { color: "#6b7280" },
  small: { fontSize: 12, color: "#6b7280" },
  disclaimer: { fontSize: 12, color: "#6b7280", marginTop: 8 },
  footer: {
    borderTop: "2px solid #e5e7eb",
    paddingTop: 16,
    marginTop: 24,
    textAlign: "center",
  },
  primaryBtn: {
    marginTop: 24,
    padding: "10px 18px",
    borderRadius: 6,
    border: "none",
    background: "#000080",
    color: "#ffffff",
    cursor: "pointer",
  },
  secondaryBtn: {
    marginTop: 12,
    padding: "8px 16px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    background: "#ffffff",
    cursor: "pointer",
  },
};
