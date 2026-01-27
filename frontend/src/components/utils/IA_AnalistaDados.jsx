
// 📊 IA ANALISTA DE DADOS - Sistema de Aprendizado Inteligente
// SDM Analyzer IA v3.0 - Módulo de Coleta e Análise de Dados
// Função: Coletar, interpretar e organizar dados para aprimoramento contínuo

import { appApi } from "@/api/appClient";

/**
 * 📊 IA ANALISTA DE DADOS - Controladora de Aprendizado
 */
class IAAnalistaDados {
  constructor() {
    this.nome = "IA_ANALISTA_DE_DADOS";
    this.versao = "3.0";
    this.ultimaColeta = null;
    this.ultimaAnalise = null;
    this.metricas = {
      totalAnalises: 0,
      totalPadroes: 0,
      totalInsights: 0,
      precisaoMedia: 0
    };
  }

  /**
   * 📥 Coletar Dados de Análise (anônimos)
   */
  async coletarDadosAnalise(analise, anonimizar = true) {
    console.log(`📥 [${this.nome}] Coletando dados da análise...`);
    
    try {
      // Verificar se há recomendações válidas
      const temAlisamento = analise.recomendacao_alisamento && 
                            analise.recomendacao_alisamento !== 'N/A';
      const temTratamento = analise.recomendacao_tratamento && 
                            analise.recomendacao_tratamento !== 'N/A';

      // Se não há nenhuma recomendação válida, não registrar
      if (!temAlisamento && !temTratamento) {
        console.log(`ℹ️ [${this.nome}] Análise sem recomendações válidas - não será registrada para aprendizado`);
        return null;
      }

      const dadosAnonimos = {
        // Dados técnicos (sem identificação pessoal)
        tipo_fio: analise.tipo_fio_detalhado || analise.tipo_fio,
        volume_capilar: analise.volume_capilar,
        estrutura_fio: analise.estrutura_fio,
        nivel_dano: analise.nivel_dano,
        coloracao: analise.coloracao_cabelo,
        cor_detectada: analise.cor_cabelo_detectada,
        
        // Recomendações
        recomendacao_alisamento: analise.recomendacao_alisamento,
        recomendacao_alisamento_alt: analise.recomendacao_alisamento_alternativa,
        recomendacao_tratamento: analise.recomendacao_tratamento,
        recomendacao_tratamento_alt: analise.recomendacao_tratamento_alternativo,
        necessidade_corte: analise.necessidade_corte,
        
        // Feedback
        feedback_positivo: analise.feedback_positivo,
        feedback_comentario: analise.feedback_comentario,
        confirmado_profissional: analise.confirmado_por_profissional,
        resultado_satisfatorio: analise.resultado_satisfatorio,
        
        // Metadados
        modo_analise: analise.modo_analise,
        tipo_analise_solicitado: analise.tipo_analise_solicitado,
        metodo_recomendacao: analise.metodo_recomendacao,
        created_date: analise.created_date,
        
        // Profissional (email apenas para agrupamento, sem dados pessoais)
        profissional_email: anonimizar ? this.anonimizarEmail(analise.created_by) : analise.created_by
      };

      // Registrar no sistema de aprendizado - criar múltiplos registros se necessário
      const registros = [];

      // Registrar alisamento principal
      if (temAlisamento) {
        try {
          const registroAlisamento = await appApi.entities.AprendizadoMetrica.create({
            servico_id: analise.id || 'temp_alisamento_' + Date.now(), // Use analise.id if available, otherwise temp ID
            servico_nome: analise.recomendacao_alisamento,
            tipo_fio: dadosAnonimos.tipo_fio || 'desconhecido',
            volume_capilar: dadosAnonimos.volume_capilar || 'médio',
            estrutura_fio: dadosAnonimos.estrutura_fio || 'média',
            nivel_dano: dadosAnonimos.nivel_dano || 'leve',
            foi_recomendado: true,
            foi_escolhido: true, // Assumimos que foi escolhido para feedback
            resultado_satisfatorio: analise.feedback_positivo === true,
            score_compatibilidade: analise.score_compatibilidade_alisamento || 0,
            analise_id: analise.id,
            recomendacao_tipo: 'alisamento'
          });
          registros.push(registroAlisamento);
        } catch (err) {
          console.warn('⚠️ Erro ao registrar alisamento:', err.message);
        }
      }

      // Registrar tratamento principal
      if (temTratamento) {
        try {
          const registroTratamento = await appApi.entities.AprendizadoMetrica.create({
            servico_id: analise.id || 'temp_tratamento_' + Date.now(), // Use analise.id if available, otherwise temp ID
            servico_nome: analise.recomendacao_tratamento,
            tipo_fio: dadosAnonimos.tipo_fio || 'desconhecido',
            volume_capilar: dadosAnonimos.volume_capilar || 'médio',
            estrutura_fio: dadosAnonimos.estrutura_fio || 'média',
            nivel_dano: dadosAnonimos.nivel_dano || 'leve',
            foi_recomendado: true,
            foi_escolhido: true, // Assumimos que foi escolhido para feedback
            resultado_satisfatorio: analise.feedback_positivo === true,
            score_compatibilidade: analise.score_compatibilidade_tratamento || 0,
            analise_id: analise.id,
            recomendacao_tipo: 'tratamento'
          });
          registros.push(registroTratamento);
        } catch (err) {
          console.warn('⚠️ Erro ao registrar tratamento:', err.message);
        }
      }

      if (registros.length > 0) {
        this.metricas.totalAnalises++;
        this.ultimaColeta = new Date().toISOString();
        console.log(`✅ [${this.nome}] ${registros.length} registro(s) criado(s) com sucesso`);
      } else {
        console.log(`ℹ️ [${this.nome}] Nenhuma recomendação registrada para aprendizado, apesar de ter sido detectada. Verifique os logs de aviso.`);
      }

      return dadosAnonimos;

    } catch (error) {
      console.error(`❌ [${this.nome}] Erro ao coletar dados:`, error.message);
      return null;
    }
  }

  /**
   * 🔒 Anonimizar Email (manter domínio para agrupamento)
   */
  anonimizarEmail(email) {
    if (!email) return 'anonimo';
    const [usuario, dominio] = email.split('@');
    const usuarioHash = usuario.substring(0, 3) + '***';
    return `${usuarioHash}@${dominio}`;
  }

  /**
   * 🔍 Analisar Padrões de Tipo de Fio
   */
  async analisarPadroesTipoFio() {
    console.log(`🔍 [${this.nome}] Analisando padrões de tipo de fio...`);
    
    try {
      const analises = await appApi.entities.Analise.list('-created_date', 500);
      
      const distribuicao = {};
      const sucessoPorTipo = {};
      
      analises.forEach(a => {
        const tipo = a.tipo_fio_detalhado || a.tipo_fio || 'desconhecido';
        
        // Contar distribuição
        distribuicao[tipo] = (distribuicao[tipo] || 0) + 1;
        
        // Calcular taxa de sucesso
        if (a.feedback_positivo !== null && a.feedback_positivo !== undefined) {
          if (!sucessoPorTipo[tipo]) {
            sucessoPorTipo[tipo] = { total: 0, positivos: 0 };
          }
          sucessoPorTipo[tipo].total++;
          if (a.feedback_positivo === true) {
            sucessoPorTipo[tipo].positivos++;
          }
        }
      });

      // Calcular taxas
      const padroes = ensureArray(Object.keys(distribuicao || {})).map(tipo => ({
        tipo_fio: tipo,
        total_analises: distribuicao[tipo],
        percentual: ((distribuicao[tipo] / analises.length) * 100).toFixed(1) + '%',
        taxa_sucesso: sucessoPorTipo[tipo] 
          ? ((sucessoPorTipo[tipo].positivos / sucessoPorTipo[tipo].total) * 100).toFixed(1) + '%'
          : 'N/A',
        feedbacks_recebidos: sucessoPorTipo[tipo]?.total || 0
      })).sort((a, b) => b.total_analises - a.total_analises);

      console.log(`✅ [${this.nome}] ${padroes.length} padrões identificados`);
      return padroes;

    } catch (error) {
      console.error(`❌ [${this.nome}] Erro ao analisar padrões:`, error);
      return [];
    }
  }

  /**
   * 💊 Analisar Efetividade de Tratamentos
   */
  async analisarEfetividadeTratamentos() {
    console.log(`💊 [${this.nome}] Analisando efetividade de tratamentos...`);
    
    try {
      // Buscar dados de aprendizado para tratamentos
      const metricasTratamento = await appApi.entities.AprendizadoMetrica.list(
        '-created_date', 
        500, 
        { field: 'recomendacao_tipo', operator: '==', value: 'tratamento' }
      );
      
      const tratamentos = {};
      
      metricasTratamento.forEach(m => {
        const tratamento = m.servico_nome;
        if (tratamento && tratamento !== 'N/A') {
          if (!tratamentos[tratamento]) {
            tratamentos[tratamento] = {
              nome: tratamento,
              total_recomendacoes: 0,
              feedbacks_positivos: 0,
              feedbacks_negativos: 0,
              sem_feedback: 0
            };
          }
          
          tratamentos[tratamento].total_recomendacoes++;
          
          if (m.resultado_satisfatorio === true) {
            tratamentos[tratamento].feedbacks_positivos++;
          } else if (m.resultado_satisfatorio === false) {
            tratamentos[tratamento].feedbacks_negativos++;
          } else {
            // Se resultado_satisfatorio for null/undefined, não tem feedback
            tratamentos[tratamento].sem_feedback++;
          }
        }
      });

      // Calcular taxa de efetividade
      const efetividade = ensureArray(Object.values(tratamentos || {})).map(t => ({
        ...t,
        taxa_efetividade: t.feedbacks_positivos > 0
          ? ((t.feedbacks_positivos / (t.feedbacks_positivos + t.feedbacks_negativos)) * 100).toFixed(1) + '%'
          : 'N/A',
        total_feedbacks: t.feedbacks_positivos + t.feedbacks_negativos
      })).sort((a, b) => b.total_recomendacoes - a.total_recomendacoes);

      console.log(`✅ [${this.nome}] ${efetividade.length} tratamentos analisados`);
      return efetividade;

    } catch (error) {
      console.error(`❌ [${this.nome}] Erro ao analisar tratamentos:`, error);
      return [];
    }
  }

  /**
   * ✨ Analisar Efetividade de Alisamentos
   */
  async analisarEfetividadeAlisamentos() {
    console.log(`✨ [${this.nome}] Analisando efetividade de alisamentos...`);
    
    try {
      // Buscar dados de aprendizado para alisamentos
      const metricasAlisamento = await appApi.entities.AprendizadoMetrica.list(
        '-created_date', 
        500, 
        { field: 'recomendacao_tipo', operator: '==', value: 'alisamento' }
      );
      
      const alisamentos = {};
      
      metricasAlisamento.forEach(m => {
        const alisamento = m.servico_nome;
        if (alisamento && alisamento !== 'N/A') {
          if (!alisamentos[alisamento]) {
            alisamentos[alisamento] = {
              nome: alisamento,
              total_recomendacoes: 0,
              feedbacks_positivos: 0,
              feedbacks_negativos: 0,
              sem_feedback: 0,
              tipos_fio: []
            };
          }
          
          alisamentos[alisamento].total_recomendacoes++;
          
          if (m.resultado_satisfatorio === true) {
            alisamentos[alisamento].feedbacks_positivos++;
          } else if (m.resultado_satisfatorio === false) {
            alisamentos[alisamento].feedbacks_negativos++;
          } else {
            // Se resultado_satisfatorio for null/undefined, não tem feedback
            alisamentos[alisamento].sem_feedback++;
          }
          
          // Registrar tipos de fio
          const tipoFio = m.tipo_fio;
          if (tipoFio && !alisamentos[alisamento].tipos_fio.includes(tipoFio)) {
            alisamentos[alisamento].tipos_fio.push(tipoFio);
          }
        }
      });

      const efetividade = ensureArray(Object.values(alisamentos)).map(a => ({
        ...a,
        taxa_efetividade: a.feedbacks_positivos > 0
          ? ((a.feedbacks_positivos / (a.feedbacks_positivos + a.feedbacks_negativos)) * 100).toFixed(1) + '%'
          : 'N/A',
        total_feedbacks: a.feedbacks_positivos + a.feedbacks_negativos,
        variedade_tipos: a.tipos_fio.length
      })).sort((a, b) => b.total_recomendacoes - a.total_recomendacoes);

      console.log(`✅ [${this.nome}] ${efetividade.length} alisamentos analisados`);
      return efetividade;

    } catch (error) {
      console.error(`❌ [${this.nome}] Erro ao analisar alisamentos:`, error);
      return [];
    }
  }

  /**
   * 🎨 Analisar Padrões de Coloração
   */
  async analisarPadroesColoracao() {
    console.log(`🎨 [${this.nome}] Analisando padrões de coloração...`);
    
    try {
      const analises = await appApi.entities.Analise.list('-created_date', 500);
      
      const coloracoes = {};
      
      analises.forEach(a => {
        const cor = a.coloracao_cabelo || a.cor_cabelo_detectada || 'não especificado';
        
        if (!coloracoes[cor]) {
          coloracoes[cor] = {
            coloracao: cor,
            total: 0,
            dano_leve: 0,
            dano_moderado: 0,
            dano_severo: 0,
            tratamentos_mais_usados: {}
          };
        }
        
        coloracoes[cor].total++;
        
        // Contar nível de dano
        if (a.nivel_dano === 'leve') coloracoes[cor].dano_leve++;
        else if (a.nivel_dano === 'moderado') coloracoes[cor].dano_moderado++;
        else if (a.nivel_dano === 'severo') coloracoes[cor].dano_severo++;
        
        // Contar tratamentos
        const tratamento = a.recomendacao_tratamento;
        if (tratamento && tratamento !== 'N/A') {
          coloracoes[cor].tratamentos_mais_usados[tratamento] = 
            (coloracoes[cor].tratamentos_mais_usados[tratamento] || 0) + 1;
        }
      });

      const padroes = ensureArray(Object.values(coloracoes)).map(c => {
        const tratamentoMaisUsado = Object.entries(c.tratamentos_mais_usados)
          .sort((a, b) => b[1] - a[1])[0];
        
        return {
          ...c,
          percentual_dano_severo: c.total > 0 ? ((c.dano_severo / c.total) * 100).toFixed(1) + '%' : '0%',
          tratamento_mais_recomendado: tratamentoMaisUsado ? tratamentoMaisUsado[0] : 'N/A'
        };
      }).sort((a, b) => b.total - a.total);

      console.log(`✅ [${this.nome}] ${padroes.length} padrões de coloração identificados`);
      return padroes;

    } catch (error) {
      console.error(`❌ [${this.nome}] Erro ao analisar coloração:`, error);
      return [];
    }
  }

  /**
   * 📈 Gerar Relatório de Performance da IA
   */
  async gerarRelatorioPerformance() {
    console.log(`📈 [${this.nome}] Gerando relatório de performance...`);
    
    try {
      // Usar AprendizadoMetrica para feedbacks, não Analise diretamente
      const metricasAprendizado = await appApi.entities.AprendizadoMetrica.list('-created_date', 500);
      const ultimoMes = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const metricasRecentes = metricasAprendizado.filter(m => 
        new Date(m.created_date) > ultimoMes
      );

      // Análises com feedback (onde resultado_satisfatorio foi registrado)
      const comFeedback = metricasRecentes.filter(m => 
        m.resultado_satisfatorio !== null && m.resultado_satisfatorio !== undefined
      );
      
      const feedbackPositivo = comFeedback.filter(m => m.resultado_satisfatorio === true);
      const feedbackNegativo = comFeedback.filter(m => m.resultado_satisfatorio === false);

      // Total de análises para recomendação (não o total de registros de métricas, mas de análises únicas)
      // Agrupamos por analise_id para contar análises únicas que geraram registros de aprendizado
      const analiseIdsUnicos = new Set(ensureArray(metricasRecentes).map(m => m.analise_id));
      const totalAnalisesComRecomendacao = analiseIdsUnicos.size;

      // Para obter modos_analise e outros detalhes da Analise original, precisaríamos rebuscar as Analises.
      // Por simplicidade, para o relatório de performance da IA (feedback e recomendação), focamos nas métricas.
      // Se precisamos de dados da Analise original (como modo_analise), teríamos que buscar Analise também.
      // Para o escopo atual, vamos usar o total de registros de métricas recentes como base para a proporção.

      // Análises originais para obter modos_analise
      const analisesOriginais = await appApi.entities.Analise.list('-created_date', 500);
      const analisesRecentesOriginal = analisesOriginais.filter(a => 
        new Date(a.created_date) > ultimoMes
      );

      // Modos de análise
      const modos = {
        simples: analisesRecentesOriginal.filter(a => a.modo_analise === 'simples').length,
        antes_depois: analisesRecentesOriginal.filter(a => a.modo_analise === 'antes_depois').length,
        raiz_comprimento: analisesRecentesOriginal.filter(a => a.modo_analise === 'raiz_comprimento').length,
        video: analisesRecentesOriginal.filter(a => a.modo_analise === 'video').length,
        total: analisesRecentesOriginal.length
      };

      const relatorio = {
        periodo: 'Últimos 30 dias',
        total_analises: analisesRecentesOriginal.length, // Total de análises originais
        analises_por_dia: (analisesRecentesOriginal.length / 30).toFixed(1),
        
        feedback: {
          total_feedbacks: comFeedback.length, // Total de registros de métricas com feedback
          positivos: feedbackPositivo.length,
          negativos: feedbackNegativo.length,
          taxa_precisao: comFeedback.length > 0 
            ? ((feedbackPositivo.length / comFeedback.length) * 100).toFixed(1) + '%'
            : 'N/A',
          // Taxa de feedback agora é baseada nos registros de métricas que têm feedback
          taxa_feedback: (metricasRecentes.length > 0) 
            ? ((comFeedback.length / metricasRecentes.length) * 100).toFixed(1) + '%'
            : 'N/A'
        },
        
        modos_analise: modos,
        modo_mais_usado: Object.keys(modos).reduce((a, b) => modos[a] > modos[b] ? a : b),
        
        // Reusar funções existentes, mas podem precisar de dados de AprendizadoMetrica
        // Por agora, manter como estava, assumindo que obtêm dados gerais
        tipos_fio_mais_analisados: await this.obterTop5TiposFio(analisesRecentesOriginal),
        tratamentos_mais_recomendados: await this.obterTop5Tratamentos(analisesRecentesOriginal),
        alisamentos_mais_recomendados: await this.obterTop5Alisamentos(analisesRecentesOriginal),
        
        qualidade: {
          analises_completas: analisesRecentesOriginal.filter(a => 
            a.tipo_fio && a.tipo_fio_detalhado && a.condicao_cabelo && a.justificativa
          ).length,
          analises_incompletas: analisesRecentesOriginal.filter(a => 
            !a.tipo_fio || !a.tipo_fio_detalhado || !a.condicao_cabelo
          ).length
        },
        
        timestamp: new Date().toISOString()
      };

      this.metricas.precisaoMedia = parseFloat(relatorio.feedback.taxa_precisao) || 0;
      this.ultimaAnalise = new Date().toISOString();

      console.log(`✅ [${this.nome}] Relatório gerado:`, {
        total: relatorio.total_analises,
        precisao: relatorio.feedback.taxa_precisao
      });

      return relatorio;

    } catch (error) {
      console.error(`❌ [${this.nome}] Erro ao gerar relatório:`, error);
      return null;
    }
  }

  /**
   * 🔝 Obter Top 5 Tipos de Fio
   */
  async obterTop5TiposFio(analises) {
    const contagem = {};
    analises.forEach(a => {
      const tipo = a.tipo_fio_detalhado || a.tipo_fio || 'desconhecido';
      contagem[tipo] = (contagem[tipo] || 0) + 1;
    });
    
    return Object.entries(contagem)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tipo, count]) => ({ tipo, count }));
  }

  /**
   * 🔝 Obter Top 5 Tratamentos
   */
  async obterTop5Tratamentos(analises) {
    const contagem = {};
    analises.forEach(a => {
      const tratamento = a.recomendacao_tratamento;
      if (tratamento && tratamento !== 'N/A') {
        contagem[tratamento] = (contagem[tratamento] || 0) + 1;
      }
    });
    
    return Object.entries(contagem)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nome, count]) => ({ nome, count }));
  }

  /**
   * 🔝 Obter Top 5 Alisamentos
   */
  async obterTop5Alisamentos(analises) {
    const contagem = {};
    analises.forEach(a => {
      const alisamento = a.recomendacao_alisamento;
      if (alisamento && alisamento !== 'N/A') {
        contagem[alisamento] = (contagem[alisamento] || 0) + 1;
      }
    });
    
    return Object.entries(contagem)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nome, count]) => ({ nome, count }));
  }

  /**
   * 🎯 Gerar Insights Inteligentes
   */
  async gerarInsights() {
    console.log(`🎯 [${this.nome}] Gerando insights inteligentes...`);
    
    try {
      const insights = [];

      // Análises de padrões
      const padroesTipoFio = await this.analisarPadroesTipoFio();
      const efetividadeTratamentos = await this.analisarEfetividadeTratamentos();
      const efetividadeAlisamentos = await this.analisarEfetividadeAlisamentos();
      const padroesColoracao = await this.analisarPadroesColoracao();

      // Insight 1: Tipo de fio mais comum
      if (padroesTipoFio.length > 0) {
        insights.push({
          tipo: 'distribuicao',
          prioridade: 'info',
          titulo: 'Tipo de Fio Mais Analisado',
          descricao: `${padroesTipoFio[0].tipo_fio} representa ${padroesTipoFio[0].percentual} das análises`,
          dados: padroesTipoFio[0]
        });
      }

      // Insight 2: Tratamento mais efetivo
      const tratamentoTop = efetividadeTratamentos
        .filter(t => t.total_feedbacks >= 5)
        .sort((a, b) => {
          const taxaA = parseFloat(a.taxa_efetividade);
          const taxaB = parseFloat(b.taxa_efetividade);
          if (isNaN(taxaA) && isNaN(taxaB)) return 0;
          if (isNaN(taxaA)) return 1;
          if (isNaN(taxaB)) return -1;
          return taxaB - taxaA;
        })[0];
      
      if (tratamentoTop) {
        insights.push({
          tipo: 'efetividade',
          prioridade: 'sucesso',
          titulo: 'Tratamento Mais Efetivo',
          descricao: `${tratamentoTop.nome} tem ${tratamentoTop.taxa_efetividade} de efetividade`,
          dados: tratamentoTop
        });
      }

      // Insight 3: Alisamento mais recomendado
      if (efetividadeAlisamentos.length > 0) {
        insights.push({
          tipo: 'recomendacao',
          prioridade: 'info',
          titulo: 'Alisamento Mais Recomendado',
          descricao: `${efetividadeAlisamentos[0].nome} foi recomendado ${efetividadeAlisamentos[0].total_recomendacoes} vezes`,
          dados: efetividadeAlisamentos[0]
        });
      }

      // Insight 4: Coloração com maior dano
      const coloracaoComMaisDano = padroesColoracao
        .sort((a, b) => {
          const percA = parseFloat(a.percentual_dano_severo);
          const percB = parseFloat(b.percentual_dano_severo);
          if (isNaN(percA) && isNaN(percB)) return 0;
          if (isNaN(percA)) return 1;
          if (isNaN(percB)) return -1;
          return percB - percA;
        })[0];
      
      if (coloracaoComMaisDano && parseFloat(coloracaoComMaisDano.percentual_dano_severo) > 30) {
        insights.push({
          tipo: 'alerta',
          prioridade: 'atencao',
          titulo: 'Coloração com Alto Índice de Dano',
          descricao: `Cabelos ${coloracaoComMaisDano.coloracao} apresentam ${coloracaoComMaisDano.percentual_dano_severo} de dano severo`,
          dados: coloracaoComMaisDano
        });
      }

      // Insight 5: Taxa de precisão da IA
      const relatorioPerformance = await this.gerarRelatorioPerformance();
      const precisao = parseFloat(relatorioPerformance.feedback.taxa_precisao);
      
      if (!isNaN(precisao)) { // Only add if precision is a valid number
        if (precisao < 80) {
          insights.push({
            tipo: 'alerta',
            prioridade: 'critico',
            titulo: 'Precisão da IA Abaixo do Esperado',
            descricao: `Taxa atual de ${relatorioPerformance.feedback.taxa_precisao} - requer ajustes`,
            dados: relatorioPerformance.feedback
          });
        } else if (precisao >= 90) {
          insights.push({
            tipo: 'sucesso',
            prioridade: 'sucesso',
            titulo: 'Excelente Performance da IA',
            descricao: `Taxa de precisão de ${relatorioPerformance.feedback.taxa_precisao}`,
            dados: relatorioPerformance.feedback
          });
        }
      }

      this.metricas.totalInsights = insights.length;
      this.metricas.totalPadroes = padroesTipoFio.length;

      console.log(`✅ [${this.nome}] ${insights.length} insights gerados`);
      return insights;

    } catch (error) {
      console.error(`❌ [${this.nome}] Erro ao gerar insights:`, error);
      return [];
    }
  }

  /**
   * 🔄 Executar Auditoria Completa
   */
  async executarAuditoriaCompleta() {
    console.log(`🔄 [${this.nome}] Executando auditoria completa de dados...`);
    
    const auditoria = {
      timestamp: new Date().toISOString(),
      modulo: this.nome,
      versao: this.versao,
      padroes_tipo_fio: await this.analisarPadroesTipoFio(),
      efetividade_tratamentos: await this.analisarEfetividadeTratamentos(),
      efetividade_alisamentos: await this.analisarEfetividadeAlisamentos(),
      padroes_coloracao: await this.analisarPadroesColoracao(),
      relatorio_performance: await this.gerarRelatorioPerformance(),
      insights: await this.gerarInsights(),
      metricas: this.metricas
    };

    // Registrar auditoria
    try {
      await appApi.entities.LogAuditoria.create({
        tipo_auditoria: 'ia_analista_dados',
        status: 'sucesso',
        descricao: `${this.nome} - Auditoria completa de dados e padrões`,
        correcao_aplicada: `${auditoria.insights.length} insights gerados`,
        metrica_antes: { total_analises_ia: this.metricas.totalAnalises }, // Renamed for clarity, it's IA's metric
        metrica_depois: auditoria,
        automatica: true
      });
    } catch (error) {
      console.warn('⚠️ Não foi possível registrar auditoria:', error);
    }

    console.log(`✅ [${this.nome}] Auditoria completa finalizada`);
    return auditoria;
  }

  /**
   * 📊 Obter Dashboard de Métricas
   */
  async obterDashboard() {
    const relatorio = await this.gerarRelatorioPerformance();
    const insights = await this.gerarInsights();
    
    return {
      sistema: 'SDM Analyzer IA',
      modulo: this.nome,
      versao: this.versao,
      ultima_atualizacao: new Date().toISOString(),
      relatorio_performance: relatorio,
      insights_prioritarios: insights.filter(i => i.prioridade === 'critico' || i.prioridade === 'atencao'),
      insights_gerais: insights,
      metricas_sistema: this.metricas,
      status: 'ativo'
    };
  }
}

// Singleton global
const iaAnalistaDados = new IAAnalistaDados();

/**
 * 📥 Registrar Análise (chamar após criar análise)
 */
export const registrarAnaliseParaAprendizado = async (analise) => {
  try {
    await iaAnalistaDados.coletarDadosAnalise(analise, true);
  } catch (error) {
    console.warn('⚠️ Erro ao registrar análise para aprendizado:', error);
  }
};

/**
 * 📊 Obter Insights do Sistema
 */
export const obterInsightsSistema = async () => {
  return await iaAnalistaDados.gerarInsights();
};

/**
 * 📈 Obter Relatório de Performance
 */
export const obterRelatorioPerformance = async () => {
  return await iaAnalistaDados.gerarRelatorioPerformance();
};

/**
 * 🔄 Executar Auditoria de Dados
 */
export const executarAuditoriaDados = async () => {
  return await iaAnalistaDados.executarAuditoriaCompleta();
};

/**
 * 📊 Obter Dashboard Completo
 */
export const obterDashboardCompleto = async () => {
  return await iaAnalistaDados.obterDashboard();
};

/**
 * 🚀 Iniciar Auditoria Automática (24h)
 */
export const iniciarAuditoriaAutomatica = () => {
  console.log('🚀 [IA_ANALISTA_DE_DADOS] Sistema de auditoria automática iniciado');
  
  // Executar auditoria a cada 24 horas
  const intervalo = 24 * 60 * 60 * 1000;
  
  setInterval(async () => {
    await iaAnalistaDados.executarAuditoriaCompleta();
  }, intervalo);

  // Executar primeira auditoria após 5 minutos
  setTimeout(async () => {
    await iaAnalistaDados.executarAuditoriaCompleta();
  }, 5 * 60 * 1000);
};

export default iaAnalistaDados;


