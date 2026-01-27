// Sistema de Descrição de Tipos de Fio
// Analyzer SDM IA — Diagnóstico Inteligente

export function getDescricaoTipoFio(tipoDetalhado) {
  const descricoes = {
    "1A": "Liso fino e delicado",
    "1B": "Liso médio",
    "1C": "Liso grosso e resistente",
    "2A": "Ondulado suave",
    "2B": "Ondulado médio",
    "2C": "Ondulado pronunciado",
    "3A": "Cachos largos e soltos",
    "3B": "Cachos médios definidos",
    "3C": "Cachos fechados e volumosos",
    "4A": "Crespo com padrão 'S' definido",
    "4B": "Crespo com padrão 'Z' angular",
    "4C": "Crespo super enrolado e denso"
  };

  return descricoes[tipoDetalhado] || tipoDetalhado;
}

export function getTipoFioBasico(tipoDetalhado) {
  if (!tipoDetalhado) return "Não definido";
  
  const primeiro = tipoDetalhado.charAt(0);
  
  switch(primeiro) {
    case "1":
      return "Liso";
    case "2":
      return "Ondulado";
    case "3":
      return "Cacheado";
    case "4":
      return "Crespo";
    default:
      return tipoDetalhado;
  }
}

export function getCorCabelo(cor) {
  const cores = {
    "preto": "Preto Natural",
    "castanho_escuro": "Castanho Escuro",
    "castanho_medio": "Castanho Médio",
    "castanho_claro": "Castanho Claro",
    "loiro_escuro": "Loiro Escuro",
    "loiro_medio": "Loiro Médio",
    "loiro_claro": "Loiro Claro",
    "ruivo": "Ruivo",
    "grisalho_parcial": "Grisalho Parcial",
    "grisalho_total": "Grisalho Total",
    "branco": "Branco"
  };

  return cores[cor] || cor;
}

