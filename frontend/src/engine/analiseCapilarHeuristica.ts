export interface AnaliseCapilarInput {
  tipoFio: string[];
  estadoFio: string[];
  comportamentoFio: string[];
  observacoes?: string;
}

export type NivelTecnico = "baixo" | "moderado" | "elevado";

export interface AnaliseCapilarOutput {
  score: number;
  nivel: NivelTecnico;
  flags: string[];
  recomendacoes: string[];
  resumo: string;
}

/**
 * Pesos técnicos (MVP)
 * 1 = leve | 2 = moderado | 3 = elevado
 */
const PESOS: Record<string, number> = {
  "Estrutura fragilizada": 3,
  "Ressecamento visível": 2,
  "Elasticidade comprometida": 3,
  "Dificuldade de alinhamento": 1,
  "Volume excessivo": 1,
  "Ondulação irregular": 1,
};

function classificarNivel(score: number): NivelTecnico {
  if (score >= 6) return "elevado";
  if (score >= 3) return "moderado";
  return "baixo";
}

export function avaliarAnaliseCapilar(
  input: AnaliseCapilarInput
): AnaliseCapilarOutput {
  let score = 0;
  const flags: string[] = [];
  const recomendacoes: string[] = [];

  // Avaliar estado do fio
  input.estadoFio.forEach((item) => {
    const peso = PESOS[item] || 0;
    if (peso > 0) {
      score += peso;
      flags.push(item);
    }
  });

  // Avaliar comportamento do fio
  input.comportamentoFio.forEach((item) => {
    const peso = PESOS[item] || 0;
    if (peso > 0) {
      score += peso;
      flags.push(item);
    }
  });

  const nivel = classificarNivel(score);

  // Recomendações graduais
  if (nivel === "baixo") {
    recomendacoes.push(
      "Fio sem sinais críticos aparentes no momento da análise.",
      "Procedimentos podem ser avaliados com segurança técnica."
    );
  }

  if (nivel === "moderado") {
    recomendacoes.push(
      "Indicar protocolos de hidratação e nutrição antes de procedimentos químicos.",
      "Avaliar necessidade de tratamento preparatório."
    );
  }

  if (nivel === "elevado") {
    recomendacoes.push(
      "Priorizar recuperação da fibra capilar antes de qualquer química.",
      "Evitar procedimentos de alta intensidade no atendimento atual.",
      "Planejar cronograma capilar de recuperação."
    );
  }

  const resumo =
    nivel === "baixo"
      ? "Fio em condições estéticas favoráveis no momento."
      : nivel === "moderado"
      ? "Fio apresenta pontos de atenção que exigem preparo técnico."
      : "Fio com atenção elevada, exigindo recuperação antes de procedimentos.";

  return {
    score,
    nivel,
    flags: Array.from(new Set(flags)),
    recomendacoes,
    resumo,
  };
}
