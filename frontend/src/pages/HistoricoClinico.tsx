// frontend/src/pages/HistoricoClinico.tsx
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  getClinicalReports,
  ClinicalReport,
} from '../services/clinicalReportService';

export default function HistoricoClinico() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [reports, setReports] = useState<ClinicalReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const data = await getClinicalReports();
      if (mounted) {
        setReports(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      style={{
        padding: 32,
        minHeight: '100vh',
        backgroundColor: isDark ? '#0f0f0f' : '#ffffff',
        color: isDark ? '#ffffff' : '#000000',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>
        Histórico Clínico
      </h1>

      {loading && <p>Carregando relatórios...</p>}

      {!loading && reports.length === 0 && (
        <p>Nenhum relatório clínico encontrado.</p>
      )}

      {!loading && reports.length > 0 && (
        <div style={{ display: 'grid', gap: 12 }}>
          {reports.map((report) => (
            <div
              key={report.id}
              style={{
                border: `1px solid ${isDark ? '#333' : '#ddd'}`,
                borderRadius: 8,
                padding: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong>{report.clientName}</strong>
                <div
                  style={{
                    fontSize: 12,
                    color: isDark ? '#aaa' : '#777',
                  }}
                >
                  {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div style={{ fontWeight: 600 }}>
                Saúde do fio: {report.hairHealth}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
