export interface PesosIA {
  severidadeCritica: number;
  severidadeAtencao: number;
  severidadeInfo: number;

  scoreBaixo: number;
  scoreMedio: number;

  riscoAlto: number;
  alertasMultiplos: number;
  analiseRecente: number;
}

export const PESOS_DEFAULT: PesosIA = {
  severidadeCritica: 50,
  severidadeAtencao: 30,
  severidadeInfo: 10,

  scoreBaixo: 30,
  scoreMedio: 15,

  riscoAlto: 25,
  alertasMultiplos: 20,
  analiseRecente: 15,
};
