export interface FeedbackRegistro {
  data: string;
  positivo: boolean;
}

const KEY = "sdm_feedback_ia";

export function registrarFeedback(positivo: boolean) {
  const registros = carregarFeedback();
  registros.push({
    data: new Date().toISOString(),
    positivo,
  });
  localStorage.setItem(KEY, JSON.stringify(registros));
}

export function carregarFeedback(): FeedbackRegistro[] {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function limparFeedback() {
  localStorage.removeItem(KEY);
}
