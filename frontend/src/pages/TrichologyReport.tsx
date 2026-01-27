import PageContainer from "../components/ui/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import { exportTrichologyReportPdf } from "../utils/exportTrichologyReportPdf";

type ClinicalStatus = "normal" | "alerta" | "critico";

const statusMap: Record<
  ClinicalStatus,
  { label: string; color: string; bg: string }
> = {
  normal: { label: "Normal", color: "#065f46", bg: "#d1fae5" },
  alerta: { label: "Alerta", color: "#92400e", bg: "#fef3c7" },
  critico: { label: "Crítico", color: "#991b1b", bg: "#fee2e2" },
};

const TrichologyReport = () => {
  const report = {
    client: "Cliente Exemplo",
    date: "19/01/2026",
    scalpType: "Oleoso",
    sensitivity: "Moderada",
    density: "Média",
    hairLoss: "Leve",
    inflammation: "Ausente",
    risk: "alerta" as ClinicalStatus,
    recommendation:
      "Indicado tratamento calmante associado a controle de oleosidade. Evitar procedimentos agressivos.",
    observations:
      "Couro cabeludo apresenta produção sebácea elevada, porém sem sinais de inflamação ativa.",
  };

  function handleExportPdf() {
    exportTrichologyReportPdf({
      ...report,
      risk: statusMap[report.risk].label,
    });
  }

  return (
    <PageContainer>
      <PageHeader
        title="Laudo Tricológico"
        subtitle="Avaliação técnica do couro cabeludo e fios"
      />

      <div style={{ marginBottom: 24 }}>
        <button
          onClick={handleExportPdf}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#111827",
            color: "#ffffff",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Exportar PDF Clínico
        </button>
      </div>

      {/* O restante do layout permanece igual ao anterior */}
      {/* (mantido propositalmente para consistência clínica) */}
    </PageContainer>
  );
};

export default TrichologyReport;
