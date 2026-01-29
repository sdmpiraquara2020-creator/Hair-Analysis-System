import { useRef, useState } from "react";

interface Props {
  onCapture: (file: File) => void;
}

export default function ImageCapture({ onCapture }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(file: File) {
    setPreview(URL.createObjectURL(file));
    onCapture(file);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: "10px 14px",
          borderRadius: 6,
          border: "1px solid #2563eb",
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        📷 Capturar / Enviar Imagem
      </button>

      {preview && (
        <div>
          <p>Pré-visualização:</p>
          <img
            src={preview}
            alt="preview"
            style={{
              maxWidth: "100%",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
            }}
          />
        </div>
      )}
    </div>
  );
}
