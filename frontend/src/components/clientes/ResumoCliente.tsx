type Cliente = {
  id?: string;
  nome: string;
  telefone?: string;
  email?: string;
};

type Props = {
  cliente: Cliente;
  onEditar?: () => void;
};

export default function ResumoCliente({ cliente, onEditar }: Props) {
  return (
    <div className="resumo-cliente-card">
      <div className="resumo-cliente-header">
        <h3>Cliente selecionado</h3>

        {onEditar && (
          <button
            type="button"
            className="btn-secundario"
            onClick={onEditar}
          >
            Editar cadastro
          </button>
        )}
      </div>

      <div className="resumo-cliente-body">
        <div className="resumo-item">
          <span className="label">Nome</span>
          <strong>{cliente.nome}</strong>
        </div>

        {cliente.telefone && (
          <div className="resumo-item">
            <span className="label">Telefone</span>
            <strong>{cliente.telefone}</strong>
          </div>
        )}

        {cliente.email && (
          <div className="resumo-item">
            <span className="label">E-mail</span>
            <strong>{cliente.email}</strong>
          </div>
        )}
      </div>

      <p className="resumo-observacao">
        As informações apresentadas são técnicas e visuais, não substituindo
        avaliação dermatológica ou diagnóstico médico.
      </p>
    </div>
  );
}
