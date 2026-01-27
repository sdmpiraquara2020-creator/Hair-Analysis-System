// ExternalLearningAgent.js
// Agente de Aprendizado Externo Inteligente
// SDM Analyzer IA - Incorporação de Estudos e Descobertas Externas

import { appApi } from "@/api/appClient";

/**
 * 🧠 AGENTE DE APRENDIZADO EXTERNO
 * 
 * Este módulo busca automaticamente estudos, pesquisas e descobertas externas
 * sobre cabelos, tratamentos capilares e tricologia, incorporando esses insights
 * nas análises e relatórios do sistema.
 * 
 * FUNCIONALIDADES:
 * - Busca inteligente de estudos e pesquisas
 * - Incorporação automática de descobertas
 * - Criação dinâmica de campos nos relatórios
 * - Aprendizado contínuo e evolução do sistema
 */

class ExternalLearningSystem {
  constructor() {
    this.version = '1.0.0';
    this.lastUpdate = null;
    this.learningCache = this._loadCache();
    this.discoveryCount = 0;
  }

  /**
   * Buscar e incorporar estudos externos
   * @param {Object} analysisContext - Contexto da análise atual
   * @returns {Promise<Array>} - Array de insights descobertos
   */
  async searchAndLearn(analysisContext = {}) {
    console.log('🔍 [ExternalLearning] Buscando conhecimento externo...');

    try {
      const { tipo_fio, coloracao, nivel_dano, tipo_dano } = analysisContext;

      // Construir query de busca inteligente
      const searchQuery = this._buildSearchQuery(analysisContext);

      console.log('📚 [ExternalLearning] Query:', searchQuery);

      // Buscar insights usando IA com contexto da internet
      const insights = await this._fetchExternalKnowledge(searchQuery, analysisContext);

      // Salvar insights no cache
      if (insights && insights.length > 0) {
        this._saveToCache(insights);
        this.discoveryCount += insights.length;
        console.log(`✅ [ExternalLearning] ${insights.length} insights incorporados`);
      }

      return insights;

    } catch (error) {
      console.error('❌ [ExternalLearning] Erro ao buscar conhecimento:', error);
      return [];
    }
  }

  /**
   * Construir query de busca inteligente
   */
  _buildSearchQuery(context) {
    const { tipo_fio, coloracao, nivel_dano, tipo_dano, percentual_grisalhos } = context;

    let query = 'Latest hair care research and treatments for ';

    if (tipo_fio) {
      query += `${tipo_fio} hair type, `;
    }

    if (coloracao && coloracao !== 'Natural') {
      query += `${coloracao} colored hair, `;
    }

    if (percentual_grisalhos > 30) {
      query += `gray hair treatment, `;
    }

    if (nivel_dano && nivel_dano !== 'saudavel') {
      query += `${nivel_dano} damage repair, `;
    }

    if (tipo_dano && tipo_dano !== 'nenhum') {
      query += `${tipo_dano} hair damage, `;
    }

    query += 'professional salon techniques 2024-2025';

    return query;
  }

  /**
   * Buscar conhecimento externo usando IA
   */
  async _fetchExternalKnowledge(searchQuery, context) {
    try {
      const prompt = `
🔬 MISSÃO: Analista de Pesquisas Capilares Avançadas

Você é um especialista em pesquisa científica capilar. Analise as últimas descobertas e estudos sobre:

CONTEXTO DA ANÁLISE:
- Tipo de fio: ${context.tipo_fio || 'não especificado'}
- Coloração: ${context.coloracao || 'natural'}
- Nível de dano: ${context.nivel_dano || 'não especificado'}
- Tipo de dano: ${context.tipo_dano || 'não especificado'}
${context.percentual_grisalhos > 0 ? `- Grisalhos: ${context.percentual_grisalhos}%` : ''}

📚 BUSCA: ${searchQuery}

🎯 FORNEÇA:
1. Descobertas científicas recentes (2024-2025)
2. Novas técnicas profissionais de tratamento
3. Insights sobre cuidados específicos para este perfil
4. Alertas sobre ingredientes ou procedimentos
5. Recomendações baseadas em estudos científicos

⚠️ IMPORTANTE:
- Foque em informações PRÁTICAS e APLICÁVEIS em salão
- Cite fontes quando possível (estudos, universidades, especialistas)
- Seja específico para o perfil analisado
- Máximo de 5 insights mais relevantes

Retorne em formato JSON com esta estrutura:
{
  "insights": [
    {
      "titulo": "Título do insight",
      "descricao": "Descrição detalhada",
      "aplicacao_pratica": "Como aplicar no salão",
      "fonte": "Fonte ou tipo de estudo",
      "relevancia": "alta|media|baixa",
      "categoria": "tratamento|tecnica|cuidado|alerta"
    }
  ]
}`;

      const response = await appApi.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            insights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  titulo: { type: "string" },
                  descricao: { type: "string" },
                  aplicacao_pratica: { type: "string" },
                  fonte: { type: "string" },
                  relevancia: { type: "string", enum: ["alta", "media", "baixa"] },
                  categoria: { type: "string", enum: ["tratamento", "tecnica", "cuidado", "alerta"] }
                },
                required: ["titulo", "descricao", "aplicacao_pratica", "fonte", "relevancia", "categoria"]
              }
            }
          },
          required: ["insights"]
        }
      });

      return response.insights || [];

    } catch (error) {
      console.error('❌ [ExternalLearning] Erro ao buscar com IA:', error);
      return [];
    }
  }

  /**
   * Incorporar insights na análise
   * @param {Array} insights - Insights descobertos
   * @param {Object} analise - Análise atual
   * @returns {Object} - Análise enriquecida com insights
   */
  incorporateInsights(insights, analise) {
    if (!insights || insights.length === 0) return analise;

    const insightsExternos = ensureArray(insights).map(insight => ({
      fonte: insight.fonte || 'Pesquisa Externa',
      insight: `${insight.titulo}: ${insight.descricao}`,
      aplicacao: insight.aplicacao_pratica || '',
      categoria: insight.categoria || 'informacao',
      aplicado_em: new Date().toISOString(),
      relevancia: insight.relevancia || 'media'
    }));

    // Adicionar insights de alta relevância às observações
    const insightsAlta = insights.filter(i => i.relevancia === 'alta');
    let observacoesEnriquecidas = analise.observacoes_adicionais || '';

    if (insightsAlta.length > 0) {
      observacoesEnriquecidas += '\n\n📚 INSIGHTS CIENTÍFICOS RECENTES:\n\n';
      insightsAlta.forEach((insight, idx) => {
        observacoesEnriquecidas += `${idx + 1}. ${insight.titulo}\n`;
        observacoesEnriquecidas += `   ${insight.aplicacao_pratica}\n\n`;
      });
    }

    return {
      ...analise,
      insights_externos: insightsExternos,
      observacoes_adicionais: observacoesEnriquecidas,
      ia_version: `${this.version} + External Learning`,
      ia_confidence: Math.min(100, (analise.ia_confidence || 85) + (insightsAlta.length * 2))
    };
  }

  /**
   * Atualizar cache de aprendizado
   */
  _saveToCache(insights) {
    try {
      const timestamp = new Date().toISOString();
      this.learningCache.push({
        timestamp,
        insights,
        count: insights.length
      });

      // Manter apenas últimas 50 buscas
      if (this.learningCache.length > 50) {
        this.learningCache = this.learningCache.slice(-50);
      }

      localStorage.setItem('sdm_external_learning_cache', JSON.stringify(this.learningCache));
      this.lastUpdate = timestamp;

    } catch (error) {
      console.warn('⚠️ [ExternalLearning] Erro ao salvar cache:', error);
    }
  }

  /**
   * Carregar cache
   */
  _loadCache() {
    try {
      const cached = localStorage.getItem('sdm_external_learning_cache');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Obter estatísticas do sistema
   */
  getStats() {
    return {
      version: this.version,
      last_update: this.lastUpdate,
      total_discoveries: this.discoveryCount,
      cached_searches: this.learningCache.length,
      cache_size_kb: new Blob([JSON.stringify(this.learningCache)]).size / 1024
    };
  }

  /**
   * Limpar cache antigo
   */
  clearCache() {
    this.learningCache = [];
    localStorage.removeItem('sdm_external_learning_cache');
    this.lastUpdate = null;
    this.discoveryCount = 0;
    console.log('🗑️ [ExternalLearning] Cache limpo');
  }
}

// Singleton
const externalLearning = new ExternalLearningSystem();

/**
 * Buscar e incorporar conhecimento externo usando OpenAI GPT-4o
 */
export async function fetchExternalInsights(analysisContext) {
  console.log('🔬 [ExternalLearning] Integrando estudos científicos via OpenAI GPT-4o...');
  return await externalLearning.searchAndLearn(analysisContext);
}

/**
 * Incorporar insights na análise
 */
export function enrichAnalysisWithInsights(insights, analise) {
  return externalLearning.incorporateInsights(insights, analise);
}

/**
 * Processar feedback detalhado e gerar aprendizado
 */
export async function processarFeedbackParaAprendizado(analise, feedback) {
  try {
    const tipoAprendizado = feedback.feedback_positivo ? 'reforco_positivo' : 'correcao';
    
    const learningState = {
      tipo_aprendizado: tipoAprendizado,
      contexto: {
        analise_id: analise.id,
        tipo_fio: analise.tipo_fio_detalhado || analise.tipo_fio,
        nivel_dano: analise.nivel_dano,
        coloracao: analise.coloracao_cabelo,
        modo_analise: analise.modo_analise
      },
      entrada: {
        tipo_fio: analise.tipo_fio_detalhado || analise.tipo_fio,
        volume_capilar: analise.volume_capilar,
        estrutura_fio: analise.estrutura_fio,
        nivel_dano: analise.nivel_dano
      },
      saida_esperada: feedback.feedback_detalhado?.aspectos_avaliados || {},
      saida_obtida: {
        recomendacao_alisamento: analise.recomendacao_alisamento,
        recomendacao_tratamento: analise.recomendacao_tratamento
      },
      acuracia: feedback.feedback_positivo ? 100 : (feedback.feedback_detalhado?.estatisticas?.precisao_percentual || 50),
      ajuste_aplicado: feedback.feedback_comentario || 'Feedback registrado',
      validado_por: analise.created_by,
      impacto: feedback.feedback_positivo ? 'medio' : 'alto'
    };

    await appApi.entities.LearningState.create(learningState);
    console.log('✅ [ExternalLearning] Aprendizado registrado');
    
    return learningState;

  } catch (error) {
    console.error('❌ [ExternalLearning] Erro ao processar aprendizado:', error);
    return null;
  }
}

/**
 * Obter estatísticas do sistema
 */
export function getExternalLearningStats() {
  return externalLearning.getStats();
}

/**
 * Limpar cache
 */
export function clearExternalLearningCache() {
  externalLearning.clearCache();
}

export default externalLearning;

