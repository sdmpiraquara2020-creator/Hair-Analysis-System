import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* TOPO — ocupa 100% da largura */}
      <TopBar />

      {/* CORPO — sidebar + conteúdo */}
      <div style={{ flex: 1, display: "flex" }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "24px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
