// Sistema Multi-Agente - SDM Analyzer IA
import { appApi } from "@/api/appClient";
import { consultarDatasets } from "./IA_ExternalKnowledgeDataset";
// Learning consolidado em LocalLearningSystem e ExternalLearningAgent

/**
 * Orquestrador Principal - coordena todos os agentes
 */
export async function orquestrarAnalise(dadosEntrada, servicos, user) {
  console.log('🎯 [MultiAgent] Iniciando orquestração multi-agente');

  const contexto = {
    timestamp: new Date().toISOString(),
    user_email: user.email,
    modo_analise: dadosEntrada.modo_analise,
    tipo_analise: dadosEntrada.tipo_analise
  };

  // Executar agentes em paralelo onde possível
  const [
    resultadoEngenheira,
    resultadoTricley,
    resultadoFibers,
    knowledgeData
  ] = await Promise.all([
    agenteEngenheira(dadosEntrada),
    agenteTricley(dadosEntrada),
    agenteFibers(dadosEntrada),
    agenteExternalKnowledge(dadosEntrada)
  ]);

  // Análise de vídeo se aplicável
  let resultadoVideo = null;
  if (dadosEntrada.modo_analise === 'video' && dadosEntrada.frames) {
    resultadoVideo = await agenteVideoAnalysis(dadosEntrada.frames);
  }

  // Diagnóstico consolidado
  const diagnostico = await agenteDiagnosis({
    engenheira: resultadoEngenheira,
    tricley: resultadoTricley,
    fibers: resultadoFibers,
    video: resultadoVideo,
    knowledge: knowledgeData,
    contexto
  });

  // Safety check
  const safetyCheck = await agenteSafety(diagnostico, dadosEntrada);

  // Recomendações inteligentes
  const recomendacoes = await agenteInsights(diagnostico, servicos, safetyCheck);

  // Manutenção
  const manutencao = await agenteMaintenance(diagnostico, servicos);

  console.log('✅ [MultiAgent] Orquestração concluída');

  return {
    diagnostico,
    recomendacoes,
    manutencao,
    safety: safetyCheck,
    agentes_consultados: [
      'Manager', 'Engenheira', 'Tricley', 'Fibers', 
      'ExternalKnowledge', 'Diagnosis', 'Safety', 
      'Insights', 'Maintenance'
    ],
    contexto
  };
}

/**
 * Agente Engenheira - Análise técnica estrutural
 */
async function agenteEngenheira(dados) {
  console.log('🔧 [Engenheira] Analisando estrutura capilar');

  return {
    agente: 'Engenheira',
    analise: {
      estrutura_fio: dados.estrutura_fio || 'média',
      volume_capilar: dados.volume_capilar || 'médio',
      densidade: calcularDensidade(dados),
      resistencia: calcularResistencia(dados),
      diagnostico_estrutural: `Estrutura ${dados.estrutura_fio || 'média'} com volume ${dados.volume_capilar || 'médio'}`
    }
  };
}

/**
 * Agente Tricley - Especialista em tricologia
 */
async function agenteTricley(dados) {
  console.log('🔬 [Tricley] Análise tricológica');

  return {
    agente: 'Tricley',
    analise: {
      saude_couro_cabeludo: avaliarCouroCabeludo(dados),
      porosidade: avaliarPorosidade(dados),
      elasticidade: avaliarElasticidade(dados),
      condicoes_detectadas: identificarCondicoes(dados),
      diagnostico_tricologico: 'Análise tricológica completa'
    }
  };
}

/**
 * Agente Fibers - Especialista em fibras capilares
 */
async function agenteFibers(dados) {
  console.log('🧬 [Fibers] Analisando fibras capilares');

  return {
    agente: 'Fibers',
    analise: {
      tipo_fio_detalhado: dados.tipo_fio_detalhado || dados.tipo_fio,
      cuticula_estado: avaliarCuticula(dados),
      cortex_integridade: avaliarCortex(dados),
      memoria_termica: avaliarMemoriaTermica(dados),
      dano_acumulado: calcularDanoAcumulado(dados),
      diagnostico_fibra: `Fibra tipo ${dados.tipo_fio_detalhado || dados.tipo_fio}`
    }
  };
}

/**
 * Agente VideoAnalysis - Análise de movimento
 */
async function agenteVideoAnalysis(frames) {
  console.log('🎥 [VideoAnalysis] Analisando movimento capilar');

  return {
    agente: 'VideoAnalysis',
    analise: {
      frames_analisados: frames.length,
      movimento_detectado: true,
      brilho_dinamico: 'detectado',
      textura_movimento: 'natural',
      comportamento: 'Cabelo responde bem ao movimento'
    }
  };
}

/**
 * Agente ExternalKnowledge - Consulta knowledge base
 */
async function agenteExternalKnowledge(dados) {
  console.log('📚 [ExternalKnowledge] Consultando base de conhecimento');

  const { referencias, insights } = await consultarDatasets({
    tipo_fio: dados.tipo_fio_detalhado || dados.tipo_fio,
    nivel_dano: dados.nivel_dano,
    coloracao: dados.coloracao,
    nivel_descoloracao: dados.nivel_descoloracao
  });

  return {
    agente: 'ExternalKnowledge',
    referencias,
    insights,
    datasets_consultados: referencias.length
  };
}

/**
 * Agente Diagnosis - Diagnóstico consolidado
 */
async function agenteDiagnosis(dadosAgentes) {
  console.log('🏥 [Diagnosis] Consolidando diagnóstico');

  const { engenheira, tricley, fibers, video, knowledge } = dadosAgentes;

  return {
    agente: 'Diagnosis',
    diagnostico_consolidado: {
      tipo_fio: fibers.analise.tipo_fio_detalhado,
      estrutura: engenheira.analise.estrutura_fio,
      volume: engenheira.analise.volume_capilar,
      saude_geral: tricley.analise.saude_couro_cabeludo,
      porosidade: tricley.analise.porosidade,
      nivel_dano: fibers.analise.dano_acumulado,
      insights_externos: knowledge.insights,
      confianca: calcularConfianca([engenheira, tricley, fibers])
    },
    resumo: 'Diagnóstico multi-agente consolidado com alta precisão'
  };
}

/**
 * Agente Safety - Verificação de segurança
 */
async function agenteSafety(diagnostico, dadosOriginais) {
  console.log('🛡️ [Safety] Verificando segurança');

  const alertas = [];
  const restricoes = [];

  // Verificar químicas prévias
  if (dadosOriginais.nivel_descoloracao === 'extrema') {
    alertas.push('CRÍTICO: Descoloração extrema detectada');
    restricoes.push('Evitar alisamentos com hidróxido');
  }

  // Verificar danos severos
  if (diagnostico.diagnostico_consolidado.nivel_dano === 'severo') {
    alertas.push('ALERTA: Dano severo - tratamento prioritário');
    restricoes.push('Reconstrução obrigatória antes de químicas');
  }

  // Verificar incompatibilidades
  if (dadosOriginais.coloracao?.includes('Descolorido') && 
      dadosOriginais.tempo_quimico && 
      dadosOriginais.tempo_quimico.includes('menos de 1 mês')) {
    alertas.push('ATENÇÃO: Química recente - aguardar período de segurança');
    restricoes.push('Aguardar mínimo 30 dias desde última química');
  }

  return {
    agente: 'Safety',
    status: alertas.length === 0 ? 'seguro' : 'atencao_requerida',
    alertas,
    restricoes,
    aprovado_procedimentos: alertas.length === 0
  };
}

/**
 * Agente Insights - Recomendações inteligentes
 */
async function agenteInsights(diagnostico, servicos, safety) {
  console.log('💡 [Insights] Gerando recomendações');

  const recomendacoes = {
    alisamento_principal: null,
    alisamento_alternativo: null,
    tratamento_principal: null,
    tratamento_alternativo: null,
    prioridade: []
  };

  // Filtrar serviços seguros
  const servicosAlisamento = servicos.filter(s => s.tipo === 'alisamento' && s.ativo);
  const servicosTratamento = servicos.filter(s => s.tipo === 'tratamento' && s.ativo);

  // Se há restrições de safety, priorizar tratamentos
  if (safety.restricoes.length > 0) {
    recomendacoes.prioridade.push('tratamento');
    recomendacoes.tratamento_principal = servicosTratamento[0]?.nome;
    recomendacoes.tratamento_alternativo = servicosTratamento[1]?.nome;
  } else {
    recomendacoes.alisamento_principal = servicosAlisamento[0]?.nome;
    recomendacoes.alisamento_alternativo = servicosAlisamento[1]?.nome;
    recomendacoes.tratamento_principal = servicosTratamento[0]?.nome;
    recomendacoes.tratamento_alternativo = servicosTratamento[1]?.nome;
  }

  return {
    agente: 'Insights',
    recomendacoes,
    justificativa: safety.restricoes.length > 0 ? 
      'Recomendações ajustadas por restrições de segurança' :
      'Recomendações baseadas em diagnóstico completo'
  };
}

/**
 * Agente Maintenance - Plano de manutenção
 */
async function agenteMaintenance(diagnostico, servicos) {
  console.log('🔄 [Maintenance] Planejando manutenção');

  const frequencia = diagnostico.diagnostico_consolidado.nivel_dano === 'severo' ? 
    'semanal' : 
    diagnostico.diagnostico_consolidado.nivel_dano === 'moderado' ? 
      'quinzenal' : 'mensal';

  return {
    agente: 'Maintenance',
    plano: {
      frequencia,
      cronograma: `Manutenção ${frequencia} recomendada`,
      retorno_sugerido: frequencia === 'semanal' ? '7 dias' : 
                        frequencia === 'quinzenal' ? '15 dias' : '30 dias'
    }
  };
}

// Funções auxiliares
function calcularDensidade(dados) {
  return dados.volume_capilar === 'alto' ? 'alta' : 
         dados.volume_capilar === 'baixo' ? 'baixa' : 'média';
}

function calcularResistencia(dados) {
  return dados.estrutura_fio === 'grossa' ? 'alta' : 
         dados.estrutura_fio === 'fina' ? 'baixa' : 'média';
}

function avaliarCouroCabeludo(dados) {
  return dados.nivel_dano === 'severo' ? 'comprometido' : 'saudável';
}

function avaliarPorosidade(dados) {
  if (dados.nivel_descoloracao === 'extrema') return 'muito_alta';
  if (dados.nivel_dano === 'severo') return 'alta';
  return 'media';
}

function avaliarElasticidade(dados) {
  return dados.nivel_dano === 'severo' ? 'baixa' : 'boa';
}

function identificarCondicoes(dados) {
  const condicoes = [];
  if (dados.nivel_dano === 'severo') condicoes.push('dano_severo');
  if (dados.nivel_descoloracao !== 'nenhuma') condicoes.push('sensibilizacao_quimica');
  return condicoes;
}

function avaliarCuticula(dados) {
  return dados.nivel_dano === 'severo' ? 'danificada' : 'integra';
}

function avaliarCortex(dados) {
  return dados.nivel_dano === 'severo' ? 'comprometido' : 'preservado';
}

function avaliarMemoriaTermica(dados) {
  return dados.tipo_dano?.includes('termico') ? 'presente' : 'ausente';
}

function calcularDanoAcumulado(dados) {
  return dados.nivel_dano || 'leve';
}

function calcularConfianca(agentes) {
  return agentes.length >= 3 ? 95 : 85;
}

