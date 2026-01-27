import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  style?: React.CSSProperties;
}

const baseStyle: React.CSSProperties = {
  background:
    "linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%)",
  backgroundSize: "400% 100%",
  animation: "skeleton-loading 1.4s ease infinite"
};

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 16,
  borderRadius = 4,
  style
}) => {
  return (
    <div
      style={{
        ...baseStyle,
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
};

// 🔹 Keyframes globais (registrados uma única vez)
if (typeof document !== "undefined") {
  const exists = Array.from(document.styleSheets).some(sheet =>
    Array.from(sheet.cssRules || []).some(rule =>
      rule.cssText.includes("skeleton-loading")
    )
  );

  if (!exists) {
    const sheet = document.styleSheets[0];
    sheet?.insertRule(
      `
      @keyframes skeleton-loading {
        0% { background-position: 100% 50%; }
        100% { background-position: 0 50%; }
      }
    `,
      sheet.cssRules.length
    );
  }
}
