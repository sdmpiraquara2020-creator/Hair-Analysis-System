import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarClientes, Cliente } from "../core/cliente/cliente.service";

export default function ListaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    listarClientes()
      .then(setClientes)
      .catch((err) => console.error("Erro ao listar clientes", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando clientes...</p>;

  return (
    <div>
      <h1>Clientes</h1>

      {clientes.length === 0 ? (
        <p>Nenhum cliente cadastrado.</p>
      ) : (
        <ul>
          {clientes.map((cliente) => (
            <li
              key={cliente.id}
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/clientes/${cliente.id}/historico`)
              }
            >
              <strong>{cliente.nome}</strong>
              {cliente.telefone && ` — ${cliente.telefone}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
