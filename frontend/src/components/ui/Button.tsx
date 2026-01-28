import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    border: "1px solid #2563EB",
  },
  secondary: {
    backgroundColor: "#FFFFFF",
    color: "#2563EB",
    border: "1px solid #2563EB",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#2563EB",
    border: "1px solid transparent",
  },
};

export default function Button({
  variant = "primary",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        padding: "10px 16px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "all 0.2s ease",
        ...variantStyles[variant],
      }}
    >
      {children}
    </button>
  );
}
