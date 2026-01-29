import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AnalysisHistory } from "../services/history.service";

function getScoreStyle(score: number) {
  if (score >= 80) {
    return {
      label: "Excelente",
      className: "bg-green-100 text-green-800 border-green-300",
    };
  }

  if (score >= 60) {
    return {
      label: "Bom",
      className: "bg-blue-100 text-blue-800 border-blue-300",
    };
  }

  if (score >= 40) {
    return {
      label: "Atenção",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    };
  }

  return {
    label: "Crítico",
    className: "bg-red-100 text-red-800 border-red-300",
    };
}

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<AnalysisHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    if (!id) return;

    api
      .get<AnalysisHistory>(`/history/${id}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleGeneratePdf = async () => {
    if (!id) return;

    try {
      setLoadingPdf(true);

      const response = await api.get(`/history/${id}/pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } finally {
      setLoadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Carregando análise...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-red-600">
        Análise não encontrada.
      </div>
    );
  }

  const scoreStyle = getScoreStyle(data.score);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Voltar para o histórico
      </button>

      <div className={`border rounded-lg p-6 shadow-sm ${scoreStyle.className}`}>
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            Detalhe da Análise
          </h1>

          <span className="text-xs px-3 py-1 rounded border font-medium">
            {scoreStyle.label}
          </span>
        </div>

        <p className="text-sm opacity-70 mt-1">
          {new Date(data.createdAt).toLocaleString()}
        </p>

        <div className="mt-4 space-y-2">
          <p>
            <strong>Tipo:</strong>{" "}
            {data.analysisType === "tricologica"
              ? "Análise Tricológica"
              : "Análise Capilar"}
          </p>

          <p>
            <strong>Score:</strong>{" "}
            <span className="text-lg font-semibold">
              {data.score}
            </span>
          </p>
        </div>

        <div className="mt-6">
          <h2 className="font-medium mb-2">
            Interpretação Técnica
          </h2>

          <div className="text-sm whitespace-pre-line">
            {data.interpretation}
          </div>
        </div>

        {data.flags.length > 0 && (
          <div className="mt-6">
            <h2 className="font-medium mb-2">
              Pontos de Atenção
            </h2>

            <div className="flex flex-wrap gap-2">
              {data.flags.map((flag) => (
                <span
                  key={flag}
                  className="text-xs px-2 py-1 rounded bg-white bg-opacity-60 border"
                >
                  {flag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleGeneratePdf}
          disabled={loadingPdf}
          className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loadingPdf ? "Gerando PDF..." : "Gerar PDF do Laudo"}
        </button>
      </div>
    </div>
  );
}
