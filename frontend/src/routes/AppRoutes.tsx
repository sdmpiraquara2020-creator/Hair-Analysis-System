import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import PrivateRoute from "./PrivateRoute";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AnaliseCapilar from "../pages/AnaliseCapilar";
import AnaliseTricologica from "../pages/AnaliseTricologica";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas */}
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ANÁLISES */}
        <Route path="/analise-capilar" element={<AnaliseCapilar />} />
        <Route
          path="/analise-tricologica"
          element={<AnaliseTricologica />}
        />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
