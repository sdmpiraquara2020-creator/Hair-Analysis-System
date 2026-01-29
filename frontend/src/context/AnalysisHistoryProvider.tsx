import React, { createContext, useContext, useEffect, useState } from "react";

interface Analysis {
  id: string;
  clienteId: string;
  tipo: "CAPILAR" | "TRICOLOGICA";
  data: string;
  resultado: any;
}

interface AnalysisHistoryContextData {
  analysisHistory: Analysis[];
  addAnalysis: (analysis: Analysis) => void;
  clearHistory: () => void;
}

const AnalysisHistoryContext = createContext<AnalysisHistoryContextData>(
  {} as AnalysisHistoryContextData
);

export const AnalysisHistoryProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [analysisHistory, setAnalysisHistory] = useState<Analysis[]>([]);

  // 🔐 RESTAURA DO localStorage
  useEffect(() => {
    const stored = localStorage.getItem("HAS_ANALYSIS_HISTORY");
    if (stored) {
      setAnalysisHistory(JSON.parse(stored));
    }
  }, []);

  // 💾 SALVA NO localStorage
  useEffect(() => {
    localStorage.setItem(
      "HAS_ANALYSIS_HISTORY",
      JSON.stringify(analysisHistory)
    );
  }, [analysisHistory]);

  const addAnalysis = (analysis: Analysis) => {
    setAnalysisHistory((prev) => [...prev, analysis]);
  };

  const clearHistory = () => {
    setAnalysisHistory([]);
    localStorage.removeItem("HAS_ANALYSIS_HISTORY");
  };

  return (
    <AnalysisHistoryContext.Provider
      value={{ analysisHistory, addAnalysis, clearHistory }}
    >
      {children}
    </AnalysisHistoryContext.Provider>
  );
};

export const useAnalysisHistory = () =>
  useContext(AnalysisHistoryContext);
