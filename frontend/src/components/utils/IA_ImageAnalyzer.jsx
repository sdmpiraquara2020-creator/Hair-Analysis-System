// IA_ImageAnalyzer.js
// Sistema Avançado de Análise de Imagens
// SDM Analyzer IA - Aperfeiçoamento de Precisão

import { appApi } from "@/api/appClient";

/**
 * GUIA DE ANÁLISE DETALHADA DE IMAGENS
 * Prompts técnicos para máxima precisão
 */
export const PROMPTS_ANALISE_AVANCADA = {
  
  // ANÁLISE PROFISSIONAL CAPILAR
  profissional: `
🔬 PROTOCOLO DE ANÁLISE MICROSCÓPICA CAPILAR

VOCÊ É UM ESPECIALISTA EM ANÁLISE CAPILAR PROFISSIONAL.

═══════════════════════════════════════════════════════════
📸 INSTRUÇÕES DE ANÁLISE DE IMAGEM
═══════════════════════════════════════════════════════════

1️⃣ ANÁLISE DE TIPO DE FIO (Sistema Andre Walker):
   
   LISOS (1A-1C):
   - 1A: Fio completamente liso, fino, sem volume, brilho natural
   - 1B: Fio liso, médio, leve volume na raiz
   - 1C: Fio liso, grosso, resistente, volume moderado
   
   ONDULADOS (2A-2C):
   - 2A: Ondas suaves em "S", fácil de alisar
   - 2B: Ondas médias em "S", frizz moderado
   - 2C: Ondas pronunciadas, frizz visível, volume alto
   
   CACHOS (3A-3C):
   - 3A: Cachos largos e soltos (espessura de giz)
   - 3B: Cachos médios definidos (espessura de marcador)
   - 3C: Cachos fechados, muito volumosos (espessura de caneta)
   
   CRESPOS (4A-4C):
   - 4A: Padrão "S" bem definido e pequeno
   - 4B: Padrão "Z" angular, menos definição
   - 4C: Padrão muito fechado, alta densidade

2️⃣ ANÁLISE DE ESTRUTURA DO FIO:
   
   FINA:
   - Difícil de sentir entre os dedos
   - Transparência ao olhar contra a luz
   - Pouco volume natural
   - Facilmente moldável
   
   MÉDIA:
   - Perceptível ao toque
   - Textura equilibrada
   - Volume moderado
   - Resistência normal
   
   GROSSA:
   - Muito perceptível ao toque
   - Opaca, sem transparência
   - Alto volume natural
   - Grande resistência

3️⃣ ANÁLISE DE VOLUME CAPILAR:
   
   BAIXO:
   - Cabelo rente ao couro cabeludo
   - Pouca projeção
   - Aparência "chapada"
   
   MÉDIO:
   - Projeção moderada
   - Volume equilibrado
   - Não muito volumoso nem muito raso
   
   ALTO:
   - Grande projeção
   - Muito volumoso
   - Cabelo "armado"

4️⃣ ANÁLISE DE NÍVEL DE DANO:
   
   SAUDÁVEL:
   - Brilho uniforme e intenso
   - Pontas alinhadas
   - Cutícula fechada (brilho reflexivo)
   - Sem quebra visível
   
   LEVE:
   - Brilho moderado
   - Algumas pontas abertas
   - Leve opacidade
   - Mínima quebra
   
   MODERADO:
   - Brilho reduzido
   - Pontas duplas visíveis
   - Frizz evidente
   - Quebra perceptível
   
   SEVERO:
   - Opacidade total
   - Pontas muito abertas
   - Frizz intenso
   - Quebra acentuada
   - Elasticidade comprometida

5️⃣ ANÁLISE DE COLORAÇÃO:
   
   NATURAL:
   - Cor uniforme da raiz às pontas
   - Brilho natural preservado
   - Sem manchas químicas
   
   DESCOLORIDO/PLATINADO:
   - Tom loiro muito claro ou branco
   - Porosidade visível
   - Possível amarelamento
   - Alta sensibilização
   
   COLORIDO/TINGIDO:
   - Cor artificial uniforme ou com raiz aparente
   - Possível desbotamento
   - Textura alterada pela química

6️⃣ ANÁLISE DE POROSIDADE (quando detectável):
   
   BAIXA:
   - Brilho intenso
   - Cutícula fechada
   - Resistente à hidratação
   
   MÉDIA:
   - Brilho equilibrado
   - Cutícula parcialmente aberta
   - Absorção moderada
   
   ALTA:
   - Opacidade
   - Cutícula muito aberta
   - Absorção rápida e perda rápida

7️⃣ SINAIS CRÍTICOS A OBSERVAR:
   - Quebra excessiva (fios curtos no meio do comprimento)
   - Pontas triplas ou múltiplas
   - Fios elásticos ou borrachudos (excesso de proteína)
   - Fios opacos e sem vida (falta de hidratação)
   - Irregularidades na espessura do fio
   - Diferentes texturas no mesmo cabelo

═══════════════════════════════════════════════════════════
⚠️ IMPORTANTE: SEJA EXTREMAMENTE PRECISO
═══════════════════════════════════════════════════════════

- Observe TODOS os detalhes da imagem
- Compare múltiplas áreas do cabelo
- Identifique padrões consistentes
- Não faça suposições sem base visual
- Descreva com terminologia técnica profissional
- Justifique cada conclusão com evidências visuais

═══════════════════════════════════════════════════════════
`,

  // ANÁLISE TRICOLÓGICA MICROSCÓPICA
  tricologia: `
🔬 PROTOCOLO DE ANÁLISE TRICOLÓGICA MICROSCÓPICA

VOCÊ É UM ESPECIALISTA EM TRICOLOGIA CLÍNICA.

═══════════════════════════════════════════════════════════
📸 INSTRUÇÕES DE ANÁLISE MICROSCÓPICA
═══════════════════════════════════════════════════════════

1️⃣ ANÁLISE DE DENSIDADE FOLICULAR:
   
   MUITO ALTA (>120 fol/cm²):
   - Cobertura densa e uniforme
   - Pouco ou nenhum espaço entre folículos
   - Saúde folicular excelente
   
   ALTA (100-120 fol/cm²):
   - Boa cobertura
   - Distribuição equilibrada
   - Folículos saudáveis
   
   MÉDIA (80-100 fol/cm²):
   - Cobertura adequada
   - Espaçamento normal
   - Alguns folículos finos
   
   BAIXA (60-80 fol/cm²):
   - Rarefação visível
   - Espaçamento aumentado
   - Miniaturização presente
   
   MUITO BAIXA (<60 fol/cm²):
   - Rarefação severa
   - Áreas com poucos folículos
   - Intervenção necessária

2️⃣ DETECÇÃO DE ALOPECIA:
   
   ANDROGENÉTICA:
   - Miniaturização progressiva
   - Padrão típico (coroa/frontal em homens, difusa em mulheres)
   - Folículos em diferentes fases
   
   AREATA:
   - Áreas circulares sem cabelo
   - Folículos em repouso
   - Pontos de exclamação
   
   DIFUSA:
   - Rarefação generalizada
   - Sem padrão específico
   - Queda em telógeno
   
   TRAÇÃO:
   - Dano em áreas de tensão
   - Folículos danificados
   - Linha frontal afetada

3️⃣ ANÁLISE DE OLEOSIDADE E SEBO:
   
   BAIXO:
   - Couro cabeludo seco
   - Descamação leve
   - Pouco brilho
   
   MÉDIO:
   - Oleosidade equilibrada
   - Sem acúmulo excessivo
   - Brilho saudável
   
   ALTO:
   - Brilho excessivo visível
   - Acúmulo de sebo
   - Obstrução folicular leve
   
   EXCESSIVO:
   - Couro cabeludo muito brilhante
   - Sebo acumulado evidente
   - Obstrução folicular severa
   - Possível dermatite seborreica

4️⃣ ANÁLISE DE DESCAMAÇÃO E CASPA:
   
   CASPA SECA:
   - Flocos brancos pequenos
   - Fácil desprendimento
   - Couro cabeludo seco
   
   CASPA OLEOSA:
   - Flocos amarelados grandes
   - Aderentes ao couro cabeludo
   - Associada a oleosidade
   
   DERMATITE SEBORREICA:
   - Vermelhidão visível
   - Descamação intensa
   - Possível coceira

5️⃣ ESTADO DOS FOLÍCULOS:
   
   SAUDÁVEIS:
   - Tamanho uniforme
   - Boa profundidade
   - Sem obstrução
   - Boa vascularização
   
   MINIATURIZADOS:
   - Folículos finos
   - Cabelos miniaturizados
   - Indicação de alopecia
   
   OBSTRUÍDOS:
   - Acúmulo de sebo
   - Queratina acumulada
   - Inflamação possível
   
   INFLAMADOS:
   - Vermelhidão
   - Inchaço
   - Possível infecção

6️⃣ ANÁLISE DE VASCULARIZAÇÃO:
   
   BOA:
   - Couro cabeludo rosado saudável
   - Boa irrigação visível
   
   REGULAR:
   - Cor normal mas sem destaque vascular
   
   COMPROMETIDA:
   - Palidez
   - Má circulação
   - Nutrição folicular prejudicada

7️⃣ CONDIÇÕES DETECTÁVEIS:
   - Foliculite (inflamação dos folículos)
   - Psoríase (placas prateadas)
   - Eczema (irritação e vermelhidão)
   - Queratose (acúmulo de queratina)
   - Infecções fúngicas

═══════════════════════════════════════════════════════════
⚠️ CRITÉRIOS DE ENCAMINHAMENTO MÉDICO
═══════════════════════════════════════════════════════════

OBRIGATÓRIO quando detectar:
- Alopecia severa ou progressiva rápida
- Inflamação intensa ou infecção
- Lesões ou feridas no couro cabeludo
- Sinais de condições autoimunes
- Perda súbita de cabelo em áreas grandes
- Sangramento ou secreção

═══════════════════════════════════════════════════════════
`
};

/**
 * VALIDAÇÃO E REFINAMENTO DE ANÁLISE
 * Verifica consistência e melhora precisão
 */
export function validarCoerenciaAnalise(analise) {
  const alertas = [];
  const inconsistencias = [];

  // Validar consistência entre tipo de fio e volume
  if (analise.tipo_fio_detalhado) {
    const numero = analise.tipo_fio_detalhado.charAt(0);
    
    // Cachos e crespos geralmente têm volume médio/alto
    if (['3', '4'].includes(numero) && analise.volume_capilar === 'baixo') {
      inconsistencias.push({
        campo: 'volume_capilar',
        mensagem: 'Cachos/crespos geralmente têm volume médio ou alto',
        sugestao: 'Revisar análise de volume'
      });
    }
    
    // Lisos finos geralmente têm volume baixo
    if (numero === '1' && analise.estrutura_fio === 'fina' && analise.volume_capilar === 'alto') {
      inconsistencias.push({
        campo: 'volume_capilar',
        mensagem: 'Lisos finos raramente têm volume alto natural',
        sugestao: 'Pode haver tratamento volumizador aplicado'
      });
    }
  }

  // Validar nível de dano vs coloração
  if (analise.coloracao_cabelo && analise.coloracao_cabelo.includes('Descolorido') && 
      analise.nivel_dano === 'saudavel') {
    inconsistencias.push({
      campo: 'nivel_dano',
      mensagem: 'Cabelos descoloridos raramente são completamente saudáveis',
      sugestao: 'Revisar análise de dano'
    });
  }

  // Validar quebra vs nível de dano
  if (analise.quebra_fios && analise.quebra_fios.quebra_detectada && 
      analise.quebra_fios.nivel_quebra === 'severa' && 
      analise.nivel_dano === 'leve') {
    inconsistencias.push({
      campo: 'nivel_dano',
      mensagem: 'Quebra severa não é compatível com dano leve',
      sugestao: 'Ajustar nível de dano para moderado ou severo'
    });
  }

  return {
    valido: inconsistencias.length === 0,
    inconsistencias,
    alertas,
    confianca: inconsistencias.length === 0 ? 'alta' : 
               inconsistencias.length <= 2 ? 'media' : 'baixa'
  };
}

/**
 * EXTRAÇÃO DE CARACTERÍSTICAS VISUAIS
 * Análise automática de padrões na imagem
 */
export function extrairCaracteristicasVisuais(analise) {
  const caracteristicas = {
    brilho: null,
    textura: null,
    uniformidade: null,
    densidade_aparente: null
  };

  // Inferir brilho baseado em dano e porosidade
  if (analise.nivel_dano === 'saudavel') {
    caracteristicas.brilho = 'alto';
  } else if (analise.nivel_dano === 'leve') {
    caracteristicas.brilho = 'medio';
  } else {
    caracteristicas.brilho = 'baixo';
  }

  // Inferir textura baseado em tipo de fio
  if (analise.tipo_fio_detalhado) {
    const numero = analise.tipo_fio_detalhado.charAt(0);
    if (numero === '1') caracteristicas.textura = 'lisa';
    else if (numero === '2') caracteristicas.textura = 'ondulada';
    else if (numero === '3') caracteristicas.textura = 'cacheada';
    else if (numero === '4') caracteristicas.textura = 'crespa';
  }

  // Inferir uniformidade
  if (analise.nivel_dano === 'saudavel' && !analise.coloracao_cabelo) {
    caracteristicas.uniformidade = 'alta';
  } else if (analise.nivel_dano === 'severo') {
    caracteristicas.uniformidade = 'baixa';
  } else {
    caracteristicas.uniformidade = 'media';
  }

  return caracteristicas;
}

/**
 * COMPARAÇÃO DE ANÁLISES
 * Para análise antes/depois
 */
export function compararAnalises(antes, depois) {
  const melhorias = [];
  const pioras = [];
  const manteve = [];

  // Comparar brilho
  const nivelDano = { 'saudavel': 4, 'leve': 3, 'moderado': 2, 'severo': 1 };
  const danoAntes = nivelDano[antes.nivel_dano] || 0;
  const danoDepois = nivelDano[depois.nivel_dano] || 0;

  if (danoDepois > danoAntes) {
    melhorias.push('Redução no nível de dano');
  } else if (danoDepois < danoAntes) {
    pioras.push('Aumento no nível de dano');
  } else {
    manteve.push('Nível de dano mantido');
  }

  // Comparar volume
  const nivelVolume = { 'baixo': 1, 'médio': 2, 'alto': 3 };
  const volumeAntes = nivelVolume[antes.volume_capilar] || 0;
  const volumeDepois = nivelVolume[depois.volume_capilar] || 0;

  if (volumeDepois !== volumeAntes) {
    if (Math.abs(volumeDepois - volumeAntes) > 0) {
      if (volumeDepois > volumeAntes) {
        melhorias.push('Aumento de volume');
      } else {
        pioras.push('Redução de volume');
      }
    }
  }

  return {
    melhorias,
    pioras,
    manteve,
    score_melhoria: (melhorias.length - pioras.length) * 25 + 50
  };
}

/**
 * GERAÇÃO DE PROMPT OTIMIZADO
 * Combina contexto + conhecimento + histórico
 */
export function gerarPromptOtimizado(tipo, analiseContext, historico) {
  let prompt = tipo === 'tricologia' ? 
    PROMPTS_ANALISE_AVANCADA.tricologia : 
    PROMPTS_ANALISE_AVANCADA.profissional;

  // Adicionar contexto de análises similares bem-sucedidas
  if (historico && historico.length > 0) {
    prompt += `\n\n═══════════════════════════════════════════════════════════
📊 CONTEXTO DE CASOS SIMILARES BEM-SUCEDIDOS
═══════════════════════════════════════════════════════════\n\n`;
    
    historico.slice(0, 3).forEach((caso, idx) => {
      prompt += `Caso ${idx + 1}:\n`;
      prompt += `- Tipo: ${caso.tipo_fio_detalhado || caso.tipo_fio}\n`;
      prompt += `- Dano: ${caso.nivel_dano}\n`;
      prompt += `- Recomendação: ${caso.recomendacao_tratamento || 'N/A'}\n`;
      prompt += `- Resultado: Positivo ✅\n\n`;
    });
  }

  // Adicionar análise de contexto específico
  if (analiseContext) {
    prompt += `\n\n═══════════════════════════════════════════════════════════
🎯 CONTEXTO ESPECÍFICO DESTA ANÁLISE
═══════════════════════════════════════════════════════════\n\n`;
    
    if (analiseContext.cliente_historico) {
      prompt += `Cliente com histórico de: ${analiseContext.cliente_historico}\n`;
    }
    if (analiseContext.observacoes) {
      prompt += `Observações profissionais: ${analiseContext.observacoes}\n`;
    }
  }

  return prompt;
}

export default {
  PROMPTS_ANALISE_AVANCADA,
  validarCoerenciaAnalise,
  extrairCaracteristicasVisuais,
  compararAnalises,
  gerarPromptOtimizado
};

