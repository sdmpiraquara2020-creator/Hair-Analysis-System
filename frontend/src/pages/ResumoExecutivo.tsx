import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import NivelBadge from "../components/ui/NivelBadge";

export default function ResumoExecutivo() {
  const navigate = useNavigate();

  const resultadoCapilar = JSON.parse(
    sessionStorage.getItem("resultadoAnaliseCapilar") || "{}"
  );

  const resultadoTricologico = JSON.parse(
    sessionStorage.getItem("resultadoAnaliseTricologica") || "{}"
  );

  const nivelGeral =
    resultadoCapilar.nivel === "elevado" ||
    resultadoTricologico.nivel === "elevado"
      ? "elevado"
      : resultadoCapilar.nivel === "moderado" ||
        resultadoTricologico.nivel === "moderado"
      ? "moderado"
      : "baixo";

  const recomendacaoFinal =
    nivelGeral === "baixo"
      ? "Condições favoráveis para procedimentos, respeitando avaliação técnica."
      : nivelGeral === "moderado"
      ? "Indicado preparo técnico antes de procedimentos químicos."
      : "Procedimentos químicos não recomendados no momento. Priorizar recuperação.";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
        Resumo Executivo
      </h1>

      {/* Nível geral */}
      <Card title="Nível técnico geral do atendimento">
        <div style={{ marginBottom: "12px" }}>
          <NivelBadge nivel={nivelGeral} />
        </div>
        <p>{recomendacaoFinal}</p>
      </Card>

      {/* Capilar */}
      <Card title="Análise Capilar">
        <NivelBadge nivel={resultadoCapilar.nivel || "baixo"} />
        <p style={{ marginTop: "8px" }}>
          {resultadoCapilar.resumo || "Nenhuma análise capilar registrada."}
        </p>
      </Card>

      {/* Tricológica */}
      <Card title="Análise Tricológica">
        <NivelBadge nivel={resultadoTricologico.nivel || "baixo"} />
        <p style={{ marginTop: "8px" }}>
          {resultadoTricologico.resumo ||
            "Nenhuma análise tricológica registrada."}
        </p>
      </Card>

      {/* Aviso */}
      <Card title="Observação importante" variant="attention">
        Este resumo consolida análises técnicas estéticas. A decisão final
        sobre procedimentos é sempre do profissional responsável.
      </Card>

      {/* Ações */}
      <div style={{ display: "flex", gap: "12px" }}>
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          Voltar ao Dashboard
        </Button>
        <Button variant="primary">
          Registrar Decisão do Atendimento
        </Button>
      </div>
    </div>
  );
}
