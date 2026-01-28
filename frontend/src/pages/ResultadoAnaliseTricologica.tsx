import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import NivelBadge from "../components/ui/NivelBadge";

export default function ResultadoAnaliseTricologica() {
  const navigate = useNavigate();

  const resultado = JSON.parse(
    sessionStorage.getItem("resultadoAnaliseTricologica") || "{}"
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
        Resultado da Análise Tricológica
      </h1>

      <Card title="Resumo técnico estético">
        <div style={{ marginBottom: "12px" }}>
          <NivelBadge nivel={resultado.nivel} />
        </div>

        <p>{resultado.resumo}</p>

        <p style={{ marginTop: "8px", color: "#4B5563" }}>
          Pontuação técnica: <strong>{resultado.score}</strong>
        </p>
      </Card>

      <Card title="Indicadores técnicos" variant="attention">
        <ul>
          {(resultado.flags || []).map((f: string) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </Card>

      <Card title="Recomendações estéticas assistivas">
        <ul>
          {(resultado.recomendacoes || []).map((r: string) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Card>

      <Card title="Aviso importante" variant="attention">
        Conteúdo gerado para apoio técnico-estético. O sistema não realiza
        diagnósticos clínicos.
      </Card>

      <div style={{ display: "flex", gap: "12px" }}>
        <Button
          variant="secondary"
          onClick={() => navigate("/analise-tricologica")}
        >
          Voltar à Análise
        </Button>
        <Button variant="primary">Salvar no Histórico</Button>
      </div>
    </div>
  );
}
