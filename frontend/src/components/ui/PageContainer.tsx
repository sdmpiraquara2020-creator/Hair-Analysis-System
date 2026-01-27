import React from "react";

interface Props {
  children: React.ReactNode;
}

const PageContainer: React.FC<Props> = ({ children }) => {
  return (
    <main
      style={{
        padding: "32px 40px",
        background: "#f6f7f9",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {children}
    </main>
  );
};

export default PageContainer;
