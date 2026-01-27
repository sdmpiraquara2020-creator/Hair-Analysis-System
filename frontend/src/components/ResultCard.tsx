type Props = {
  title: string;
  value: string;
};

export default function ResultCard({ title, value }: Props) {
  return (
    <div className="result-card">
      <span className="result-title">{title}</span>
      <strong className="result-value">{value}</strong>
    </div>
  );
}
