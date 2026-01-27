import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside style={{ width: 240 }}>
        {/* menu lateral */}
      </aside>

      {/* CONTEÚDO */}
      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
