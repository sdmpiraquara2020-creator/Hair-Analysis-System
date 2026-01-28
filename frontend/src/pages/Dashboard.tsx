import React from "react";
import TopBar from "../components/layout/TopBar";

const Dashboard: React.FC = () => {
  return (
    <>
      <TopBar />

      <main
        style={{
          padding: "32px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Dashboard</h1>

        <p style={{ color: "#6b7280", marginBottom: "32px" }}>
          Painel de acompanhamento do Hair Analysis System. Inicie novas análises
          e acompanhe avaliações recentes realizadas no salão.
        </p>

        {/* CLIENTE ATIVO */}
        <section
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "32px",
            background: "#fff",
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>
            Cliente ativa na sessão
          </h2>

          <p style={{ color: "#6b7280" }}>
            Atendimento em andamento com histórico vinculado à cliente atual.
          </p>

          <p style={{ marginTop: "8px" }}>
            <strong>Análises realizadas:</strong> nenhuma até o momento
          </p>

          <button
            style={{
              marginTop: "16px",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#047857",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Ver relatório da cliente
          </button>
        </section>

        {/* GRID DE ANÁLISES */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {/* TRICOLÓGICA */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "24px",
              background: "#fff",
            }}
          >
            <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>
              Análise Tricológica
            </h2>

            <p style={{ color: "#6b7280", marginBottom: "16px" }}>
              Avaliação do couro cabeludo para garantir segurança, saúde capilar
              e melhores resultados nos procedimentos.
            </p>

            <button
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#047857",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Nova Análise Tricológica
            </button>
          </div>

          {/* CAPILAR */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "24px",
              background: "#fff",
            }}
          >
            <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>
              Análise Capilar
            </h2>

            <p style={{ color: "#6b7280", marginBottom: "16px" }}>
              Avaliação do fio para definição de tratamentos, alisamentos e
              manutenções de forma segura e personalizada.
            </p>

            <button
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#000080",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Nova Análise Capilar
            </button>
          </div>
        </section>

        {/* ATENDIMENTOS RECENTES */}
        <section
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
            background: "#fff",
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>
            Atendimentos recentes
          </h2>

          <p style={{ color: "#6b7280" }}>
            Nenhuma análise registrada ainda. Inicie uma avaliação para começar
            o acompanhamento da cliente.
          </p>
        </section>
      </main>
    </>
  );
};

export default Dashboard;
