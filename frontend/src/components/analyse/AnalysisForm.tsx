import { useState } from "react";
import { createClinicalAnalysis } from "../../api/analysis.api";

interface Props {
  clientId: string;
  onSuccess: (result: any) => void;
}

export default function AnalysisForm({ clientId, onSuccess }: Props) {
  const [form, setForm] = useState({
    hairType: "",
    porosity: "",
    elasticity: "",
    chemistry: "",
    damage: "",
    observations: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      clientId,
      hairType: form.hairType,
      porosity: form.porosity,
      elasticity: form.elasticity,
      chemistry: form.chemistry ? form.chemistry.split(",") : [],
      damage: form.damage ? form.damage.split(",") : [],
      observations: form.observations,
    };

    const result = await createClinicalAnalysis(payload);
    onSuccess(result);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Análise Capilar</h3>

      <input placeholder="Tipo de fio" onChange={(e) => setForm({ ...form, hairType: e.target.value })} />
      <input placeholder="Porosidade" onChange={(e) => setForm({ ...form, porosity: e.target.value })} />
      <input placeholder="Elasticidade" onChange={(e) => setForm({ ...form, elasticity: e.target.value })} />
      <input placeholder="Químicas (separadas por vírgula)" onChange={(e) => setForm({ ...form, chemistry: e.target.value })} />
      <input placeholder="Danos (separados por vírgula)" onChange={(e) => setForm({ ...form, damage: e.target.value })} />

      <textarea
        placeholder="Observações clínicas"
        onChange={(e) => setForm({ ...form, observations: e.target.value })}
      />

      <button type="submit">Gerar Análise</button>
    </form>
  );
}
