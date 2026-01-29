import StatusBadge from "./StatusBadge";

export default function ServiceCard({ service }) {
  let status = "apto";

  if (service.requirements?.length) status = "preparo";
  if (service.blocked) status = "bloqueado";

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>{service.name}</strong>
        <StatusBadge status={status} />
      </div>

      <p style={{ marginTop: 8, color: "#555" }}>{service.reason}</p>

      {service.requirements?.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <strong>Requisitos:</strong>
          <ul>
            {service.requirements.map((r, i) => (
              <li key={i}>
                {r.type === "tratamento_previo" && (
                  <>
                    Tratamento prévio:{" "}
                    <strong>{r.services.join(", ")}</strong>{" "}
                    {r.days > 0 && `(aguardar ${r.days} dias)`}
                  </>
                )}
                {r.type === "corte_obrigatorio" && (
                  <>Corte obrigatório antes do procedimento</>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
