import { useState } from "react";
import api from "../services/api";

type Props = {
  onResult: (analysis: any) => void;
};

export default function ImageUploader({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (!file) {
      setError("Selecione uma imagem");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/v2/vision/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onResult(response.data.analysis);
    } catch (err) {
      console.error(err);
      setError("Erro ao analisar imagem");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Análise Capilar e Tricológica</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br />
      <br />

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analisando..." : "Analisar agora"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 12 }}>
          {error}
        </p>
      )}
    </div>
  );
}
