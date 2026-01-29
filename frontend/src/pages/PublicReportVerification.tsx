import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function PublicReportVerification() {
  const { reportId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/reports/verify/${reportId}`);
        setData(res.data);
      } catch {
        setData({ valid: false });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [reportId]);

  if (loading) return <p>Verificando relatório...</p>;

  if (!data?.valid) {
    return (
      <div>
        <h1>Relatório inválido</h1>
        <p>Este relatório não possui assinatura válida.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Relatório válido</h1>
      <p><strong>Assinado por:</strong> {data.signedBy}</p>
      <p><strong>Data:</strong> {new Date(data.signedAt).toLocaleString()}</p>
      <p style={{ fontSize: "12px", opacity: 0.6 }}>
        Hash: {data.signatureHash}
      </p>
    </div>
  );
}
