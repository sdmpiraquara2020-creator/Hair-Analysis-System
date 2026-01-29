import { useParams } from "react-router-dom";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

import { listarVisionHistory } from "../vision/VisionHistoryStorage";
import { VisionHistoryItem } from "../vision/VisionHistory.types";

export default function RelatorioVisionPDF() {
  const { id } = useParams();
  const lista = listarVisionHistory();

  const item: VisionHistoryItem | undefined = lista.find(
    (i) => i.id === id
  );

  if (!item) {
    return <Card>Registro visual não encontrado.</Card>;
  }

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>
        Relatório Técnico — Análise Visual
      </h1>

      <p>
        <strong>Data:</strong>{" "}
        {new Date(item.createdAt).toLocaleString()}
      </p>

      <hr style={{ margin: "16px 0" }} />

      <h2>Imagem analisada</h2>
      <img
        src={item.annotationBase64 || item.imageBase64}
        alt="Registro visual"
        style={{
          width: "100%",
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
        }}
      />

      {item.findings.length > 0 && (
        <>
          <h2 style={{ marginTop: "16px" }}>Achados visuais automáticos</h2>
          <ul>
            {item.findings.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </>
      )}

      <Card title="Observação importante" variant="attention">
        Este relatório é de uso técnico-estético interno.
        Não substitui avaliação profissional nem diagnóstico clínico.
      </Card>

      <div style={{ marginTop: "24px" }}>
        <Button
          variant="primary"
          onClick={() => window.print()}
        >
          Exportar / Imprimir PDF
        </Button>
      </div>
    </div>
  );
}
