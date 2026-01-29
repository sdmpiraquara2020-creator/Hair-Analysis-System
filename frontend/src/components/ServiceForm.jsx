import { useState } from "react";

export default function ServiceForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: "", category: "", description: "" });
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <h3>Cadastrar Serviço</h3>

      <input
        name="name"
        placeholder="Nome do serviço"
        value={form.name}
        onChange={handleChange}
        required
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="">Categoria</option>
        <option value="alisamento">Alisamento (ferramenta)</option>
        <option value="hidratacao">Hidratação</option>
        <option value="nutricao">Nutrição</option>
        <option value="reconstrucao">Reconstrução</option>
        <option value="cronograma">Cronograma</option>
        <option value="corte">Corte</option>
      </select>

      <textarea
        name="description"
        placeholder="Descrição profissional"
        value={form.description}
        onChange={handleChange}
      />

      <button type="submit">Salvar</button>
    </form>
  );
}
