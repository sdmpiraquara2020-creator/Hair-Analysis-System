import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, RotateCw } from "lucide-react";

export default function CameraCapture({ onCapture, onClose, label = "Capturar Foto" }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsReady(true);
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
      alert("Não foi possível acessar a câmera. Verifique as permissões.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const switchCamera = () => {
    setIsReady(false);
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    if (!videoRef.current || !isReady) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Converter para data URL diretamente
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    onCapture(dataUrl);
    stopCamera();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-white font-bold text-lg">{label}</h2>
              <p className="text-white/70 text-sm">Posicione o cabelo no centro</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full h-10 w-10"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Video Preview */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center text-white">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-semibold">Iniciando câmera...</p>
            </div>
          </div>
        )}

        {/* Guide Grid */}
        {isReady && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-white/20"></div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Switch Camera Button */}
            <Button
              onClick={switchCamera}
              disabled={!isReady}
              variant="ghost"
              className="text-white hover:bg-white/20 rounded-full h-14 w-14 disabled:opacity-50"
            >
              <RotateCw className="w-6 h-6" />
            </Button>

            {/* Capture Button */}
            <Button
              onClick={capturePhoto}
              disabled={!isReady}
              className="h-20 w-20 rounded-full bg-white hover:bg-white/90 disabled:opacity-50 disabled:bg-white/50 shadow-xl border-4 border-white/30 transition-all active:scale-95"
            >
              <div className="w-16 h-16 rounded-full bg-white border-4 border-gray-800"></div>
            </Button>

            {/* Empty Space for Symmetry */}
            <div className="w-14"></div>
          </div>

          {/* Tips */}
          {isReady && (
            <div className="mt-4 text-center">
              <p className="text-white/80 text-sm">
                💡 Dica: Mantenha boa iluminação e foque no cabelo
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

