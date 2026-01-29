import { useEffect, useState } from "react";
import { getHistoryByClient, AnalysisHistory } from "../../services/history.service";
import HistoryList from "./HistoryList";

export default function HistoryPage() {
  const [data, setData] = useState<AnalysisHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const clientId = "cliente_123"; // 🔧 depois vem do contexto/rota

  useEffect(() => {
    getHistoryByClient(clientId)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-500">Carregando histórico...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Histórico de Análises
      </h1>

      <HistoryList items={data} />
    </div>
  );
}
