import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AnaliseCapilar from "./pages/AnaliseCapilar";
import AnaliseTricologica from "./pages/AnaliseTricologica";
import RelatorioCliente from "./pages/RelatorioCliente";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analise-capilar" element={<AnaliseCapilar />} />
      <Route path="/analise-tricologica" element={<AnaliseTricologica />} />

      {/* FASE 4 — Relatório */}
      <Route path="/relatorio-cliente" element={<RelatorioCliente />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
