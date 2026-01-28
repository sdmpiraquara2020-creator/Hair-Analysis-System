import React from "react";
import { useNavigate } from "react-router-dom";
import "./TopBar.css";

const TopBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      {/* LADO ESQUERDO */}
      <div className="topbar-left">
        <img
          src="/Sistema-de-Análise-Capilar.png"
          alt="Hair Analysis System"
          style={{ height: "60px" }}
        />

        <span className="topbar-subtitle">Sistema Inteligente</span>
      </div>

      {/* LADO DIREITO */}
      <div className="topbar-right">
        <button
          className="notification-button"
          onClick={() => navigate("/clientes/novo")}
        >
          + Cliente
        </button>

        <div className="topbar-separator" />

        <div className="user-profile">
          <div className="user-avatar">HAS</div>

          <div className="user-info">
            <div className="user-name">Profissional</div>
            <div className="user-role">Salão</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
