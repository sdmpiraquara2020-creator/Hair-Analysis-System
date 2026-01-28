import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";

interface VisionCaptureProps {
  onCapture: (imageBase64: string) => void;
}

export default function VisionCapture({ onCapture }: VisionCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((allDevices) => {
      const videoDevices = allDevices.filter(
        (d) => d.kind === "videoinput"
      );
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedDeviceId) return;

    navigator.mediaDevices
      .getUserMedia({
        video: {
          deviceId: { exact: selectedDeviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
  }, [selectedDeviceId]);

  function handleCapture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/png");

    onCapture(base64);
  }

  return (
    <div>
      {/* Seleção de dispositivo */}
      <div style={{ marginBottom: "12px" }}>
        <label>
          <strong>Dispositivo de captura:</strong>
        </label>
        <select
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          style={{
            display: "block",
            marginTop: "6px",
            padding: "6px",
            width: "100%",
          }}
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || "Dispositivo de vídeo"}
            </option>
          ))}
        </select>
      </div>

      {/* Vídeo */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "100%",
          borderRadius: "12px",
          backgroundColor: "#000",
        }}
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ marginTop: "12px" }}>
        <Button variant="primary" onClick={handleCapture}>
          Capturar Imagem
        </Button>
      </div>
    </div>
  );
}
