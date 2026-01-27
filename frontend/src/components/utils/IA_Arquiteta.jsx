// 🧩 IA ARQUITETA - Sistema de Gestão Inteligente
// SDM Analyzer IA v3.0 - Ecossistema Integrado
// Função: Supervisionar, validar e otimizar todo o sistema

import { appApi } from "@/api/appClient";
import { validarComInteligencia, corrigirTipoFioDuplicado, normalizarTexto } from "./AutoCorrectAI";

/**
 * 🎯 IA ARQUITETA - Controladora Principal
 * Gerencia e coordena todas as camadas do sistema
 */
class IAArquiteta {
  constructor() {
    this.nome = "IA_ARQUITETA";
    this.versao = "3.0";
    this.ultimaExecucao = null;
    this.metricas = {
      totalValidacoes: 0,
      totalCorrecoes: 0,
      totalOtimizacoes: 0,
      ultimaAuditoria: null
    };
  }

  /**
   * 🔍 Auditar Sistema Completo
   */
  async auditarSistema() {
    console.log(`🧩 [${this.nome} v${this.versao}] Iniciando auditoria completa do sistema...`);
    
    const auditoria = {
      timestamp: new Date().toISOString(),
      status: 'iniciada',
      modulos: {
        ia_sistema: await this.auditarIASistema(),
        ia_diagnostico: await this.auditarIADiagnostico(),
        ia_visual: await this.auditarIAVisual(),
        ia_relatorios: await this.auditarIARelatorios(),
        ia_aprendizado: await this.auditarIAAprendizado()
      },
      problemas_detectados: [],
      acoes_tomadas: []
    };

    // Analisar resultados
    Object.keys(auditoria.modulos).forEach(modulo => {
      const resultado = auditoria.modulos[modulo];
      if (resultado.status === 'erro' || resultado.problemas.length > 0) {
        auditoria.problemas_detectados.push(...resultado.problemas);
      }
    });

    auditoria.status = auditoria.problemas_detectados.length === 0 ? 'sucesso' : 'atencao';

    console.log(`✅ [${this.nome}] Auditoria concluída:`, {
      status: auditoria.status,
      problemas: auditoria.problemas_detectados.length,
      modulos_auditados: Object.keys(auditoria.modulos).length
    });

    this.metricas.ultimaAuditoria = auditoria;
    this.ultimaExecucao = new Date().toISOString();

    return auditoria;
  }

  /**
   * 🔧 Auditar IA Sistema (appApi)
   */
  async auditarIASistema() {
    const resultado = {
      modulo: 'IA_SISTEMA',
      status: 'ok',
      problemas: [],
      metricas: {}
    };

    try {
      // Verificar entidades
      const entidadesEssenciais = ['Analise', 'Servico', 'Cliente', 'ConfiguracaoSistema'];
      for (const entidade of entidadesEssenciais) {
        try {
          const dados = await appApi.entities[entidade].list('-created_date', 1);
          resultado.metricas[entidade] = dados.length;
        } catch (error) {
          resultado.problemas.push(`Entidade ${entidade} inacessível: ${error.message}`);
          resultado.status = 'erro';
        }
      }

      // Verificar logs de auditoria
      const logs = await appApi.entities.LogAuditoria.list('-created_date', 20);
      resultado.metricas.logs_recentes = logs.length;

      // Detectar erros críticos recentes
      const errosCriticos = logs.filter(l => l.status === 'erro' && 
        new Date(l.created_date) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      );

      if (errosCriticos.length > 5) {
        resultado.problemas.push(`${errosCriticos.length} erros críticos nas últimas 24h`);
        resultado.status = 'atencao';
      }

    } catch (error) {
      resultado.status = 'erro';
      resultado.problemas.push(`Erro na auditoria: ${error.message}`);
    }

    return resultado;
  }

  /**
   * 🧠 Auditar IA Diagnóstico (OpenAI)
   */
  async auditarIADiagnostico() {
    const resultado = {
      modulo: 'IA_DIAGNOSTICO',
      status: 'ok',
      problemas: [],
      metricas: {}
    };

    try {
      // Verificar análises recentes
      const analises = await appApi.entities.Analise.list('-created_date', 50);
      resultado.metricas.total_analises = analises.length;

      // Verificar qualidade das análises
      const analisesComProblemas = analises.filter(a => {
        return (
          !a.tipo_fio || 
          !a.tipo_fio_detalhado ||
          !a.volume_capilar ||
          !a.estrutura_fio ||
          !a.condicao_cabelo ||
          a.tipo_fio?.includes(a.tipo_fio?.split(' ')[0] + ' ' + a.tipo_fio?.split(' ')[0]) // duplicação
        );
      });

      resultado.metricas.analises_com_problemas = analisesComProblemas.length;
      resultado.metricas.taxa_qualidade = ((analises.length - analisesComProblemas.length) / analises.length * 100).toFixed(1) + '%';

      if (analisesComProblemas.length > analises.length * 0.2) {
        resultado.problemas.push(`${analisesComProblemas.length} análises com dados incompletos ou duplicados (>${20}%)`);
        resultado.status = 'atencao';
      }

      // Verificar feedback
      const comFeedback = analises.filter(a => a.feedback_positivo !== null && a.feedback_positivo !== undefined);
      const feedbackPositivo = comFeedback.filter(a => a.feedback_positivo === true);
      
      resultado.metricas.total_feedbacks = comFeedback.length;
      resultado.metricas.feedback_positivo_taxa = comFeedback.length > 0 
        ? ((feedbackPositivo.length / comFeedback.length) * 100).toFixed(1) + '%'
        : 'N/A';

    } catch (error) {
      resultado.status = 'erro';
      resultado.problemas.push(`Erro na auditoria: ${error.message}`);
    }

    return resultado;
  }

  /**
   * 🎨 Auditar IA Visual
   */
  async auditarIAVisual() {
    const resultado = {
      modulo: 'IA_VISUAL',
      status: 'ok',
      problemas: [],
      metricas: {},
      recomendacoes: []
    };

    try {
      // Verificar elementos visuais problemáticos
      const problemasVisuais = [];

      // Simular verificação (em produção, analisaria DOM)
      resultado.metricas.elementos_auditados = 0;
      resultado.recomendacoes.push('Manter layout limpo e responsivo');
      resultado.recomendacoes.push('Verificar contraste e legibilidade');
      resultado.recomendacoes.push('Evitar sobreposição de elementos');

    } catch (error) {
      resultado.status = 'erro';
      resultado.problemas.push(`Erro na auditoria visual: ${error.message}`);
    }

    return resultado;
  }

  /**
   * 📄 Auditar IA Relatórios
   */
  async auditarIARelatorios() {
    const resultado = {
      modulo: 'IA_RELATORIOS',
      status: 'ok',
      problemas: [],
      metricas: {}
    };

    try {
      const analises = await appApi.entities.Analise.list('-created_date', 30);
      
      // Verificar completude dos dados para relatório
      const analisesIncompletas = analises.filter(a => {
        const camposEssenciais = [
          'tipo_fio',
          'tipo_fio_detalhado',
          'condicao_cabelo',
          'coloracao_cabelo',
          'necessidade_corte',
          'justificativa'
        ];

        return camposEssenciais.some(campo => !a[campo]);
      });

      resultado.metricas.analises_completas = analises.length - analisesIncompletas.length;
      resultado.metricas.analises_incompletas = analisesIncompletas.length;

      if (analisesIncompletas.length > 0) {
        resultado.problemas.push(`${analisesIncompletas.length} análises com dados incompletos para relatório`);
        resultado.status = 'atencao';
      }

    } catch (error) {
      resultado.status = 'erro';
      resultado.problemas.push(`Erro na auditoria: ${error.message}`);
    }

    return resultado;
  }

  /**
   * 🧠 Auditar IA Aprendizado
   */
  async auditarIAAprendizado() {
    const resultado = {
      modulo: 'IA_APRENDIZADO',
      status: 'ok',
      problemas: [],
      metricas: {}
    };

    try {
      // Verificar logs de autocorreção
      const logs = await appApi.entities.LogAuditoria.list('-created_date', 100);
      const logsAutocorrecao = logs.filter(l => l.tipo_auditoria === 'autocorrecao');
      const logsFeedback = logs.filter(l => l.tipo_auditoria === 'feedback_implicito');

      resultado.metricas.total_autocorrecoes = logsAutocorrecao.length;
      resultado.metricas.total_feedbacks = logsFeedback.length;

      // Verificar taxa de aprendizado
      const metricas = await appApi.entities.AprendizadoMetrica.list('-created_date', 50);
      resultado.metricas.metricas_aprendizado = metricas.length;

      if (logsAutocorrecao.length === 0 && logs.length > 0) {
        resultado.problemas.push('Sistema de autocorreção não está registrando eventos');
        resultado.status = 'atencao';
      }

    } catch (error) {
      resultado.status = 'erro';
      resultado.problemas.push(`Erro na auditoria: ${error.message}`);
    }

    return resultado;
  }

  /**
   * 🔧 Executar Correções Automáticas
   */
  async executarCorrecoesAutomaticas() {
    console.log(`🔧 [${this.nome}] Executando correções automáticas...`);
    
    const correcoes = {
      timestamp: new Date().toISOString(),
      total: 0,
      detalhes: []
    };

    try {
      // 1. Corrigir análises com duplicações
      const analises = await appApi.entities.Analise.list('-created_date', 100);
      
      for (const analise of analises) {
        const corrigida = await validarComInteligencia(analise);
        
        if (JSON.stringify(corrigida) !== JSON.stringify(analise)) {
          try {
            await appApi.entities.Analise.update(analise.id, corrigida);
            correcoes.total++;
            correcoes.detalhes.push({
              tipo: 'correcao_analise',
              analise_id: analise.id,
              campos_corrigidos: Object.keys(corrigida).filter(k => corrigida[k] !== analise[k])
            });
          } catch (error) {
            console.warn(`⚠️ Erro ao corrigir análise ${analise.id}:`, error);
          }
        }
      }

      this.metricas.totalCorrecoes += correcoes.total;

      console.log(`✅ [${this.nome}] ${correcoes.total} correções aplicadas`);

    } catch (error) {
      console.error(`❌ [${this.nome}] Erro nas correções automáticas:`, error);
    }

    return correcoes;
  }

  /**
   * 📊 Gerar Relatório de Status
   */
  gerarRelatorioStatus() {
    return {
      sistema: 'SDM Analyzer IA',
      versao: this.versao,
      ia_arquiteta: {
        nome: this.nome,
        status: 'ativa',
        ultima_execucao: this.ultimaExecucao,
        metricas: this.metricas
      },
      modulos: {
        ia_sistema: 'ativo',
        ia_diagnostico: 'ativo',
        ia_visual: 'ativo',
        ia_relatorios: 'ativo',
        ia_aprendizado: 'ativo'
      },
      saude_geral: this.metricas.ultimaAuditoria?.status || 'desconhecido'
    };
  }

  /**
   * 🚀 Executar Ciclo Completo
   */
  async executarCicloCompleto() {
    console.log(`🚀 [${this.nome}] Iniciando ciclo completo de supervisão...`);
    
    const resultado = {
      timestamp: new Date().toISOString(),
      auditoria: null,
      correcoes: null,
      status: 'ok'
    };

    try {
      // 1. Auditar sistema
      resultado.auditoria = await this.auditarSistema();

      // 2. Executar correções se necessário
      if (resultado.auditoria.problemas_detectados.length > 0) {
        resultado.correcoes = await this.executarCorrecoesAutomaticas();
      }

      // 3. Registrar execução
      await this.registrarExecucao(resultado);

      console.log(`✅ [${this.nome}] Ciclo completo finalizado`);

    } catch (error) {
      console.error(`❌ [${this.nome}] Erro no ciclo completo:`, error);
      resultado.status = 'erro';
      resultado.erro = error.message;
    }

    return resultado;
  }

  /**
   * 📝 Registrar Execução
   */
  async registrarExecucao(resultado) {
    try {
      await appApi.entities.LogAuditoria.create({
        tipo_auditoria: 'ia_arquiteta',
        status: resultado.status,
        descricao: `IA Arquiteta - Ciclo de supervisão automático`,
        correcao_aplicada: resultado.correcoes ? `${resultado.correcoes.total} correções aplicadas` : 'Nenhuma correção necessária',
        metrica_antes: resultado.auditoria,
        metrica_depois: resultado.correcoes,
        automatica: true
      });
    } catch (error) {
      console.warn('⚠️ Não foi possível registrar execução:', error);
    }
  }
}

// Singleton global
const iaArquiteta = new IAArquiteta();

/**
 * 🎯 Validar Análise Completa (chamada antes de salvar/exibir)
 */
export const validarAnaliseCompleta = async (analise) => {
  console.log('🎯 [IA_ARQUITETA] Validando análise completa...');
  
  iaArquiteta.metricas.totalValidacoes++;
  
  // Aplicar todas as correções
  const analiseCorrigida = await validarComInteligencia(analise);
  
  // Validações adicionais
  const validacoes = {
    tipo_fio: corrigirTipoFioDuplicado(analiseCorrigida.tipo_fio || ''),
    tipo_fio_detalhado: corrigirTipoFioDuplicado(analiseCorrigida.tipo_fio_detalhado || ''),
    necessidade_corte: normalizarTexto(analiseCorrigida.necessidade_corte || ''),
    volume_capilar: normalizarTexto(analiseCorrigida.volume_capilar || ''),
    estrutura_fio: normalizarTexto(analiseCorrigida.estrutura_fio || ''),
    nivel_dano: normalizarTexto(analiseCorrigida.nivel_dano || '')
  };

  return {
    ...analiseCorrigida,
    ...validacoes
  };
};

/**
 * 🔍 Otimizar Visual (detectar e corrigir poluição visual)
 */
export const otimizarVisual = () => {
  console.log('🔍 [IA_ARQUITETA] Otimizando visual...');
  
  iaArquiteta.metricas.totalOtimizacoes++;
  
  // Detectar elementos duplicados ou sobrepostos
  const problemas = [];
  
  // Verificar z-index conflicts
  const elementosAltos = document.querySelectorAll('[class*="z-["]');
  if (elementosAltos.length > 10) {
    problemas.push('Muitos elementos com z-index alto');
  }

  // Verificar elementos fixos sobrepostos
  const elementosFixos = document.querySelectorAll('[class*="fixed"]');
  if (elementosFixos.length > 5) {
    problemas.push('Possível sobreposição de elementos fixos');
  }

  return {
    problemas_detectados: problemas,
    recomendacoes: [
      'Revisar z-index de elementos fixos',
      'Evitar múltiplos elementos fixed na mesma área',
      'Manter espaçamento adequado entre componentes'
    ]
  };
};

/**
 * 🚀 Iniciar Supervisão Automática
 */
export const iniciarSupervisaoAutomatica = () => {
  console.log('🚀 [IA_ARQUITETA] Sistema de supervisão automática iniciado');
  
  // Executar auditoria a cada 30 minutos
  const intervalo = 30 * 60 * 1000;
  
  setInterval(async () => {
    await iaArquiteta.executarCicloCompleto();
  }, intervalo);

  // Executar primeira auditoria após 1 minuto
  setTimeout(async () => {
    await iaArquiteta.executarCicloCompleto();
  }, 60000);
};

/**
 * 📊 Obter Status do Sistema
 */
export const obterStatusSistema = () => {
  return iaArquiteta.gerarRelatorioStatus();
};

export default iaArquiteta;

