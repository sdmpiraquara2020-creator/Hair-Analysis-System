// Layout.tsx (com CSS inline)
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout() {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#ffffff"
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0
      }}>
        <TopBar />
        <main style={{
          flex: 1,
          padding: "24px",
          background: "#f7f7f8",
          overflowY: "auto",
          position: "relative"
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}