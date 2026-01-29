import React from 'react';
import { AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorCount: 0,
      autoRecoveryAttempts: 0
    };
  }

  static getDerivedStateFromError(error) {
    console.error("🔴 [ErrorBoundary] Erro capturado:", error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🔴 [ErrorBoundary] Detalhes do erro:", {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Tentar registrar erro no sistema
    this.registerError(error, errorInfo);

    // Auto-recuperação inteligente
    if (this.state.autoRecoveryAttempts < 2) {
      console.log('🔄 [ErrorBoundary] Tentando recuperação automática...');
      setTimeout(() => {
        this.setState(prevState => ({
          hasError: false,
          error: null,
          errorInfo: null,
          autoRecoveryAttempts: prevState.autoRecoveryAttempts + 1
        }));
      }, 2000);
    } else if (this.state.errorCount >= 3) {
      console.log("🔄 [ErrorBoundary] Múltiplos erros detectados, limpando cache...");
      setTimeout(() => {
        this.handleClearCache();
      }, 3000);
    }
  }

  async registerError(error, errorInfo) {
    try {
      if (window.appApi) {
        await window.appApi.entities.LogAuditoria.create({
          tipo_auditoria: 'erro',
          status: 'erro',
          descricao: `Erro crítico de renderização: ${error.toString()}`,
          metrica_antes: {
            error: error.toString(),
            stack: errorInfo.componentStack,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          },
          automatica: false
        });
        console.log('✅ [ErrorBoundary] Erro registrado no sistema');
      }
    } catch (e) {
      console.error("❌ [ErrorBoundary] Erro ao registrar log:", e);
    }
  }

  handleReset = () => {
    console.log("🔄 [ErrorBoundary] Resetando estado...");
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      autoRecoveryAttempts: 0
    });
  };

  handleReload = () => {
    console.log("🔄 [ErrorBoundary] Recarregando página...");
    window.location.reload();
  };

  handleClearCache = () => {
    console.log("🗑️ [ErrorBoundary] Limpando cache completo...");
    
    // Salvar apenas preferências essenciais
    const userPrefs = localStorage.getItem('sdm_user_preferences');
    const performanceMode = localStorage.getItem('sdm_performance_mode');
    
    localStorage.clear();
    sessionStorage.clear();
    
    // Restaurar preferências
    if (userPrefs) localStorage.setItem('sdm_user_preferences', userPrefs);
    if (performanceMode) localStorage.setItem('sdm_performance_mode', performanceMode);
    
    // Recarregar
    window.location.reload();
  };

  render() {
    if (this.state.hasError && this.state.autoRecoveryAttempts >= 2) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full shadow-2xl border-red-300 animate-in fade-in duration-500">
            <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-2xl font-black">Ops! Algo inesperado aconteceu</p>
                  <p className="text-sm font-normal text-white/90 mt-1">
                    SDM Analyzer IA — Sistema de Recuperação Automática
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-5">
                <p className="text-red-800 font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="text-2xl">😔</span>
                  Detectamos um erro no sistema
                </p>
                <p className="text-red-700 leading-relaxed">
                  Nosso sistema de inteligência tentou recuperar automaticamente, mas precisa da sua ajuda para continuar.
                </p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                <p className="text-blue-800 font-bold mb-2 flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  Soluções Recomendadas
                </p>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    <span>Tente recarregar a página (geralmente resolve)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    <span>Se persistir, limpe o cache do sistema</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    <span>Entre em contato com o suporte se o problema continuar</span>
                  </li>
                </ul>
              </div>

              {this.state.error && (
                <details className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <summary className="cursor-pointer font-bold text-gray-700 mb-2 flex items-center gap-2 hover:text-gray-900">
                    <span className="text-lg">🔍</span>
                    Detalhes técnicos (para desenvolvedores)
                  </summary>
                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Erro:</p>
                      <pre className="whitespace-pre-wrap text-gray-700 bg-white p-3 rounded-lg text-xs overflow-auto max-h-32 border">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Stack Trace:</p>
                        <pre className="whitespace-pre-wrap text-gray-600 bg-white p-3 rounded-lg text-[10px] overflow-auto max-h-40 border">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-800">
                        <strong>Tentativas de recuperação:</strong> {this.state.autoRecoveryAttempts} de 2
                      </p>
                      <p className="text-xs text-yellow-800 mt-1">
                        <strong>Erros consecutivos:</strong> {this.state.errorCount}
                      </p>
                    </div>
                  </div>
                </details>
              )}

              <div className="flex flex-col gap-3">
                <Button
                  onClick={this.handleReload}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg py-6 shadow-lg"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Recarregar Página
                </Button>

                <Button
                  onClick={this.handleClearCache}
                  variant="outline"
                  className="w-full text-orange-600 border-2 border-orange-300 hover:bg-orange-50 font-semibold py-5"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Cache do Sistema
                </Button>

                <Button
                  onClick={this.handleReset}
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-gray-900 font-semibold"
                >
                  Tentar Novamente Sem Recarregar
                </Button>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-xs text-gray-500">
                  🤖 SDM Analyzer IA — Inteligência Evolutiva v2.0
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Sistema com autocorreção e aprendizado contínuo
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

