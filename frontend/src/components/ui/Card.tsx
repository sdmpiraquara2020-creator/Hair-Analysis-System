import React from "react";

type CardVariant = "default" | "attention" | "alert";

interface CardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  variant?: CardVariant;
}

const variantStyles: Record<CardVariant, React.CSSProperties> = {
  default: {
    borderLeft: "4px solid #2563EB", // azul técnico
  },
  attention: {
    borderLeft: "4px solid #D97706", // âmbar
  },
  alert: {
    borderLeft: "4px solid #DC2626", // vermelho
  },
};

export default function Card({
  title,
  description,
  children,
  action,
  variant = "default",
}: CardProps) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        padding: "20px",
        ...variantStyles[variant],
      }}
    >
      <div style={{ marginBottom: "12px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            margin: 0,
          }}
        >
          {title}
        </h3>

        {description && (
          <p
            style={{
              marginTop: "6px",
              color: "#4B5563",
              fontSize: "14px",
            }}
          >
            {description}
          </p>
        )}
      </div>

      {children && <div style={{ marginBottom: action ? "16px" : 0 }}>{children}</div>}

      {action && <div>{action}</div>}
    </div>
  );
}
