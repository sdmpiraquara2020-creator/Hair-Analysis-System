import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
        Dashboard
      </h1>

      <p>
        Painel de acompanhamento do Hair Analysis System.
      </p>

      {/* Cliente ativo */}
      <Card title="Cliente ativo na sessão" variant="attention">
        <p>
          Atendimento em andamento com histórico vinculado ao cliente atual.
        </p>

        <p>
          <strong>Análises realizadas:</strong> nenhuma até o momento
        </p>

        <Button variant="secondary">
          Ver Relatório Cliente
        </Button>
      </Card>

      {/* Ações */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <Card title="Análise Tricológica">
          <p>
            Avaliação do couro cabeludo para segurança e saúde capilar.
          </p>

          <Button
            variant="primary"
            onClick={() => navigate("/analise-tricologica")}
          >
            Nova Análise Tricológica
          </Button>
        </Card>

        <Card title="Análise Capilar">
          <p>
            Avaliação do fio para tratamentos personalizados.
          </p>

          <Button
            variant="primary"
            onClick={() => navigate("/analise-capilar")}
          >
            Nova Análise Capilar
          </Button>
        </Card>
      </div>

      {/* Atendimentos recentes */}
      <Card title="Atendimentos recentes">
        <p>Histórico recente de análises realizadas.</p>
        <p>Nenhuma análise registrada ainda.</p>
      </Card>
    </div>
  );
}
