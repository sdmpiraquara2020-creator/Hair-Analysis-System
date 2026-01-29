export default function ReportSeal() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 12px",
        border: "1px solid #2e7d32",
        borderRadius: "6px",
        color: "#2e7d32",
        fontSize: "12px",
        fontWeight: 600
      }}
    >
      <span
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "#2e7d32",
          display: "inline-block"
        }}
      />
      Relatório válido
    </div>
  );
}
