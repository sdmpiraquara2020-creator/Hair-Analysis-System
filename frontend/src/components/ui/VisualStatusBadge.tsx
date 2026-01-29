type Status = "melhora" | "estavel" | "piora";

const estilos: Record<Status, { bg: string; color: string; label: string }> = {
  melhora: {
    bg: "#DCFCE7",
    color: "#166534",
    label: "Evolução positiva",
  },
  estavel: {
    bg: "#E5E7EB",
    color: "#374151",
    label: "Condição mantida",
  },
  piora: {
    bg: "#FEE2E2",
    color: "#991B1B",
    label: "Atenção aumentada",
  },
};

export default function VisualStatusBadge({ status }: { status: Status }) {
  const { bg, color, label } = estilos[status];

  return (
    <span
      style={{
        backgroundColor: bg,
        color,
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}
