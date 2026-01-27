import React from "react";

interface ClienteHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export default function ClienteHeader({
  title,
  subtitle,
  actionLabel,
  onActionClick,
}: ClienteHeaderProps) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>{title}</h1>
          {subtitle && (
            <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
              {subtitle}
            </p>
          )}
        </div>

        {actionLabel && onActionClick && (
          <button
            onClick={onActionClick}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
