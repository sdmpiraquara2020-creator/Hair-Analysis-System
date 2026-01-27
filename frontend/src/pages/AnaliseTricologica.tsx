import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysisHistory } from "../context/AnalysisHistoryContext";
import { useCliente } from "../context/ClienteContext";

type Oleosidade = "normal" | "oleoso" | "seco";
type Descamacao = "nao" | "leve" | "moderada";
type Sensibilidade = "nao" | "coceira" | "ardor";
type Densidade = "normal" | "rarefacao_leve";
type Queda = "nao" | "ocasional" | "frequente";

type ResultadoTricologico = {
  resumoTecnico: string;
  pontosObservados: string[];
  recomendacoes: string[];
  interpretacaoIA: string;
  observacoesProfissional: string;
};

export default function AnaliseTricologica() {
  const navigate = useNavigate();
  const { adicionarRegistro } = useAnalysisHistory();
  const { cliente, criarCliente, adicionarAnaliseAoCliente } = useCliente();

  const [oleosidade, setOleosidade] = useState<Oleosidade | "">("");
  const [descamacao, setDescamacao] = useState<Descamacao | "">("");
  const [sensibilidade, setSensibilidade] = useState<Sensibilidade | "">("");
  const [densidade, setDensidade] = useState<Densidade | "">("");
  const [queda, setQueda] = useState<Queda | "">("");
  const [observacoes, setObservacoes] = useState("");

  const [resultado, setResultado] =
    useState<ResultadoTricologico | null>(null);

  function gerarResultado(): ResultadoTricologico {
    const pontosObservados: string[] = [];
    const recomendacoes: string[] = [];

    if (oleosidade === "oleoso") {
      pontosObservados.push("Oleosidade elevada no couro cabeludo.");
      recomendacoes.push(
        "Indica-se controle de oleosidade antes de procedimentos químicos."
      );
    }

    if (descamacao !== "nao") {
      pontosObservados.push("Presença de descamação no couro cabeludo.");
      recomendacoes.push(
        "Utilizar protocolos calmantes e equilibrantes."
      );
    }

    if (sensibilidade !== "nao") {
      pontosObservados.push("Sensibilidade relatada no couro cabeludo.");
      recomendacoes.push(
        "Evitar estímulos agressivos e priorizar cuidados suaves."
      );
    }

    if (densidade === "rarefacao_leve") {
      pontosObservados.push("Sinais de rarefação capilar leve.");
      recomendacoes.push(
        "Acompanhar evolução e estimular o couro cabeludo."
      );
    }

    if (queda === "frequente") {
      pontosObservados.push("Queda capilar frequente relatada.");
      recomendacoes.push(
        "Reforçar acompanhamento contínuo e retornos periódicos."
      );
    }

    if (pontosObservados.length === 0) {
      recomendacoes.push(
        "Manter rotina atual de cuidados e acompanhamento preventivo."
      );
    }

    return {
      resumoTecnico:
        pontosObservados.length === 0
          ? "Couro cabeludo em equilíbrio estético no momento."
          : "Foram identificados pontos de atenção no couro cabeludo.",
      pontosObservados,
      recomendacoes,
      interpretacaoIA:
        "Interpretação assistiva gerada por IA para apoio informativo. A decisão final é sempre do profissional.",
      observacoesProfissional: observacoes,
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const resultadoGerado = gerarResultado();
    setResultado(resultadoGerado);

    // Registro global (inalterado)
    adicionarRegistro({
      tipo: "tricológica",
      data: new Date().toLocaleString("pt-BR"),
      descricao:
        "Análise tricológica realizada para avaliação da saúde do couro cabeludo e segurança em procedimentos.",
    });

    // Garantir cliente ativo
    if (!cliente) {
      criarCliente();
    }

    // Registro vinculado ao cliente ativo
    adicionarAnaliseAoCliente({
      id: crypto.randomUUID(),
      tipo: "tricológica",
      data: new Date().toLocaleString("pt-BR"),
      descricao:
        "Análise tricológica vinculada ao atendimento da cliente.",
    });
  }

  function novaAnalise() {
    setResultado(null);
    setOleosidade("");
    setDescamacao("");
    setSensibilidade("");
    setDensidade("");
    setQueda("");
    setObservacoes("");
  }

  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      <header style={{ marginBottom: 28 }}>
        <h1>Análise Tricológica Estética</h1>
        <p style={{ color: "#6b7280", maxWidth: 720 }}>
          Avaliação técnica do couro cabeludo para garantir segurança,
          saúde capilar e melhores resultados nos procedimentos do salão.
        </p>
      </header>

      {!resultado && (
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: 20, maxWidth: 720 }}>
            <p>
              Preencha as informações com base na observação visual e no relato da
              cliente.
            </p>

            <select
              required
              value={oleosidade}
              onChange={(e) => setOleosidade(e.target.value as Oleosidade)}
            >
              <option value="">Oleosidade do couro cabeludo</option>
              <option value="normal">Normal</option>
              <option value="oleoso">Oleoso</option>
              <option value="seco">Seco</option>
            </select>

            <select
              required
              value={descamacao}
              onChange={(e) => setDescamacao(e.target.value as Descamacao)}
            >
              <option value="">Descamação</option>
              <option value="nao">Não</option>
              <option value="leve">Leve</option>
              <option value="moderada">Moderada</option>
            </select>

            <select
              required
              value={sensibilidade}
              onChange={(e) =>
                setSensibilidade(e.target.value as Sensibilidade)
              }
            >
              <option value="">Sensibilidade percebida</option>
              <option value="nao">Não</option>
              <option value="coceira">Coceira</option>
              <option value="ardor">Ardor</option>
            </select>

            <select
              required
              value={densidade}
              onChange={(e) => setDensidade(e.target.value as Densidade)}
            >
              <option value="">Densidade capilar</option>
              <option value="normal">Normal</option>
              <option value="rarefacao_leve">Rarefação leve</option>
            </select>

            <select
              required
              value={queda}
              onChange={(e) => setQueda(e.target.value as Queda)}
            >
              <option value="">Queda capilar percebida</option>
              <option value="nao">Não</option>
              <option value="ocasional">Ocasional</option>
              <option value="frequente">Frequente</option>
            </select>

            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações técnicas relevantes para o atendimento"
              rows={4}
            />

            <button
              type="submit"
              style={{
                padding: "12px 20px",
                borderRadius: 8,
                border: "none",
                background: "#047857",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              Gerar avaliação tricológica
            </button>
          </div>
        </form>
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
          <h2>Resultado da Avaliação Tricológica</h2>
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

          {resultado.observacoesProfissional && (
            <>
              <h3 style={{ marginTop: 24 }}>Observações do profissional</h3>
              <p>{resultado.observacoesProfissional}</p>
            </>
          )}

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
                background: "#000080",
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
