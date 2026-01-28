import { useRef, useState } from "react";

import Card from "../components/ui/Card";
import VisionCapture from "../components/vision/VisionCapture";
import ImageAnnotator from "../components/vision/ImageAnnotator";

import { VisionSession } from "../vision/VisionSession";
import { analyzeFrame } from "../vision/VisionAnalyzer";
import { VisionFrame } from "../vision/types";

import { salvarVisionHistory } from "../vision/VisionHistoryStorage";
import { salvarVisionBackend } from "../services/visionApi";
import { useAuth } from "../context/AuthContext";

export default function AnaliseVision() {
  const { auth } = useAuth(); // 🔐 salonId REAL vem daqui
  const sessionRef = useRef(new VisionSession());

  const [frames, setFrames] = useState<VisionFrame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<VisionFrame | null>(null);
  const [findings, setFindings] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function handleCapture(imageBase64: string) {
    sessionRef.current.addFrame(imageBase64);
    const allFrames = sessionRef.current.getFrames();
    setFrames([...allFrames]);

    const lastFrame = allFrames[allFrames.length - 1];
    setSelectedFrame(lastFrame);

    const analysisResult = analyzeFrame(lastFrame);
    setFindings(analysisResult.findings.map((f) => f.label));
  }

  async function handleSaveAnnotation(annotationBase64: string) {
    if (!selectedFrame || !auth) return;

    setSaving(true);

    // 1️⃣ Atualiza sessão local
    sessionRef.current.setAnnotation(
      selectedFrame.id,
      annotationBase64
    );

    // 2️⃣ Salva offline (localStorage)
    salvarVisionHistory({
      id: selectedFrame.id,
      createdAt: Date.now(),
      imageBase64: selectedFrame.imageBase64,
      annotationBase64,
      findings,
    });

    // 3️⃣ Salva no backend com salonId REAL
    try {
      await salvarVisionBackend(auth.salonId, {
        imageBase64: selectedFrame.imageBase64,
        annotationBase64,
        findings,
      });
    } catch (error) {
      console.error("Erro ao sincronizar com backend:", error);
      alert(
        "A imagem foi salva localmente, mas não foi possível sincronizar com o servidor."
      );
    }

    setSaving(false);
    alert("Imagem e anotação salvas com sucesso.");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
        Análise Visual (IA Vision Assistiva)
      </h1>

      <Card title="Captura por câmera ou microscópio">
        <VisionCapture onCapture={handleCapture} />
      </Card>

      {selectedFrame && (
        <Card title="Anotar imagem capturada">
          <ImageAnnotator
            imageBase64={selectedFrame.imageBase64}
            onSave={handleSaveAnnotation}
          />
        </Card>
      )}

      <Card title="Achados automáticos" variant="attention">
        {findings.length === 0 ? (
          <p>Nenhum achado visual automático relevante.</p>
        ) : (
          <ul>
            {findings.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
      </Card>

      {saving && (
        <Card variant="attention">
          Salvando dados… aguarde.
        </Card>
      )}

      <Card title="Aviso importante" variant="attention">
        Esta análise visual é um recurso de apoio técnico-estético.
        Não substitui avaliação profissional nem diagnóstico clínico.
      </Card>
    </div>
  );
}
