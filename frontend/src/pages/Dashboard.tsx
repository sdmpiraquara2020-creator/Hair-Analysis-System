import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-text-main">
          Dashboard
        </h1>

        <p className="text-text-muted">
          Painel de acompanhamento do Hair Analysis System.
        </p>
      </div>

      {/* Cliente ativo */}
      <Card title="Cliente ativo na sessão" variant="attention">
        <div className="space-y-3">
          <p className="text-text-main">
            Atendimento em andamento com histórico vinculado ao cliente atual.
          </p>

          <p className="text-text-main">
            <strong>Análises realizadas:</strong> nenhuma até o momento
          </p>

          <div>
            <Button variant="secondary">
              Ver Relatório Cliente
            </Button>
          </div>
        </div>
      </Card>

      {/* Ações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Análise Tricológica">
          <div className="flex flex-col gap-4">
            <p className="text-text-main">
              Avaliação do couro cabeludo para segurança e saúde capilar.
            </p>

            <Button
              variant="primary"
              onClick={() => navigate("/analise-tricologica")}
            >
              Nova Análise Tricológica
            </Button>
          </div>
        </Card>

        <Card title="Análise Capilar">
          <div className="flex flex-col gap-4">
            <p className="text-text-main">
              Avaliação do fio para tratamentos personalizados.
            </p>

            <Button
              variant="primary"
              onClick={() => navigate("/analise-capilar")}
            >
              Nova Análise Capilar
            </Button>
          </div>
        </Card>
      </div>

      {/* Atendimentos recentes */}
      <Card title="Atendimentos recentes">
        <div className="space-y-2">
          <p className="text-text-main">
            Histórico recente de análises realizadas.
          </p>

          <p className="text-text-muted">
            Nenhuma análise registrada ainda.
          </p>
        </div>
      </Card>
    </div>
  );
}
