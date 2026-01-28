export type Nivel = "baixo" | "moderado" | "elevado";

export interface AnaliseResumo {
  data: string;
  score: number;
  nivel: Nivel;
  flags: string[];
}

export interface ResultadoComparacao {
  status: "melhora" | "estavel" | "piora";
  diferencaScore: number;
  resumo: string;
}

const ordemNivel: Record<Nivel, number> = {
  baixo: 1,
  moderado: 2,
  elevado: 3,
};

export function compararAnalises(
  anterior: AnaliseResumo,
  atual: AnaliseResumo
): ResultadoComparacao {
  const diferencaScore = atual.score - anterior.score;

  let status: ResultadoComparacao["status"] = "estavel";

  if (ordemNivel[atual.nivel] < ordemNivel[anterior.nivel]) {
    status = "melhora";
  } else if (ordemNivel[atual.nivel] > ordemNivel[anterior.nivel]) {
    status = "piora";
  }

  const resumo =
    status === "melhora"
      ? "Evolução positiva observada entre as análises."
      : status === "piora"
      ? "Atenção aumentada em relação à análise anterior."
      : "Condição mantida em relação à análise anterior.";

  return {
    status,
    diferencaScore,
    resumo,
  };
}
