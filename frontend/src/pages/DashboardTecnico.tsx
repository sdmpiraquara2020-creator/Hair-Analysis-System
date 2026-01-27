import { useEffect, useState } from "react";
import { fetchProfessionalDashboard } from "../api/dashboard.api";

interface ProfessionalDashboardData {
  myAnalyses: number;
  clientsToday: number;
  pendingReports: number;
}

export default function DashboardTecnico() {
  const [data, setData] = useState<ProfessionalDashboardData | null>(null);

  useEffect(() => {
    fetchProfessionalDashboard().then(setData);
  }, []);

  if (!data) return <p>Carregando dashboard...</p>;

  return (
    <div>
      <h2>Dashboard Profissional</h2>

      <ul>
        <li>Minhas análises: {data.myAnalyses}</li>
        <li>Clientes hoje: {data.clientsToday}</li>
        <li>Relatórios pendentes: {data.pendingReports}</li>
      </ul>
    </div>
  );
}
