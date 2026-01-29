import { useEffect, useState } from "react";
import api from "../services/api";

export default function HistoricoCliente() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    api.get("/history/cliente-001").then((res) => setData(res.data));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Histórico de Análises</h1>

      {data.map((item) => (
        <div
          key={item.id}
          className="border rounded p-4 bg-white shadow-sm"
        >
          <p className="text-sm text-gray-500">
            {new Date(item.createdAt).toLocaleString()}
          </p>

          <p className="font-medium">
            Tipo: {item.domain}
          </p>

          <pre className="text-xs mt-2 bg-gray-100 p-2 rounded">
            {JSON.stringify(item.ragResult, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}
