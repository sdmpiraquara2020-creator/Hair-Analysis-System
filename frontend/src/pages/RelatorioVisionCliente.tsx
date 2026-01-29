import { useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import { listarVisionHistory } from "../vision/VisionHistoryStorage";
import { VisionHistoryItem } from "../vision/VisionHistory.types";

export default function RelatorioVisionCliente() {
  const { id } = useParams();
  const lista = listarVisionHistory();

  const item: VisionHistoryItem | undefined = lista.find(
    (i) => i.id === id
  );

  if (!item) {
    return <Card>Registro não encontrado.</Card>;
  }

  const cuidadosRecomendados =
    item.findings.length === 0
      ? [
          "Manter rotina de cuidados indicada pelo profissional.",
          "Acompanhar a evolução em atendimentos futuros.",
        ]
      : [
          "Realizar tratamentos de cuidado e equilíbrio.",
          "Seguir as orientações personalizadas indicadas no atendimento.",
          "Evitar procedimentos sem avaliação prévia.",
        ];

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
        Relatório de Acompanhamento Capilar
      </h1>

      <p style={{ color: "#6B7280", marginBottom: "16px" }}>
        Registro visual realizado durante seu atendimento
      </p>

      <p>
        <strong>Data do atendimento:</strong>{" "}
        {new Date(item.createdAt).toLocaleDateString()}
      </p>

      <hr style={{ margin: "16px 0" }} />

      <h2>Imagem registrada</h2>
      <p style={{ marginBottom: "8px", color: "#4B5563" }}>
        A imagem abaixo ajuda a acompanhar a evolução do cuidado com seus fios e couro cabeludo.
      </p>

      <img
        src={item.annotationBase64 || item.imageBase64}
        alt="Imagem do atendimento"
        style={{
          width: "100%",
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
        }}
      />

      <h2 style={{ marginTop: "20px" }}>O que observamos</h2>
      <p>
        A análise visual permite acompanhar como estão os fios e o couro cabeludo
        no momento do atendimento, ajudando a definir os cuidados mais adequados.
      </p>

      {item.findings.length > 0 && (
        <ul>
          {item.findings.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}

      <h2 style={{ marginTop: "20px" }}>Cuidados recomendados</h2>
      <ul>
        {cuidadosRecomendados.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <Card title="Importante" variant="attention">
        Este relatório tem caráter informativo e de acompanhamento estético.
        As orientações são personalizadas para este atendimento e podem variar
        conforme a evolução ao longo do tempo.
      </Card>

      <div style={{ marginTop: "24px" }}>
        <Button variant="primary" onClick={() => window.print()}>
          Salvar ou Imprimir PDF
        </Button>
      </div>
    </div>
  );
}
