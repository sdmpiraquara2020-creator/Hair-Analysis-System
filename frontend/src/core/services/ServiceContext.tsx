import { createContext, useContext, useState, ReactNode } from "react";

export type SalonService = {
  id: string;
  nome: string;
  categoria: "ALISAMENTO" | "TRATAMENTO";
  nivelPermitido: "VERDE" | "AMARELO" | "VERMELHO";
  descricao: string;
};

type ServiceContextType = {
  services: SalonService[];
  addService: (service: SalonService) => void;
  removeService: (id: string) => void;
};

const ServiceContext = createContext<ServiceContextType | null>(null);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<SalonService[]>([]);

  function addService(service: SalonService) {
    setServices((prev) => [...prev, service]);
  }

  function removeService(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <ServiceContext.Provider value={{ services, addService, removeService }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServices must be used within ServiceProvider");
  }
  return context;
}
