import { Outlet } from "react-router-dom";
import TopBar from "../components/layout/TopBar";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <TopBar />

      <main
        className="app-content"
        style={{
          paddingTop: "64px",          // espaço da TopBar
          backgroundColor: "#F8FAFC",  // fundo técnico neutro
          minHeight: "100vh",
        }}
      >
        {/* Container padrão do sistema */}
        <div
          className="content-container"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "24px",
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
