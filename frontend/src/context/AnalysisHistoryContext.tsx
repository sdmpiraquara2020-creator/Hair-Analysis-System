import { createContext, useContext, useState, ReactNode } from "react";

type TipoAnalise = "tricológica" | "capilar";

export type RegistroAnalise = {
  tipo: TipoAnalise;
  data: string;
  descricao: string;
};

type AnalysisHistoryContextType = {
  historico: RegistroAnalise[];
  adicionarRegistro: (registro: RegistroAnalise) => void;
};

const AnalysisHistoryContext = createContext<
  AnalysisHistoryContextType | undefined
>(undefined);

export function AnalysisHistoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [historico, setHistorico] = useState<RegistroAnalise[]>([]);

  function adicionarRegistro(registro: RegistroAnalise) {
    setHistorico((prev) => [registro, ...prev]);
  }

  return (
    <AnalysisHistoryContext.Provider
      value={{ historico, adicionarRegistro }}
    >
      {children}
    </AnalysisHistoryContext.Provider>
  );
}

export function useAnalysisHistory() {
  const context = useContext(AnalysisHistoryContext);
  if (!context) {
    throw new Error(
      "useAnalysisHistory deve ser usado dentro de AnalysisHistoryProvider"
    );
  }
  return context;
}
