import { Outlet } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import "./MainLayout.css";

export default function MainLayout() {
  return (
    <div className="app-layout">
      <TopBar />
      <div className="app-content">
        <Outlet />
      </div>
    </div>
  );
}
