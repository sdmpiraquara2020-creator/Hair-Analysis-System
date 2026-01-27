interface Props {
  label: string;
  value: number | string;
}

const StatCard: React.FC<Props> = ({ label, value }) => {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 14,
        padding: "20px 22px",
        border: "1px solid #f1f3f5",
        boxShadow: "0 1px 1px rgba(0,0,0,0.03)",
      }}
    >
      <p
        style={{
          fontSize: 12,
          letterSpacing: "0.02em",
          color: "#6b7280",
          marginBottom: 10,
        }}
      >
        {label.toUpperCase()}
      </p>

      <strong
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: "#111827",
        }}
      >
        {value}
      </strong>
    </div>
  );
};

export default StatCard;
