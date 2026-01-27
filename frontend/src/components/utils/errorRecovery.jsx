// Sistema de Recuperação de Erros e Tela Branca - Analyzer SDM IA
import { appApi } from "@/api/appClient";

class ErrorRecovery {
  constructor() {
    this.errorCount = 0;
    this.maxRetries = 3;
    this.recoveryAttempts = 0;
    this.lastError = null;
    this.errorHistory = [];
    this.isRecovering = false;
    
    this.init();
  }

  init() {
    // Capturar erros globais
    window.addEventListener('error', (e) => this.handleError(e));
    window.addEventListener('unhandledrejection', (e) => this.handlePromiseRejection(e));
    
    // Monitorar renderização
    this.monitorRendering();
    
    console.log('🛡️ [ErrorRecovery] Sistema de recuperação inicializado');
  }

  handleError(event) {
    this.errorCount++;
    this.lastError = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: Date.now()
    };
    
    this.errorHistory.push(this.lastError);
    
    console.error('🔴 [ErrorRecovery] Erro capturado:', this.lastError);
    
    // Registrar no sistema
    this.logError(this.lastError);
    
    // Tentar recuperação se necessário
    if (this.errorCount >= 2 && !this.isRecovering) {
      this.attemptRecovery();
    }
  }

  handlePromiseRejection(event) {
    console.error('🔴 [ErrorRecovery] Promise rejeitada:', event.reason);
    
    const error = {
      message: event.reason?.message || String(event.reason),
      type: 'promise_rejection',
      timestamp: Date.now()
    };
    
    this.errorHistory.push(error);
    this.logError(error);
    
    // Tentar recuperação
    if (!this.isRecovering) {
      this.attemptRecovery();
    }
  }

  monitorRendering() {
    // Verificar se a página renderizou corretamente
    const checkRender = setInterval(() => {
      const main = document.querySelector('main');
      const content = document.querySelector('[data-page]');
      
      if (!main || !content) {
        console.warn('⚠️ [ErrorRecovery] Conteúdo não renderizado detectado');
        this.handleRenderFailure();
      }
    }, 5000);

    // Limpar após 30 segundos (página deve ter carregado)
    setTimeout(() => clearInterval(checkRender), 30000);
  }

  handleRenderFailure() {
    if (this.isRecovering) return;
    
    console.error('🔴 [ErrorRecovery] Falha de renderização detectada');
    
    this.logError({
      message: 'Render failure detected',
      type: 'render_failure',
      timestamp: Date.now()
    });
    
    this.attemptRecovery();
  }

  async attemptRecovery() {
    if (this.recoveryAttempts >= this.maxRetries) {
      console.error('❌ [ErrorRecovery] Máximo de tentativas atingido');
      this.showFatalError();
      return;
    }

    this.isRecovering = true;
    this.recoveryAttempts++;
    
    console.log(`🔄 [ErrorRecovery] Tentando recuperação (${this.recoveryAttempts}/${this.maxRetries})...`);
    
    // Mostrar notificação ao usuário
    this.showRecoveryNotification();
    
    // Limpar cache e estado
    try {
      // Limpar sessionStorage (mas não localStorage com preferências)
      sessionStorage.clear();
      
      // Invalidar queries do React Query
      if (window.queryClient) {
        window.queryClient.clear();
      }
      
      // Aguardar um pouco
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Recarregar página
      window.location.reload();
      
    } catch (error) {
      console.error('❌ [ErrorRecovery] Erro na recuperação:', error);
      this.isRecovering = false;
    }
  }

  showRecoveryNotification() {
    const notification = document.createElement('div');
    notification.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]';
    notification.innerHTML = `
      <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
        <div class="w-20 h-20 mx-auto mb-6 relative">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-spin" style="animation-duration: 2s;"></div>
          <div class="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
        </div>
        <h2 class="text-2xl font-black text-gray-900 mb-3">🔄 Recuperando Sistema</h2>
        <p class="text-gray-600 mb-4">
          Detectamos um problema e estamos reprocessando em modo seguro...
        </p>
        <div class="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
          <p class="text-sm text-blue-800 font-semibold">
            Tentativa ${this.recoveryAttempts} de ${this.maxRetries}
          </p>
        </div>
        <p class="text-xs text-gray-500 mt-4 italic">
          Aguarde alguns segundos...
        </p>
      </div>
    `;
    
    document.body.appendChild(notification);
  }

  showFatalError() {
    const notification = document.createElement('div');
    notification.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4';
    notification.innerHTML = `
      <div class="bg-white rounded-2xl p-8 max-w-lg text-center shadow-2xl">
        <div class="text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-black text-gray-900 mb-3">Erro Crítico</h2>
        <p class="text-gray-600 mb-6">
          Não foi possível recuperar o sistema automaticamente. Por favor, tente as seguintes ações:
        </p>
        <div class="bg-gray-50 rounded-lg p-6 text-left space-y-3 mb-6">
          <div class="flex items-start gap-3">
            <div class="text-2xl">1️⃣</div>
            <div>
              <p class="font-bold text-gray-900">Limpar Cache</p>
              <p class="text-sm text-gray-600">Ctrl+Shift+Del (Windows) ou Cmd+Shift+Del (Mac)</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="text-2xl">2️⃣</div>
            <div>
              <p class="font-bold text-gray-900">Tentar Outro Navegador</p>
              <p class="text-sm text-gray-600">Chrome, Firefox ou Edge</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="text-2xl">3️⃣</div>
            <div>
              <p class="font-bold text-gray-900">Verificar Conexão</p>
              <p class="text-sm text-gray-600">Conexão estável com internet é necessária</p>
            </div>
          </div>
        </div>
        <div class="flex gap-3 justify-center">
          <button onclick="localStorage.clear(); window.location.reload();" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
            🔄 Limpar Tudo e Recarregar
          </button>
          <button onclick="window.location.href='/';" class="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-all">
            🏠 Ir para Início
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-6">
          Código do Erro: ${this.lastError?.message || 'UNKNOWN'}
        </p>
      </div>
    `;
    
    document.body.appendChild(notification);
  }

  async logError(error) {
    try {
      await appApi.entities.LogAuditoria.create({
        tipo_auditoria: 'autocorrecao',
        status: 'erro',
        descricao: `Erro capturado: ${error.message}`,
        metrica_antes: {
          error,
          errorCount: this.errorCount,
          recoveryAttempts: this.recoveryAttempts,
          timestamp: error.timestamp,
          userAgent: navigator.userAgent,
          url: window.location.href
        },
        automatica: true
      });
    } catch (logError) {
      console.error('❌ [ErrorRecovery] Erro ao registrar log:', logError);
    }
  }

  reset() {
    this.errorCount = 0;
    this.recoveryAttempts = 0;
    this.isRecovering = false;
    this.errorHistory = [];
    console.log('✅ [ErrorRecovery] Sistema resetado');
  }
}

// Instância global
export const errorRecovery = new ErrorRecovery();

// Hook para componentes React
export function useErrorRecovery() {
  return {
    errorCount: errorRecovery.errorCount,
    recoveryAttempts: errorRecovery.recoveryAttempts,
    lastError: errorRecovery.lastError,
    reset: () => errorRecovery.reset()
  };
}

// Wrapper seguro para operações assíncronas
export async function safeAsync(operation, fallback = null, context = 'unknown') {
  try {
    console.log(`🔒 [SafeAsync] Iniciando operação: ${context}`);
    const result = await operation();
    console.log(`✅ [SafeAsync] Operação concluída: ${context}`);
    return result;
  } catch (error) {
    console.error(`❌ [SafeAsync] Erro em ${context}:`, error);
    
    // Registrar erro
    await appApi.entities.LogAuditoria.create({
      tipo_auditoria: 'autocorrecao',
      status: 'erro',
      descricao: `Erro em operação assíncrona: ${context}`,
      metrica_antes: {
        context,
        error: error.toString(),
        stack: error.stack
      },
      automatica: true
    }).catch(console.error);
    
    return fallback;
  }
}

