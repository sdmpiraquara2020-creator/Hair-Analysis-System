export interface VisionHistoryItem {
  id: string;
  createdAt: number;
  imageBase64: string;
  annotationBase64?: string;
  findings: string[];
}
