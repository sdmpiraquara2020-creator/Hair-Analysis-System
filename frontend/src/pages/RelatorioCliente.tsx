import { useCliente } from "../context/ClienteContext";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { useRef, useState } from "react";

type Protocolo = {
  titulo: string;
  descricao: string;
  indicacoes: string[];
};

export default function RelatorioCliente() {
  const { cliente } = useCliente();
  const navigate = useNavigate();
  const pdfRef = useRef<HTMLDivElement>(null);

  const [profissional, setProfissional] = useState("");
  const [clienteNome, setClienteNome] = useState("");
  const [aceite, setAceite] = useState(false);

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
        descricao: "Equilíbrio do couro cabeludo antes de procedimentos químicos.",
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
          "Nutrição ou reconstrução",
          "Alisamentos compatíveis",
          "Manutenção periódica",
        ],
      });
    }

    return protocolos;
  }

  function exportarPDF() {
    if (!pdfRef.current) return;
    if (!aceite || !profissional || !clienteNome) {
      alert("Preencha os nomes e confirme o aceite antes de exportar o PDF.");
      return;
    }

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
  const data = new Date().toLocaleDateString();

  return (
    <section style={styles.page}>
      {/* AÇÕES */}
      <div style={styles.actions}>
        <button onClick={exportarPDF} style={styles.primaryBtn}>
          Exportar PDF com Assinatura
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
          <p><strong>Data:</strong> {data}</p>
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
        </section>

        {/* ASSINATURAS */}
        <section style={styles.section}>
          <h2>Aceite e Assinaturas</h2>

          <p style={styles.disclaimer}>
            Declaro que recebi as orientações acima e estou ciente de que este
            relatório possui caráter técnico-estético, não clínico.
          </p>

          <div style={styles.signatureBlock}>
            <div>
              <label>Nome do Profissional</label>
              <input
                value={profissional}
                onChange={(e) => setProfissional(e.target.value)}
                style={styles.input}
              />
            </div>

            <div>
              <label>Nome da Cliente</label>
              <input
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
                style={styles.input}
              />
            </div>

            <label style={styles.checkbox}>
              <input
                type="checkbox"
                checked={aceite}
                onChange={(e) => setAceite(e.target.checked)}
              />
              Confirmo o aceite das orientações acima
            </label>
          </div>
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

/* ===== ESTILOS ===== */
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
  input: {
    width: "100%",
    padding: 8,
    marginTop: 4,
    marginBottom: 12,
    borderRadius: 4,
    border: "1px solid #d1d5db",
  },
  checkbox: { display: "flex", gap: 8, alignItems: "center" },
  signatureBlock: { marginTop: 16 },
  muted: { color: "#6b7280" },
  small: { fontSize: 12, color: "#6b7280" },
  disclaimer: { fontSize: 13, marginBottom: 12 },
  footer: { borderTop: "1px solid #e5e7eb", paddingTop: 12, marginTop: 24 },
};
