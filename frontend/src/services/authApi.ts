const API_URL = "http://localhost:3001/api";

export async function loginSalon(email: string, senha: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  if (!res.ok) {
    throw new Error("Login inválido");
  }

  return res.json();
}
