import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Square, Play, Upload, Film, Image as ImageIcon, AlertCircle, RefreshCw, Maximize, Minimize } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VideoCapture({ onFramesCaptured, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [uploadMode, setUploadMode] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setUploadMode(false);
    } catch (error) {
      console.error("Erro ao acessar câmera:", error);
      alert("Não foi possível acessar a câmera. Por favor, permita o acesso.");
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.error("Erro ao entrar em tela cheia:", error);
      }
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    if (stream) {
      startCamera();
    }
  }, [facingMode]);

  const startRecording = () => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });

    const chunks = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      await processVideoBlob(blob);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setRecordedChunks(chunks);

    // Auto-stop após 10 segundos
    setTimeout(() => {
      if (mediaRecorder.state === 'recording') {
        stopRecording();
      }
    }, 10000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Por favor, selecione um arquivo de vídeo (MP4, WebM, MOV) ou GIF.');
      return;
    }

    // Validar tamanho (máximo 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('O arquivo é muito grande. Tamanho máximo: 50MB');
      return;
    }

    setProcessing(true);
    const blob = file;
    await processVideoBlob(blob);
  };

  const processVideoBlob = async (blob) => {
    setProcessing(true);
    
    try {
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(blob);
      videoElement.muted = true;

      await new Promise((resolve) => {
        videoElement.onloadedmetadata = resolve;
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      const duration = videoElement.duration;
      const frameCount = Math.min(12, Math.floor(duration * 2)); // 2 frames por segundo, máximo 12
      const interval = duration / frameCount;

      const frames = [];
      
      for (let i = 0; i < frameCount; i++) {
        videoElement.currentTime = i * interval;
        
        await new Promise((resolve) => {
          videoElement.onseeked = resolve;
        });

        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const frameDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        frames.push(frameDataUrl);
      }

      console.log(`✅ [VideoCapture] Processados ${frames.length} frames do vídeo`);
      
      // Análise de movimento e qualidade
      const videoAnalysis = analyzeVideoQuality(frames);
      
      onFramesCaptured(frames, videoAnalysis);
      
      URL.revokeObjectURL(videoElement.src);
    } catch (error) {
      console.error('Erro ao processar vídeo:', error);
      alert('Erro ao processar vídeo. Tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  const analyzeVideoQuality = (frames) => {
    // Análise básica de qualidade do vídeo
    return {
      frame_count: frames.length,
      has_movement: frames.length > 1,
      quality_assessment: frames.length >= 8 ? 'boa' : frames.length >= 4 ? 'média' : 'baixa'
    };
  };

  return (
    <Card className="glass-effect border-white/40" ref={containerRef}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Captura de Vídeo</h3>
          <div className="flex gap-2">
            {!uploadMode && !stream && (
              <Button
                onClick={() => setUploadMode(true)}
                variant="outline"
                size="sm"
                className="glass-effect"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
            )}
            {uploadMode && (
              <Button
                onClick={() => {
                  setUploadMode(false);
                  startCamera();
                }}
                variant="outline"
                size="sm"
                className="glass-effect"
              >
                <Video className="w-4 h-4 mr-2" />
                Câmera
              </Button>
            )}
          </div>
        </div>

        <Alert className="glass-effect border-blue-300 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-800">
            {uploadMode ? (
              <span>
                📹 <strong>Importe um vídeo ou GIF</strong> para análise detalhada de movimento, balanço, brilho e textura.
              </span>
            ) : (
              <span>
                🎥 <strong>Grave um vídeo de 5-10 segundos</strong> movimentando suavemente o cabelo para análise completa de movimento, balanço e textura dinâmica.
              </span>
            )}
          </AlertDescription>
        </Alert>

        {uploadMode ? (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,image/gif"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-400 transition-colors cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}>
              <div className="space-y-4">
                <div className="flex justify-center gap-4">
                  <Film className="w-12 h-12 text-purple-500" />
                  <ImageIcon className="w-12 h-12 text-pink-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Clique para importar</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Vídeo (MP4, WebM, MOV) ou GIF animado
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Máximo 50MB • Recomendado: 5-10 segundos
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <p className="text-xs font-semibold text-purple-900">✨ Análise de Movimento</p>
                <p className="text-xs text-purple-700 mt-1">Balanço e volume natural</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
                <p className="text-xs font-semibold text-pink-900">💎 Análise de Brilho</p>
                <p className="text-xs text-pink-700 mt-1">Reflexo da luz em movimento</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs font-semibold text-blue-900">🌊 Análise de Textura</p>
                <p className="text-xs text-blue-700 mt-1">Ondulação e cachos dinâmicos</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="text-xs font-semibold text-green-900">🎯 Análise de Raiz</p>
                <p className="text-xs text-green-700 mt-1">Volume e oleosidade na raiz</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: isFullscreen ? '100vh' : '400px' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full animate-pulse z-10">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-bold">Gravando...</span>
                </div>
              )}
              {stream && (
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <Button
                    onClick={toggleCamera}
                    size="icon"
                    className="bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={toggleFullscreen}
                    size="icon"
                    className="bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg"
                  >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </Button>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-3">
              {!stream ? (
                <Button
                  onClick={startCamera}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Iniciar Câmera
                </Button>
              ) : !isRecording ? (
                <Button
                  onClick={startRecording}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar Gravação
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Parar Gravação
                </Button>
              )}
              
              <Button
                onClick={onCancel}
                variant="outline"
                className="glass-effect"
              >
                Cancelar
              </Button>
            </div>

            {isRecording && (
              <p className="text-sm text-gray-600 text-center italic animate-pulse">
                🎥 Movimente suavemente o cabelo para melhor análise...
              </p>
            )}
          </>
        )}

        {processing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600 font-semibold">
              🎬 Processando vídeo e extraindo frames...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

