// TopBar.tsx
export default function TopBar() {
  return (
    <header
      style={{
        height: "50px",
        width: "100%",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* ESQUERDA */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

        {/* Logo */}
        <img
          src="/Sistema-de-Análise-Capilar.png"
          alt="Hair Analysis System"
          style={{ height: "60px" }}
        />

        {/* Contexto */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#000000",
            }}
          >
            Sistema
          </span>

          <span
            style={{
              fontSize: "12px",
              padding: "6px 12px",
              borderRadius: "8px",
              backgroundColor: "#f9fafa",
              color: "#000080",
              fontWeight: 500,
            }}
          >
            Inteligente
          </span>
        </div>
      </div>

             {/* Criar */}
        <button
          style={{
            backgroundColor: "#f9fafa",
            color: "#000080",
            border: "none",
            borderRadius: "6px",
            padding: "8px 14px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
         + Criar
        </button>

      {/* DIREITA */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>

        {/* Pesquisa */}
        <button style={iconButton} title="Pesquisar">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Configurações */}
        <button style={iconButton} title="Configurações">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.3-1 1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.3 1.65 1.65 0 0 0 .67-1.45V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 .67 1.45c.28.2.63.3 1 .3a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.46.46-.58 1.1-.33 1.82.13.33.2.67.2 1z" />
          </svg>
        </button>

        {/* Notificações */}
        <button style={{ ...iconButton, position: "relative" }} title="Notificações">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>

          <span
            style={{
              position: "absolute",
              top: "2px",
              right: "2px",
              backgroundColor: "#EF4444",
              color: "#fff",
              fontSize: "10px",
              fontWeight: 600,
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            3
          </span>
        </button>

        {/* Usuário */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "6px 10px",
            backgroundColor: "#F3F4F6",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#000080",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
            }}
          >
            A
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>
              Administrador
            </div>
            <div style={{ fontSize: "11px", color: "#6B7280" }}>Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}

const iconButton = {
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#F3F4F6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#111827",
};
