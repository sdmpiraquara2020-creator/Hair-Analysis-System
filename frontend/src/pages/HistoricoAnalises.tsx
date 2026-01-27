import { useEffect, useState } from "react";
import analisesService, {
  AnaliseHistorico,
} from "../services/analysis.service";

export default function HistoricoAnalises() {
  const [historico, setHistorico] = useState<AnaliseHistorico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await analisesService.buscarHistoricoAnalises();
        setHistorico(data);
      } catch (error) {
        console.error("Erro ao buscar histórico", error);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  if (loading) {
    return <p>Carregando histórico...</p>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Histórico de Análises</h1>

      {historico.length === 0 && <p>Nenhuma análise encontrada.</p>}

      <ul>
        {historico.map((item) => (
          <li key={item.id}>
            <strong>{new Date(item.createdAt).toLocaleDateString()}</strong> —{" "}
            {item.resumo}
          </li>
        ))}
      </ul>
    </div>
  );
}
