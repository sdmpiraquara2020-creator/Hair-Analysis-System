interface AnalysisInput {
  hairType: string;
  porosity: string;
  elasticity: string;
  chemistry: string[];
  damage: string[];
}

interface AiResult {
  diagnosis: string;
  recommendation: string;
  schedule: string[];
  alerts: string[];
}

export function clinicalAi(input: AnalysisInput): AiResult {
  const alerts: string[] = [];
  const schedule: string[] = [];

  // ALERTAS
  if (input.chemistry.includes("PROGRESSIVA") && input.damage.includes("QUIMICO")) {
    alerts.push("Risco elevado de corte químico");
  }

  if (input.elasticity === "BAIXA") {
    alerts.push("Elasticidade comprometida");
  }

  // CRONOGRAMA
  if (input.porosity === "ALTA") {
    schedule.push("Reconstrução");
    schedule.push("Nutrição");
    schedule.push("Hidratação");
  } else {
    schedule.push("Hidratação");
    schedule.push("Nutrição");
  }

  // DIAGNÓSTICO
  const diagnosis = `Fio ${input.hairType.toLowerCase()}, porosidade ${input.porosity.toLowerCase()} e elasticidade ${input.elasticity.toLowerCase()}, com sinais de dano ${input.damage.join(", ").toLowerCase()}.`;

  // RECOMENDAÇÃO
  const recommendation = `Recomenda-se iniciar protocolo de ${schedule.join(
    " → "
  )}, evitar novas químicas por 60 dias e reavaliar elasticidade antes de qualquer procedimento químico.`;

  return {
    diagnosis,
    recommendation,
    schedule,
    alerts,
  };
}
