import { PesosIA } from "./pesosIA";

export function aplicarSugestoes(
  pesos: PesosIA,
  sugestoes: {
    campo: keyof PesosIA;
    ajustePercentual: number;
  }[]
): PesosIA {
  const novosPesos = { ...pesos };

  sugestoes.forEach((s) => {
    const atual = novosPesos[s.campo];
    novosPesos[s.campo] = Math.round(
      atual * (1 + s.ajustePercentual / 100)
    );
  });

  return novosPesos;
}
