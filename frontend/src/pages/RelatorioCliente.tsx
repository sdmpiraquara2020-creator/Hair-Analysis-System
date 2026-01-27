import { useCliente } from "../context/ClienteContext";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { useRef } from "react";

type Protocolo = {
  titulo: string;
  descricao: string;
  indicacoes: string[];
};

export default function RelatorioCliente() {
  const { cliente } = useCliente();
  const navigate = useNavigate();
  const pdfRef = useRef<HTMLDivElement>(null);

  if (!cliente) {
    return (
      <section style={styles.page}>
        <h1>Relatório da Cliente</h1>
        <p style={styles.muted}>Nenhuma cliente ativa nesta sessão.</p>
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

    if (possuiTrico) {
      protocolos.push({
        titulo: "Protocolo de Saúde do Couro Cabeludo",
        descricao: "Equilíbrio e segurança antes de procedimentos químicos.",
        indicacoes: [
          "Tratamentos calmantes",
          "Controle de oleosidade",
          "Preparação pré-química",
        ],
      });
    }

    if (possuiCapilar) {
      protocolos.push({
        titulo: "Protocolo Capilar Personalizado",
        descricao: "Procedimentos compatíveis com o histórico do fio.",
        indicacoes: [
          "Tratamentos de nutrição/reconstrução",
          "Alisamentos compatíveis",
          "Manutenção periódica",
        ],
      });
    }

    return protocolos;
  }

  function exportarPDF() {
    if (!pdfRef.current) return;

    html2pdf()
      .set({
        margin: 10,
        filename: `relatorio-cliente-${cliente.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(pdfRef.current)
      .save();
  }

  const protocolos = gerarProtocolos();

  return (
    <section style={styles.page}>
      {/* AÇÕES (NÃO VAI PARA O PDF) */}
      <div style={styles.actions}>
        <button onClick={exportarPDF} style={styles.primaryBtn}>
          Exportar PDF
        </button>
        <button onClick={() => navigate("/dashboard")} style={styles.secondaryBtn}>
          Voltar
        </button>
      </div>

      {/* CONTEÚDO DO PDF */}
      <div ref={pdfRef}>
        <header style={styles.header}>
          <h1>Relatório Técnico da Cliente</h1>
          <p style={styles.subtitle}>
            Documento técnico-estético • Hair Analysis System
          </p>
        </header>

        <section style={styles.section}>
          <h2>Identificação</h2>
          <p><strong>ID:</strong> {cliente.id}</p>
          <p><strong>Início:</strong> {cliente.criadoEm}</p>
          <p><strong>Total de análises:</strong> {analises.length}</p>
        </section>

        <section style={styles.section}>
          <h2>Histórico de Análises</h2>
          {analises.map((a) => (
            <div key={a.id} style={styles.card}>
              <strong>Análise {a.tipo}</strong>
              <p>{a.descricao}</p>
              <span style={styles.small}>{a.data}</span>
            </div>
          ))}
        </section>

        <section style={styles.section}>
          <h2>Protocolos Recomendados</h2>
          {protocolos.map((p, i) => (
            <div key={i} style={styles.card}>
              <h3>{p.titulo}</h3>
              <p>{p.descricao}</p>
              <ul>
                {p.indicacoes.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
          <p style={styles.disclaimer}>
            Recomendações técnico-estéticas. Decisão final do profissional.
          </p>
        </section>

        <footer style={styles.footer}>
          <p style={styles.small}>
            Relatório gerado para uso profissional • Não clínico
          </p>
        </footer>
      </div>
    </section>
  );
}

/* ===== Estilos ===== */
const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 900, margin: "0 auto", padding: 32 },
  header: { borderBottom: "2px solid #e5e7eb", marginBottom: 20 },
  subtitle: { color: "#6b7280" },
  section: { marginBottom: 24 },
  card: {
    border: "1px solid #e5e7eb",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  actions: { display: "flex", gap: 12, marginBottom: 20 },
  primaryBtn: {
    padding: "10px 18px",
    borderRadius: 6,
    border: "none",
    background: "#047857",
    color: "#fff",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "10px 18px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
  },
  muted: { color: "#6b7280" },
  small: { fontSize: 12, color: "#6b7280" },
  disclaimer: { fontSize: 12, color: "#6b7280", marginTop: 12 },
  footer: { borderTop: "1px solid #e5e7eb", paddingTop: 12, marginTop: 24 },
};
