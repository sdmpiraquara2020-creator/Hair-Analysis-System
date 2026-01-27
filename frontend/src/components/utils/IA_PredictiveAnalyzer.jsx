// 🔮 IA PREDICTIVE ANALYZER - Análise Preditiva de Saúde Capilar
// SDM Analyzer IA v1.0 - Predição de Tendências e Prevenção

import { appApi } from "@/api/appClient";

/**
 * 🔮 SISTEMA DE ANÁLISE PREDITIVA
 * 
 * Analisa histórico de análises capilares e tricológicas para:
 * - Prever tendências futuras de saúde capilar
 * - Identificar riscos potenciais antes que se agravem
 * - Sugerir medidas preventivas personalizadas
 * - Recomendar tratamentos proativos
 */

class PredictiveHealthAnalyzer {
  constructor() {
    this.version = '1.0.0';
    this.module_name = 'IA_PREDICTIVE_ANALYZER';
  }

  /**
   * 🔍 Analisar histórico e gerar previsões
   */
  async analyzeAndPredict(userId, clienteId = null) {
    console.log('🔮 [PredictiveAnalyzer] Iniciando análise preditiva...');

    try {
      // Buscar dados históricos
      const historicalData = await this._fetchHistoricalData(userId, clienteId);

      if (!historicalData || historicalData.total_analyses < 2) {
        return {
          insufficient_data: true,
          message: 'Dados insuficientes para análise preditiva. São necessárias pelo menos 2 análises.',
          required_analyses: 2,
          current_analyses: historicalData?.total_analyses || 0
        };
      }

      // Preparar dados para análise preditiva
      const analysisContext = this._prepareAnalysisContext(historicalData);

      // Usar IA para gerar previsões
      const predictions = await this._generateAIPredictions(analysisContext);

      console.log('✅ [PredictiveAnalyzer] Análise preditiva concluída');

      return {
        insufficient_data: false,
        predictions,
        historical_summary: historicalData.summary,
        generated_at: new Date().toISOString(),
        confidence_level: this._calculateConfidence(historicalData.total_analyses),
        module_version: this.version
      };

    } catch (error) {
      console.error('❌ [PredictiveAnalyzer] Erro:', error);
      throw error;
    }
  }

  /**
   * 📊 Buscar dados históricos
   */
  async _fetchHistoricalData(userId, clienteId) {
    try {
      // Buscar análises capilares
      let analisesCapilares = await appApi.entities.Analise.list('-created_date', 100);
      
      // Buscar análises tricológicas
      let analisesTricolicas = await appApi.entities.AnaliseTricologica.list('-created_date', 100);

      // Filtrar por cliente se fornecido
      if (clienteId) {
        analisesCapilares = analisesCapilares.filter(a => a.cliente_id === clienteId);
        analisesTricolicas = analisesTricolicas.filter(a => a.cliente_id === clienteId);
      }

      // Ordenar por data
      analisesCapilares.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
      analisesTricolicas.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

      const totalAnalyses = analisesCapilares.length + analisesTricolicas.length;

      // Gerar resumo
      const summary = {
        total_capilar: analisesCapilares.length,
        total_tricologica: analisesTricolicas.length,
        oldest_date: totalAnalyses > 0 ? 
          (analisesCapilares[0]?.created_date || analisesTricolicas[0]?.created_date) : null,
        newest_date: totalAnalyses > 0 ?
          (analisesCapilares[analisesCapilares.length - 1]?.created_date || 
           analisesTricolicas[analisesTricolicas.length - 1]?.created_date) : null
      };

      return {
        total_analyses: totalAnalyses,
        analises_capilares: analisesCapilares,
        analises_tricologicas: analisesTricolicas,
        summary
      };

    } catch (error) {
      console.error('❌ [PredictiveAnalyzer] Erro ao buscar dados:', error);
      throw error;
    }
  }

  /**
   * 🧩 Preparar contexto para análise
   */
  _prepareAnalysisContext(historicalData) {
    const { analises_capilares, analises_tricologicas } = historicalData;

    // Extrair tendências de análises capilares
    const capilaresTrends = ensureArray(analises_capilares).map((a, idx) => ({
      index: idx + 1,
      date: a.created_date,
      tipo_fio: a.tipo_fio_detalhado || a.tipo_fio,
      nivel_dano: a.nivel_dano,
      coloracao: a.coloracao_cabelo || a.cor_cabelo_detectada,
      percentual_grisalhos: a.percentual_grisalhos || 0,
      nivel_descoloracao: a.nivel_descoloracao,
      tipo_dano: a.tipo_dano_predominante,
      feedback_positivo: a.feedback_positivo,
      tratamento_escolhido: a.recomendacao_tratamento
    }));

    // Extrair tendências de análises tricológicas
    const tricologicasTrends = ensureArray(analises_tricologicas).map((a, idx) => ({
      index: idx + 1,
      date: a.created_date,
      densidade_folicular: a.densidade_folicular?.foliculos_por_cm2,
      indice_saude: a.metricas_quantitativas?.indice_saude_geral,
      oleosidade: a.oleosidade_sebo?.percentual_oleosidade,
      descamacao: a.descamacao_caspa?.percentual_descamacao,
      alopecia_grau: a.deteccao_alopecia?.grau_rarefacao,
      quebra_nivel: a.quebra_fios?.nivel_quebra,
      porosidade_score: a.porosidade_fios?.score_porosidade
    }));

    return {
      total_analyses: historicalData.total_analyses,
      period_days: this._calculatePeriodDays(historicalData.summary.oldest_date, historicalData.summary.newest_date),
      capilar_trends: capilaresTrends,
      tricologica_trends: tricologicasTrends,
      summary: historicalData.summary
    };
  }

  /**
   * 🤖 Gerar previsões usando IA
   */
  async _generateAIPredictions(context) {
    try {
      const prompt = `Você é uma IA ESPECIALISTA EM ANÁLISE PREDITIVA DE SAÚDE CAPILAR do SDM Analyzer IA.

═══════════════════════════════════════════════════════════
🔮 MISSÃO: ANÁLISE PREDITIVA E PREVENÇÃO
═══════════════════════════════════════════════════════════

Você receberá o HISTÓRICO COMPLETO de análises capilares e tricológicas de um cliente.

📊 DADOS HISTÓRICOS:
${JSON.stringify(context, null, 2)}

🎯 SUA MISSÃO:

1️⃣ **ANÁLISE DE TENDÊNCIAS** (OBRIGATÓRIO)
   Identifique padrões e tendências observadas ao longo do tempo:
   - Progressão ou regressão do dano capilar
   - Evolução da saúde do couro cabeludo
   - Mudanças na densidade folicular
   - Tendências de oleosidade e descamação
   - Aumento ou redução de quebra
   - Progressão de coloração/grisalhos

2️⃣ **PREVISÕES FUTURAS** (3-6 meses)
   Com base nas tendências identificadas, preveja:
   - Condições que podem se desenvolver
   - Riscos potenciais (queda, alopecia, danos severos)
   - Áreas que necessitam atenção urgente
   - Probabilidade de cada risco (baixa/média/alta)

3️⃣ **MEDIDAS PREVENTIVAS** (OBRIGATÓRIO)
   Recomende ações PROATIVAS para prevenir problemas:
   - Tratamentos preventivos específicos
   - Mudanças na rotina de cuidados
   - Produtos recomendados
   - Frequência de acompanhamento sugerida
   - Alertas para o profissional

4️⃣ **PLANO DE AÇÃO PERSONALIZADO**
   Crie um plano de ação com:
   - Prioridades imediatas (próximos 30 dias)
   - Ações de médio prazo (1-3 meses)
   - Monitoramento de longo prazo (3-6 meses)
   - Indicadores-chave para acompanhar

═══════════════════════════════════════════════════════════
⚠️ IMPORTANTE:
═══════════════════════════════════════════════════════════

- Use DADOS REAIS do histórico para fundamentar previsões
- Seja ESPECÍFICO e TÉCNICO nas recomendações
- Priorize PREVENÇÃO sobre correção
- Identifique RISCOS SUTIS que podem se agravar
- Forneça CONFIANÇA para cada previsão (0-100%)

═══════════════════════════════════════════════════════════`;

      const predictionSchema = {
        type: "object",
        properties: {
          tendencias_identificadas: {
            type: "array",
            description: "Tendências observadas no histórico",
            items: {
              type: "object",
              properties: {
                categoria: {
                  type: "string",
                  enum: ["saude_geral", "densidade", "oleosidade", "descamacao", "quebra", "dano", "coloracao", "alopecia"]
                },
                tendencia: {
                  type: "string",
                  enum: ["melhorando", "estavel", "piorando", "flutuante"]
                },
                descricao: { type: "string" },
                dados_suporte: { type: "string" }
              },
              required: ["categoria", "tendencia", "descricao"]
            }
          },
          previsoes_futuras: {
            type: "array",
            description: "Previsões para os próximos 3-6 meses",
            items: {
              type: "object",
              properties: {
                condicao_prevista: { type: "string" },
                probabilidade: {
                  type: "string",
                  enum: ["baixa", "media", "alta", "muito_alta"]
                },
                prazo_estimado: { type: "string" },
                gravidade: {
                  type: "string",
                  enum: ["leve", "moderada", "severa", "critica"]
                },
                justificativa: { type: "string" },
                confianca: { type: "number", minimum: 0, maximum: 100 }
              },
              required: ["condicao_prevista", "probabilidade", "justificativa", "confianca"]
            }
          },
          medidas_preventivas: {
            type: "array",
            description: "Ações preventivas recomendadas",
            items: {
              type: "object",
              properties: {
                acao: { type: "string" },
                tipo: {
                  type: "string",
                  enum: ["tratamento_profissional", "homecare", "habito", "produto", "monitoramento"]
                },
                prioridade: {
                  type: "string",
                  enum: ["urgente", "alta", "media", "baixa"]
                },
                frequencia: { type: "string" },
                objetivo_preventivo: { type: "string" }
              },
              required: ["acao", "tipo", "prioridade", "objetivo_preventivo"]
            }
          },
          plano_acao: {
            type: "object",
            properties: {
              imediato_30_dias: {
                type: "array",
                items: { type: "string" }
              },
              medio_prazo_1_3_meses: {
                type: "array",
                items: { type: "string" }
              },
              longo_prazo_3_6_meses: {
                type: "array",
                items: { type: "string" }
              },
              indicadores_monitorar: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["imediato_30_dias", "medio_prazo_1_3_meses", "longo_prazo_3_6_meses", "indicadores_monitorar"]
          },
          resumo_executivo: {
            type: "string",
            description: "Resumo executivo da análise preditiva para o profissional"
          },
          alertas_criticos: {
            type: "array",
            description: "Alertas críticos que requerem atenção imediata",
            items: { type: "string" }
          }
        },
        required: [
          "tendencias_identificadas",
          "previsoes_futuras",
          "medidas_preventivas",
          "plano_acao",
          "resumo_executivo"
        ]
      };

      console.log('🧠 [PredictiveAnalyzer] Invocando IA para análise preditiva...');

      const response = await appApi.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: predictionSchema
      });

      return response;

    } catch (error) {
      console.error('❌ [PredictiveAnalyzer] Erro ao gerar previsões:', error);
      throw error;
    }
  }

  /**
   * 📅 Calcular período em dias
   */
  _calculatePeriodDays(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    const diff = new Date(endDate) - new Date(startDate);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * 📊 Calcular confiança baseada em quantidade de dados
   */
  _calculateConfidence(totalAnalyses) {
    if (totalAnalyses < 2) return 20;
    if (totalAnalyses < 4) return 50;
    if (totalAnalyses < 8) return 70;
    if (totalAnalyses < 15) return 85;
    return 95;
  }

  /**
   * 📈 Gerar estatísticas do módulo
   */
  getStats() {
    return {
      module_name: this.module_name,
      version: this.version,
      status: 'active'
    };
  }
}

// Singleton
const predictiveAnalyzer = new PredictiveHealthAnalyzer();

/**
 * 🔮 Função pública para gerar análise preditiva
 */
export async function generatePredictiveAnalysis(userId, clienteId = null) {
  return await predictiveAnalyzer.analyzeAndPredict(userId, clienteId);
}

/**
 * 📊 Obter estatísticas do módulo
 */
export function getPredictiveAnalyzerStats() {
  return predictiveAnalyzer.getStats();
}

export default predictiveAnalyzer;

