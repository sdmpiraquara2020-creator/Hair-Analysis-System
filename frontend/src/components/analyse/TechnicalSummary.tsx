import { TechnicalSummaryData } from "../../types/analysis";

interface Props {
  data: TechnicalSummaryData;
}

export function TechnicalSummary({ data }: Props) {
  return (
    <section>
      <h2>Resumo Técnico do Fio</h2>
      <ul>
        <li>Tipo de fio: {data.hairType}</li>
        <li>Espessura: {data.thickness}</li>
        <li>Volume: {data.volume}</li>
        <li>Elasticidade: {data.elasticity}</li>
        <li>Porosidade: {data.porosity}</li>
        <li>Nível de dano: {data.damageLevel}</li>
      </ul>
    </section>
  );
}
