interface Props {
  modo: "geral" | "cliente";
  cliente: any;
}

export default function DashboardGraficos({ modo, cliente }: Props) {
  return (
    <div className="dashboard-graficos">
      <div className="grafico">
        {modo === "geral"
          ? "Gráfico geral de análises (fake)"
          : `Evolução da cliente ${cliente.nome} (fake)`}
      </div>

      <div className="grafico">
        {modo === "geral"
          ? "Distribuição de riscos (fake)"
          : "Riscos individuais da cliente (fake)"}
      </div>
    </div>
  );
}
