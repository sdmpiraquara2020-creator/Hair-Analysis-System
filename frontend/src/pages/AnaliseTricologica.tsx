import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { avaliarAnaliseTricologica } from "../engine/analiseTricologicaHeuristica";

export default function AnaliseTricologica() {
  const navigate = useNavigate();

  const [oleosidade, setOleosidade] = useState<string[]>([]);
  const [condicoes, setCondicoes] = useState<string[]>([]);
  const [sensacoes, setSensacoes] = useState<string[]>([]);
  const [observacoes, setObservacoes] = useState("");

  function toggle(list: string[], value: string, set: Function) {
    set(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  }

  function handleAvancar() {
    const resultado = avaliarAnaliseTricologica({
      oleosidade,
      condicoes,
      sensacoes,
      observacoes,
    });

    sessionStorage.setItem(
      "resultadoAnaliseTricologica",
      JSON.stringify(resultado)
    );

    navigate("/resultado-analise-tricologica");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
        Análise Tricológica
      </h1>

      <Card title="Oleosidade do couro cabeludo">
        {["Oleosidade elevada", "Oleosidade equilibrada", "Oleosidade baixa"].map(
          (v) => (
            <label key={v}>
              <input
                type="checkbox"
                onChange={() => toggle(oleosidade, v, setOleosidade)}
              />{" "}
              {v}
            </label>
          )
        )}
      </Card>

      <Card title="Condições observadas" variant="attention">
        {["Descamação visível", "Vermelhidão", "Sensibilidade relatada"].map(
          (v) => (
            <label key={v}>
              <input
                type="checkbox"
                onChange={() => toggle(condicoes, v, setCondicoes)}
              />{" "}
              {v}
            </label>
          )
        )}
      </Card>

      <Card title="Sensações relatadas pela cliente">
        {["Queda percebida", "Coceira frequente"].map((v) => (
          <label key={v}>
            <input
              type="checkbox"
              onChange={() => toggle(sensacoes, v, setSensacoes)}
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
