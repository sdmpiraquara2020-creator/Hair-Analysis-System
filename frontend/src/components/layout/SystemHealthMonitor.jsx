import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { getBehaviorLearning } from '../utils/behaviorLearning';

export default function SystemHealthMonitor() {
  const [stats, setStats] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [healthStatus, setHealthStatus] = useState('good');

  useEffect(() => {
    const updateStats = () => {
      const learning = getBehaviorLearning();
      if (learning) {
        const newStats = learning.getStatistics();
        setStats(newStats);

        // Avaliar saúde do sistema
        if (newStats.avgResponseTime > 3000 || newStats.totalErrors > 10) {
          setHealthStatus('warning');
        } else if (newStats.avgResponseTime > 5000 || newStats.totalErrors > 20) {
          setHealthStatus('critical');
        } else {
          setHealthStatus('good');
        }
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 30000); // Atualizar a cada 30s

    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  const statusConfig = {
    good: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-300',
      text: 'Sistema Saudável'
    },
    warning: {
      icon: AlertCircle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'Atenção Necessária'
    },
    critical: {
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'Intervenção Necessária'
    }
  };

  const status = statusConfig[healthStatus];
  const Icon = status.icon;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className={`glass-effect ${status.border} border-2 shadow-2xl max-w-sm`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${status.bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${status.color}`} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">SDM Health Monitor</p>
                <p className={`text-xs font-semibold ${status.color}`}>{status.text}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDetails(!showDetails)}
              className="h-8 w-8 p-0"
            >
              <Activity className="w-4 h-4" />
            </Button>
          </div>

          {showDetails && (
            <div className="space-y-2 pt-3 border-t">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white rounded-lg p-2 border">
                  <p className="text-gray-500 font-semibold">Tempo Médio</p>
                  <p className="text-gray-900 font-bold">{Math.round(stats.avgResponseTime)}ms</p>
                </div>
                <div className="bg-white rounded-lg p-2 border">
                  <p className="text-gray-500 font-semibold">Erros</p>
                  <p className="text-gray-900 font-bold">{stats.totalErrors}</p>
                </div>
                <div className="bg-white rounded-lg p-2 border">
                  <p className="text-gray-500 font-semibold">Modo</p>
                  <p className="text-gray-900 font-bold">{stats.currentMode}</p>
                </div>
                <div className="bg-white rounded-lg p-2 border">
                  <p className="text-gray-500 font-semibold">Otimizações</p>
                  <p className="text-gray-900 font-bold">{stats.optimizations}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-2 border border-purple-200">
                <p className="text-xs text-purple-800 font-semibold">
                  💡 Última otimização: {stats.lastOptimization}
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const learning = getBehaviorLearning();
                  if (learning) learning.forceOptimization();
                }}
                className="w-full text-xs"
              >
                <Zap className="w-3 h-3 mr-2" />
                Forçar Otimização
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

