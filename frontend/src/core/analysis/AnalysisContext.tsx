import { createContext, useContext, useState, ReactNode } from "react";
import { AnalysisInput } from "./analysisEngine";

type AnalysisContextType = {
  input: AnalysisInput | null;
  setInput: (data: AnalysisInput) => void;
};

const AnalysisContext = createContext<AnalysisContextType | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState<AnalysisInput | null>(null);

  return (
    <AnalysisContext.Provider value={{ input, setInput }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within AnalysisProvider");
  }
  return context;
}
