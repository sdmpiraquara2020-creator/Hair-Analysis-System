import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

import ListagemClientes from "../pages/cliente/Listagem";
import CriarCliente from "../pages/cliente/Criar";
import EditarCliente from "../pages/cliente/Editar";
import HistoricoCliente from "../pages/cliente/HistoricoCliente";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🔹 ROTA INICIAL */}
      <Route path="/" element={<Navigate to="/clientes" replace />} />

      <Route element={<AppLayout />}>
        <Route path="/clientes">
          <Route index element={<ListagemClientes />} />
          <Route path="criar" element={<CriarCliente />} />
          <Route path=":id/editar" element={<EditarCliente />} />
          <Route path=":id/historico" element={<HistoricoCliente />} />
        </Route>
      </Route>
    </Routes>
  );
}
