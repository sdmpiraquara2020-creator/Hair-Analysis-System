import { useEffect, useState } from "react";
import {
  getClientHistory,
  getComparison,
} from "../services/history.service";

export default function HistoryClinical() {
  const clientId = "CLIENT_ID_FIXO_TEMP"; // depois vem do contexto
  const [items, setItems] = useState<any[]>([]);
  const [comparison, setComparison] = useState<any>(null);

  useEffect(() => {
    getClientHistory(clientId).then((data) => setItems(data.items));
  }, []);

  async function compare(baseId: string, targetId: string) {
    const result = await getComparison(baseId, targetId);
    setComparison(result);
  }

  return (
    <div>
      <h2>Histórico Clínico</h2>

      <ul>
        {items.map((i) => (
          <li key={i.id}>
            {new Date(i.createdAt).toLocaleDateString()} — Score {i.score}
          </li>
        ))}
      </ul>

      {items.length >= 2 && (
        <button onClick={() => compare(items[1].id, items[0].id)}>
          Comparar últimas análises
        </button>
      )}

      {comparison && (
        <div>
          <h3>Comparação Clínica</h3>
          <p>
            Score: {comparison.base.score} → {comparison.target.score}
          </p>
          <p>Status: {comparison.delta.status}</p>
          <p>{comparison.clinicalNotes}</p>
        </div>
      )}
    </div>
  );
}
