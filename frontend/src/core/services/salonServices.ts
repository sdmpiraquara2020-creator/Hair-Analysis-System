export type SalonService = {
  id: string;
  nome: string;
  categoria: "ALISAMENTO" | "TRATAMENTO";
  nivelPermitido: "VERDE" | "AMARELO" | "VERMELHO";
  descricao: string;
};

export const salonServices: SalonService[] = [
  {
    id: "alisamento-suave",
    nome: "Alisamento Suave",
    categoria: "ALISAMENTO",
    nivelPermitido: "VERDE",
    descricao:
      "Procedimento de manutenção estética indicado para fios em condições seguras.",
  },
  {
    id: "botox-capilar",
    nome: "Botox Capilar",
    categoria: "TRATAMENTO",
    nivelPermitido: "AMARELO",
    descricao:
      "Tratamento de alinhamento e reposição indicado para fios com atenção preventiva.",
  },
  {
    id: "reconstrucao-profunda",
    nome: "Reconstrução Profunda",
    categoria: "TRATAMENTO",
    nivelPermitido: "VERMELHO",
    descricao:
      "Tratamento intensivo indicado para recuperação da integridade do fio.",
  },
];
