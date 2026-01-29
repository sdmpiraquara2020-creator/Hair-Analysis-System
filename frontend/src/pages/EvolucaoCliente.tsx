import AnalysisCompare from "../components/analyse/AnalysisCompare";

export default function EvolucaoCliente() {
  const clientId = "client_123";

  return (
    <div>
      <h2>Evolução do Fio</h2>
      <AnalysisCompare clientId={clientId} />
    </div>
  );
}
