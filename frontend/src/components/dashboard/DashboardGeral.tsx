import "./dashboard-geral.css";

export default function DashboardGeral() {
  return (
    <div className="dashboard-geral">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral das análises e pontos de atenção</p>
      </header>

      <section className="dashboard-cards">
        <div className="card card-green">
          <h3>Análises realizadas</h3>
          <strong>Sem dados</strong>
          <span>Volume total de análises</span>
        </div>

        <div className="card card-orange">
          <h3>Retornos vencidos</h3>
          <strong>Sem dados</strong>
          <span>Clientes que exigem acompanhamento</span>
        </div>

        <div className="card card-red">
          <h3>Riscos ativos</h3>
          <strong>Sem dados</strong>
          <span>Histórico crítico detectado</span>
        </div>

        <div className="card card-neutral">
          <h3>Status geral</h3>
          <strong>OK</strong>
          <span>Base atual de análises</span>
        </div>
      </section>

      <section className="dashboard-graficos">
        <div className="grafico-box">Análises por período</div>
        <div className="grafico-box">Riscos ativos</div>
        <div className="grafico-box">Protocolos aplicados</div>
        <div className="grafico-box">Retornos previstos</div>
      </section>
    </div>
  );
}
