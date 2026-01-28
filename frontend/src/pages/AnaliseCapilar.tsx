import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { avaliarAnaliseCapilar } from "../engine/analiseCapilarHeuristica";

export default function AnaliseCapilar() {
  const navigate = useNavigate();

  const [tipoFio, setTipoFio] = useState<string[]>([]);
  const [estadoFio, setEstadoFio] = useState<string[]>([]);
  const [comportamentoFio, setComportamentoFio] = useState<string[]>([]);
  const [observacoes, setObservacoes] = useState("");

  function toggle(list: string[], value: string, set: Function) {
    set(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  }

  function handleAvancar() {
    const resultado = avaliarAnaliseCapilar({
      tipoFio,
      estadoFio,
      comportamentoFio,
      observacoes,
    });

    sessionStorage.setItem(
      "resultadoAnaliseCapilar",
      JSON.stringify(resultado)
    );

    navigate("/resultado-analise-capilar");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700 }}>Análise Capilar</h1>

      <Card title="Tipo e estrutura do fio">
        {["Fio fino", "Fio médio", "Fio grosso"].map((v) => (
          <label key={v}>
            <input
              type="checkbox"
              onChange={() => toggle(tipoFio, v, setTipoFio)}
            />{" "}
            {v}
          </label>
        ))}
      </Card>

      <Card title="Estado estético do fio" variant="attention">
        {[
          "Estrutura fragilizada",
          "Ressecamento visível",
          "Elasticidade comprometida",
          "Fio saudável",
        ].map((v) => (
          <label key={v}>
            <input
              type="checkbox"
              onChange={() => toggle(estadoFio, v, setEstadoFio)}
            />{" "}
            {v}
          </label>
        ))}
      </Card>

      <Card title="Comportamento do fio">
        {[
          "Dificuldade de alinhamento",
          "Volume excessivo",
          "Ondulação irregular",
        ].map((v) => (
          <label key={v}>
            <input
              type="checkbox"
              onChange={() =>
                toggle(comportamentoFio, v, setComportamentoFio)
              }
            />{" "}
            {v}
          </label>
        ))}
      </Card>

      <Card title="Observações do profissional">
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows={4}
          style={{ width: "100%" }}
        />
      </Card>

      <div style={{ display: "flex", gap: "12px" }}>
        <Button variant="secondary">Salvar Análise</Button>
        <Button variant="primary" onClick={handleAvancar}>
          Avançar para Resultado
        </Button>
      </div>
    </div>
  );
}
