import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

import {
  listarVisionHistory,
  limparVisionHistory,
} from "../vision/VisionHistoryStorage";

export default function HistoricoVision() {
  const navigate = useNavigate();
  const lista = listarVisionHistory();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
        Histórico Visual
      </h1>

      {lista.length === 0 ? (
        <Card>Nenhum registro visual salvo.</Card>
      ) : (
        lista.map((item) => (
          <Card
            key={item.id}
            title={new Date(item.createdAt).toLocaleString()}
          >
            <img
              src={item.annotationBase64 || item.imageBase64}
              alt="Registro visual"
              style={{ width: "100%", borderRadius: "12px" }}
            />

            {item.findings.length > 0 && (
              <>
                <strong>Observações:</strong>
                <ul>
                  {item.findings.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </>
            )}

            <div style={{ marginTop: "12px", display: "flex", gap: "12px" }}>
              <Button
                variant="secondary"
                onClick={() =>
                  navigate(`/relatorio-vision/${item.id}`)
                }
              >
                PDF Técnico
              </Button>

              <Button
                variant="primary"
                onClick={() =>
                  navigate(`/relatorio-vision-cliente/${item.id}`)
                }
              >
                PDF Cliente
              </Button>
            </div>
          </Card>
        ))
      )}

      {lista.length > 0 && (
        <Button
          variant="secondary"
          onClick={() => {
            if (confirm("Deseja limpar todo o histórico visual?")) {
              limparVisionHistory();
              location.reload();
            }
          }}
        >
          Limpar Histórico Visual
        </Button>
      )}
    </div>
  );
}
