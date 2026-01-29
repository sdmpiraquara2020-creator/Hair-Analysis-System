import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import jsPDF from 'jspdf';

type TricologicaHistoryItem = {
  tricologicaScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: string;
};

type Props = {
  clientId: string;
};

const riskStyles: Record<
  TricologicaHistoryItem['riskLevel'],
  { label: string; bg: string; color: string; border: string }
> = {
  low: {
    label: 'Baixo',
    bg: '#E8F7EE',
    color: '#1E7F4E',
    border: '#9ED9B8',
  },
  medium: {
    label: 'Médio',
    bg: '#FFF6E5',
    color: '#9A6A00',
    border: '#FFD27A',
  },
  high: {
    label: 'Alto',
    bg: '#FDECEC',
    color: '#B42318',
    border: '#F2B8B5',
  },
};

export function TricologicaHistory({ clientId }: Props) {
  const { token } = useAuth();

  const [history, setHistory] = useState<TricologicaHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;

    const loadHistory = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/vision/tricologica/history/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erro ao carregar histórico tricológico');
        }

        const data = await response.json();
        setHistory(data);
      } catch (err: any) {
        setError(err.message || 'Erro inesperado');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [clientId, token]);

  if (loading) return <p>Carregando histórico tricológico…</p>;
  if (error) return <p style={{ color: '#B42318' }}>{error}</p>;
  if (history.length === 0) return <p>Nenhum histórico tricológico disponível.</p>;

  const first = history[0];
  const last = history[history.length - 1];
  const diff = Number((last.tricologicaScore - first.tricologicaScore).toFixed(1));
  const hasRegression = diff < 0;

  const chartData = history.map(item => ({
    date: new Date(item.createdAt).toLocaleDateString(),
    score: Number(item.tricologicaScore.toFixed(1)),
  }));

  // 📄 Exportação PDF
  const exportPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Relatório Tricológico', 14, 20);

    doc.setFontSize(11);
    doc.text(`Cliente: ${clientId}`, 14, 30);
    doc.text(`Data do relatório: ${new Date().toLocaleDateString()}`, 14, 36);

    doc.line(14, 40, 196, 40);

    doc.text(
      `Primeira análise: ${first.tricologicaScore.toFixed(1)} (${new Date(
        first.createdAt
      ).toLocaleDateString()})`,
      14,
      48
    );

    doc.text(
      `Última análise: ${last.tricologicaScore.toFixed(1)} (${new Date(
        last.createdAt
      ).toLocaleDateString()})`,
      14,
      54
    );

    doc.text(
      `Resultado geral: ${
        diff > 0 ? `Melhora (+${diff})` : diff < 0 ? `Regressão (${diff})` : 'Estável'
      }`,
      14,
      60
    );

    doc.line(14, 64, 196, 64);

    let y = 72;
    doc.setFontSize(10);
    doc.text('Histórico detalhado:', 14, y);
    y += 6;

    history.forEach(item => {
      doc.text(
        `${new Date(item.createdAt).toLocaleDateString()} — Score: ${item.tricologicaScore.toFixed(
          1
        )} — Risco: ${item.riskLevel}`,
        14,
        y
      );
      y += 6;
    });

    doc.save(`relatorio-tricologico-${clientId}.pdf`);
  };

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Evolução Tricológica</h3>

      {hasRegression && (
        <div
          style={{
            border: '2px solid #B42318',
            background: '#FDECEC',
            color: '#7A271A',
            borderRadius: 8,
            padding: 12,
            margin: '12px 0',
          }}
        >
          <strong>⚠️ Atenção:</strong> Regressão detectada. Recomenda-se revisão de
          protocolo.
        </div>
      )}

      <button
        onClick={exportPdf}
        style={{
          marginBottom: 16,
          padding: '8px 14px',
          borderRadius: 6,
          border: '1px solid #2563EB',
          background: '#2563EB',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        📄 Exportar PDF
      </button>

      {/* 📊 Gráfico */}
      <div style={{ width: '100%', height: 260, marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
