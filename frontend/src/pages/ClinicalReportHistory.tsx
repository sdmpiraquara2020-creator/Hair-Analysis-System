import { useEffect, useState } from "react";
import {
  getClinicalReportHistory,
  ClinicalReportHistory
} from "../services/clinicalReportService";
import Layout from "../components/Layout";

export default function ClinicalReportHistoryPage() {
  const [reports, setReports] = useState<ClinicalReportHistory[]>([]);

  useEffect(() => {
    getClinicalReportHistory("CLIENT_ID_FIXO_TEMP")
      .then(setReports);
  }, []);

  return (
    <Layout>
      <h1>Histórico de Relatórios Clínicos</h1>

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Período</th>
            <th>Total análises</th>
            <th>Variação</th>
            <th>Arquivo</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r.id}>
              <td>{new Date(r.generatedAt).toLocaleDateString()}</td>
              <td>{r.periodDays} dias</td>
              <td>{r.totalAnalyses}</td>
              <td>{r.deltaPercentage}%</td>
              <td>{r.fileName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
