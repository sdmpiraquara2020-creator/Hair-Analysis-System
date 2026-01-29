type Props = {
  onNovoCliente: () => void;
};

export default function ClientesHeader({ onNovoCliente }: Props) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h1>Clientes</h1>
        <p style={{ color: "#6b7280" }}>
          Gerencie seus clientes e acompanhe históricos de atendimento
        </p>
      </div>

      <button
        onClick={onNovoCliente}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          background: "#111827",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Cadastrar cliente
      </button>
    </div>
  );
}
