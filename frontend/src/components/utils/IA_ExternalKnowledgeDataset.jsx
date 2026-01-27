// Sistema de Consulta a Datasets Externos - SDM Analyzer IA
import { appApi } from "@/api/appClient";

/**
 * Consulta datasets externos baseado em critérios da análise
 */
export async function consultarDatasets(criterios) {
  try {
    // Buscar datasets ativos e indexados
    const datasets = await appApi.entities.ExternalDataset.list();
    const datasetsAtivos = datasets.filter(d => d.ativo && d.indexado);

    if (datasetsAtivos.length === 0) {
      console.log('📚 [ExternalKnowledge] Nenhum dataset disponível');
      return { referencias: [], insights: [] };
    }

    // Determinar quais tipos de datasets são relevantes
    const tiposRelevantes = determinarTiposRelevantes(criterios);

    // Buscar conhecimento relevante
    const knowledgeBase = await appApi.entities.KnowledgeTable.list();
    const conhecimentoRelevante = knowledgeBase.filter(k => 
      tiposRelevantes.includes(k.tipo_conhecimento)
    );

    // Buscar padrões similares
    const padroesSimilares = buscarPadroesSimilares(conhecimentoRelevante, criterios);

    // Incrementar contador de consultas
    for (const pattern of padroesSimilares) {
      await appApi.entities.KnowledgeTable.update(pattern.id, {
        vezes_consultado: (pattern.vezes_consultado || 0) + 1,
        ultima_consulta: new Date().toISOString()
      });
    }

    // Gerar insights
    const insights = gerarInsights(padroesSimilares, criterios);

    // Montar referências usadas
    const datasetsUsados = [...new Set(ensureArray(padroesSimilares).map(p => p.dataset_id))];
    const referencias = datasetsAtivos
      .filter(d => datasetsUsados.includes(d.id))
      .map(d => ({
        nome: d.nome,
        tipo: d.tipo,
        fonte: d.fonte,
        total_registros: d.total_registros
      }));

    console.log(`📚 [ExternalKnowledge] Consultados ${referencias.length} datasets, ${insights.length} insights gerados`);

    return {
      referencias,
      insights,
      padroes_encontrados: padroesSimilares.length
    };

  } catch (error) {
    console.error('❌ [ExternalKnowledge] Erro ao consultar datasets:', error);
    return { referencias: [], insights: [] };
  }
}

/**
 * Determina quais tipos de datasets são relevantes baseado nos critérios
 */
function determinarTiposRelevantes(criterios) {
  const tipos = ['tipos_fios']; // Sempre relevante

  if (criterios.coloracao || criterios.nivel_descoloracao) {
    tipos.push('pos_coloracao', 'pos_descoloracao');
  }

  if (criterios.nivel_dano && criterios.nivel_dano !== 'saudavel') {
    tipos.push('danos_quimicos', 'danos_termicos');
  }

  if (criterios.percentual_grisalhos > 20) {
    tipos.push('grisalhos');
  }

  if (criterios.porosidade || criterios.elasticidade) {
    tipos.push('porosidade_elasticidade');
  }

  if (criterios.volume || criterios.densidade) {
    tipos.push('volume_densidade');
  }

  if (criterios.estrutura_cuticula) {
    tipos.push('estrutura_cuticula');
  }

  if (criterios.modo_analise === 'video') {
    tipos.push('motion_hair_analysis');
  }

  return tipos;
}

/**
 * Busca padrões similares no conhecimento indexado
 */
function buscarPadroesSimilares(conhecimento, criterios) {
  const padroesSimilares = [];

  for (const item of conhecimento) {
    let score = 0;

    // Calcular score de similaridade
    if (criterios.tipo_fio && item.dados_estruturados.tipo_fio) {
      if (item.dados_estruturados.tipo_fio.includes(criterios.tipo_fio)) {
        score += 30;
      }
    }

    if (criterios.nivel_dano && item.dados_estruturados.nivel_dano) {
      if (item.dados_estruturados.nivel_dano === criterios.nivel_dano) {
        score += 25;
      }
    }

    if (criterios.coloracao && item.dados_estruturados.coloracao) {
      if (item.dados_estruturados.coloracao.includes(criterios.coloracao)) {
        score += 20;
      }
    }

    if (criterios.estrutura && item.dados_estruturados.estrutura) {
      if (item.dados_estruturados.estrutura === criterios.estrutura) {
        score += 15;
      }
    }

    if (score >= 20) { // Threshold mínimo
      padroesSimilares.push({
        ...item,
        score_similaridade: score
      });
    }
  }

  // Ordenar por score e retornar top 10
  return padroesSimilares
    .sort((a, b) => b.score_similaridade - a.score_similaridade)
    .slice(0, 10);
}

/**
 * Gera insights baseados nos padrões encontrados
 */
function gerarInsights(padroes, criterios) {
  const insights = [];

  // Insight sobre tipo de fio
  const tiposFio = padroes.filter(p => p.tipo_conhecimento === 'tipos_fios');
  if (tiposFio.length > 0) {
    const maisRelevante = tiposFio[0];
    insights.push({
      categoria: 'Tipo de Fio',
      insight: `Padrão identificado compatível com ${maisRelevante.chave}`,
      confianca: maisRelevante.score_similaridade,
      fonte: 'Dataset externo de tipos capilares'
    });
  }

  // Insight sobre danos
  const padroesDano = padroes.filter(p => 
    p.tipo_conhecimento === 'danos_quimicos' || p.tipo_conhecimento === 'danos_termicos'
  );
  if (padroesDano.length > 0) {
    insights.push({
      categoria: 'Análise de Danos',
      insight: `Compatível com ${padroesDano.length} padrões de dano documentados`,
      confianca: 75,
      fonte: 'Datasets de danos capilares'
    });
  }

  // Insight sobre porosidade
  const padroesPorosidade = padroes.filter(p => 
    p.tipo_conhecimento === 'porosidade_elasticidade'
  );
  if (padroesPorosidade.length > 0) {
    insights.push({
      categoria: 'Porosidade',
      insight: 'Padrão de porosidade identificado em base científica',
      confianca: 80,
      fonte: 'Pesquisas de porosidade capilar'
    });
  }

  // Insight sobre coloração
  if (criterios.nivel_descoloracao && criterios.nivel_descoloracao !== 'nenhuma') {
    const padroesColoracao = padroes.filter(p => 
      p.tipo_conhecimento === 'pos_coloracao' || p.tipo_conhecimento === 'pos_descoloracao'
    );
    if (padroesColoracao.length > 0) {
      insights.push({
        categoria: 'Pós-Coloração',
        insight: 'Histórico químico compatível com padrões documentados',
        confianca: 70,
        fonte: 'Datasets de alterações químicas'
      });
    }
  }

  return insights;
}

/**
 * Registra aprendizado baseado em feedback e datasets
 */
export async function registrarAprendizadoComDatasets(analise, feedback, datasetsUsados) {
  try {
    const learningData = {
      tipo_aprendizado: 'diagnostico',
      contexto: {
        analise_id: analise.id,
        tipo_fio: analise.tipo_fio,
        nivel_dano: analise.nivel_dano,
        coloracao: analise.coloracao_cabelo
      },
      entrada: {
        criterios: {
          tipo_fio: analise.tipo_fio,
          nivel_dano: analise.nivel_dano,
          coloracao: analise.coloracao_cabelo
        }
      },
      saida_obtida: {
        recomendacao_alisamento: analise.recomendacao_alisamento,
        recomendacao_tratamento: analise.recomendacao_tratamento
      },
      acuracia: feedback.feedback_positivo ? 100 : 
                feedback.feedback_detalhado?.estatisticas?.precisao_percentual || 50,
      datasets_utilizados: ensureArray(datasetsUsados).map(d => d.nome),
      ajuste_aplicado: feedback.feedback_positivo ? 
        'Padrão confirmado por profissional' : 
        feedback.feedback_comentario,
      validado_por: analise.created_by,
      impacto: feedback.feedback_positivo ? 'medio' : 'alto'
    };

    await appApi.entities.LearningState.create(learningData);

    console.log('✅ [ExternalKnowledge] Aprendizado registrado com datasets externos');

  } catch (error) {
    console.error('❌ [ExternalKnowledge] Erro ao registrar aprendizado:', error);
  }
}

/**
 * Enriquece prompt da IA com insights dos datasets
 */
export function enriquecerPromptComDatasets(promptBase, insights, referencias) {
  if (!insights || insights.length === 0) {
    return promptBase;
  }

  let secaoDatasets = '\n\n📚 CONHECIMENTO DE DATASETS EXTERNOS:\n\n';

  secaoDatasets += 'Referências Técnicas Consultadas:\n';
  for (const ref of referencias) {
    secaoDatasets += `- ${ref.nome} (${ref.tipo}) - ${ref.total_registros} registros\n`;
  }

  secaoDatasets += '\nInsights Técnicos Identificados:\n';
  for (const insight of insights) {
    secaoDatasets += `\n${insight.categoria}:\n`;
    secaoDatasets += `  ${insight.insight}\n`;
    secaoDatasets += `  Confiança: ${insight.confianca}%\n`;
    secaoDatasets += `  Fonte: ${insight.fonte}\n`;
  }

  secaoDatasets += '\n⚠️ Use estes insights como referência científica adicional na sua análise.\n';

  return promptBase + secaoDatasets;
}

