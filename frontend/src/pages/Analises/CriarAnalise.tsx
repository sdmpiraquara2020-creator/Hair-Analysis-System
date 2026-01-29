import { useState } from 'react';
import { criarAnaliseCapilar } from '../../services/analysis.service';

interface Props {
  clienteId: string | number;
}

export function CriarAnalise({ clienteId }: Props) {
  const [couroCabeludo, setCouroCabeludo] = useState('');
  const [fio, setFio] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [profissional, setProfissional] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await criarAnaliseCapilar(clienteId, {
      couroCabeludo,
      fio,
      observacoes,
      profissional,
    });

    setCouroCabeludo('');
    setFio('');
    setObservacoes('');
    setProfissional('');
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Couro cabeludo"
        value={couroCabeludo}
        onChange={(e) => setCouroCabeludo(e.target.value)}
        required
      />

      <input
        placeholder="Fio"
        value={fio}
        onChange={(e) => setFio(e.target.value)}
        required
      />

      <input
        placeholder="Observações"
        value={observacoes}
        onChange={(e) => setObservacoes(e.target.value)}
      />

      <input
        placeholder="Profissional"
        value={profissional}
        onChange={(e) => setProfissional(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Análise'}
      </button>
    </form>
  );
}
