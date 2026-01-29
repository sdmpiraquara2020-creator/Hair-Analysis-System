interface Props {
  visible: boolean;
}

export default function ProcessingOverlay({ visible }: Props) {
  if (!visible) return null;

  return (
    <div className="processing-overlay">
      <div className="processing-box">
        <div className="spinner" />
        <p>Analisando estrutura do fio, couro cabeludo e necessidades…</p>
      </div>
    </div>
  );
}
