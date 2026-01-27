import ClienteHeader from "./cliente/ClienteHeader";
import { useCliente } from "../../core/cliente/ClienteContext";

export default function DashboardCliente() {
  const { clientes = [] } = useCliente();

  return (
    <main>
      <ClienteHeader
        title="Clientes"
        subtitle="Gerencie seus clientes cadastrados"
      />

      <section>
        {clientes.length === 0 && (
          <p style={{ color: "#6b7280" }}>
            Nenhum cliente cadastrado até o momento.
          </p>
        )}

        {clientes.length > 0 && (
          <ul>
            {clientes.map((cliente) => (
              <li key={cliente.id}>
                <strong>{cliente.nome}</strong> — {cliente.telefone}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
