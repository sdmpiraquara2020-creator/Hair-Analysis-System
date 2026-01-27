import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysisHistory } from "../context/AnalysisHistoryContext";
import { useCliente } from "../context/ClienteContext";

type ResultadoCapilar = {
  resumoTecnico: string;
  pontosObservados: string[];
  recomendacoes: string[];
  interpretacaoIA: string;
};

export default function AnaliseCapilar() {
  const navigate = useNavigate();
  const { adicionarRegistro } = useAnalysisHistory();
  const { cliente, criarCliente, adicionarAnaliseAoCliente } = useCliente();

  const [resultado, setResultado] = useState<ResultadoCapilar | null>(null);

  function gerarAvaliacaoCapilar() {
    const resultadoGerado: ResultadoCapilar = {
      resumoTecnico:
        "Avaliação capilar realizada com base na observação da estrutura, resistência e condição estética do fio.",
      pontosObservados: [
        "Estrutura do fio dentro dos parâmetros estéticos observados.",
        "Condição geral compatível com procedimentos estéticos mediante preparo adequado.",
      ],
      recomendacoes: [
        "Associar tratamentos de manutenção ou recuperação antes de procedimentos químicos.",
        "Manter rotina de cuidados para preservação da saúde do fio.",
        "Evitar processos agressivos sem preparo técnico adequado.",
      ],
      interpretacaoIA:
        "Com base nas informações analisadas, o fio apresenta condições estéticas compatíveis com procedimentos, desde que respeitados os cuidados e protocolos recomendados pelo profissional.",
    };

    setResultado(resultadoGerado);

    // Registro global (inalterado)
    adicionarRegistro({
      tipo: "capilar",
      data: new Date().toLocaleString("pt-BR"),
      descricao:
        "Análise capilar realizada para avaliação da saúde do fio e definição de cuidados estéticos.",
    });

    // Garantir cliente ativo em memória
    if (!cliente) {
      criarCliente();
    }

    // Registro vinculado ao cliente ativo
    adicionarAnaliseAoCliente({
      id: crypto.randomUUID(),
      tipo: "capilar",
      data: new Date().toLocaleString("pt-BR"),
      descricao:
        "Análise capilar vinculada ao atendimento da cliente.",
    });
  }

  function novaAnalise() {
    setResultado(null);
  }

  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      <header style={{ marginBottom: 28 }}>
        <h1>Análise Capilar Estética</h1>
        <p style={{ color: "#6b7280", maxWidth: 720 }}>
          Avaliação técnica do fio para orientar tratamentos, alisamentos e
          manutenções de forma segura, saudável e personalizada.
        </p>
      </header>

      {!resultado && (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 24,
            background: "#ffffff",
            maxWidth: 720,
          }}
        >
          <p style={{ marginBottom: 20 }}>
            Inicie a avaliação considerando a estrutura do fio, histórico
            químico e condição estética atual.
          </p>

          <button
            onClick={gerarAvaliacaoCapilar}
            style={{
              padding: "12px 20px",
              borderRadius: 8,
              border: "none",
              background: "#000080",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            Gerar avaliação capilar
          </button>
        </div>
      )}

      {resultado && (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 24,
            background: "#ffffff",
            marginTop: 24,
          }}
        >
          <h2>Resultado da Avaliação Capilar</h2>
          <p style={{ marginTop: 12 }}>{resultado.resumoTecnico}</p>

          <h3 style={{ marginTop: 24 }}>Pontos observados</h3>
          <ul>
            {resultado.pontosObservados.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3 style={{ marginTop: 24 }}>Recomendações estéticas</h3>
          <ul>
            {resultado.recomendacoes.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <div
            style={{
              marginTop: 24,
              padding: 16,
              borderRadius: 8,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3>Interpretação Assistiva (IA)</h3>
            <p>{resultado.interpretacaoIA}</p>
          </div>

          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 16 }}>
            Conteúdo gerado por IA para apoio informativo. A decisão final é do
            profissional. Esta análise possui finalidade técnico-estética e não
            substitui avaliação dermatológica.
          </p>

          <div style={{ marginTop: 24 }}>
            <button
              onClick={novaAnalise}
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                background: "#ffffff",
                cursor: "pointer",
                marginRight: 12,
              }}
            >
              Nova análise
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                border: "none",
                background: "#047857",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              Retornar ao dashboard
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
