import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getHistoryByClient, AnalysisHistory } from "../services/history.service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function HistoryEvolutionPage() {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // ⚠️ temporário — depois vem por rota/contexto
  const clientId = "cliente_123";

  useEffect(() => {
    getHistoryByClient(clientId)
      .then((data) => {
        // ordena do mais antigo para o mais recente
        const ordered = [...data].reverse();
        setHistory(ordered);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Carregando evolução...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        Nenhum dado disponível para evolução.
      </div>
    );
  }

  const labels = history.map((item) =>
    new Date(item.createdAt).toLocaleDateString()
  );

  const scores = history.map((item) => item.score);

  const data = {
    labels,
    datasets: [
      {
        label: "Score de Evolução",
        data: scores,
        borderColor: "#2563eb", // blue-600
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        tension: 0.3,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `Score: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Score",
        },
      },
      x: {
        title: {
          display: true,
          text: "Data da Análise",
        },
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Evolução do Cliente
      </h1>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
