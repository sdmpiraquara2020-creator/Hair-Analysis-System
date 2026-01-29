import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/layout/TopBar";
import { useCliente } from "../../context/ClienteProvider";
import "../../styles/clientes.css";

interface Cliente {
  id: string;
  nome: string;
  telefone?: string;
  cpf?: string;
}

const ITENS_POR_PAGINA = 10;

const ListaClientes: React.FC = () => {
  const navigate = useNavigate();
  const { setClienteSelecionado } = useCliente();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    fetch("http://localhost:3000/api/clientes")
      .then((res) => res.json())
      .then(setClientes);
  }, []);

  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cliente) =>
      `${cliente.nome} ${cliente.telefone || ""} ${cliente.cpf || ""}`
        .toLowerCase()
        .includes(busca.toLowerCase())
    );
  }, [clientes, busca]);

  const totalPaginas = Math.ceil(
    clientesFiltrados.length / ITENS_POR_PAGINA
  );

  const clientesPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    return clientesFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [clientesFiltrados, paginaAtual]);

  return (
    <>
      <TopBar />

      <main className="clientes-container">
        {/* VOLTAR */}
        <button
          className="btn-voltar"
          onClick={() => navigate("/dashboard")}
        >
          ← Voltar para Dashboard
        </button>

        {/* CABEÇALHO */}
        <div className="clientes-header">
          <div>
            <h1>Clientes</h1>
            <span className="clientes-total">
              Total cadastrados: {clientesFiltrados.length}
            </span>
          </div>

          <input
            type="text"
            className="clientes-busca"
            placeholder="Buscar por nome, telefone ou CPF"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* TABELA */}
        <div className="clientes-table-wrapper">
          <table className="clientes-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>CPF</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientesPaginados.map((cliente) => (
                <tr key={cliente.id}>
                  <td className="cliente-nome">{cliente.nome}</td>
                  <td>{cliente.telefone || "-"}</td>
                  <td>{cliente.cpf || "-"}</td>
                  <td className="acoes">
                    <button
                      className="acao selecionar"
                      title="Selecionar cliente"
                      onClick={() => {
                        setClienteSelecionado(cliente);
                        navigate("/dashboard");
                      }}
                    />
                    <button
                      className="acao editar"
                      title="Editar cliente"
                      onClick={() =>
                        navigate(`/clientes/${cliente.id}/editar`)
                      }
                    />
                    <button
                      className="acao excluir"
                      title="Excluir cliente"
                    />
                  </td>
                </tr>
              ))}

              {clientesPaginados.length === 0 && (
                <tr>
                  <td colSpan={4} className="vazio">
                    Nenhum cliente encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        {totalPaginas > 1 && (
          <div className="paginacao">
            <button
              disabled={paginaAtual === 1}
              onClick={() => setPaginaAtual(1)}
            >
              «
            </button>
            <button
              disabled={paginaAtual === 1}
              onClick={() => setPaginaAtual((p) => p - 1)}
            >
              ‹
            </button>
            <span>
              Página {paginaAtual} de {totalPaginas}
            </span>
            <button
              disabled={paginaAtual === totalPaginas}
              onClick={() => setPaginaAtual((p) => p + 1)}
            >
              ›
            </button>
            <button
              disabled={paginaAtual === totalPaginas}
              onClick={() => setPaginaAtual(totalPaginas)}
            >
              »
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default ListaClientes;
