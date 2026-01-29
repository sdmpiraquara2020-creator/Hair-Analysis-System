import { useEffect, useState } from "react";
import { getClientHistory } from "../../services/history.service";
import { HistoryEventDTO } from "../../types/history.types";

export function ClientHistory({ clientId }: { clientId: string }) {
  const [items, setItems] = useState<HistoryEventDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClientHistory(clientId)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [clientId]);

  if (loading) return <p>Carregando…</p>;
  if (!items.length) return <p>Sem histórico</p>;

  return (
    <ul>
      {items.map((e) => (
        <li key={e.id}>
          <strong>{e.eventType}</strong> — {e.summary}
          <br />
          <small>{new Date(e.createdAt).toLocaleString("pt-BR")}</small>
        </li>
      ))}
    </ul>
  );
}
