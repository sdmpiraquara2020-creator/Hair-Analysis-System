export default function TopBar() {
  return (
    <header
      className="topbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "64px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        zIndex: 1000,
      }}
    >
      TopBar
    </header>
  );
}
