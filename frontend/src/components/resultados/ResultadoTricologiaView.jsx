export default function ResultadoTricologiaView({ resultado }) {
  return (
    <div style={{ maxWidth: 900 }}>
      <h1>Resultado Tricológico</h1>

      <p>{resultado.resumoGeral}</p>

      <section>
        <h3>Couro Cabeludo</h3>
        <ul>
          <li>Oleosidade: {resultado.couroCabeludo.oleosidade}</li>
          <li>Sensibilidade: {resultado.couroCabeludo.sensibilidade}</li>
          <li>Descamação: {resultado.couroCabeludo.descamacao}</li>
          <li>Inflamação: {resultado.couroCabeludo.inflamacao}</li>
        </ul>
      </section>

      <section>
        <h3>Fios</h3>
        <ul>
          <li>Espessura: {resultado.fios.espessura}</li>
          <li>Densidade: {resultado.fios.densidade}</li>
          <li>Resistência: {resultado.fios.resistencia}</li>
          <li>Elasticidade: {resultado.fios.elasticidade}</li>
        </ul>
      </section>

      <section>
        <h3>Sinais Observados</h3>
        <ul>
          {resultado.sinaisObservados.map((sinal, i) => (
            <li key={i}>{sinal}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Recomendações Profissionais</h3>
        <ul>
          {resultado.recomendacoes.tratamentos.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
        <p>
          <strong>Frequência:</strong>{" "}
          {resultado.recomendacoes.frequencia}
        </p>
      </section>

      <p style={{ marginTop: 32, fontStyle: "italic" }}>
        {resultado.observacaoProfissional}
      </p>
    </div>
  );
}
