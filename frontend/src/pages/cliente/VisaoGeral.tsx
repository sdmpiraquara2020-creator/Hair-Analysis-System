import { useState } from "react";
import ClientesHeader from "./components/ClientesHeader";
import ClientesBusca from "./components/ClientesBusca";
import ClientesLista from "./components/ClientesLista";
import CadastroClienteModal from "./CadastroClienteModal";

export default function VisaoGeralCliente() {
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <ClientesHeader onNovoCliente={() => setModalAberto(true)} />

      <div style={{ margin: "24px 0" }}>
        <ClientesBusca value={busca} onChange={setBusca} />
      </div>

      <ClientesLista />

      {modalAberto && (
        <CadastroClienteModal onClose={() => setModalAberto(false)} />
      )}
    </>
  );
}
