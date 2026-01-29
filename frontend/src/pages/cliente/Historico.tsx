import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HistoricoItem } from "../../types/Historico";
import { useFeedback } from "../../context/FeedbackContext";

export default function HistoricoCliente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError } = useFeedback();

  const [historico, setHistorico] = useState<HistoricoItem[]>([]);

  // MVP: dados mockados (backend entra depois)
  useEffect(() => {
    if (!id) return;

    try {
      setHistorico([
        {
          id: "1",
          clienteId: id,
          tipo: "ANALISE",
          titulo: "Análise Capilar Inicial",
          descricao: "Couro cabeludo sensível, fios com ressecamento.",
          criadoEm: new Date().toISOString(),
        },
        {
          id: "2",
          clienteId: id,
          tipo: "EVOLUCAO",
          titulo: "Evolução após 30 dias",
          descricao: "Redução de frizz e melhora da hidratação.",
          criadoEm: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      showError("Erro ao carregar histórico.");
    }
  }, [id, showError]);

  return (
    <div>
      <button onClick={() => navigate("/clientes")}>
        ← Voltar para clientes
      </button>

      <h1>Histórico do Cliente</h1>
      <p>Análises e evolução ao longo do tempo</p>

      <div style={{ margin: "16px 0" }}>
        <button style={{ marginRight: 8 }}>
          + Nova Análise
        </button>
        <button>
          + Nova Evolução
        </button>
      </div>

      {historico.length === 0 ? (
        <p>Nenhum histórico registrado.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {historico.map((item) => (
            <li
              key={item.id}
              style={{
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 6,
                marginBottom: 12,
              }}
            >
              <strong>
                {item.tipo === "ANALISE" ? "🔬" : "📈"} {item.titulo}
              </strong>
              <p style={{ margin: "8px 0" }}>{item.descricao}</p>
              <small>
                {new Date(item.criadoEm).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
