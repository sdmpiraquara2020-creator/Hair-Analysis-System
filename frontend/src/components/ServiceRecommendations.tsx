type Props = {
  tipo_fio: string;
  porosidade: string;
  nivel_dano: string;
};

export default function ServiceRecommendations({
  tipo_fio,
  porosidade,
  nivel_dano,
}: Props) {
  const services = [];

  if (porosidade === "alta" || nivel_dano !== "baixo") {
    services.push({
      title: "Reconstrução SDM",
      description:
        "Reconstrução profunda para recuperar massa, força e resistência do fio.",
    });
  }

  if (porosidade !== "baixa") {
    services.push({
      title: "Nutrição Lipídica SDM",
      description:
        "Reposição de óleos essenciais para eliminar frizz e selar a fibra capilar.",
    });
  }

  services.push({
    title: "Hidratação SDM",
    description:
      "Reposição de água e ativos para devolver maciez, brilho e elasticidade.",
  });

  if (tipo_fio !== "liso") {
    services.push({
      title: "Alinhamento / Selagem SDM",
      description:
        "Redução de volume e alinhamento sem comprometer a saúde do fio.",
    });
  }

  return (
    <div style={box}>
      <h3>Serviços Recomendados SDM</h3>

      <div style={grid}>
        {services.map((s) => (
          <div key={s.title} style={card}>
            <strong>{s.title}</strong>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const box: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 12,
  padding: 24,
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  marginBottom: 24,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};

const card: React.CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 10,
  padding: 16,
};
