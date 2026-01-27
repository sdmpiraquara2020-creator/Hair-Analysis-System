import { useState } from "react";
import { explainDiagnosis } from "../services/diagnosisAI.service";

export function useDiagnosisAI() {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState(null);

  async function runExplanation(payload, results) {
    try {
      setLoading(true);
      setError(null);

      const res = await explainDiagnosis(payload, results);

      if (!res.success) {
        throw new Error("Falha ao gerar explicação");
      }

      setExplanation(res.data.explanation);
    } catch (err) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return {
    runExplanation,
    explanation,
    loading,
    error
  };
}
