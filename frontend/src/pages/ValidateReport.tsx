import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ValidateReport() {
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>(
    'loading'
  );
  const [reportId, setReportId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payload = params.get('payload');

    if (!payload) {
      setStatus('invalid');
      return;
    }

    axios
      .get('/api/reports/validate', { params: { payload } })
      .then((res) => {
        if (res.data.valid) {
          setReportId(res.data.reportId);
          setStatus('valid');
        } else {
          setStatus('invalid');
        }
      })
      .catch(() => setStatus('invalid'));
  }, []);

  if (status === 'loading') return <p>Validando relatório...</p>;

  if (status === 'invalid')
    return <p>❌ Relatório inválido ou adulterado</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Relatório Clínico Validado</h2>
      <p>Este relatório é autêntico.</p>
      <p>
        <strong>ID:</strong> {reportId}
      </p>
    </div>
  );
}
