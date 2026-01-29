import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AnaliseTricologica from "../pages/AnaliseTricologica";
import AnaliseCapilar from "../pages/AnaliseCapilar";
import HistoryPage from "../pages/HistoryPage";

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Análise Tricológica */}
      <Route
        path="/analise-tricologica"
        element={
          <PrivateRoute>
            <AnaliseTricologica />
          </PrivateRoute>
        }
      />

      {/* Análise Capilar */}
      <Route
        path="/analise-capilar"
        element={
          <PrivateRoute>
            <AnaliseCapilar />
          </PrivateRoute>
        }
      />

      {/* Histórico de Análises */}
      <Route
        path="/historico"
        element={
          <PrivateRoute>
            <HistoryPage />
          </PrivateRoute>
        }
      />

      {/* Rota raiz */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
}
