export default function ResultadoCapilarView({ resultado }) {
  if (!resultado) {
    return <p>Nenhum resultado disponível.</p>;
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <h1>Resultado Capilar</h1>

      <ul>
        <li><strong>Diagnóstico:</strong> {resultado.diagnostico}</li>
        <li><strong>Tamanho da imagem:</strong> {resultado.tamanhoImagem}</li>
        <li><strong>Tipo:</strong> {resultado.tipo}</li>
      </ul>
    </div>
  );
}
