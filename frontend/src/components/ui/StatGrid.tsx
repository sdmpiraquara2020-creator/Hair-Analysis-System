import React from "react";

const StatGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        marginBottom: 40,
      }}
    >
      {children}
    </section>
  );
};

export default StatGrid;
