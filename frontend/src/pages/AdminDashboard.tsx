import { useEffect, useState } from "react";
import { obterDashboardAdmin } from "../services/dashboard.service";
import DashboardCards from "../components/dashboard/DashboardCards";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dados, setDados] = useState({
    totalClientes: 0,
    totalAnalises: 0,
    totalEvolucoes: 0,
  });

  useEffect(() => {
    async function carregar() {
      try {
        const response = await obterDashboardAdmin();
        setDados(response);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  if (loading) {
    return <p>Carregando dashboard...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p style={{ marginBottom: 24 }}>
        Visão geral do sistema
      </p>

      <DashboardCards
        totalClientes={dados.totalClientes}
        totalAnalises={dados.totalAnalises}
        totalEvolucoes={dados.totalEvolucoes}
      />
    </div>
  );
}
