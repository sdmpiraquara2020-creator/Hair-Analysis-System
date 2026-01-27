// 🤖 Sistema de IA Autocorretiva Avançada - SDM Analyzer IA
// Versão: 2.0 - Patch Corretivo Inteligente
// Detecção e Correção Automática com Aprendizado Contínuo

import { appApi } from "@/api/appClient";

/**
 * Log de erros detectados e corrigidos com aprendizado
 */
const registrarErroCorrigido = async (tipo, valorOriginal, valorCorrigido, contexto, metadata = {}) => {
  try {
    const logEntry = {
      tipo_erro: tipo,
      valor_original: valorOriginal,
      valor_corrigido: valorCorrigido,
      contexto: contexto,
      metadata: metadata,
      timestamp: new Date().toISOString()
    };

    console.log('🔧 [AutoCorrectAI v2.0] Erro detectado e corrigido:', logEntry);

    // Registrar em LogAuditoria para histórico e aprendizado
    await appApi.entities.LogAuditoria.create({
      tipo_auditoria: 'autocorrecao',
      status: 'corrigido',
      descricao: `IA Autocorretiva: ${tipo} | "${valorOriginal}" → "${valorCorrigido}"`,
      correcao_aplicada: valorCorrigido,
      metrica_antes: { 
        valor: valorOriginal,
        encoding: detectarEncoding(valorOriginal),
        ...metadata 
      },
      metrica_depois: { 
        valor: valorCorrigido,
        encoding: 'UTF-8',
        validado: true 
      },
      automatica: true
    });

    return true;
  } catch (error) {
    console.warn('⚠️ [AutoCorrectAI] Não foi possível registrar log (não crítico):', error);
    return false;
  }
};

/**
 * Detectar encoding incorreto
 */
const detectarEncoding = (texto) => {
  if (!texto) return 'unknown';
  
  // Padrões de encoding corrompido
  const padroesProblematicos = [
    /Ã[^o]/gi,          // ex: "Nãnecessário"
    /â€™/g,             // caractere especial corrompido
    /Ã£/g,              // "ã" corrompido
    /Ã§/g,              // "ç" corrompido
    /Ã©/g,              // "é" corrompido
    /Ã­/g,              // "í" corrompido
    /Ã³/g,              // "ó" corrompido
    /_[a-z]+_/g         // underscores
  ];

  const temProblemas = padroesProblematicos.some(padrao => padrao.test(texto));
  return temProblemas ? 'corrupted' : 'UTF-8';
};

/**
 * Corrigir encoding UTF-8 corrompido
 */
const corrigirEncoding = (texto) => {
  if (!texto) return texto;
  
  const correcoes = {
    'Ã£': 'ã',
    'Ã§': 'ç',
    'Ã©': 'é',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã¡': 'á',
    'Ã¢': 'â',
    'Ã´': 'ô',
    'Ãª': 'ê',
    'Ã': 'Ã',
    'â€™': "'",
    'â€œ': '"',
    'â€': '"'
  };
  
  let corrigido = texto;
  Object.keys(correcoes).forEach(errado => {
    corrigido = corrigido.replace(new RegExp(errado, 'g'), correcoes[errado]);
  });
  
  return corrigido;
};

/**
 * Detecta e corrige duplicação de tipo de fio AVANÇADO
 * Ex: "3B 3B" → "3B"
 * Ex: "2A2A" → "2A"
 * Ex: "4A 4A 4A" → "4A"
 */
export const corrigirTipoFioDuplicado = (tipoFio) => {
  if (!tipoFio) return tipoFio;

  const original = tipoFio.trim();
  
  // Padrão 1: "3B 3B" (com espaço)
  let match = original.match(/^(\d[A-C])\s+\1$/i);
  if (match) {
    const corrigido = match[1].toUpperCase();
    registrarErroCorrigido('tipo_fio_duplicado_espaco', original, corrigido, 'pre_render');
    return corrigido;
  }
  
  // Padrão 2: "3B3B" (sem espaço)
  match = original.match(/^(\d[A-C])\1$/i);
  if (match) {
    const corrigido = match[1].toUpperCase();
    registrarErroCorrigido('tipo_fio_duplicado_colado', original, corrigido, 'pre_render');
    return corrigido;
  }
  
  // Padrão 3: "3B 3B 3B" (múltiplas duplicações)
  match = original.match(/^(\d[A-C])(\s+\1)+$/i);
  if (match) {
    const corrigido = match[1].toUpperCase();
    registrarErroCorrigido('tipo_fio_multiplicado', original, corrigido, 'pre_render');
    return corrigido;
  }
  
  // Padrão 4: Remover espaços extras e normalizar
  const limpo = original.replace(/\s+/g, ' ').trim().toUpperCase();
  
  if (limpo !== original && limpo.length <= 2) {
    registrarErroCorrigido('tipo_fio_espacos', original, limpo, 'normalizacao');
    return limpo;
  }

  return original.toUpperCase();
};

/**
 * Normaliza texto com correção de encoding e acentuação AVANÇADO
 * Ex: "Nãnecessário" → "Não necessário"
 * Ex: "nao_necessario" → "Não necessário"
 */
export const normalizarTexto = (texto) => {
  if (!texto) return texto;

  const original = texto;
  
  // Etapa 1: Corrigir encoding corrompido
  let corrigido = corrigirEncoding(original);
  
  // Etapa 2: Mapa de correções conhecidas (case-insensitive)
  const correcoes = {
    // Necessidade de corte
    'nao_necessario': 'Não necessário',
    'não_necessario': 'Não necessário',
    'nao necessario': 'Não necessário',
    'naonecessario': 'Não necessário',
    'nãnecessário': 'Não necessário',
    'nãonecessário': 'Não necessário',
    'não necessario': 'Não necessário',
    
    // Níveis
    'obrigatorio': 'Obrigatório',
    'obrigatório': 'Obrigatório',
    'moderado': 'Moderado',
    'preventivo': 'Preventivo',
    
    // Condições
    'saudavel': 'Saudável',
    'saudável': 'Saudável',
    
    // Medidas
    'medio': 'Médio',
    'média': 'Média',
    'media': 'Média',
    'baixo': 'Baixo',
    'alto': 'Alto',
    'alta': 'Alta',
    
    // Estruturas
    'fina': 'Fina',
    'grossa': 'Grossa',
    
    // Danos
    'severo': 'Severo',
    'leve': 'Leve'
  };

  const textoLower = corrigido.toLowerCase().trim();
  
  if (correcoes[textoLower]) {
    const resultado = correcoes[textoLower];
    if (resultado !== original) {
      registrarErroCorrigido('texto_mal_formatado', original, resultado, 'normalizacao_texto', {
        encoding: detectarEncoding(original),
        matched: textoLower
      });
    }
    return resultado;
  }

  // Etapa 3: Remover underscores e capitalizar
  corrigido = ensureArray(
    corrigido
      .replace(/_/g, ' ')
      .split(' ')
      .filter(word => word.length > 0)
  ).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

  if (corrigido !== original) {
    registrarErroCorrigido('texto_underscores', original, corrigido, 'capitalizacao');
  }

  return corrigido;
};

/**
 * Valida e corrige estrutura de análise completa
 */
export const validarECorrigirAnalise = (analise) => {
  if (!analise) return analise;

  const analiseCorrigida = { ...analise };
  let correctedCount = 0;

  // Campo: tipo_fio
  if (analiseCorrigida.tipo_fio) {
    const tipoCorrigido = corrigirTipoFioDuplicado(analiseCorrigida.tipo_fio);
    if (tipoCorrigido !== analiseCorrigida.tipo_fio) {
      analiseCorrigida.tipo_fio = tipoCorrigido;
      correctedCount++;
    }
  }

  // Campo: tipo_fio_detalhado
  if (analiseCorrigida.tipo_fio_detalhado) {
    const tipoDetalhadoCorrigido = corrigirTipoFioDuplicado(analiseCorrigida.tipo_fio_detalhado);
    if (tipoDetalhadoCorrigido !== analiseCorrigida.tipo_fio_detalhado) {
      analiseCorrigida.tipo_fio_detalhado = tipoDetalhadoCorrigido;
      correctedCount++;
    }
  }

  // Campo: necessidade_corte
  if (analiseCorrigida.necessidade_corte) {
    const corteCorrigido = normalizarTexto(analiseCorrigida.necessidade_corte);
    if (corteCorrigido !== analiseCorrigida.necessidade_corte) {
      analiseCorrigida.necessidade_corte = corteCorrigido;
      correctedCount++;
    }
  }

  // Campo: volume_capilar
  if (analiseCorrigida.volume_capilar) {
    const volumeCorrigido = normalizarTexto(analiseCorrigida.volume_capilar);
    if (volumeCorrigido !== analiseCorrigida.volume_capilar) {
      analiseCorrigida.volume_capilar = volumeCorrigido;
      correctedCount++;
    }
  }

  // Campo: estrutura_fio
  if (analiseCorrigida.estrutura_fio) {
    const estruturaCorrigida = normalizarTexto(analiseCorrigida.estrutura_fio);
    if (estruturaCorrigida !== analiseCorrigida.estrutura_fio) {
      analiseCorrigida.estrutura_fio = estruturaCorrigida;
      correctedCount++;
    }
  }

  // Campo: nivel_dano
  if (analiseCorrigida.nivel_dano) {
    const danoCorrigido = normalizarTexto(analiseCorrigida.nivel_dano);
    if (danoCorrigido !== analiseCorrigida.nivel_dano) {
      analiseCorrigida.nivel_dano = danoCorrigido;
      correctedCount++;
    }
  }

  // Campo: brilho_natural
  if (analiseCorrigida.brilho_natural) {
    const brilhoCorrigido = normalizarTexto(analiseCorrigida.brilho_natural);
    if (brilhoCorrigido !== analiseCorrigida.brilho_natural) {
      analiseCorrigida.brilho_natural = brilhoCorrigido;
      correctedCount++;
    }
  }

  // Campo: condicao_cabelo
  if (analiseCorrigida.condicao_cabelo) {
    const condicaoCorrigida = corrigirEncoding(analiseCorrigida.condicao_cabelo);
    if (condicaoCorrigida !== analiseCorrigida.condicao_cabelo) {
      analiseCorrigida.condicao_cabelo = condicaoCorrigida;
      correctedCount++;
    }
  }

  // Campo: justificativa
  if (analiseCorrigida.justificativa) {
    const justificativaCorrigida = corrigirEncoding(analiseCorrigida.justificativa);
    if (justificativaCorrigida !== analiseCorrigida.justificativa) {
      analiseCorrigida.justificativa = justificativaCorrigida;
      correctedCount++;
    }
  }

  if (correctedCount > 0) {
    console.log(`✅ [AutoCorrectAI v2.0] ${correctedCount} correção(ões) aplicada(s) automaticamente`);
  }

  return analiseCorrigida;
};

/**
 * Aprendizado contínuo - Analisa padrões de erros
 */
export const analisarPadroesErros = async () => {
  try {
    const logs = await appApi.entities.LogAuditoria.list('-created_date', 100);
    const logsAutocorrecao = logs.filter(l => l.tipo_auditoria === 'autocorrecao');

    if (logsAutocorrecao.length === 0) {
      console.log('📊 [AutoCorrectAI v2.0] Nenhum erro registrado ainda - sistema aprendendo');
      return { total: 0, padroes: {}, insights: [] };
    }

    // Agrupar por tipo de erro
    const padroes = {};
    const insights = [];
    
    logsAutocorrecao.forEach(log => {
      const tipo = log.descricao?.split('|')[0]?.replace('IA Autocorretiva:', '').trim() || 'desconhecido';
      padroes[tipo] = (padroes[tipo] || 0) + 1;
    });

    // Gerar insights de aprendizado
    Object.keys(padroes).forEach(tipo => {
      const frequencia = padroes[tipo];
      if (frequencia > 5) {
        insights.push({
          tipo,
          frequencia,
          prioridade: frequencia > 10 ? 'alta' : 'média',
          acao: 'Reforçar validação preventiva'
        });
      }
    });

    console.log('📊 [AutoCorrectAI v2.0] Padrões de erros detectados:', padroes);
    console.log('🧠 [AutoCorrectAI v2.0] Insights de aprendizado:', insights);

    return {
      total: logsAutocorrecao.length,
      padroes,
      insights,
      ultimaAnalise: new Date().toISOString()
    };
  } catch (error) {
    console.warn('⚠️ [AutoCorrectAI] Erro ao analisar padrões:', error);
    return { total: 0, padroes: {}, insights: [] };
  }
};

/**
 * Validação inteligente baseada em histórico e aprendizado
 */
export const validarComInteligencia = async (analise) => {
  console.log('🧠 [AutoCorrectAI v2.0] Iniciando validação inteligente com aprendizado...');
  
  // Aplicar correções básicas
  let analiseCorrigida = validarECorrigirAnalise(analise);

  // Analisar padrões de erros anteriores
  const { padroes, insights } = await analisarPadroesErros();

  // Aplicar correções reforçadas baseadas em aprendizado
  if (insights.length > 0) {
    console.log('🎯 [AutoCorrectAI v2.0] Aplicando correções reforçadas baseadas em aprendizado...');
    
    insights.forEach(insight => {
      if (insight.prioridade === 'alta') {
        // Validação extra para tipos de fio
        if (insight.tipo.includes('tipo_fio')) {
          analiseCorrigida.tipo_fio = corrigirTipoFioDuplicado(analiseCorrigida.tipo_fio || '');
          analiseCorrigida.tipo_fio_detalhado = corrigirTipoFioDuplicado(analiseCorrigida.tipo_fio_detalhado || '');
        }
        
        // Validação extra para textos
        if (insight.tipo.includes('texto')) {
          Object.keys(analiseCorrigida).forEach(key => {
            if (typeof analiseCorrigida[key] === 'string' && analiseCorrigida[key].length < 100) {
              analiseCorrigida[key] = normalizarTexto(analiseCorrigida[key]);
            }
          });
        }
      }
    });
  }

  console.log('✅ [AutoCorrectAI v2.0] Validação inteligente concluída');
  return analiseCorrigida;
};

/**
 * Recalibração automática de recomendações baseada em feedback
 */
export const recalibrarRecomendacoes = async (analise) => {
  try {
    console.log('🎯 [AutoCorrectAI v2.0] Iniciando recalibração de recomendações...');
    
    // Buscar análises anteriores bem-sucedidas
    const analisesAnteriores = await appApi.entities.Analise.list('-created_date', 30);
    const analisesComSucesso = analisesAnteriores.filter(a => 
      a.feedback_positivo === true && 
      a.tipo_fio === analise.tipo_fio
    );

    if (analisesComSucesso.length >= 3) {
      console.log(`🎓 [AutoCorrectAI v2.0] Aprendizado: ${analisesComSucesso.length} casos de sucesso encontrados para tipo ${analise.tipo_fio}`);
      
      // Extrair padrões de sucesso
      const alisamentosMaisSucesso = {};
      const tratamentosMaisSucesso = {};

      analisesComSucesso.forEach(a => {
        if (a.recomendacao_alisamento) {
          alisamentosMaisSucesso[a.recomendacao_alisamento] = 
            (alisamentosMaisSucesso[a.recomendacao_alisamento] || 0) + 1;
        }
        if (a.recomendacao_tratamento) {
          tratamentosMaisSucesso[a.recomendacao_tratamento] = 
            (tratamentosMaisSucesso[a.recomendacao_tratamento] || 0) + 1;
        }
      });

      const recalibracao = {
        alisamentoPreferido: Object.keys(alisamentosMaisSucesso).sort((a, b) => 
          alisamentosMaisSucesso[b] - alisamentosMaisSucesso[a]
        )[0],
        tratamentoPreferido: Object.keys(tratamentosMaisSucesso).sort((a, b) => 
          tratamentosMaisSucesso[b] - tratamentosMaisSucesso[a]
        )[0],
        confianca: Math.min(analisesComSucesso.length / 10, 1), // 0-1 score
        casosDeSucesso: analisesComSucesso.length
      };
      
      console.log('🎓 [AutoCorrectAI v2.0] Recalibração concluída:', recalibracao);
      return recalibracao;
    }

    console.log('📚 [AutoCorrectAI v2.0] Ainda coletando dados de aprendizado...');
    return null;
  } catch (error) {
    console.warn('⚠️ [AutoCorrectAI] Erro na recalibração:', error);
    return null;
  }
};

/**
 * Sistema de feedback implícito - aprende com edições manuais
 */
export const registrarFeedbackImplicito = async (analiseOriginal, analiseEditada, usuarioEmail) => {
  try {
    const diferencas = [];
    
    Object.keys(analiseEditada).forEach(campo => {
      if (analiseOriginal[campo] !== analiseEditada[campo] && 
          typeof analiseEditada[campo] === 'string') {
        diferencas.push({
          campo,
          valorIA: analiseOriginal[campo],
          valorProfissional: analiseEditada[campo]
        });
      }
    });

    if (diferencas.length > 0) {
      console.log('📝 [AutoCorrectAI v2.0] Feedback implícito detectado:', diferencas);
      
      // Registrar para aprendizado
      await appApi.entities.LogAuditoria.create({
        tipo_auditoria: 'feedback_implicito',
        status: 'aprendizado',
        descricao: `Profissional ${usuarioEmail} corrigiu ${diferencas.length} campo(s)`,
        correcao_aplicada: JSON.stringify(diferencas),
        metrica_antes: { diferencas },
        automatica: false
      });
    }
    
    return diferencas;
  } catch (error) {
    console.warn('⚠️ [AutoCorrectAI] Erro ao registrar feedback implícito:', error);
    return [];
  }
};

export default {
  corrigirTipoFioDuplicado,
  normalizarTexto,
  validarECorrigirAnalise,
  validarComInteligencia,
  analisarPadroesErros,
  recalibrarRecomendacoes,
  registrarFeedbackImplicito,
  corrigirEncoding,
  detectarEncoding
};

