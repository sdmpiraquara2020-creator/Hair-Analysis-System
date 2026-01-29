export interface VisionFrame {
  id: string;
  timestamp: number;
  imageBase64: string;
  annotationBase64?: string; // desenho sobreposto
}

export interface VisionFinding {
  label: string;
  confidence?: number;
  area?: string;
}
