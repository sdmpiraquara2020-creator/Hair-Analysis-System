import { useState } from "react";
import "../../styles/system.css";

type ClienteFake = {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
};

type Props = {
  onClose: () => void;
  clienteInicial?: ClienteFake | null;
};

type Tab = "dados" | "endereco" | "adicionais";

export default function CadastroClienteModal({
  onClose,
  clienteInicial,
}: Props) {
  const [tabAtiva, setTabAtiva] = useState<Tab>("dados");

  const modoEdicao = Boolean(clienteInicial);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 680,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">
            {modoEdicao ? "Editar cadastro" : "Cadastrar cliente"}
          </h1>
          <p className="page-subtitle">
            Registro básico para acompanhamento capilar
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[
            { id: "dados", label: "Dados do Cliente" },
            { id: "endereco", label: "Endereço" },
            { id: "adicionais", label: "Informações Adicionais" },
          ].map((tab) => (
            <button
              key={tab.id}
              className="btn-secondary"
              style={{
                borderBottom:
                  tabAtiva === tab.id
                    ? "2px solid var(--color-primary)"
                    : "2px solid transparent",
              }}
              onClick={() => setTabAtiva(tab.id as Tab)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo das Tabs */}
        {tabAtiva === "dados" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              placeholder="Nome completo *"
              defaultValue={clienteInicial?.nome}
            />
            <input
              placeholder="Telefone *"
              defaultValue={clienteInicial?.telefone}
            />
            <input
              placeholder="Email"
              defaultValue={clienteInicial?.email}
            />
            <input placeholder="Data de nascimento" />
            <input placeholder="CPF (opcional)" />
            <textarea placeholder="Observações técnicas" rows={3} />
          </div>
        )}

        {tabAtiva === "endereco" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input placeholder="CEP" />
            <input placeholder="Rua" />
            <input placeholder="Número" />
            <input placeholder="Complemento" />
            <input placeholder="Bairro" />
            <input placeholder="Cidade" />
            <input placeholder="Estado" />
          </div>
        )}

        {tabAtiva === "adicionais" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <textarea
              placeholder="Histórico químico informado pelo cliente"
              rows={3}
            />
            <textarea
              placeholder="Sensibilidade ou desconfortos relatados"
              rows={3}
            />
            <textarea
              placeholder="Observações técnicas do profissional"
              rows={4}
            />
          </div>
        )}

        {/* Ações */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 32,
          }}
        >
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary">
            {modoEdicao ? "Salvar alterações" : "Salvar cliente"}
          </button>
        </div>
      </div>
    </div>
  );
}
