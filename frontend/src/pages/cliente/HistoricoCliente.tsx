import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obterHistoricoCliente } from "../../services/clientes.service";

type Analise = {
  id: string;
  data: string;
  observacoes: string;
};

type Evolucao = {
  id: string;
  data: string;
  descricao: string;
};

export default function HistoricoCliente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<any>(null);
  const [analises, setAnalises] = useState<Analise[]>([]);
  const [evolucoes, setEvolucoes] = useState<Evolucao[]>([]);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await obterHistoricoCliente(id!);
        setCliente(data.cliente);
        setAnalises(data.analises);
        setEvolucoes(data.evolucoes);
      } catch {
        alert("Erro ao carregar histórico");
        navigate("/clientes");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [id, navigate]);

  if (loading) return <p>Carregando histórico...</p>;

  return (
    <div>
      <h1>Histórico do Cliente</h1>
      <p><strong>Nome:</strong> {cliente.nome}</p>
      <p><strong>Telefone:</strong> {cliente.telefone}</p>
      <p><strong>Email:</strong> {cliente.email}</p>

      <hr />

      <h2>Análises Capilares</h2>
      {analises.length === 0 && <p>Nenhuma análise registrada.</p>}
      <ul>
        {analises.map((a) => (
          <li key={a.id}>
            <strong>{a.data}</strong> — {a.observacoes}
          </li>
        ))}
      </ul>

      <hr />

      <h2>Evoluções</h2>
      {evolucoes.length === 0 && <p>Nenhuma evolução registrada.</p>}
      <ul>
        {evolucoes.map((e) => (
          <li key={e.id}>
            <strong>{e.data}</strong> — {e.descricao}
          </li>
        ))}
      </ul>

      <button onClick={() => navigate("/clientes")}>
        Voltar
      </button>
    </div>
  );
}
