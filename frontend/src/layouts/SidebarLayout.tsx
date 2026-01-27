import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

export default function SidebarLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px" }}>
        <Outlet />
      </main>
    </div>
  );
}
