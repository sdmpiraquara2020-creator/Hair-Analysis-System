import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // autenticação real entra depois
    console.log({ email, password });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 360,
          padding: 32,
          backgroundColor: "#ffffff",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ marginBottom: 8 }}>Hair Analysis System</h1>
        <p style={{ marginBottom: 24, color: "#666" }}>
          Acesso profissional ao sistema
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 4,
            border: "none",
            backgroundColor: "#111",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
