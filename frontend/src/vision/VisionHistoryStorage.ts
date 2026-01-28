import { VisionHistoryItem } from "./VisionHistory.types";

const STORAGE_KEY = "vision_history";

export function listarVisionHistory(): VisionHistoryItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function salvarVisionHistory(item: VisionHistoryItem) {
  const lista = listarVisionHistory();
  lista.unshift(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

export function limparVisionHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
