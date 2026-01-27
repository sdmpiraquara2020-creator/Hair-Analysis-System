interface DashboardCardsProps {
  totalClientes: number;
  totalAnalises: number;
  totalEvolucoes: number;
}

function Card({
  titulo,
  valor,
  subtitulo,
}: {
  titulo: string;
  valor: number;
  subtitulo?: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 8,
        padding: 20,
        minWidth: 220,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <p
        style={{
          fontSize: 14,
          color: "#666",
          marginBottom: 8,
        }}
      >
        {titulo}
      </p>

      <h2
        style={{
          fontSize: 32,
          margin: 0,
        }}
      >
        {valor}
      </h2>

      {subtitulo && (
        <p
          style={{
            fontSize: 12,
            color: "#999",
            marginTop: 6,
          }}
        >
          {subtitulo}
        </p>
      )}
    </div>
  );
}

export default function DashboardCards({
  totalClientes,
  totalAnalises,
  totalEvolucoes,
}: DashboardCardsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        flexWrap: "wrap",
      }}
    >
      <Card
        titulo="Clientes cadastrados"
        valor={totalClientes}
        subtitulo="Total no sistema"
      />

      <Card
        titulo="Análises realizadas"
        valor={totalAnalises}
        subtitulo="Diagnósticos capilares"
      />

      <Card
        titulo="Evoluções registradas"
        valor={totalEvolucoes}
        subtitulo="Acompanhamentos"
      />
    </div>
  );
}
