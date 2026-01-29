type Nivel = "baixo" | "moderado" | "elevado";

interface NivelBadgeProps {
  nivel: Nivel;
}

const estilos: Record<Nivel, { bg: string; color: string; label: string }> = {
  baixo: {
    bg: "#DCFCE7",
    color: "#166534",
    label: "Condição favorável",
  },
  moderado: {
    bg: "#FEF3C7",
    color: "#92400E",
    label: "Atenção técnica",
  },
  elevado: {
    bg: "#FEE2E2",
    color: "#991B1B",
    label: "Atenção elevada",
  },
};

export default function NivelBadge({ nivel }: NivelBadgeProps) {
  const { bg, color, label } = estilos[nivel];

  return (
    <span
      style={{
        backgroundColor: bg,
        color,
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: 600,
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}
