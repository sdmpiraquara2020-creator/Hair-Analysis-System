import { useEffect, useState } from "react";
import ImageCapture from "../components/vision/ImageCapture";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function AnaliseTricologica() {
  const { auth } = useAuth();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Iniciando sessão...");

  // Inicia sessão ao entrar na tela
  useEffect(() => {
    async function startSession() {
      try {
        const response = await fetch(`${API}/vision/session/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.token}`,
          },
          body: JSON.stringify({
            clientId: "cliente_demo", // depois vem do fluxo real
            type: "tricologica",
          }),
        });

        if (!response.ok) {
          throw new Error("Erro ao iniciar sessão");
        }

        const data = await response.json();
        setSessionId(data.id);
        setStatus("Sessão tricológica iniciada. Capture a imagem.");
      } catch (error) {
        console.error(error);
        setStatus("Erro ao iniciar sessão tricológica.");
      }
    }

    if (auth?.token) {
      startSession();
    }
  }, [auth]);

  async function handleCapture(file: File) {
    if (!sessionId) return;

    setStatus("Enviando imagem do couro cabeludo...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sessionId", sessionId);

    try {
      const response = await fetch(`${API}/vision/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro no upload");
      }

      setStatus("Imagem enviada com sucesso.");
    } catch (error) {
      console.error(error);
      setStatus("Erro ao enviar imagem.");
    }
  }

  async function endSession() {
    if (!sessionId) return;

    try {
      await fetch(`${API}/vision/session/end`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({ sessionId }),
      });

      setStatus("Sessão tricológica finalizada.");
    } catch (error) {
      console.error(error);
      setStatus("Erro ao finalizar sessão.");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Análise Tricológica</h1>
      <p>Status: {status}</p>

      {sessionId && <ImageCapture onCapture={handleCapture} />}

      {sessionId && (
        <button style={{ marginTop: 16 }} onClick={endSession}>
          Finalizar Sessão
        </button>
      )}
    </div>
  );
}
