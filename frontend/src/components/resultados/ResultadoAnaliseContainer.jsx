import "./ResultadoAnaliseContainer.css";

export default function ResultadoAnaliseContainer({ analysis }) {
  if (!analysis) {
    return (
      <div className="resultado-empty">
        <p>Nenhuma análise gerada ainda.</p>
      </div>
    );
  }

  return (
    <section className="resultado-container">
      <h2 className="resultado-title">Resultado da Análise</h2>

      {/* Diagnóstico */}
      <div className="card card-diagnostico">
        <h3>Diagnóstico Geral</h3>
        <p>{analysis.diagnostic || "Diagnóstico técnico baseado na análise do fio."}</p>
      </div>

      {/* Métricas */}
      <div className="metrics-grid">
        <div className="card metric-card">
          <span className="metric-label">Score</span>
          <span className="metric-value">{analysis.score}</span>
        </div>

        <div className="card metric-card">
          <span className="metric-label">Risco químico</span>
          <span className={`badge badge-${analysis.riscoQuimico}`}>
            {analysis.riscoQuimico}
          </span>
        </div>
      </div>

      {/* Alertas */}
      <div className="card">
        <h3>Alertas identificados</h3>
        {analysis.alertas?.length ? (
          <ul>
            {analysis.alertas.map((alerta, index) => (
              <li key={index}>{alerta}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">Nenhum alerta relevante identificado.</p>
        )}
      </div>

      {/* Tratamentos */}
      <div className="card">
        <h3>Tratamentos recomendados</h3>
        {analysis.tratamentosRecomendados?.length ? (
          <ul>
            {analysis.tratamentosRecomendados.map((tratamento, index) => (
              <li key={index}>{tratamento}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">Nenhuma recomendação específica.</p>
        )}
      </div>
    </section>
  );
}
