interface AnalysisSnapshot {
  date: string;
  porosity: "BAIXA" | "MEDIA" | "ALTA";
  elasticity: "BAIXA" | "MEDIA" | "ALTA";
  damage: string[];
}

interface ComparisonResult {
  evolutionScore: number;
  summary: string;
  details: string[];
}

function score(value: string) {
  if (value === "BAIXA") return 1;
  if (value === "MEDIA") return 2;
  return 3;
}

export function compareAnalyses(
  base: AnalysisSnapshot,
  current: AnalysisSnapshot
): ComparisonResult {
  let scoreBase = score(base.porosity) + score(base.elasticity);
  let scoreCurrent = score(current.porosity) + score(current.elasticity);

  const evolutionScore = scoreCurrent - scoreBase;
  const details: string[] = [];

  // Porosidade
  if (base.porosity !== current.porosity) {
    details.push(
      `Porosidade: ${base.porosity} → ${current.porosity}`
    );
  }

  // Elasticidade
  if (base.elasticity !== current.elasticity) {
    details.push(
      `Elasticidade: ${base.elasticity} → ${current.elasticity}`
    );
  }

  // Danos
  if (base.damage.length !== current.damage.length) {
    details.push(
      `Redução de danos de ${base.damage.length} para ${current.damage.length}`
    );
  }

  let summary = "Estado estável do fio.";
  if (evolutionScore > 0) summary = "Evolução positiva do fio.";
  if (evolutionScore < 0) summary = "Regressão do estado do fio.";

  return {
    evolutionScore,
    summary,
    details,
  };
}
