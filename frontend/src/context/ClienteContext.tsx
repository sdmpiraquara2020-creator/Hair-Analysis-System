import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type TipoAnalise = "capilar" | "tricológica";

type RegistroAnaliseCliente = {
  id: string;
  tipo: TipoAnalise;
  data: string;
  descricao: string;
};

type Cliente = {
  id: string;
  nome?: string;
  criadoEm: string;
  analises: RegistroAnaliseCliente[];
};

type ClienteContextType = {
  cliente: Cliente | null;
  criarCliente: (nome?: string) => void;
  adicionarAnaliseAoCliente: (analise: RegistroAnaliseCliente) => void;
  limparCliente: () => void;
};

const STORAGE_KEY = "has_cliente_ativo";

const ClienteContext = createContext<ClienteContextType | undefined>(undefined);

export function ClienteProvider({ children }: { children: ReactNode }) {
  const [cliente, setCliente] = useState<Cliente | null>(null);

  // 🔹 Carregar cliente do localStorage ao iniciar
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (!salvo) return;

      const parsed = JSON.parse(salvo) as Cliente;

      // validação mínima defensiva
      if (
        parsed &&
        typeof parsed.id === "string" &&
        Array.isArray(parsed.analises)
      ) {
        setCliente(parsed);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // 🔹 Persistir cliente a cada alteração
  useEffect(() => {
    if (cliente) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cliente));
    }
  }, [cliente]);

  function criarCliente(nome?: string) {
    const novoCliente: Cliente = {
      id: crypto.randomUUID(),
      nome,
      criadoEm: new Date().toLocaleString("pt-BR"),
      analises: [],
    };

    setCliente(novoCliente);
  }

  function adicionarAnaliseAoCliente(analise: RegistroAnaliseCliente) {
    setCliente((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        analises: [analise, ...prev.analises],
      };
    });
  }

  function limparCliente() {
    setCliente(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <ClienteContext.Provider
      value={{
        cliente,
        criarCliente,
        adicionarAnaliseAoCliente,
        limparCliente,
      }}
    >
      {children}
    </ClienteContext.Provider>
  );
}

export function useCliente() {
  const context = useContext(ClienteContext);

  if (!context) {
    throw new Error(
      "useCliente deve ser usado dentro de um ClienteProvider"
    );
  }

  return context;
}
