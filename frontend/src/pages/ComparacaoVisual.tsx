import { useState } from "react";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import VisualStatusBadge from "../components/ui/VisualStatusBadge";

import {
  listarVisionHistory,
} from "../vision/VisionHistoryStorage";
import { compararVision } from "../vision/compareVision";
import { VisionHistoryItem } from "../vision/VisionHistory.types";

export default function ComparacaoVisual() {
  const lista = listarVisionHistory();

  const [idxAntes, setIdxAntes] = useState<number | null>(null);
  const [idxDepois, setIdxDepois] = useState<number | null>(null);

  if (lista.length < 2) {
    return (
      <Card title="Comparação Visual">
        É necessário ter pelo menos dois registros visuais salvos.
      </Card>
    );
  }

  const antes: VisionHistoryItem | null =
    idxAntes !== null ? lista[idxAntes] : null;

  const depois: VisionHistoryItem | null =
    idxDepois !== null ? lista[idxDepois] : null;

  const resultado =
    antes && depois ? compararVision(antes, depois) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
        Comparação Visual (Antes × Depois)
      </h1>

      <Card title="Selecionar registros">
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <strong>Antes</strong>
            <select
              style={{ display: "block", marginTop: "6px" }}
              onChange={(e) => setIdxAntes(Number(e.target.value))}
            >
              <option value="">Selecione</option>
              {lista.map((item, i) => (
                <option key={item.id} value={i}>
                  {new Date(item.createdAt).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <strong>Depois</strong>
            <select
              style={{ display: "block", marginTop: "6px" }}
              onChange={(e) => setIdxDepois(Number(e.target.value))}
            >
              <option value="">Selecione</option>
              {lista.map((item, i) => (
                <option key={item.id} value={i}>
                  {new Date(item.createdAt).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {antes && depois && (
        <>
          <Card title="Resultado da comparação">
            <VisualStatusBadge status={resultado!.status} />
            <p style={{ marginTop: "8px" }}>{resultado!.resumo}</p>
          </Card>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Card title="Antes">
              <img
                src={antes.annotationBase64 || antes.imageBase64}
                alt="Antes"
                style={{ width: "100%", borderRadius: "12px" }}
              />
              {antes.findings.length > 0 && (
                <>
                  <strong>Achados:</strong>
                  <ul>
                    {antes.findings.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </>
              )}
            </Card>

            <Card title="Depois">
              <img
                src={depois.annotationBase64 || depois.imageBase64}
                alt="Depois"
                style={{ width: "100%", borderRadius: "12px" }}
              />
              {depois.findings.length > 0 && (
                <>
                  <strong>Achados:</strong>
                  <ul>
                    {depois.findings.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </>
              )}
            </Card>
          </div>
        </>
      )}

      <Button variant="secondary" onClick={() => history.back()}>
        Voltar
      </Button>
    </div>
  );
}
