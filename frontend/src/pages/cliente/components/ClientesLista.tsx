const clientesMock = [
  { id: 1, nome: "Maria Silva", telefone: "(41) 99999-9999" },
  { id: 2, nome: "Ana Souza", telefone: "(41) 98888-8888" },
];

export default function ClientesLista() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {clientesMock.map((cliente) => (
        <div
          key={cliente.id}
          style={{
            padding: 16,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            cursor: "pointer",
          }}
        >
          <strong>{cliente.nome}</strong>
          <div style={{ fontSize: 14, color: "#6b7280" }}>
            {cliente.telefone}
          </div>
        </div>
      ))}
    </div>
  );
}
