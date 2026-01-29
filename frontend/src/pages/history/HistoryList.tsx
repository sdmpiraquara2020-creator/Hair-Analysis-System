import { AnalysisHistory } from "../../services/history.service";
import HistoryCard from "./HistoryCard";

interface Props {
  items: AnalysisHistory[];
}

export default function HistoryList({ items }: Props) {
  if (items.length === 0) {
    return (
      <p className="text-gray-500">
        Nenhuma análise registrada para este cliente.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map(item => (
        <HistoryCard key={item.id} item={item} />
      ))}
    </div>
  );
}
