import { useEffect, useState } from "react";
import { fetchClientAnalyses } from "../../api/analysis.history.api";
import { compareAnalyses } from "../../services/analysisCompare.service";

export default function AnalysisCompare({ clientId }: { clientId: string }) {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    fetchClientAnalyses(clientId).then(setAnalyses);
  }, [clientId]);

  function handleCompare() {
    if (analyses.length < 2) return;

    const base = analyses[analyses.length - 2];
    const current = analyses[analyses.length - 1];

    const comparison = compareAnalyses(base, current);
    setResult(comparison);
  }

  return (
    <div>
      <h3>Comparação Evolutiva</h3>

      <button onClick={handleCompare}>
        Comparar Últimas Análises
      </button>

      {result && (
        <div>
          <p><strong>Conclusão:</strong> {result.summary}</p>
          <p><strong>Score de Evolução:</strong> {result.evolutionScore}</p>

          <ul>
            {result.details.map((d: string, i: number) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
