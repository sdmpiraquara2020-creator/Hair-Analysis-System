import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { loginSalon } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      const data = await loginSalon(email, senha);
      login(data);
      navigate("/dashboard");
    } catch {
      setError("Email ou senha inválidos");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto" }}>
      <Card title="Acesso do Salão">
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "8px" }}
        />

        <input
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{ width: "100%", marginBottom: "8px" }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button variant="primary" onClick={handleLogin}>
          Entrar
        </Button>
      </Card>
    </div>
  );
}
