import React, { createContext, useContext, useEffect, useState } from "react";

interface Cliente {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
}

interface ClienteContextData {
  clienteSelecionado: Cliente | null;
  setClienteSelecionado: (cliente: Cliente | null) => void;
}

const ClienteContext = createContext<ClienteContextData>(
  {} as ClienteContextData
);

export const ClienteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [clienteSelecionado, setClienteSelecionado] =
    useState<Cliente | null>(null);

  // 🔐 RESTAURA DO localStorage
  useEffect(() => {
    const stored = localStorage.getItem("HAS_CLIENT_SELECTED");
    if (stored) {
      setClienteSelecionado(JSON.parse(stored));
    }
  }, []);

  // 💾 SALVA NO localStorage
  useEffect(() => {
    if (clienteSelecionado) {
      localStorage.setItem(
        "HAS_CLIENT_SELECTED",
        JSON.stringify(clienteSelecionado)
      );
    }
  }, [clienteSelecionado]);

  return (
    <ClienteContext.Provider
      value={{ clienteSelecionado, setClienteSelecionado }}
    >
      {children}
    </ClienteContext.Provider>
  );
};

export const useCliente = () => useContext(ClienteContext);
