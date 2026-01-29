import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import AnaliseCapilar from "../pages/AnaliseCapilar";
import AnaliseTricologica from "../pages/AnaliseTricologica";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analise-capilar" element={<AnaliseCapilar />} />
      <Route path="/analise-tricologica" element={<AnaliseTricologica />} />
    </Routes>
  );
}
