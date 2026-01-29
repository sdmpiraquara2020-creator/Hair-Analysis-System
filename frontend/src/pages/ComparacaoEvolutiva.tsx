import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import NivelBadge from "../components/ui/NivelBadge";
import { listarAnalises } from "../services/analiseCapilarStorage";
import { compararAnalises } from "../engine/comparacaoEvolutiva";

export default function ComparacaoEvolutiva() {
  const navigate = useNavigate();
  const analises = listarAnalises();

  const [indexAnterior, setIndexAnterior] = useState<number | null>(null);
  const [indexAtual, setIndexAtual] = useState<number | null>(null);

  if (analises.length < 2) {
    return (
      <Card title="Comparação Evolutiva">
        É necessário ter pelo menos duas análises salvas para realizar a
        comparação.
        <div style={{ marginTop: "16px" }}>
          <Button variant="secondary" onClick={() => navigate("/historico-analises")}>
            Voltar ao Histórico
          </Button>
        </div>
      </Card>
    );
  }

  const anterior = indexAnterior !== null ? analises[indexAnterior] : null;
  const atual = indexAtual !== null ? analises[indexAtual] : null;

  const resultado =
    anterior && atual
      ? compararAnalises(
          {
            data: anterior.data,
            score: anterior.score,
            nivel: anterior.nivel,
            flags: anterior.flags,
          },
          {
            data: atual.data,
            score: atual.score,
            nivel: atual.nivel,
            flags: atual.flags,
          }
        )
      : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
        Comparação Evolutiva
      </h1>

      <Card title="Selecionar análises para comparação">
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <strong>Análise anterior</strong>
            <select
              style={{ display: "block", marginTop: "6px" }}
              onChange={(e) => setIndexAnterior(Number(e.target.value))}
            >
              <option value="">Selecione</option>
              {analises.map((a, i) => (
                <option key={a.id} value={i}>
                  {new Date(a.data).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <strong>Análise atual</strong>
            <select
              style={{ display: "block", marginTop: "6px" }}
              onChange={(e) => setIndexAtual(Number(e.target.value))}
            >
              <option value="">Selecione</option>
              {analises.map((a, i) => (
                <option key={a.id} value={i}>
                  {new Date(a.data).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {resultado && (
        <Card title="Resultado da comparação">
          <p>{resultado.resumo}</p>

          <p>
            <strong>Diferença de pontuação:</strong>{" "}
            {resultado.diferencaScore}
          </p>

          <div style={{ display: "flex", gap: "24px", marginTop: "12px" }}>
            <div>
              <strong>Antes</strong>
              <div style={{ marginTop: "6px" }}>
                <NivelBadge nivel={anterior!.nivel} />
              </div>
            </div>

            <div>
              <strong>Depois</strong>
              <div style={{ marginTop: "6px" }}>
                <NivelBadge nivel={atual!.nivel} />
              </div>
            </div>
          </div>
        </Card>
      )}

      <Button variant="secondary" onClick={() => navigate("/historico-analises")}>
        Voltar ao Histórico
      </Button>
    </div>
  );
}
