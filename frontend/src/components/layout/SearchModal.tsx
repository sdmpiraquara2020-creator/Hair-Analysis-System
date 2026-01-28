import { useState } from "react";
import { useCliente } from "../../context/ClienteContext";
import "./SearchModal.css";

interface Props {
  onClose: () => void;
}

export default function SearchModal({ onClose }: Props) {
  const { clientes = [], setClienteAtivo } = useCliente();
  const [query, setQuery] = useState("");

  const filtrados = clientes.filter((c) =>
    `${c.nome} ${c.telefone ?? ""} ${c.cpf ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>Busca rápida de clientes</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <input
          className="modal-input"
          placeholder="Nome, telefone ou CPF"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        <div className="modal-results">
          {filtrados.length === 0 && (
            <p className="empty">Nenhum cliente encontrado</p>
          )}

          {filtrados.map((c) => (
            <div
              key={c.id}
              className="result-item"
              onClick={() => {
                setClienteAtivo(c);
                onClose();
              }}
            >
              <strong>{c.nome}</strong>
              <span>{c.telefone || "Sem telefone"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
