import { useState } from "react";
import AnalysisForm from "./AnalysisForm";
import ResultadoAnaliseContainer from "../resultados/ResultadoAnaliseContainer";
import { createClinicalAnalysis } from "../../api/analysis.api";

export default function AnalysePage() {
  const [analysis, setAnalysis] = useState(null);

  async function handleAnalyze() {
    const response = await createClinicalAnalysis(payload)
    setAnalysis(response);
  }

  return (
    <div>
      <h1>SDM Analyzer IA</h1>

      <AnalysisForm onAnalyze={handleAnalyze} />

      {analysis && (
        <ResultadoAnaliseContainer analysis={analysis} />
      )}
    </div>
  );
}
