import ServiceRecommendations from "./ServiceRecommendations";

type Props = {
  analysis: any;
  onReset: () => void;
};

export default function AnalysisResult({ analysis, onReset }: Props) {
  return (
    <div style={container}>
      <h1 style={title}>Resultado da Análise Capilar</h1>

      <div style={grid}>
        <Card title="Tipo de fio" value={analysis.tipo_fio} />
        <Card title="Espessura" value={analysis.espessura} />
        <Card title="Porosidade" value={analysis.porosidade} />
        <Card title="Nível de dano" value={analysis.nivel_dano} />
        <Card title="Score" value={analysis.score} />
      </div>

      <div style={box}>
        <h3>Necessidades do fio</h3>
        <ul>
          {analysis.necessidades.map((n: string) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>

      <div style={box}>
        <h3>Indicação Técnica</h3>
        <p>{analysis.indicacao_tratamento}</p>
      </div>

      <ServiceRecommendations
        tipo_fio={analysis.tipo_fio}
        porosidade={analysis.porosidade}
        nivel_dano={analysis.nivel_dano}
      />

      <button style={button} onClick={onReset}>
        Nova análise
      </button>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={card}>
      <span style={cardTitle}>{title}</span>
      <strong style={cardValue}>{value}</strong>
    </div>
  );
}

/* ===== STYLES ===== */

const container: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: 32,
};

const title: React.CSSProperties = {
  marginBottom: 32,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 20,
  marginBottom: 32,
};

const card: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 12,
  padding: 20,
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  textAlign: "center",
};

const cardTitle: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  color: "#777",
  marginBottom: 8,
};

const cardValue: React.CSSProperties = {
  fontSize: 18,
  textTransform: "capitalize",
};

const box: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 12,
  padding: 24,
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  marginBottom: 24,
};

const button: React.CSSProperties = {
  padding: "12px 24px",
  borderRadius: 8,
  border: "none",
  background: "#000",
  color: "#fff",
  fontSize: 16,
  cursor: "pointer",
};
