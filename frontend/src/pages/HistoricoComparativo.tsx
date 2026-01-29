import { useEffect, useState } from "react";

interface Analysis {
  id: string;
  analysisType: string;
  clientName: string;
  status: string;
  createdAt: string;
}

export default function HistoricoComparativo() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:3333/api/analysis";

  useEffect(() => {
    async function loadAnalyses() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Erro ao carregar histórico");
        }

        const data = await response.json();
        setAnalyses(data);
      } catch {
        setError("Não foi possível carregar o histórico clínico.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalyses();
  }, []);

  const container: React.CSSProperties = {
    maxWidth: 1000,
    margin: "0 auto",
    padding: 32,
  };

  const card: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 24,
  };

  if (loading) {
    return (
      <section style={container}>
        <h1 style={{ fontSize: 26, fontWeight: 600 }}>
          Histórico Comparativo
        </h1>
        <p style={{ marginTop: 12, color: "#6b7280" }}>
          Carregando histórico clínico...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section style={container}>
        <h1 style={{ fontSize: 26, fontWeight: 600 }}>
          Histórico Comparativo
        </h1>
        <p style={{ marginTop: 12, color: "#b91c1c" }}>{error}</p>
      </section>
    );
  }

  return (
    <section style={container}>
      {/* Cabeçalho */}
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600 }}>
          Histórico Comparativo
        </h1>
        <p style={{ color: "#6b7280", marginTop: 6 }}>
          Acompanhamento das análises clínicas realizadas
        </p>
      </header>

      {analyses.length === 0 ? (
        <div
          style={{
            border: "1px dashed #d1d5db",
            borderRadius: 12,
            padding: 32,
            background: "#fafafa",
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>
            Nenhuma análise registrada
          </h3>
          <p style={{ marginTop: 10, color: "#6b7280" }}>
            Assim que análises capilares ou tricológicas forem
            registradas, elas aparecerão aqui para acompanhamento e
            comparação clínica.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {analyses.map((analysis) => (
            <div key={analysis.id} style={card}>
              <strong>{analysis.clientName}</strong>
              <p style={{ marginTop: 6 }}>
                Tipo de análise:{" "}
                <strong>{analysis.analysisType}</strong>
              </p>
              <p>Status: {analysis.status}</p>
              <p style={{ color: "#6b7280", fontSize: 13 }}>
                Data:{" "}
                {new Date(analysis.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <p
        style={{
          marginTop: 32,
          fontSize: 12,
          color: "#6b7280",
        }}
      >
        O histórico comparativo não substitui avaliação dermatológica.
        Uso técnico-profissional.
      </p>
    </section>
  );
}
