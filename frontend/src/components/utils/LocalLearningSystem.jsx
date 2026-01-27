// Sistema de Aprendizado Contínuo Local - Analyzer SDM IA
// Aprendizado por unidade com refinamento automático baseado em feedback detalhado

import { appApi } from "@/api/appClient";

const STORAGE_KEY_PREFIX = 'sdm_local_learning_';
const REFRESH_INTERVAL_DAYS = 7;

/**
 * 🧠 SISTEMA DE APRENDIZADO INTELIGENTE V3.0
 * 
 * Processa feedbacks detalhados e gera regras de aprendizado que refinam
 * a precisão da IA em tempo real.
 */

class LocalLearningData {
  constructor(userId) {
    this.userId = userId;
    this.patterns = {
      successful_recommendations: [],
      failed_recommendations: [],
      color_patterns: {},
      damage_patterns: {},
      service_performance: {},
      detailed_feedback_patterns: [], // NOVO: Feedbacks detalhados
      error_patterns: {} // NOVO: Padrões de erros específicos
    };
    this.learning_rules = {
      tipo_fio_corrections: {},
      coloracao_corrections: {},
      tempo_quimico_patterns: {},
      alisamento_safety_rules: []
    };
    this.metadata = {
      total_analyses: 0,
      total_feedbacks: 0,
      total_detailed_feedbacks: 0,
      last_refresh: new Date().toISOString(),
      version: '3.0'
    };
  }
}

export async function loadLocalLearning(userId) {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      const data = JSON.parse(stored);
      console.log('📚 [LocalLearning v3] Dados carregados:', data.metadata);
      return data;
    }
    
    const newData = new LocalLearningData(userId);
    saveLocalLearning(userId, newData);
    console.log('✨ [LocalLearning v3] Nova estrutura criada');
    return newData;
  } catch (error) {
    console.error('❌ [LocalLearning] Erro ao carregar:', error);
    return new LocalLearningData(userId);
  }
}

export function saveLocalLearning(userId, data) {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
    console.log('💾 [LocalLearning v3] Dados salvos');
  } catch (error) {
    console.error('❌ [LocalLearning] Erro ao salvar:', error);
  }
}

/**
 * 🆕 PROCESSAR FEEDBACK DETALHADO
 * Analisa aspectos específicos marcados como incorretos/imprecisos
 */
async function processarFeedbackDetalhado(userId, analise, feedbackDetalhado) {
  if (!feedbackDetalhado || !feedbackDetalhado.aspectos_avaliados) {
    return;
  }

  const learning = await loadLocalLearning(userId);
  
  // Registrar feedback detalhado
  learning.patterns.detailed_feedback_patterns.push({
    timestamp: new Date().toISOString(),
    analise_id: analise.id,
    aspectos: feedbackDetalhado.aspectos_avaliados,
    estatisticas: feedbackDetalhado.estatisticas,
    comentario: feedbackDetalhado.comentario_geral
  });

  learning.metadata.total_detailed_feedbacks++;

  // Analisar padrões de erro por aspecto
  Object.entries(feedbackDetalhado.aspectos_avaliados).forEach(([aspecto, status]) => {
    if (status === 'incorreto' || status === 'impreciso') {
      
      // Inicializar padrão de erro se não existir
      if (!learning.patterns.error_patterns[aspecto]) {
        learning.patterns.error_patterns[aspecto] = {
          total_erros: 0,
          casos: []
        };
      }

      learning.patterns.error_patterns[aspecto].total_erros++;
      learning.patterns.error_patterns[aspecto].casos.push({
        timestamp: new Date().toISOString(),
        valor_detectado: analise[aspecto],
        tipo_fio: analise.tipo_fio_detalhado || analise.tipo_fio,
        coloracao: analise.coloracao_cabelo,
        nivel_descoloracao: analise.nivel_descoloracao,
        comentario: feedbackDetalhado.comentario_geral
      });

      // 🧠 GERAR REGRAS DE APRENDIZADO ESPECÍFICAS
      
      // TIPO DE FIO
      if (aspecto === 'tipo_fio' || aspecto === 'tipo_fio_detalhado') {
        if (!learning.learning_rules.tipo_fio_corrections[analise.tipo_fio_detalhado]) {
          learning.learning_rules.tipo_fio_corrections[analise.tipo_fio_detalhado] = {
            erro_count: 0,
            ultima_ocorrencia: new Date().toISOString()
          };
        }
        learning.learning_rules.tipo_fio_corrections[analise.tipo_fio_detalhado].erro_count++;
      }

      // COLORAÇÃO
      if (aspecto === 'coloracao') {
        const key = `${analise.coloracao_cabelo}_${analise.nivel_descoloracao}`;
        if (!learning.learning_rules.coloracao_corrections[key]) {
          learning.learning_rules.coloracao_corrections[key] = {
            erro_count: 0,
            casos: []
          };
        }
        learning.learning_rules.coloracao_corrections[key].erro_count++;
        learning.learning_rules.coloracao_corrections[key].casos.push({
          coloracao_detectada: analise.coloracao_cabelo,
          descoloracao_detectada: analise.nivel_descoloracao,
          feedback: status
        });
      }

      // TEMPO QUÍMICO
      if (aspecto === 'tempo_ultimo_quimico') {
        const tempo = analise.tempo_desde_ultimo_quimico;
        if (!learning.learning_rules.tempo_quimico_patterns[tempo]) {
          learning.learning_rules.tempo_quimico_patterns[tempo] = {
            erros: 0,
            acertos: 0
          };
        }
        learning.learning_rules.tempo_quimico_patterns[tempo].erros++;
      }

      // ALISAMENTO ORGÂNICO
      if (aspecto === 'recomendacao_alisamento' || aspecto === 'recomendacao_alternativa') {
        const isOrganico = analise[aspecto]?.toLowerCase().includes('orgânico') || 
                          analise[aspecto]?.toLowerCase().includes('organico');
        const temDescoloracao = ['media', 'intensa', 'extrema'].includes(analise.nivel_descoloracao);
        
        if (isOrganico && temDescoloracao) {
          learning.learning_rules.alisamento_safety_rules.push({
            timestamp: new Date().toISOString(),
            erro: 'organico_para_descolorido',
            nivel_descoloracao: analise.nivel_descoloracao,
            servico_incorreto: analise[aspecto]
          });
        }
      }
    }

    // Registrar acertos para melhorar confiança
    if (status === 'correto') {
      if (aspecto === 'tempo_ultimo_quimico') {
        const tempo = analise.tempo_desde_ultimo_quimico;
        if (!learning.learning_rules.tempo_quimico_patterns[tempo]) {
          learning.learning_rules.tempo_quimico_patterns[tempo] = {
            erros: 0,
            acertos: 0
          };
        }
        learning.learning_rules.tempo_quimico_patterns[tempo].acertos++;
      }
    }
  });

  saveLocalLearning(userId, learning);
  console.log('✅ [LocalLearning v3] Feedback detalhado processado e regras atualizadas');
}

export async function registerSuccessfulAnalysis(userId, analise, feedback) {
  try {
    const learning = await loadLocalLearning(userId);
    
    if (feedback?.feedback_detalhado) {
      await processarFeedbackDetalhado(userId, analise, feedback.feedback_detalhado);
    }
    
    const pattern = {
      timestamp: new Date().toISOString(),
      tipo_fio: analise.tipo_fio_detalhado || analise.tipo_fio,
      cor_cabelo: analise.cor_cabelo_detectada || analise.coloracao_cabelo,
      nivel_descoloracao: analise.nivel_descoloracao,
      recomendacao_alisamento: analise.recomendacao_alisamento,
      recomendacao_tratamento: analise.recomendacao_tratamento,
      score: 100
    };
    
    learning.patterns.successful_recommendations.push(pattern);
    learning.metadata.total_analyses++;
    learning.metadata.total_feedbacks++;
    
    if (pattern.cor_cabelo) {
      if (!learning.patterns.color_patterns[pattern.cor_cabelo]) {
        learning.patterns.color_patterns[pattern.cor_cabelo] = { count: 0, successful_services: {}, common_issues: [] };
      }
      learning.patterns.color_patterns[pattern.cor_cabelo].count++;
    }
    
    saveLocalLearning(userId, learning);
    return learning;
  } catch (error) {
    console.error('Erro ao registrar:', error);
  }
}

export async function registerFailedAnalysis(userId, analise, feedback) {
  try {
    const learning = await loadLocalLearning(userId);
    
    if (feedback?.feedback_detalhado) {
      await processarFeedbackDetalhado(userId, analise, feedback.feedback_detalhado);
    }
    
    const pattern = {
      timestamp: new Date().toISOString(),
      tipo_fio: analise.tipo_fio_detalhado || analise.tipo_fio,
      cor_cabelo: analise.cor_cabelo_detectada || analise.coloracao_cabelo,
      nivel_descoloracao: analise.nivel_descoloracao,
      recomendacao_alisamento: analise.recomendacao_alisamento,
      score: 0
    };
    
    learning.patterns.failed_recommendations.push(pattern);
    learning.metadata.total_feedbacks++;
    
    saveLocalLearning(userId, learning);
    return learning;
  } catch (error) {
    console.error('Erro ao registrar falha:', error);
  }
}

/**
 * 🆕 GERAR INSTRUÇÕES DE APRENDIZADO PARA IA
 * Cria instruções dinâmicas baseadas em erros detectados
 */
export async function gerarInstrucoesAprendizado(userId) {
  try {
    const learning = await loadLocalLearning(userId);
    
    if (learning.metadata.total_detailed_feedbacks < 3) {
      return null; // Dados insuficientes
    }

    const instrucoes = [];

    // 🔬 APRENDIZADO: TIPO DE FIO
    const errosTipoFio = learning.patterns.error_patterns['tipo_fio'] || 
                         learning.patterns.error_patterns['tipo_fio_detalhado'];
    
    if (errosTipoFio && errosTipoFio.total_erros >= 2) {
      instrucoes.push({
        categoria: 'tipo_fio',
        instrucao: `⚠️ ATENÇÃO REFORÇADA: Tipo de fio tem ${errosTipoFio.total_erros} erros detectados. 
        REFORCE a diferenciação entre ondulado (2A-2C) e cacheado (3A-3C). 
        Analise com MÁXIMA precisão o padrão de curvatura.`,
        prioridade: 'alta'
      });
    }

    // 🎨 APRENDIZADO: COLORAÇÃO
    const errosColoracao = learning.patterns.error_patterns['coloracao'];
    
    if (errosColoracao && errosColoracao.total_erros >= 2) {
      const casosDescoloridoIncorreto = errosColoracao.casos.filter(c => 
        c.valor_detectado?.toLowerCase().includes('descolorido') &&
        c.nivel_descoloracao === 'nenhuma'
      );

      if (casosDescoloridoIncorreto.length > 0) {
        instrucoes.push({
          categoria: 'coloracao',
          instrucao: `🚨 ALERTA CRÍTICO: ${casosDescoloridoIncorreto.length} casos de confusão COLORIDO vs DESCOLORIDO detectados.
          
          REGRA APRENDIDA:
          - Se NÃO há contraste raiz/comprimento ➡️ "Colorido/Tingido" (NÃO descolorido)
          - Se HÁ raiz escura + resto claro ➡️ "Descolorido/Platinado"
          - NUNCA classifique como "Descolorido" se nivel_descoloracao = "nenhuma"`,
          prioridade: 'critica'
        });
      }
    }

    // ⏰ APRENDIZADO: TEMPO QUÍMICO
    const errosTempoQuimico = learning.patterns.error_patterns['tempo_ultimo_quimico'];
    
    if (errosTempoQuimico && errosTempoQuimico.total_erros >= 2) {
      const padroes = learning.learning_rules.tempo_quimico_patterns;
      const tempoMaisDe6Meses = padroes['mais de 6 meses'];
      
      if (tempoMaisDe6Meses && tempoMaisDe6Meses.erros > tempoMaisDe6Meses.acertos) {
        instrucoes.push({
          categoria: 'tempo_quimico',
          instrucao: `🚨 CORREÇÃO APRENDIDA: "mais de 6 meses" tem ${tempoMaisDe6Meses.erros} erros.
          
          NOVA METODOLOGIA:
          1. MEÇA VISUALMENTE a raiz (em cm)
          2. Raiz 0-2cm = "menos de 1 mês" ou "1-2 meses"
          3. Raiz 2-4cm = "2-3 meses"
          4. Raiz 4-7cm = "3-6 meses"
          5. Raiz >7cm = "mais de 6 meses"
          6. SEM contraste = "não aplicável"
          
          ⛔ NUNCA use "mais de 6 meses" como padrão!`,
          prioridade: 'critica'
        });
      }
    }

    // 🚨 APRENDIZADO: SEGURANÇA ALISAMENTO ORGÂNICO
    const errosAlisamento = learning.learning_rules.alisamento_safety_rules;
    
    if (errosAlisamento.length > 0) {
      const errosOrganico = errosAlisamento.filter(e => e.erro === 'organico_para_descolorido');
      
      if (errosOrganico.length > 0) {
        instrucoes.push({
          categoria: 'alisamento_seguranca',
          instrucao: `🚨 REGRA DE SEGURANÇA CRÍTICA APRENDIDA (${errosOrganico.length} violações detectadas):
          
          ⛔ ALISAMENTO ORGÂNICO ABSOLUTAMENTE PROIBIDO PARA:
          - nivel_descoloracao = "media", "intensa" ou "extrema"
          - Qualquer menção a "Descolorido", "Platinado", "Loiro Claro"
          
          ✅ SUBSTITUA POR: Queratina, Aminoácidos, Proteico
          
          ⚠️ Esta regra foi aprendida de erros reais e deve ser SEMPRE respeitada.`,
          prioridade: 'critica'
        });
      }
    }

    console.log('🧠 [LocalLearning v3] Instruções de aprendizado geradas:', instrucoes.length);
    return instrucoes;

  } catch (error) {
    console.error('❌ [LocalLearning] Erro ao gerar instruções:', error);
    return null;
  }
}

/**
 * 🆕 APLICAR APRENDIZADO NO PROMPT
 * Injeta regras aprendidas no prompt da IA
 */
export async function aplicarAprendizadoNoPrompt(userId, promptBase) {
  try {
    const instrucoes = await gerarInstrucoesAprendizado(userId);
    
    if (!instrucoes || instrucoes.length === 0) {
      return promptBase;
    }

    const instrucoesTexto = instrucoes
      .sort((a, b) => {
        const prioridadeOrdem = { critica: 0, alta: 1, media: 2 };
        return prioridadeOrdem[a.prioridade] - prioridadeOrdem[b.prioridade];
      })
      .map(i => i.instrucao)
      .join('\n\n');

    const promptEnriquecido = `${promptBase}

═══════════════════════════════════════════════════════════
🧠 APRENDIZADO LOCAL - REGRAS ESPECÍFICAS DESTA UNIDADE
═══════════════════════════════════════════════════════════

Com base em feedbacks detalhados de profissionais, você aprendeu:

${instrucoesTexto}

⚠️ ESTAS REGRAS SÃO CRÍTICAS E DEVEM SER SEMPRE RESPEITADAS!

═══════════════════════════════════════════════════════════`;

    console.log('✅ [LocalLearning v3] Prompt enriquecido com aprendizado local');
    return promptEnriquecido;

  } catch (error) {
    console.error('❌ [LocalLearning] Erro ao aplicar aprendizado:', error);
    return promptBase;
  }
}

export async function generateLocalInsights(userId) {
  try {
    const learning = await loadLocalLearning(userId);
    
    const insights = {
      total_analyses: learning.metadata.total_analyses,
      total_feedbacks: learning.metadata.total_feedbacks,
      total_detailed_feedbacks: learning.metadata.total_detailed_feedbacks,
      success_rate: 0,
      most_common_colors: [],
      best_performing_services: [],
      services_to_avoid: [],
      recommendations: [],
      error_patterns_summary: {},
      learning_rules_active: 0
    };
    
    const totalFeedbacks = learning.patterns.successful_recommendations.length + 
                          learning.patterns.failed_recommendations.length;
    if (totalFeedbacks > 0) {
      insights.success_rate = (learning.patterns.successful_recommendations.length / totalFeedbacks) * 100;
    }
    
    // Padrões de erro detectados
    Object.entries(learning.patterns.error_patterns).forEach(([aspecto, dados]) => {
      if (dados.total_erros > 0) {
        insights.error_patterns_summary[aspecto] = {
          total_erros: dados.total_erros,
          ultima_ocorrencia: dados.casos[dados.casos.length - 1]?.timestamp
        };
      }
    });

    // Contar regras de aprendizado ativas
    insights.learning_rules_active = 
      Object.keys(learning.learning_rules.tipo_fio_corrections).length +
      Object.keys(learning.learning_rules.coloracao_corrections).length +
      Object.keys(learning.learning_rules.tempo_quimico_patterns).length +
      learning.learning_rules.alisamento_safety_rules.length;

    // Cores mais comuns
    const colorCounts = Object.entries(learning.patterns.color_patterns)
      .map(([color, data]) => ({ color, count: data.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    insights.most_common_colors = colorCounts;
    
    // Performance de serviços
    const servicePerformance = Object.entries(learning.patterns.service_performance)
      .map(([service, data]) => {
        const total = data.success_count + data.fail_count;
        const rate = total > 0 ? (data.success_count / total) * 100 : 0;
        return { service, rate, total, success: data.success_count, fail: data.fail_count };
      })
      .sort((a, b) => b.rate - a.rate);
    
    insights.best_performing_services = servicePerformance.filter(s => s.rate >= 70).slice(0, 5);
    insights.services_to_avoid = servicePerformance.filter(s => s.rate < 50 && s.total >= 3).slice(0, 3);
    
    // Recomendações
    if (insights.success_rate < 70 && totalFeedbacks >= 5) {
      insights.recommendations.push({
        type: 'alerta',
        message: `Taxa de sucesso baixa (${insights.success_rate.toFixed(1)}%). Revise as recomendações.`
      });
    }
    
    if (Object.keys(insights.error_patterns_summary).length > 0) {
      insights.recommendations.push({
        type: 'aprendizado',
        message: `${Object.keys(insights.error_patterns_summary).length} padrões de erro identificados. IA aprendendo ativamente.`
      });
    }
    
    if (insights.learning_rules_active > 0) {
      insights.recommendations.push({
        type: 'sucesso',
        message: `${insights.learning_rules_active} regras de aprendizado ativas melhorando precisão.`
      });
    }
    
    if (insights.success_rate >= 80) {
      insights.recommendations.push({
        type: 'sucesso',
        message: `Excelente taxa de sucesso (${insights.success_rate.toFixed(1)}%)! IA bem treinada.`
      });
    }
    
    console.log('📊 [LocalLearning v3] Insights gerados:', insights);
    return insights;
  } catch (error) {
    console.error('❌ [LocalLearning] Erro ao gerar insights:', error);
    return null;
  }
}

export async function refineRecommendations(userId, analiseData, servicosDisponiveis) {
  try {
    const learning = await loadLocalLearning(userId);
    
    if (learning.metadata.total_feedbacks < 5) {
      console.log('⚠️ [LocalLearning v3] Dados insuficientes para refinamento');
      return { refined: false, original: true };
    }
    
    const refinedData = { ...analiseData };
    let modificacoes = [];
    
    const cor = analiseData.cor_cabelo_detectada || analiseData.coloracao_cabelo;
    const colorPattern = learning.patterns.color_patterns[cor];
    
    if (colorPattern && colorPattern.count >= 3) {
      console.log(`🎨 [LocalLearning v3] Aplicando padrões para cor: ${cor}`);
      
      const servicoAtual = analiseData.recomendacao_alisamento;
      const performance = learning.patterns.service_performance[servicoAtual];
      
      if (performance) {
        const total = performance.success_count + performance.fail_count;
        const successRate = total > 0 ? (performance.success_count / total) * 100 : 0;
        
        if (successRate < 50 && total >= 3) {
          console.log(`⚠️ [LocalLearning v3] Serviço "${servicoAtual}" com baixa performance (${successRate.toFixed(1)}%)`);
          
          const melhoresServicos = Object.entries(learning.patterns.service_performance)
            .filter(([_, data]) => {
              const t = data.success_count + data.fail_count;
              return t >= 2 && (data.success_count / t) >= 0.7;
            })
            .map(([servico, _]) => servico);
          
          if (melhoresServicos.length > 0) {
            const melhorAlternativa = melhoresServicos[0];
            refinedData.recomendacao_alisamento = melhorAlternativa;
            modificacoes.push(`Alterado alisamento principal para "${melhorAlternativa}" (melhor histórico)`);
            console.log(`✅ [LocalLearning v3] Refinamento aplicado: ${melhorAlternativa}`);
          }
        }
      }
    }
    
    const observacoesAdicionais = [];
    
    if (analiseData.presenca_grisalhos && analiseData.presenca_grisalhos !== '0%') {
      const grisalhosCount = learning.patterns.successful_recommendations.filter(
        p => p.presenca_grisalhos && p.presenca_grisalhos !== '0%'
      ).length;
      
      if (grisalhosCount >= 3) {
        observacoesAdicionais.push(`📚 Experiência local: ${grisalhosCount} casos similares com grisalhos tratados com sucesso.`);
      }
    }
    
    if (observacoesAdicionais.length > 0) {
      refinedData.observacoes_adicionais = (refinedData.observacoes_adicionais || '') + '\n\n' + 
        'APRENDIZADO LOCAL:\n' + observacoesAdicionais.join('\n');
      modificacoes.push('Adicionadas observações de aprendizado local');
    }
    
    if (modificacoes.length > 0) {
      console.log('✨ [LocalLearning v3] Recomendações refinadas:', modificacoes);
      
      await appApi.entities.LogAuditoria.create({
        tipo_auditoria: 'recomendacao',
        status: 'sucesso',
        descricao: 'Aprendizado local v3: recomendações refinadas com feedback detalhado',
        correcao_aplicada: modificacoes.join('; '),
        metrica_antes: {
          recomendacao_original: analiseData.recomendacao_alisamento
        },
        metrica_depois: {
          recomendacao_refinada: refinedData.recomendacao_alisamento,
          modificacoes: modificacoes.length
        },
        automatica: true
      });
      
      return { refined: true, data: refinedData, modifications: modificacoes };
    }
    
    return { refined: false, data: analiseData };
  } catch (error) {
    console.error('❌ [LocalLearning v3] Erro ao refinar:', error);
    return { refined: false, data: analiseData, error: error.message };
  }
}

export async function checkRefreshNeeded(userId) {
  try {
    const learning = await loadLocalLearning(userId);
    const lastRefresh = new Date(learning.metadata.last_refresh);
    const now = new Date();
    const diffDays = Math.floor((now - lastRefresh) / (1000 * 60 * 60 * 24));
    
    if (diffDays >= REFRESH_INTERVAL_DAYS) {
      console.log(`🔄 [LocalLearning v3] Refresh necessário (${diffDays} dias)`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ [LocalLearning] Erro ao verificar refresh:', error);
    return false;
  }
}

export async function refreshLocalData(userId) {
  try {
    const learning = await loadLocalLearning(userId);
    
    if (learning.patterns.successful_recommendations.length > 100) {
      learning.patterns.successful_recommendations = learning.patterns.successful_recommendations.slice(-100);
    }
    
    if (learning.patterns.failed_recommendations.length > 50) {
      learning.patterns.failed_recommendations = learning.patterns.failed_recommendations.slice(-50);
    }

    if (learning.patterns.detailed_feedback_patterns.length > 100) {
      learning.patterns.detailed_feedback_patterns = learning.patterns.detailed_feedback_patterns.slice(-100);
    }
    
    learning.metadata.last_refresh = new Date().toISOString();
    saveLocalLearning(userId, learning);
    
    console.log('🔄 [LocalLearning v3] Dados atualizados');
    
    await appApi.entities.LogAuditoria.create({
      tipo_auditoria: 'recomendacao',
      status: 'sucesso',
      descricao: 'Aprendizado local v3: dados atualizados (refresh de 7 dias)',
      metrica_depois: {
        sucessos_mantidos: learning.patterns.successful_recommendations.length,
        falhas_mantidas: learning.patterns.failed_recommendations.length,
        feedbacks_detalhados: learning.patterns.detailed_feedback_patterns.length,
        regras_aprendizado: learning.metadata.total_detailed_feedbacks
      },
      automatica: true
    });
    
    return learning;
  } catch (error) {
    console.error('❌ [LocalLearning v3] Erro ao refresh:', error);
  }
}

export async function exportLearningReport(userId) {
  try {
    const learning = await loadLocalLearning(userId);
    const insights = await generateLocalInsights(userId);
    const instrucoes = await gerarInstrucoesAprendizado(userId);
    
    const report = {
      metadata: learning.metadata,
      insights,
      learning_rules: learning.learning_rules,
      active_instructions: instrucoes,
      error_patterns: learning.patterns.error_patterns,
      raw_data: {
        successful_count: learning.patterns.successful_recommendations.length,
        failed_count: learning.patterns.failed_recommendations.length,
        detailed_feedbacks: learning.patterns.detailed_feedback_patterns.length,
        color_patterns: learning.patterns.color_patterns,
        service_performance: learning.patterns.service_performance
      },
      generated_at: new Date().toISOString()
    };
    
    console.log('📄 [LocalLearning v3] Relatório exportado');
    return report;
  } catch (error) {
    console.error('❌ [LocalLearning v3] Erro ao exportar:', error);
    return null;
  }
}

/**
 * 🆕 OBTER DASHBOARD DE APRENDIZADO
 */
export async function getDashboardAprendizado(userId) {
  try {
    const learning = await loadLocalLearning(userId);
    const insights = await generateLocalInsights(userId);
    
    // Top 5 aspectos com mais erros
    const aspectosProblematicos = Object.entries(learning.patterns.error_patterns)
      .map(([aspecto, dados]) => ({
        aspecto,
        total_erros: dados.total_erros,
        casos_recentes: dados.casos.slice(-3)
      }))
      .sort((a, b) => b.total_erros - a.total_erros)
      .slice(0, 5);

    // Regras de segurança aprendidas
    const regrasSeguranca = learning.learning_rules.alisamento_safety_rules.length;

    // Tendências de melhoria
    const feedbacksRecentes = learning.patterns.detailed_feedback_patterns.slice(-10);
    const precisaoMedia = feedbacksRecentes.length > 0
      ? feedbacksRecentes.reduce((sum, f) => sum + parseFloat(f.estatisticas?.precisao_percentual || 0), 0) / feedbacksRecentes.length
      : 0;

    return {
      ...insights,
      aspectos_problematicos: aspectosProblematicos,
      regras_seguranca_ativas: regrasSeguranca,
      precisao_media_recente: precisaoMedia.toFixed(1),
      esta_aprendendo: learning.metadata.total_detailed_feedbacks > 0,
      nivel_maturidade: learning.metadata.total_detailed_feedbacks < 5 ? 'iniciante' :
                        learning.metadata.total_detailed_feedbacks < 15 ? 'aprendendo' :
                        learning.metadata.total_detailed_feedbacks < 30 ? 'experiente' : 'expert'
    };
  } catch (error) {
    console.error('❌ [LocalLearning v3] Erro ao gerar dashboard:', error);
    return null;
  }
}

