import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { listarAnalises } from "../services/analiseCapilarStorage";
import { useNavigate } from "react-router-dom";

export default function HistoricoAnalises() {
  const navigate = useNavigate();
  const analises = listarAnalises();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "8px" }}>
          Histórico de Análises
        </h1>
        <p style={{ color: "#4B5563" }}>
          Registros anteriores de análises capilares realizadas.
        </p>
      </div>

      {analises.length === 0 && (
        <Card title="Nenhuma análise registrada">
          Ainda não existem análises salvas no histórico.
        </Card>
      )}

      {analises.map((a) => (
        <Card
          key={a.id}
          title={`Análise • ${new Date(a.data).toLocaleDateString()}`}
          description={a.resumo}
        >
          <strong>Indicadores:</strong>
          <ul style={{ marginLeft: "16px" }}>
            {a.flags.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          <div style={{ marginTop: "12px" }}>
            <Button variant="ghost">Ver Detalhes</Button>
          </div>
        </Card>
      ))}

      <div>
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          Voltar ao Dashboard
        </Button>
      </div>
    </div>
  );
}
