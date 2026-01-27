/**
 * 🎯 SISTEMA DE VALIDAÇÃO INTELIGENTE
 * 
 * Regras de validação e correção para garantir recomendações seguras e precisas.
 * Previne indicações perigosas como alisamentos orgânicos para cabelos descoloridos.
 */

/**
 * Validar e corrigir recomendações de alisamento
 */
export function validarRecomendacaoAlisamento(analise, servicosAlisamento) {
  const warnings = [];
  const corrections = [];

  // 🚨 REGRA CRÍTICA: Alisamentos Orgânicos vs Descoloração
  const niveisDescoloracaoPerigosos = ['media', 'intensa', 'extrema'];
  const temDescoloracao = niveisDescoloracaoPerigosos.includes(analise.nivel_descoloracao);
  
  if (temDescoloracao) {
    // Verificar se alisamento principal é orgânico
    if (analise.recomendacao_alisamento && 
        (analise.recomendacao_alisamento.toLowerCase().includes('orgânico') ||
         analise.recomendacao_alisamento.toLowerCase().includes('organico'))) {
      
      warnings.push({
        tipo: 'CRITICO',
        campo: 'recomendacao_alisamento',
        mensagem: '🚨 ALISAMENTO ORGÂNICO INCOMPATÍVEL COM DESCOLORAÇÃO',
        detalhes: `Cabelo com descoloração ${analise.nivel_descoloracao} NÃO pode receber alisamento orgânico devido aos ácidos que podem causar danos severos ou quebra total.`
      });

      // Buscar alternativa segura
      const alternativaSegura = servicosAlisamento.find(s => 
        !s.nome.toLowerCase().includes('orgânico') && 
        !s.nome.toLowerCase().includes('organico') &&
        s.ativo !== false
      );

      if (alternativaSegura) {
        corrections.push({
          campo: 'recomendacao_alisamento',
          valor_antigo: analise.recomendacao_alisamento,
          valor_novo: alternativaSegura.nome,
          motivo: 'Substituído por alisamento compatível com descoloração'
        });
        analise.recomendacao_alisamento = alternativaSegura.nome;
        analise.alerta_incompatibilidade = '⚠️ ALISAMENTO AJUSTADO: Recomendação original era incompatível com nível de descoloração detectado.';
      }
    }

    // Verificar alternativa também
    if (analise.recomendacao_alisamento_alternativa && 
        (analise.recomendacao_alisamento_alternativa.toLowerCase().includes('orgânico') ||
         analise.recomendacao_alisamento_alternativa.toLowerCase().includes('organico'))) {
      
      warnings.push({
        tipo: 'ALERTA',
        campo: 'recomendacao_alisamento_alternativa',
        mensagem: '⚠️ Alisamento alternativo orgânico removido',
        detalhes: 'Incompatível com descoloração'
      });

      const outraAlternativa = servicosAlisamento.find(s => 
        s.nome !== analise.recomendacao_alisamento &&
        !s.nome.toLowerCase().includes('orgânico') && 
        !s.nome.toLowerCase().includes('organico') &&
        s.ativo !== false
      );

      if (outraAlternativa) {
        analise.recomendacao_alisamento_alternativa = outraAlternativa.nome;
      } else {
        analise.recomendacao_alisamento_alternativa = 'N/A';
      }
    }
  }

  // 🚨 VALIDAÇÃO: Químicos recentes
  const temposRecentes = ['menos de 1 mês', '1-2 meses'];
  if (analise.tempo_desde_ultimo_quimico && 
      temposRecentes.some(t => analise.tempo_desde_ultimo_quimico.includes(t))) {
    
    warnings.push({
      tipo: 'ALERTA',
      campo: 'tempo_desde_ultimo_quimico',
      mensagem: '⚠️ Químico recente detectado',
      detalhes: 'Recomenda-se cautela com novos processos químicos. Considere período de espera ou tratamentos de reconstrução.'
    });

    if (!analise.alerta_incompatibilidade) {
      analise.alerta_incompatibilidade = '';
    }
    analise.alerta_incompatibilidade += '\n⏳ ATENÇÃO: Químico aplicado recentemente. Avaliar integridade do fio antes de novo processo.';
  }

  return {
    analiseCorrigida: analise,
    warnings,
    corrections,
    temAlertas: warnings.length > 0
  };
}

/**
 * Validar detecção de coloração
 */
export function validarDeteccaoColoracao(analise) {
  const corrections = [];

  // Se tem percentual alto de grisalhos mas cor detectada não menciona
  if (analise.percentual_grisalhos > 30 && 
      analise.coloracao_cabelo && 
      !analise.coloracao_cabelo.toLowerCase().includes('grisalho') &&
      !analise.coloracao_cabelo.toLowerCase().includes('branco')) {
    
    corrections.push({
      campo: 'coloracao_cabelo',
      valor_antigo: analise.coloracao_cabelo,
      valor_novo: `${analise.coloracao_cabelo} (${analise.percentual_grisalhos}% grisalhos)`,
      motivo: 'Inclusão de percentual de grisalhos detectado'
    });
    
    analise.coloracao_cabelo = `${analise.coloracao_cabelo} (${analise.percentual_grisalhos}% grisalhos)`;
  }

  // Corrigir confusão entre colorido e descolorido
  if (analise.coloracao_cabelo && 
      analise.coloracao_cabelo.toLowerCase().includes('colorido') &&
      analise.nivel_descoloracao === 'nenhuma') {
    
    // Colorido sem descoloração é coloração comum (não descoloração)
    corrections.push({
      campo: 'detalhes_coloracao',
      valor_antigo: analise.detalhes_coloracao || '',
      valor_novo: 'Coloração comum (não descoloração)',
      motivo: 'Esclarecimento sobre tipo de coloração'
    });
    
    analise.detalhes_coloracao = 'Coloração comum (tonalizante ou permanente), sem processo de descoloração.';
  }

  if (analise.nivel_descoloracao && 
      ['media', 'intensa', 'extrema'].includes(analise.nivel_descoloracao) &&
      analise.coloracao_cabelo &&
      !analise.coloracao_cabelo.toLowerCase().includes('descolorido')) {
    
    corrections.push({
      campo: 'coloracao_cabelo',
      valor_antigo: analise.coloracao_cabelo,
      valor_novo: `Descolorido/Clareado (${analise.nivel_descoloracao})`,
      motivo: 'Correção de classificação: descoloração detectada'
    });
    
    analise.coloracao_cabelo = `Descolorido/Clareado (nível: ${analise.nivel_descoloracao})`;
  }

  return {
    analiseCorrigida: analise,
    corrections
  };
}

/**
 * Aplicar todas as validações
 */
export function aplicarValidacoesCompletas(analise, servicos) {
  const servicosAlisamento = servicos.filter(s => s.tipo === 'alisamento');
  
  // Validação 1: Alisamento
  const resultAlisamento = validarRecomendacaoAlisamento(analise, servicosAlisamento);
  
  // Validação 2: Coloração
  const resultColoracao = validarDeteccaoColoracao(resultAlisamento.analiseCorrigida);
  
  // Consolidar resultados
  const todasCorrecoes = [
    ...resultAlisamento.corrections,
    ...resultColoracao.corrections
  ];

  const todosAlertas = resultAlisamento.warnings;

  console.log('✅ [Validação] Validações aplicadas:', {
    total_correcoes: todasCorrecoes.length,
    total_alertas: todosAlertas.length,
    tem_alertas_criticos: todosAlertas.some(a => a.tipo === 'CRITICO')
  });

  return {
    analiseValidada: resultColoracao.analiseCorrigida,
    corrections: todasCorrecoes,
    warnings: todosAlertas,
    temAlertasCriticos: todosAlertas.some(a => a.tipo === 'CRITICO')
  };
}

/**
 * Analisar feedback detalhado para melhorar futuras análises
 */
export function analisarFeedbackDetalhado(feedbackDetalhado) {
  if (!feedbackDetalhado || !feedbackDetalhado.aspectos_avaliados) {
    return null;
  }

  const aspectos = feedbackDetalhado.aspectos_avaliados;
  const problemas = [];

  // Identificar padrões de problemas
  Object.entries(aspectos).forEach(([aspecto, status]) => {
    if (status === 'incorreto' || status === 'impreciso') {
      problemas.push({
        aspecto,
        severidade: status === 'incorreto' ? 'alta' : 'media',
        timestamp: feedbackDetalhado.timestamp
      });
    }
  });

  return {
    problemas_identificados: problemas,
    precisao_geral: feedbackDetalhado.estatisticas?.precisao_percentual || 0,
    aspectos_problematicos: problemas.length,
    requer_retreinamento: problemas.length > 3 || problemas.some(p => p.severidade === 'alta')
  };
}

export default {
  validarRecomendacaoAlisamento,
  validarDeteccaoColoracao,
  aplicarValidacoesCompletas,
  analisarFeedbackDetalhado
};

