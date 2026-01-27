import { PesosIA, PESOS_DEFAULT } from "./pesosIA";

const KEY = "sdm_pesos_ia";

export function carregarPesos(): PesosIA {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : PESOS_DEFAULT;
}

export function salvarPesos(pesos: PesosIA) {
  localStorage.setItem(KEY, JSON.stringify(pesos));
}

export function resetarPesos() {
  salvarPesos(PESOS_DEFAULT);
}
