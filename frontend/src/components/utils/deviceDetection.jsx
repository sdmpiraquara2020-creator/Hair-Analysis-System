
// Sistema de Detecção de Dispositivo e Modo Leve Inteligente - Analyzer SDM IA
import { useState, useEffect } from 'react';

export function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLowEnd: false,
    shouldUseLiteMode: false,
    forcedMode: null,
    deviceMemory: null,
    connectionType: 'unknown',
    browser: 'unknown',
    os: 'unknown',
    cores: 0,
    isSupported: true,
    warnings: []
  });

  useEffect(() => {
    const detectDevice = () => {
      const ua = navigator.userAgent.toLowerCase();
      const width = window.innerWidth;
      
      // Detectar tipo de dispositivo
      const isMobile = /iphone|android|webos|blackberry|iemobile|opera mini/i.test(ua) || width < 768;
      const isTablet = /ipad|android/i.test(ua) && width >= 768 && width < 1024;
      const isDesktop = !isMobile && !isTablet;
      
      // Detectar navegador
      let browser = 'unknown';
      if (ua.includes('firefox')) browser = 'Firefox';
      else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
      else if (ua.includes('chrome')) browser = 'Chrome';
      else if (ua.includes('edge')) browser = 'Edge';
      
      // Detectar OS
      let os = 'unknown';
      if (ua.includes('android')) os = 'Android';
      else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
      else if (ua.includes('windows')) os = 'Windows';
      else if (ua.includes('mac')) os = 'MacOS';
      else if (ua.includes('linux')) os = 'Linux';
      
      // Detectar hardware
      const deviceMemory = navigator.deviceMemory || 2; // GB
      const hardwareConcurrency = navigator.hardwareConcurrency || 2;
      const isLowEnd = deviceMemory < 3 || hardwareConcurrency < 4;
      
      // Detectar conexão
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const connectionType = connection?.effectiveType || 'unknown';
      const isSlowConnection = ['slow-2g', '2g', '3g'].includes(connectionType);
      
      // Verificar suporte
      const warnings = [];
      let isSupported = true;
      
      if (deviceMemory < 2) {
        warnings.push('⚠️ Memória RAM baixa detectada (< 2GB)');
        isSupported = false;
      }
      
      if (isSlowConnection) {
        warnings.push('⚠️ Conexão lenta detectada');
      }
      
      if (browser === 'unknown') {
        warnings.push('⚠️ Navegador não reconhecido');
      }
      
      if (isMobile && deviceMemory < 3) {
        warnings.push('📱 Dispositivo móvel com recursos limitados');
      }
      
      // Verificar modo forçado
      const savedMode = localStorage.getItem('sdm_performance_mode');
      
      // Decidir modo
      const shouldUseLiteMode = savedMode === 'lite' || 
                               (savedMode !== 'full' && (isLowEnd || isSlowConnection || !isSupported));
      
      const info = {
        isMobile,
        isTablet,
        isDesktop,
        isLowEnd,
        shouldUseLiteMode,
        forcedMode: savedMode,
        deviceMemory,
        connectionType,
        browser,
        os,
        cores: hardwareConcurrency,
        isSupported,
        warnings
      };

      setDeviceInfo(info);

      // Aplicar otimizações CSS
      if (shouldUseLiteMode) {
        document.body.classList.add('lite-mode');
        console.log('🔋 [DeviceDetection] Modo Leve ativado automaticamente');
      } else {
        document.body.classList.remove('lite-mode');
      }

      // Mostrar notificação se necessário
      if (warnings.length > 0 && shouldUseLiteMode) {
        showDeviceWarning(info);
      }

      // Registrar detecção
      console.log('📱 [DeviceDetection] Informações do dispositivo:', info);
    };

    detectDevice();
    
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  const setPerformanceMode = (mode) => {
    localStorage.setItem('sdm_performance_mode', mode);
    window.location.reload();
  };

  return { ...deviceInfo, setPerformanceMode };
}

function showDeviceWarning(info) {
  // Evitar múltiplas notificações
  if (sessionStorage.getItem('device_warning_shown')) return;
  sessionStorage.setItem('device_warning_shown', 'true');

  const notification = document.createElement('div');
  notification.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-full px-4 animate-in slide-in-from-top duration-300';
  notification.innerHTML = `
    <div class="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl shadow-2xl p-6">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="font-black text-lg mb-2">⚡ Modo Leve Ativado</h3>
          <p class="text-sm opacity-95 mb-3">
            Seu dispositivo pode não suportar o modo completo. O sistema ativou automaticamente otimizações para melhor desempenho.
          </p>
          <div class="bg-white/10 rounded-lg p-3 text-xs space-y-1">
            ${ensureArray(info.warnings).map(w => `<div>${w}</div>`).join('')}
          </div>
          <p class="text-xs opacity-80 mt-3">
            📊 Memória: ${info.deviceMemory}GB | Núcleos: ${info.cores} | ${info.browser} (${info.os})
          </p>
        </div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="absolute top-3 right-3 text-white/70 hover:text-white">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('animate-out', 'slide-out-to-top');
    setTimeout(() => notification.remove(), 300);
  }, 8000);
}

// Compressão inteligente de imagem baseada no dispositivo
export async function compressImage(file, maxDimension = null, quality = null) {
  return new Promise((resolve, reject) => {
    try {
      if (!(file instanceof File)) {
        reject(new Error('Invalid file provided. Expected a File object.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Auto-detectar dispositivo se não especificado
          const isMobileUA = /iphone|android|webos|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
          const deviceMemory = navigator.deviceMemory || 2; // Default to 2GB if not available
          
          // Determine maxDimension if not explicitly provided
          if (maxDimension === null) {
            if (deviceMemory < 3 || isMobileUA) {
              maxDimension = 800;
            } else if (deviceMemory < 4) {
              maxDimension = 1200;
            } else {
              maxDimension = 1920;
            }
          }

          // Determine quality if not explicitly provided
          if (quality === null) {
            if (deviceMemory < 3 || isMobileUA) {
              quality = 0.75;
            } else if (deviceMemory < 4) {
              quality = 0.85;
            } else {
              quality = 0.9;
            }
          }

          console.log(`🖼️ [CompressImage] Config: ${maxDimension}px @ ${Math.round(quality * 100)}% (Memory: ${deviceMemory}GB, Mobile: ${isMobileUA ? 'Yes' : 'No'})`);

          // Calcular novas dimensões mantendo proporção, garantindo que não upsizes
          const scale = Math.min(maxDimension / width, maxDimension / height, 1);
          canvas.width = Math.floor(width * scale);
          canvas.height = Math.floor(height * scale);

          const ctx = canvas.getContext('2d');
          // Set background to white for transparency issues if original image has alpha channel
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image: Canvas toBlob returned null.'));
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg', // Force JPEG as per original
              lastModified: Date.now()
            });
            
            const originalSize = (file.size / 1024 / 1024).toFixed(2);
            const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
            const reduction = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
            
            console.log(`✅ [CompressImage] Original: ${originalSize}MB, Compressed: ${compressedSize}MB (${reduction}% reduction)`);
            
            resolve(compressedFile);
          }, 'image/jpeg', quality);
        };

        img.onerror = () => {
          reject(new Error('Failed to load image from FileReader result. Invalid image data?'));
        };

        img.src = e.target.result;
      };

      reader.onerror = (error) => {
        reject(new Error(`Failed to read file: ${error.target.error ? error.target.error.message : 'Unknown error'}`));
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('❌ [CompressImage] Unexpected error during compression setup:', error);
      reject(new Error(`An unexpected error occurred during image compression: ${error.message}`));
    }
  });
}

// Modelo de IA baseado no dispositivo
export function getOptimalAIModel(deviceInfo) {
  if (!deviceInfo) {
    console.log('⚡ [AIModel] No deviceInfo provided, defaulting to gpt-4o.');
    return 'gpt-4o'; // Default to full model if no info to determine limitations
  }
  
  const deviceMemory = deviceInfo.deviceMemory || 2;
  const cores = deviceInfo.cores || 2;
  const isMobile = deviceInfo.isMobile;
  const connectionType = deviceInfo.connectionType || 'unknown';
  const isSlowConnection = ['slow-2g', '2g', '3g'].includes(connectionType);

  // Consider "lite" if explicit lite mode is on, or if device resources are limited, or connection is slow.
  if (deviceInfo.shouldUseLiteMode || deviceMemory < 4 || cores < 4 || isMobile || isSlowConnection) {
    console.log('🔋 [AIModel] Usando modelo leve: gpt-4o-mini (Recursos limitados ou modo leve ativado)');
    return 'gpt-4o-mini';
  }
  
  console.log('⚡ [AIModel] Usando modelo completo: gpt-4o (Recursos suficientes)');
  return 'gpt-4o';
}

// Verificar suporte do navegador
export function checkBrowserSupport() {
  const checks = {
    canvas: !!document.createElement('canvas').getContext,
    localStorage: (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    })(),
    fileReader: !!window.FileReader,
    promises: !!window.Promise,
    fetch: !!window.fetch
  };

  const unsupported = Object.entries(checks)
    .filter(([_, supported]) => !supported)
    ensureArray(Object.entries(features || {})).map(([feature]) => feature);

  if (unsupported.length > 0) {
    console.error('❌ [BrowserSupport] Recursos não suportados:', unsupported);
    return { supported: false, missing: unsupported };
  }

  console.log('✅ [BrowserSupport] Navegador totalmente suportado');
  return { supported: true, missing: [] };
}

// Verificação de compatibilidade automática
export function checkDeviceCompatibility() {
  const ua = navigator.userAgent.toLowerCase();
  const memory = navigator.deviceMemory || 2;
  const cores = navigator.hardwareConcurrency || 2;
  // Use the same robust check for mobile as in useDeviceDetection
  const isMobile = /iphone|android|webos|blackberry|iemobile|opera mini/i.test(ua);
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const connectionType = connection?.effectiveType || 'unknown';
  
  const issues = [];
  const warnings = [];
  
  // Verificar memória
  if (memory < 2) {
    issues.push({
      type: 'critical',
      message: '⚠️ Memória RAM muito baixa (< 2GB)',
      solution: 'Modo leve será ativado automaticamente'
    });
  } else if (memory < 3) { // 2GB to 3GB
    warnings.push({
      type: 'warning',
      message: '💡 Memória RAM limitada (< 3GB)',
      solution: 'Recomendamos ativar o modo leve para melhor desempenho'
    });
  }
  
  // Verificar cores
  if (cores < 2) {
    issues.push({
      type: 'critical',
      message: '⚠️ Processador muito lento (< 2 núcleos)',
      solution: 'Modo leve será ativado automaticamente'
    });
  } else if (cores < 4) { // 2 to 3 cores
    warnings.push({
      type: 'warning',
      message: '💡 Processador moderado (< 4 núcleos)',
      solution: 'O desempenho pode ser limitado em tarefas complexas. Considere o modo leve.'
    });
  }
  
  // Verificar conexão
  if (['slow-2g', '2g'].includes(connectionType)) {
    issues.push({
      type: 'critical',
      message: '⚠️ Conexão muito lenta detectada',
      solution: 'Compressão máxima de imagens será aplicada e algumas funcionalidades podem ser restritas'
    });
  } else if (connectionType === '3g') {
    warnings.push({
      type: 'warning',
      message: '💡 Conexão moderada (3G)',
      solution: 'Imagens serão comprimidas automaticamente para otimizar o carregamento'
    });
  }
  
  // Verificar mobile (additional specific checks)
  if (isMobile) {
    if (memory < 4 || cores < 4 || ['slow-2g', '2g', '3g'].includes(connectionType)) {
      warnings.push({
        type: 'info',
        message: '📱 Dispositivo móvel detectado com recursos limitados',
        solution: 'Otimizações automáticas para dispositivos móveis serão aplicadas para melhor experiência'
      });
    } else {
      warnings.push({
        type: 'info',
        message: '📱 Dispositivo móvel detectado',
        solution: 'Otimizações automáticas para dispositivos móveis aplicadas'
      });
    }
  }

  // A device is considered to need lite mode if there are critical issues,
  // or if it's mobile with very limited resources, or a combination of warnings.
  const shouldUseLiteMode = issues.length > 0 || 
                          (isMobile && memory < 3) || 
                          (isMobile && cores < 4 && connectionType !== '4g') || // Mobile with moderate CPU and not excellent connection
                          (['slow-2g', '2g', '3g'].includes(connectionType)) || // Any slow connection
                          (memory < 3 && cores < 4); // General low-end combo

  return {
    compatible: issues.length === 0, // Considered compatible if no critical issues
    shouldUseLiteMode,
    issues,
    warnings,
    deviceInfo: {
      memory,
      cores,
      isMobile,
      connectionType
    }
  };
}


