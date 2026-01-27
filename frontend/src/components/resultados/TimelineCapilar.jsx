import React from "react";

export default function TimelineCapilar({ analysis }) {
  const estadoAtual =
    analysis?.summary ||
    "O fio apresenta condição compatível com os dados informados na análise.";

  const tratamento =
    analysis?.treatmentRecommendation ||
    "Recomenda-se protocolo de tratamento compatível com o estado atual do fio.";

  const resultadoEsperado =
    "Com a aplicação correta do tratamento indicado, espera-se melhora gradual da resistência, alinhamento e aspecto geral do fio.";

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Evolução Capilar (Visão Técnica)</h3>

      <div style={styles.timeline}>
        <TimelineItem
          label="Estado Atual"
          text={estadoAtual}
          active
        />

        <TimelineItem
          label="Tratamento Indicado"
          text={tratamento}
        />

        <TimelineItem
          label="Resultado Esperado"
          text={resultadoEsperado}
          muted
        />
      </div>
    </div>
  );
}

function TimelineItem({ label, text, active, muted }) {
  return (
    <div style={styles.item}>
      <div
        style={{
          ...styles.dot,
          backgroundColor: active
            ? "#111"
            : muted
            ? "#bbb"
            : "#555",
        }}
      />

      <div style={styles.content}>
        <strong style={styles.label}>{label}</strong>
        <p
          style={{
            ...styles.text,
            color: muted ? "#666" : "#222",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: 32,
    padding: 24,
    borderRadius: 12,
    background: "#fafafa",
    border: "1px solid #e5e5e5",
  },
  title: {
    marginBottom: 24,
    fontSize: 16,
    fontWeight: 600,
    color: "#111",
  },
  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  item: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    marginTop: 6,
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  label: {
    display: "block",
    fontSize: 14,
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    lineHeight: 1.5,
    margin: 0,
  },
};
