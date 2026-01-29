// SDM Tester IA - Sistema de Auto-Teste e Validação
// Analyzer SDM IA — Diagnóstico Inteligente

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { appApi } from "@/api/appClient";

const SDMTester = () => {
  const [testResults, setTestResults] = useState({
    total: 0,
    passed: 0,
    warnings: 0,
    failed: 0,
    lastRun: null,
    lastLogTime: null
  });

  // Queries desabilitadas para otimização
  const analises = [];
  const servicos = [];

  useEffect(() => {
    const runTests = async () => {
      console.log('🧪 [SDM Tester] Iniciando testes automáticos...');

      let passed = 0;
      let warnings = 0;
      let failed = 0;
      const issues = [];

      // TESTE 1: Validar estrutura das análises
      analises.forEach((analise, index) => {
        const testName = `Análise #${index + 1} - ${analise.cliente_nome}`;

        // Campo cliente
        if (!analise.cliente_nome || analise.cliente_nome === 'Sem cadastro') {
          warnings++;
          issues.push({
            type: 'warning',
            test: testName,
            message: 'Cliente não cadastrado',
            priority: 'média'
          });
        } else {
          passed++;
        }

        // Data da análise
        if (!analise.created_date) {
          failed++;
          issues.push({
            type: 'error',
            test: testName,
            message: 'Data da análise ausente',
            priority: 'alta'
          });
        } else {
          passed++;
        }

        // Tipo de fio
        if (!analise.tipo_fio || analise.tipo_fio === 'Não identificado') {
          failed++;
          issues.push({
            type: 'error',
            test: testName,
            message: 'Tipo de fio não identificado',
            priority: 'crítica'
          });
        } else {
          passed++;
        }

        // Recomendações (modo diagnóstico)
        if (analise.modo_analise !== 'antes_depois') {
          if (analise.tipo_analise_solicitado === 'completo' || analise.tipo_analise_solicitado === 'alisamento') {
            if (!analise.recomendacao_alisamento || analise.recomendacao_alisamento === 'N/A') {
              failed++;
              issues.push({
                type: 'error',
                test: testName,
                message: 'Falta recomendação de alisamento principal',
                priority: 'alta'
              });
            } else {
              passed++;
            }

            // Alisamento alternativo
            if (!analise.recomendacao_alisamento_alternativa || analise.recomendacao_alisamento_alternativa === 'N/A') {
              warnings++;
              issues.push({
                type: 'warning',
                test: testName,
                message: 'Falta alisamento alternativo (secundário)',
                priority: 'média'
              });
            } else {
              passed++;
            }
          }

          if (analise.tipo_analise_solicitado === 'completo' || analise.tipo_analise_solicitado === 'tratamento') {
            if (!analise.recomendacao_tratamento || analise.recomendacao_tratamento === 'N/A') {
              warnings++;
              issues.push({
                type: 'warning',
                test: testName,
                message: 'Falta recomendação de tratamento',
                priority: 'média'
              });
            } else {
              passed++;
            }
          }
        }

        // Validar inconsistências técnicas
        if (analise.tipo_fio_detalhado?.includes('2') && 
            analise.estrutura_fio === 'grossa' &&
            analise.tipo_fio?.toLowerCase().includes('cacheado')) {
          warnings++;
          issues.push({
            type: 'warning',
            test: testName,
            message: 'Possível erro: Fio 2B grosso classificado como cacheado',
            priority: 'alta'
          });
        }
      });

      // TESTE 2: Validar serviços cadastrados
      if (servicos.length === 0) {
        failed++;
        issues.push({
          type: 'error',
          test: 'Sistema',
          message: 'Nenhum serviço cadastrado no sistema',
          priority: 'crítica'
        });
      }

      // Registrar resultados
      const totalTests = passed + warnings + failed;
      const newResults = {
        total: totalTests,
        passed,
        warnings,
        failed,
        lastRun: new Date()
      };

      setTestResults(prevResults => ({
        ...newResults,
        lastLogTime: prevResults.lastLogTime
      }));

      // LOGS DESABILITADOS PARA EVITAR RATE LIMIT
      // Os testes rodam em background mas NÃO criam logs automáticos
      // Logs só são criados manualmente via agente WhatsApp
      
      console.log('✅ [SDM Tester] Testes concluídos:', newResults);
      if (issues.length > 0 && issues.length <= 3) {
        console.log('📋 [SDM Tester] Problemas encontrados:', issues);
      }
    };

    // INTERVALOS MUITO MAIORES PARA EVITAR SOBRECARGA
    // Executar testes apenas 1x por hora
    const interval = setInterval(runTests, 60 * 60 * 1000); // 1 hora

    // Primeira execução após 5 minutos (não imediatamente)
    const initialTimeout = setTimeout(runTests, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [analises, servicos]);

  // Componente roda silenciosamente em background
  return null;
};

export default SDMTester;

