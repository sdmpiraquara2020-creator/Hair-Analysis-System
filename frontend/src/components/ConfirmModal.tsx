interface ConfirmModalProps {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  title = "Confirmar ação",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9998,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          width: 360,
          padding: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ marginBottom: 8 }}>{title}</h3>
        <p style={{ marginBottom: 20, color: "#444" }}>{message}</p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              backgroundColor: "#dc2626",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {loading ? "Excluindo..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
