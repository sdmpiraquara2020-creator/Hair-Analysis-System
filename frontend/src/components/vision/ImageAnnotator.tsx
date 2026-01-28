import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";

interface ImageAnnotatorProps {
  imageBase64: string;
  onSave: (annotationBase64: string) => void;
}

export default function ImageAnnotator({
  imageBase64,
  onSave,
}: ImageAnnotatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(new Image());

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#FF0000");
  const [lineWidth, setLineWidth] = useState(4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    imgRef.current.onload = () => {
      canvas.width = imgRef.current.width;
      canvas.height = imgRef.current.height;
      ctx.drawImage(imgRef.current, 0, 0);
    };

    imgRef.current.src = imageBase64;
  }, [imageBase64]);

  function startDraw(e: React.MouseEvent) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  }

  function draw(e: React.MouseEvent) {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  }

  function endDraw() {
    setDrawing(false);
  }

  function handleSave() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL("image/png"));
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgRef.current, 0, 0);
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", borderRadius: "12px", cursor: "crosshair" }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
      />

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "12px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <input
          type="range"
          min={2}
          max={10}
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
        />

        <Button variant="secondary" onClick={handleClear}>
          Limpar
        </Button>

        <Button variant="primary" onClick={handleSave}>
          Salvar Anotação
        </Button>
      </div>
    </div>
  );
}
