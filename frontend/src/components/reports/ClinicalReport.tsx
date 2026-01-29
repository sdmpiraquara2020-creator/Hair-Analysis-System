import React from "react";

type ClinicalReportProps = {
  data?: {
    summary?: {
      totalAnalyses?: number;
      criticalCases?: number;
      period?: string;
    };
    timeline?: Array<{
      date: string;
      total: number;
    }>;
  } | null;
};

export default function ClinicalReport({ data }: ClinicalReportProps) {
  // 🔒 GUARDA DEFENSIVA ABSOLUTA
  if (!data || !data.summary) {
    return (
      <div style={{ padding: 24, fontSize: 14, color: "#666" }}>
        Relatório clínico indisponível no momento.
      </div>
    );
  }

  const { summary, timeline = [] } = data;

  return (
    <div style={{ padding: 32 }}>
      <h2>Relatório Clínico</h2>

      <section style={{ marginTop: 16 }}>
        <p>
          <strong>Período:</strong> {summary.period ?? "—"}
        </p>
        <p>
          <strong>Total de análises:</strong>{" "}
          {summary.totalAnalyses ?? 0}
        </p>
        <p>
          <strong>Casos críticos:</strong>{" "}
          {summary.criticalCases ?? 0}
        </p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Evolução Temporal</h3>

        {timeline.length === 0 ? (
          <p style={{ fontSize: 13, color: "#777" }}>
            Nenhum dado temporal disponível.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              marginTop: 8,
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
                  Data
                </th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #ccc" }}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {timeline.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "4px 0" }}>{item.date}</td>
                  <td style={{ padding: "4px 0", textAlign: "right" }}>
                    {item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
