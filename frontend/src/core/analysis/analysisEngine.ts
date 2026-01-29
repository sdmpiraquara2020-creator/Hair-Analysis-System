export type AnalysisInput = {
  sensibilidadeCouro: boolean;
  descamacao: "nenhuma" | "leve" | "moderada";
  oleosidade: "baixa" | "media" | "alta";
  integridadeFio: "preservada" | "fragilizada";
  quimicaRecente: "ate30" | "31a90" | "mais90";
  alertasRecentes: boolean;
  imagemIrregularidade: boolean;
};

export type AnalysisResult = {
  score: number;
  nivel: "VERDE" | "AMARELO" | "VERMELHO";
  resumoFio: string;
  resumoCouro: string;
  orientacao: string;
  retornoDias: 30 | 60 | 90;
};

export function runAnalysisEngine(input: AnalysisInput): AnalysisResult {
  let score = 0;

  if (input.sensibilidadeCouro) score += 3;
  if (input.descamacao === "moderada") score += 2;
  if (input.oleosidade === "alta") score += 2;
  if (input.integridadeFio === "fragilizada") score += 3;
  if (input.quimicaRecente === "ate30") score += 3;
  if (input.alertasRecentes) score += 2;
  if (input.imagemIrregularidade) score += 2;

  // Classificação
  if (score <= 3) {
    return {
      score,
      nivel: "VERDE",
      resumoFio: "Integridade preservada no momento da avaliação.",
      resumoCouro: "Sem sinais relevantes no couro cabeludo.",
      orientacao:
        "Procedimentos estéticos permitidos respeitando cronograma capilar.",
      retornoDias: 90,
    };
  }

  if (score <= 6) {
    return {
      score,
      nivel: "AMARELO",
      resumoFio: "Sinais iniciais de fragilidade observados.",
      resumoCouro: "Sensibilidade aparente com necessidade de acompanhamento.",
      orientacao:
        "Reavaliar antes de procedimentos químicos e ajustar cronograma.",
      retornoDias: 60,
    };
  }

  return {
    score,
    nivel: "VERMELHO",
    resumoFio: "Fragilidade acentuada observada na fibra capilar.",
    resumoCouro:
      "Indícios persistentes no couro cabeludo. Monitoramento prioritário.",
    orientacao:
      "Suspender procedimentos químicos. Encaminhar ao dermatologista se persistir.",
    retornoDias: 30,
  };
}

const result = runAnalysisEngine({
  sensibilidadeCouro: true,
  descamacao: "leve",
  oleosidade: "alta",
  integridadeFio: "fragilizada",
  quimicaRecente: "ate30",
  alertasRecentes: false,
  imagemIrregularidade: true,
});
