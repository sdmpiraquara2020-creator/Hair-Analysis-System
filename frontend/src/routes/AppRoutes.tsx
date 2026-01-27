import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { CriarAnalise } from '../pages/Analises/CriarAnalise';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/clientes/:id/analises/criar" element={<CriarAnaliseWrapper />} />
    </Routes>
  );
}

function CriarAnaliseWrapper() {
  const clienteId = '1';
  return <CriarAnalise clienteId={clienteId} />;
}
