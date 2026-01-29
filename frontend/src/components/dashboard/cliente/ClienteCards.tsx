export function ClienteCards() {
  return (
    <div className="grid-cards">
      <div className="card-clinico risco">
        <h4>Risco Capilar</h4>
        <strong>Baixo</strong>
        <p>Sem sinais críticos</p>
      </div>

      <div className="card-clinico dano">
        <h4>Grau de Dano</h4>
        <strong>Moderado</strong>
        <p>Compatível com histórico químico</p>
      </div>

      <div className="card-clinico historico">
        <h4>Procedimentos</h4>
        <strong>3</strong>
        <p>Últimos 12 meses</p>
      </div>

      <div className="card-clinico retorno">
        <h4>Próximo Retorno</h4>
        <strong>30 dias</strong>
        <p>Manutenção preventiva</p>
      </div>
    </div>
  );
}
