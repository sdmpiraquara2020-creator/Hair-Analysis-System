
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Edit, Save, Calendar as CalendarIcon, TrendingUp, AlertTriangle, History } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { appApi } from "@/api/appClient";
import { useQuery } from "@tanstack/react-query";

export default function OrcamentoEditavel({ analise, onSave, initialOrcamento }) {
  const [editando, setEditando] = useState(false);
  const [orcamento, setOrcamento] = useState(null);
  const [showHistorico, setShowHistorico] = useState(false);
  const [validadeOrcamento, setValidadeOrcamento] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => appApi.auth.me(),
  });

  const { data: servicos = [] } = useQuery({
    queryKey: ['servicos'],
    queryFn: () => appApi.entities.Servico.list(),
  });

  const { data: historico = [] } = useQuery({
    queryKey: ['historico-orcamento', analise?.id],
    queryFn: async () => {
      if (!analise?.id) return [];
      const logs = await appApi.entities.LogAuditoria.list('-created_date', 50);
      return logs.filter(log =>
        log.tipo_auditoria === 'orcamento' &&
        log.metrica_depois?.analise_id === analise.id
      );
    },
    enabled: !!analise?.id
  });

  useEffect(() => {
    if (analise?.orcamento_editavel) {
      setOrcamento(analise.orcamento_editavel);
      setValidadeOrcamento(analise.orcamento_editavel.validade ? new Date(analise.orcamento_editavel.validade) : null);
    } else if (initialOrcamento && initialOrcamento.length > 0) {
      // Se há orçamento manual já existente, não inicializar automático
      setOrcamento(null);
    } else if (servicos && servicos.length > 0) {
      // Inicializar com sugestão da IA
      inicializarOrcamento();
    }
  }, [analise, servicos, initialOrcamento]);

  const inicializarOrcamento = () => {
    if (!servicos || servicos.length === 0) {
      console.warn('⚠️ [OrcamentoEditavel] Serviços não carregados ainda');
      return;
    }

    if (!analise) {
      console.warn('⚠️ [OrcamentoEditavel] Análise não disponível');
      return;
    }

    const servicoPrincipal = servicos.find(s =>
      s.nome === analise.recomendacao_alisamento ||
      s.nome === analise.recomendacao_tratamento
    );

    if (!servicoPrincipal) {
      console.warn('⚠️ [OrcamentoEditavel] Serviço principal não encontrado');
      return;
    }

    const valorBase = parseFloat(servicoPrincipal.valor) || 0;

    // Calcular acréscimo baseado na análise
    let percentualAcrescimo = 0;
    let justificativas = [];

    if (analise.volume_capilar === 'alto') {
      percentualAcrescimo += 15;
      justificativas.push('Volume alto (+15%)');
    } else if (analise.volume_capilar === 'médio') {
      percentualAcrescimo += 8;
      justificativas.push('Volume médio (+8%)');
    }

    if (analise.estrutura_fio === 'grossa') {
      percentualAcrescimo += 10;
      justificativas.push('Fio grosso (+10%)');
    }

    if (analise.nivel_dano === 'severo') {
      percentualAcrescimo += 20;
      justificativas.push('Dano severo (+20%)');
    } else if (analise.nivel_dano === 'moderado') {
      percentualAcrescimo += 12;
      justificativas.push('Dano moderado (+12%)');
    } else if (analise.nivel_dano === 'leve') {
      percentualAcrescimo += 5;
      justificativas.push('Dano leve (+5%)');
    }

    const valorAcrescimo = (valorBase * percentualAcrescimo) / 100;
    const valorFinal = Math.round(valorBase + valorAcrescimo);

    setOrcamento({
      servico_principal: servicoPrincipal.nome,
      valor_base: valorBase,
      percentual_acrescimo: percentualAcrescimo,
      valor_acrescimo: valorAcrescimo,
      valor_final: valorFinal,
      justificativas,
      custo_produto: servicoPrincipal.custo_produto || 0,
      validade: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
      observacoes: ''
    });

    setValidadeOrcamento(addDays(new Date(), 15));
  };

  const calcularMargem = () => {
    if (!orcamento) return { margem: 0, percentual: 0, adequada: false };

    const custoTotal = orcamento.custo_produto || 0;
    const lucro = orcamento.valor_final - custoTotal;
    const percentual = custoTotal > 0 ? (lucro / custoTotal) * 100 : 100;
    const adequada = percentual >= 30; // Margem mínima de 30%

    return { margem: lucro, percentual, adequada };
  };

  const handleSalvar = async () => {
    if (!orcamento) return;

    const orcamentoFinal = {
      ...orcamento,
      validade: validadeOrcamento ? format(validadeOrcamento, 'yyyy-MM-dd') : orcamento.validade,
      atualizado_em: new Date().toISOString(),
      atualizado_por: user?.email || 'Desconhecido'
    };

    // Registrar no histórico
    await appApi.entities.LogAuditoria.create({
      tipo_auditoria: 'orcamento',
      status: 'sucesso',
      descricao: `Orçamento ${analise.orcamento_editavel ? 'atualizado' : 'criado'} pelo profissional`,
      metrica_antes: analise.orcamento_editavel || {},
      metrica_depois: {
        analise_id: analise.id,
        orcamento: orcamentoFinal,
        usuario: user?.email,
        timestamp: new Date().toISOString()
      },
      automatica: false
    });

    // Salvar no banco
    await onSave({ orcamento_editavel: orcamentoFinal });

    setEditando(false);

    // Notificação
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-[9999] animate-in slide-in-from-top duration-300';
    notification.innerHTML = `
      <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-2xl p-4 max-w-md">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <p class="font-bold">Orçamento Salvo!</p>
            <p class="text-sm opacity-90">Alterações registradas no sistema</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  };

  const handleAjusteAutomatico = () => {
    if (!orcamento) return;

    const margemInfo = calcularMargem();

    if (!margemInfo.adequada) {
      // Ajustar valor para atingir margem mínima de 30%
      const custoTotal = orcamento.custo_produto || 0;
      const valorMinimo = Math.ceil(custoTotal * 1.3); // 30% de margem

      setOrcamento({
        ...orcamento,
        valor_final: valorMinimo
      });

      // Notificação
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-[9999] animate-in slide-in-from-top duration-300';
      notification.innerHTML = `
        <div class="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl shadow-2xl p-4 max-w-md">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <p class="font-bold">Valor Ajustado!</p>
              <p class="text-sm opacity-90">Margem mínima de 30% aplicada</p>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);
    }
  };

  if (!orcamento) {
    return (
      <Card className="glass-effect border-white/40">
        <CardContent className="p-6 text-center">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Nenhum orçamento cadastrado</p>
          <Button
            onClick={inicializarOrcamento}
            className="mt-4 bg-gradient-to-r from-purple-500 to-indigo-600"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Gerar Orçamento Inteligente
          </Button>
        </CardContent>
      </Card>
    );
  }

  const margemInfo = calcularMargem();

  return (
    <>
      <Card className="glass-effect border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-purple-900">
              <DollarSign className="w-6 h-6" />
              💰 Orçamento do Serviço
            </CardTitle>
            <div className="flex gap-2">
              {historico.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistorico(true)}
                  className="text-purple-600"
                >
                  <History className="w-4 h-4 mr-2" />
                  Histórico
                </Button>
              )}
              {!editando ? (
                <Button
                  onClick={() => setEditando(true)}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-indigo-600"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <Button
                  onClick={handleSalvar}
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Serviço Principal */}
          <div className="bg-white/70 rounded-lg p-4 border-2 border-purple-200">
            <Label className="text-xs font-bold text-purple-600 uppercase mb-2 block">
              Serviço Principal
            </Label>
            <p className="text-lg font-bold text-purple-900">{orcamento.servico_principal}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Valor Base */}
            <div className="bg-white/70 rounded-lg p-4 border-2 border-purple-200">
              <Label className="text-xs font-bold text-purple-600 uppercase mb-2 block">
                Valor Base
              </Label>
              {editando ? (
                <Input
                  type="number"
                  value={orcamento.valor_base}
                  onChange={(e) => setOrcamento({...orcamento, valor_base: parseFloat(e.target.value) || 0})}
                  className="text-lg font-bold"
                />
              ) : (
                <p className="text-lg font-bold text-gray-900">
                  R$ {orcamento.valor_base.toFixed(2)}
                </p>
              )}
            </div>

            {/* Acréscimo */}
            <div className="bg-white/70 rounded-lg p-4 border-2 border-purple-200">
              <Label className="text-xs font-bold text-purple-600 uppercase mb-2 block">
                Acréscimo de Complexidade
              </Label>
              {editando ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={orcamento.percentual_acrescimo}
                    onChange={(e) => {
                      const percentual = parseFloat(e.target.value) || 0;
                      const acrescimo = (orcamento.valor_base * percentual) / 100;
                      setOrcamento({
                        ...orcamento,
                        percentual_acrescimo: percentual,
                        valor_acrescimo: acrescimo,
                        valor_final: Math.round(orcamento.valor_base + acrescimo)
                      });
                    }}
                    className="text-lg font-bold"
                  />
                  <span className="text-lg font-bold">%</span>
                </div>
              ) : (
                <p className="text-lg font-bold text-orange-600">
                  +{orcamento.percentual_acrescimo}% (R$ {orcamento.valor_acrescimo.toFixed(2)})
                </p>
              )}
            </div>
          </div>

          {/* Justificativas */}
          {orcamento.justificativas && orcamento.justificativas.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <Label className="text-xs font-bold text-blue-600 uppercase mb-2 block">
                Justificativas do Acréscimo
              </Label>
              <div className="flex flex-wrap gap-2">
                {orcamento.justificativas.map((just, idx) => (
                  <Badge key={idx} className="bg-blue-100 text-blue-800 border border-blue-300">
                    {just}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Valor Final */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
            <Label className="text-xs font-bold uppercase mb-2 block opacity-90">
              Valor Final do Orçamento
            </Label>
            {editando ? (
              <Input
                type="number"
                value={orcamento.valor_final}
                onChange={(e) => setOrcamento({...orcamento, valor_final: parseFloat(e.target.value) || 0})}
                className="text-3xl font-bold bg-white/20 text-white border-white/30"
              />
            ) : (
              <p className="text-4xl font-bold">R$ {orcamento.valor_final.toFixed(2)}</p>
            )}
          </div>

          {/* Análise de Margem */}
          {orcamento.custo_produto > 0 && (
            <div className={`rounded-lg p-4 border-2 ${
              margemInfo.adequada ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Label className={`text-xs font-bold uppercase mb-1 block ${
                    margemInfo.adequada ? 'text-green-700' : 'text-red-700'
                  }`}>
                    Análise de Margem de Lucro
                  </Label>
                  <p className="text-sm text-gray-700">
                    Custo do produto: R$ {orcamento.custo_produto.toFixed(2)}
                  </p>
                </div>
                {!margemInfo.adequada && editando && (
                  <Button
                    size="sm"
                    onClick={handleAjusteAutomatico}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Ajustar
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Lucro Líquido</p>
                  <p className={`text-xl font-bold ${margemInfo.adequada ? 'text-green-700' : 'text-red-700'}`}>
                    R$ {margemInfo.margem.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Margem (%)</p>
                  <p className={`text-xl font-bold ${margemInfo.adequada ? 'text-green-700' : 'text-red-700'}`}>
                    {margemInfo.percentual.toFixed(1)}%
                  </p>
                </div>
              </div>

              {!margemInfo.adequada && (
                <div className="mt-3 flex items-start gap-2 text-sm text-red-700">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong>Atenção:</strong> Margem abaixo do recomendado (mínimo 30%).
                    Valor mínimo sugerido: R$ {Math.ceil(orcamento.custo_produto * 1.3).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Validade */}
          <div className="bg-white/70 rounded-lg p-4 border-2 border-purple-200">
            <Label className="text-xs font-bold text-purple-600 uppercase mb-2 block">
              Validade do Orçamento
            </Label>
            {editando ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {validadeOrcamento ? format(validadeOrcamento, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'Selecione uma data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={validadeOrcamento}
                    onSelect={setValidadeOrcamento}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <p className="text-lg font-bold text-gray-900">
                {validadeOrcamento ? format(validadeOrcamento, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'Não definida'}
              </p>
            )}
          </div>

          {/* Observações */}
          {editando && (
            <div className="bg-white/70 rounded-lg p-4 border-2 border-purple-200">
              <Label className="text-xs font-bold text-purple-600 uppercase mb-2 block">
                Observações
              </Label>
              <Textarea
                value={orcamento.observacoes || ''}
                onChange={(e) => setOrcamento({...orcamento, observacoes: e.target.value})}
                placeholder="Observações adicionais sobre o orçamento..."
                rows={3}
              />
            </div>
          )}

          {orcamento.atualizado_por && !editando && (
            <p className="text-xs text-gray-500 text-center">
              Última atualização por {orcamento.atualizado_por} em{' '}
              {format(new Date(orcamento.atualizado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Histórico */}
      <Dialog open={showHistorico} onOpenChange={setShowHistorico}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Histórico de Alterações do Orçamento
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {historico.map((log, idx) => (
              <div key={log.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-900">{log.descricao}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(log.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <Badge className={log.status === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                    {log.status}
                  </Badge>
                </div>

                {log.metrica_antes?.valor_final && log.metrica_depois?.orcamento?.valor_final && (
                  <div className="text-sm mt-2">
                    <p className="text-gray-700">
                      Valor alterado: <span className="line-through">R$ {log.metrica_antes.valor_final.toFixed(2)}</span>
                      {' → '}
                      <span className="font-bold text-green-600">R$ {log.metrica_depois.orcamento.valor_final.toFixed(2)}</span>
                    </p>
                  </div>
                )}

                {log.metrica_depois?.usuario && (
                  <p className="text-xs text-gray-600 mt-2">
                    Por: {log.metrica_depois.usuario}
                  </p>
                )}
              </div>
            ))}

            {historico.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Nenhuma alteração registrada ainda
              </p>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setShowHistorico(false)} variant="outline">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


