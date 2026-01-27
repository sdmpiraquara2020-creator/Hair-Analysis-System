// Cache Manager - Sistema Automático de Limpeza de Cache
// Analyzer SDM IA — Diagnóstico Inteligente

class CacheManager {
  constructor() {
    this.cacheVersion = '1.0.0'; // Incrementar para forçar limpeza
    this.cacheKey = 'sdm_cache_version';
    this.lastCleanup = null;
    
    console.log('🗑️ [CacheManager] Inicializado');
    this.init();
  }

  /**
   * Inicializa o gerenciador de cache
   */
  init() {
    // Verificar se precisa limpar cache
    const savedVersion = localStorage.getItem(this.cacheKey);
    
    if (savedVersion !== this.cacheVersion) {
      console.log('🔄 [CacheManager] Nova versão detectada, limpando cache...');
      this.clearAllCache();
      localStorage.setItem(this.cacheKey, this.cacheVersion);
    }

    // Agendar limpeza automática diária
    this.scheduleDailyCleanup();

    // Limpar cache antigo ao iniciar
    this.cleanOldCache();
  }

  /**
   * Limpa todo o cache do sistema
   */
  clearAllCache() {
    console.log('🗑️ [CacheManager] Limpando todo o cache...');
    
    try {
      // Limpar localStorage (exceto configurações essenciais)
      const essentialKeys = [this.cacheKey, 'sdm_performance_mode'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!essentialKeys.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      // Limpar sessionStorage
      sessionStorage.clear();

      // Limpar cache do service worker (se existir)
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }

      // Limpar cache do navegador (forçar reload sem cache)
      if (window.location && !window.location.href.includes('no-cache')) {
        window.location.href = window.location.href + (window.location.href.includes('?') ? '&' : '?') + 'no-cache=' + Date.now();
      }

      this.lastCleanup = new Date().toISOString();
      console.log('✅ [CacheManager] Cache limpo com sucesso');
      
      return true;
    } catch (error) {
      console.error('❌ [CacheManager] Erro ao limpar cache:', error);
      return false;
    }
  }

  /**
   * Limpa cache antigo (>7 dias)
   */
  cleanOldCache() {
    try {
      const now = Date.now();
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

      Object.keys(localStorage).forEach(key => {
        try {
          const item = localStorage.getItem(key);
          
          // Tentar parsear como JSON
          let data;
          try {
            data = JSON.parse(item);
          } catch {
            return; // Não é JSON, ignorar
          }

          // Verificar se tem timestamp
          if (data && data.timestamp) {
            if (data.timestamp < sevenDaysAgo) {
              localStorage.removeItem(key);
              console.log(`🗑️ [CacheManager] Cache antigo removido: ${key}`);
            }
          }
        } catch (error) {
          // Ignorar erros individuais
        }
      });

      console.log('✅ [CacheManager] Limpeza de cache antigo concluída');
    } catch (error) {
      console.error('❌ [CacheManager] Erro na limpeza de cache antigo:', error);
    }
  }

  /**
   * Agenda limpeza diária automática
   */
  scheduleDailyCleanup() {
    // Calcular milissegundos até às 03:00
    const now = new Date();
    const next3AM = new Date();
    next3AM.setHours(3, 0, 0, 0);
    
    if (next3AM <= now) {
      next3AM.setDate(next3AM.getDate() + 1);
    }
    
    const msUntil3AM = next3AM - now;

    console.log(`⏰ [CacheManager] Próxima limpeza automática em ${Math.round(msUntil3AM / 1000 / 60 / 60)}h`);

    setTimeout(() => {
      console.log('🔄 [CacheManager] Executando limpeza automática diária...');
      this.cleanOldCache();
      
      // Reagendar para próximo dia
      this.scheduleDailyCleanup();
    }, msUntil3AM);
  }

  /**
   * Força limpeza de cache imediata
   */
  forceCleanup() {
    console.log('🔴 [CacheManager] Limpeza forçada iniciada...');
    
    const success = this.clearAllCache();
    
    if (success) {
      // Mostrar notificação
      this.showNotification('Cache limpo com sucesso! Recarregando...', 'success');
      
      // Recarregar página após 2 segundos
      setTimeout(() => {
        window.location.reload(true);
      }, 2000);
    } else {
      this.showNotification('Erro ao limpar cache. Tente novamente.', 'error');
    }
    
    return success;
  }

  /**
   * Obtém tamanho atual do cache
   */
  getCacheSize() {
    let totalSize = 0;
    
    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }
      
      for (let key in sessionStorage) {
        if (sessionStorage.hasOwnProperty(key)) {
          totalSize += sessionStorage[key].length + key.length;
        }
      }
      
      // Retornar em KB
      return (totalSize / 1024).toFixed(2);
    } catch (error) {
      console.error('❌ [CacheManager] Erro ao calcular tamanho:', error);
      return 0;
    }
  }

  /**
   * Mostra notificação
   */
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
            <p class="font-bold text-sm">Cache Manager</p>
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

  /**
   * Retorna estatísticas do cache
   */
  getStats() {
    return {
      version: this.cacheVersion,
      lastCleanup: this.lastCleanup,
      cacheSize: this.getCacheSize() + ' KB',
      itemCount: Object.keys(localStorage).length + Object.keys(sessionStorage).length
    };
  }
}

// Instância global
let cacheManagerInstance = null;

export function initCacheManager() {
  if (typeof window !== 'undefined' && !cacheManagerInstance) {
    cacheManagerInstance = new CacheManager();
  }
  return cacheManagerInstance;
}

export function getCacheManager() {
  if (!cacheManagerInstance) {
    return initCacheManager();
  }
  return cacheManagerInstance;
}

export function forceCleanCache() {
  const manager = getCacheManager();
  return manager.forceCleanup();
}

export default CacheManager;

