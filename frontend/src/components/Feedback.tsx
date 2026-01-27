import { useEffect } from "react";

interface FeedbackProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function Feedback({
  message,
  type = "success",
  onClose,
}: FeedbackProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        marginBottom: 8,
        padding: "12px 16px",
        borderRadius: 6,
        backgroundColor: type === "success" ? "#16a34a" : "#dc2626",
        color: "#fff",
        fontWeight: 500,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span>{message}</span>

      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  );
}
