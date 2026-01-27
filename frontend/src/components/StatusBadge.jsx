import React from "react";

export default function StatusBadge({ status }) {
  const styles = {
    Normal: {
      backgroundColor: "#22c55e",
      color: "#ffffff",
    },
    Alerta: {
      backgroundColor: "#f59e0b",
      color: "#ffffff",
    },
    Crítico: {
      backgroundColor: "#ef4444",
      color: "#ffffff",
    },
  };

  const style = styles[status] || {
    backgroundColor: "#64748b",
    color: "#ffffff",
  };

  return (
    <span
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        display: "inline-block",
        minWidth: 72,
        textAlign: "center",
        ...style,
      }}
    >
      {status || "Indefinido"}
    </span>
  );
}
