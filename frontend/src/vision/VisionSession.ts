import { VisionFrame } from "./types";

export class VisionSession {
  private frames: VisionFrame[] = [];

  addFrame(imageBase64: string) {
    this.frames.push({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      imageBase64,
    });
  }

  setAnnotation(frameId: string, annotationBase64: string) {
    const frame = this.frames.find((f) => f.id === frameId);
    if (frame) {
      frame.annotationBase64 = annotationBase64;
    }
  }

  getFrames(): VisionFrame[] {
    return this.frames;
  }

  clear() {
    this.frames = [];
  }
}
