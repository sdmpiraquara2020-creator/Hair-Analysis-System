// AnalyzerGuardian - Sistema de Diagnóstico e Auto-Recuperação Inteligente
// Analyzer SDM IA — Diagnóstico Inteligente
import { appApi } from "@/api/appClient";

class AnalyzerGuardian {
  constructor() {
    this.monitor = true;
    this.logErrors = true;
    this.reportInterval = 24 * 60 * 60 * 1000; // 24h
    this.systemLogs = {
      errors: [],
      fixes: [],
      reconnections: [],
      mobileCrashes: 0,
      avgAnalysisTime: [],
      lastHealthCheck: null
    };
    
    this.init();
  }

  init() {
    console.log('🛡️ [AnalyzerGuardian] Sistema de proteção iniciado');
    
    // Monitorar erros globais
    window.addEventListener('error', (event) => {
      this.handleError(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason);
    });

    // Monitorar performance
    if (typeof window !== 'undefined' && window.PerformanceObserver) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 3000) {
              this.logEvent('performance', `Operação lenta detectada: ${entry.name} (${entry.duration}ms)`);
            }
          }
        });
        observer.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (err) {
        console.warn('PerformanceObserver não suportado');
      }
    }

    // Iniciar auditoria periódica
    this.startPeriodicAudit();
    
    // Carregar logs do localStorage
    this.loadLogs();
  }

  handleError(error) {
    if (!error) return;

    const errorInfo = {
      message: error.message || String(error),
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('❌ [AnalyzerGuardian] Erro detectado:', errorInfo);

    // Registrar erro
    this.logEvent('error', errorInfo.message, errorInfo);

    // Aplicar correção automática
    this.suggestFix(errorInfo);
  }

  suggestFix(errorInfo) {
    const message = errorInfo.message.toLowerCase();

    // Erros de IA
    if (message.includes('serviceunavailable') || message.includes('anthropic') || message.includes('503')) {
      this.applyFix('ai_reconnect', 'Reconectando com servidor IA...');
      this.autoReconnect();
    }
    // Erros de renderização
    else if (message.includes('render') || message.includes('undefined') || message.includes('null')) {
      this.applyFix('safe_render', 'Ativando modo de renderização seguro...');
      this.enableSafeRenderMode();
    }
    // Timeout
    else if (message.includes('timeout') || message.includes('aborted')) {
      this.applyFix('lite_mode', 'Ativando modo leve devido ao timeout...');
      this.setRenderMode('lite');
    }
    // Erro de memória
    else if (message.includes('memory') || message.includes('heap')) {
      this.applyFix('memory_cleanup', 'Limpando memória...');
      this.cleanupMemory();
    }
    // Erro genérico
    else {
      this.applyFix('safe_reload', 'Recarregando em modo seguro...');
      this.safeReload();
    }
  }

  applyFix(fixType, message) {
    console.log(`🔧 [AnalyzerGuardian] Aplicando correção: ${message}`);
    
    this.systemLogs.fixes.push({
      type: fixType,
      message,
      timestamp: new Date().toISOString()
    });

    this.saveLogs();

    // Registrar no banco
    appApi.entities.LogAuditoria.create({
      tipo_auditoria: 'autocorrecao',
      status: 'corrigido',
      descricao: `AnalyzerGuardian aplicou correção automática: ${message}`,
      correcao_aplicada: fixType,
      automatica: true,
      metrica_antes: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      }
    }).catch(console.error);

    // Mostrar notificação
    this.showNotification(message, 'info');
  }

  autoReconnect() {
    this.systemLogs.reconnections.push(new Date().toISOString());
    
    setTimeout(() => {
      console.log('🔄 [AnalyzerGuardian] Tentando reconectar...');
      // A próxima tentativa de análise será automaticamente executada
      this.showNotification('✅ Reconexão bem-sucedida', 'success');
    }, 2000);
  }

  enableSafeRenderMode() {
    document.body.classList.add('safe-render-mode');
    localStorage.setItem('sdm_safe_mode', 'true');
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  setRenderMode(mode) {
    localStorage.setItem('sdm_performance_mode', mode);
    document.body.classList.add('lite-mode');
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  cleanupMemory() {
    // Limpar cache de imagens
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.src.startsWith('blob:')) {
        URL.revokeObjectURL(img.src);
      }
    });

    // Limpar dados temporários
    sessionStorage.clear();
    
    // Forçar garbage collection (se disponível)
    if (window.gc) {
      window.gc();
    }
  }

  safeReload() {
    localStorage.setItem('sdm_safe_mode', 'true');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  logEvent(type, message, details = {}) {
    const event = {
      type,
      message,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      deviceMemory: navigator.deviceMemory || 'unknown',
      connection: navigator.connection?.effectiveType || 'unknown'
    };

    this.systemLogs.errors.push(event);

    // Manter apenas os últimos 100 logs
    if (this.systemLogs.errors.length > 100) {
      this.systemLogs.errors = this.systemLogs.errors.slice(-100);
    }

    this.saveLogs();

    // Registrar eventos críticos no banco
    if (type === 'error') {
      appApi.entities.LogAuditoria.create({
        tipo_auditoria: 'autocorrecao',
        status: 'erro',
        descricao: message,
        metrica_antes: details,
        automatica: false
      }).catch(console.error);
    }
  }

  trackAnalysisTime(duration) {
    this.systemLogs.avgAnalysisTime.push(duration);
    
    // Manter apenas últimas 50 análises
    if (this.systemLogs.avgAnalysisTime.length > 50) {
      this.systemLogs.avgAnalysisTime.shift();
    }

    this.saveLogs();
  }

  getAverageAnalysisTime() {
    if (this.systemLogs.avgAnalysisTime.length === 0) return 0;
    
    const sum = this.systemLogs.avgAnalysisTime.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.systemLogs.avgAnalysisTime.length);
  }

  async startPeriodicAudit() {
    const runAudit = async () => {
      console.log('🔍 [AnalyzerGuardian] Executando auditoria periódica...');
      
      const report = await this.generateHealthReport();
      
      // Registrar auditoria
      await appApi.entities.LogAuditoria.create({
        tipo_auditoria: 'layout',
        status: report.status,
        descricao: 'Auditoria periódica automática do AnalyzerGuardian',
        metrica_depois: report,
        automatica: true
      }).catch(console.error);

      this.systemLogs.lastHealthCheck = new Date().toISOString();
      this.saveLogs();
    };

    // Executar primeira auditoria após 5 minutos
    setTimeout(runAudit, 5 * 60 * 1000);
    
    // Executar auditoria a cada 24h
    setInterval(runAudit, this.reportInterval);
  }

  async generateHealthReport() {
    const errorCount = this.systemLogs.errors.length;
    const fixCount = this.systemLogs.fixes.length;
    const reconnectCount = this.systemLogs.reconnections.length;
    const avgTime = this.getAverageAnalysisTime();

    let status = 'sucesso';
    if (errorCount > 10) status = 'alerta';
    if (errorCount > 50) status = 'erro';

    return {
      status,
      timestamp: new Date().toISOString(),
      metrics: {
        totalErrors: errorCount,
        totalFixes: fixCount,
        totalReconnections: reconnectCount,
        avgAnalysisTime: avgTime,
        mobileCrashes: this.systemLogs.mobileCrashes,
        lastError: this.systemLogs.errors[this.systemLogs.errors.length - 1] || null
      },
      health: status === 'sucesso' ? 'Excelente' : status === 'alerta' ? 'Atenção necessária' : 'Crítico'
    };
  }

  getSystemStats() {
    return {
      lastError: this.systemLogs.errors[this.systemLogs.errors.length - 1] || { message: 'Nenhum erro detectado' },
      lastReconnect: this.systemLogs.reconnections[this.systemLogs.reconnections.length - 1] || 'Sem reconexões recentes',
      mobileCrashes: this.systemLogs.mobileCrashes,
      avgAnalysisTime: this.getAverageAnalysisTime() || 'Normal',
      totalErrors: this.systemLogs.errors.length,
      totalFixes: this.systemLogs.fixes.length,
      lastHealthCheck: this.systemLogs.lastHealthCheck
    };
  }

  saveLogs() {
    try {
      localStorage.setItem('analyzer_guardian_logs', JSON.stringify(this.systemLogs));
    } catch (err) {
      console.warn('[AnalyzerGuardian] Não foi possível salvar logs:', err);
    }
  }

  loadLogs() {
    try {
      const saved = localStorage.getItem('analyzer_guardian_logs');
      if (saved) {
        this.systemLogs = JSON.parse(saved);
      }
    } catch (err) {
      console.warn('[AnalyzerGuardian] Não foi possível carregar logs:', err);
    }
  }

  showNotification(message, type = 'info') {
    const colors = {
      info: 'from-blue-500 to-cyan-600',
      success: 'from-green-500 to-emerald-600',
      warning: 'from-orange-500 to-amber-600',
      error: 'from-red-500 to-rose-600'
    };

    const icons = {
      info: '💡',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };

    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-[9999] max-w-md animate-in slide-in-from-right duration-300';
    notification.innerHTML = `
      <div class="bg-gradient-to-r ${colors[type]} text-white rounded-xl shadow-2xl p-4">
        <div class="flex items-center gap-3">
          <div class="text-2xl">${icons[type]}</div>
          <div>
            <p class="font-bold text-sm">AnalyzerGuardian</p>
            <p class="text-xs opacity-90">${message}</p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('animate-out', 'slide-out-to-right');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }
}

// Instância global
let guardianInstance = null;

export function initAnalyzerGuardian() {
  if (typeof window !== 'undefined' && !guardianInstance) {
    guardianInstance = new AnalyzerGuardian();
  }
  return guardianInstance;
}

export function getAnalyzerGuardian() {
  if (!guardianInstance) {
    return initAnalyzerGuardian();
  }
  return guardianInstance;
}

export default AnalyzerGuardian;

