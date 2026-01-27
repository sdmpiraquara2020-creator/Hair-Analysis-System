import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, DollarSign, Save, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { appApi } from "@/api/appClient";

export default function OrcamentoMultiServicos({ analise, onSave, mode = "analysis" }) {
  const [orcamento, setOrcamento] = useState(analise?.orcamento_manual || []);
  const [editando, setEditando] = useState(false);

  const { data: servicos = [] } = useQuery({
    queryKey: ['servicos'],
    queryFn: () => appApi.entities.Servico.list(),
  });

  useEffect(() => {
    if (analise?.orcamento_manual) {
      setOrcamento(analise.orcamento_manual);
    }
  }, [analise]);

  const adicionarServico = () => {
    setOrcamento([...orcamento, { servico: "", descricao: "", valor: 0 }]);
    setEditando(true);
  };

  const removerServico = (index) => {
    const novoOrcamento = orcamento.filter((_, i) => i !== index);
    setOrcamento(novoOrcamento);
  };

  const atualizarServico = (index, campo, valor) => {
    const novoOrcamento = [...orcamento];
    novoOrcamento[index] = { ...novoOrcamento[index], [campo]: valor };
    
    // Se mudou o nome do serviço, NÃO preencher descrição automaticamente
    // Deixar vazio para o usuário preencher manualmente se quiser
    if (campo === 'servico') {
      const servicoSelecionado = servicos.find(s => s.nome === valor);
      if (servicoSelecionado) {
        novoOrcamento[index].valor = servicoSelecionado.valor || 0;
        // NÃO preencher descrição automaticamente
        // novoOrcamento[index].descricao = "";
      }
    }
    
    setOrcamento(novoOrcamento);
  };

  const salvar = async () => {
    await onSave({ orcamento_manual: orcamento });
    setEditando(false);
  };

  const cancelar = () => {
    setOrcamento(analise?.orcamento_manual || []);
    setEditando(false);
  };

  const total = orcamento.reduce((sum, item) => sum + (parseFloat(item.valor) || 0), 0);

  return (
    <Card className="glass-effect border-white/40 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-2xl font-semibold shadow-sm">
              💰
            </span>
            <CardTitle className="text-2xl font-semibold text-gray-900 tracking-tight">Orçamento Detalhado</CardTitle>
          </div>
          {!editando && (
            <Button
              onClick={() => setEditando(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              {orcamento.length === 0 ? 'Adicionar' : 'Editar'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {orcamento.length === 0 && !editando ? (
          <div className="text-center py-8 bg-white/70 rounded-lg border-2 border-dashed border-green-200">
            <DollarSign className="w-12 h-12 mx-auto text-green-300 mb-2" />
            <p className="text-gray-600 font-medium">Nenhum orçamento criado</p>
            <p className="text-sm text-gray-500 mt-1">Clique em "Adicionar" para começar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orcamento.map((item, index) => (
              <div key={index} className="bg-white/70 rounded-lg p-4 border-2 border-green-200">
                {editando ? (
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-bold text-gray-700">Serviço *</Label>
                        <Select
                          value={item.servico}
                          onValueChange={(value) => atualizarServico(index, 'servico', value)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {servicos.map(servico => (
                              <SelectItem key={servico.id} value={servico.nome}>
                                {servico.nome} - R$ {servico.valor?.toFixed(2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs font-bold text-gray-700">Valor (R$) *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.valor}
                          onChange={(e) => atualizarServico(index, 'valor', parseFloat(e.target.value))}
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-bold text-gray-700">
                        Descrição (Opcional - pode deixar vazio ou editar)
                      </Label>
                      <Textarea
                        value={item.descricao || ""}
                        onChange={(e) => atualizarServico(index, 'descricao', e.target.value)}
                        placeholder="Digite uma descrição personalizada se desejar..."
                        rows={3}
                        className="bg-white"
                      />
                    </div>

                    <Button
                      onClick={() => removerServico(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 border-red-300 w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover Serviço
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">{item.servico}</p>
                        {item.descricao && (
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {item.descricao}
                          </p>
                        )}
                      </div>
                      <Badge className="bg-green-600 text-white text-lg font-bold">
                        R$ {parseFloat(item.valor || 0).toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {editando && (
              <>
                <Button
                  onClick={adicionarServico}
                  variant="outline"
                  className="w-full border-2 border-dashed border-green-300 hover:bg-green-50"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Adicionar Outro Serviço
                </Button>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={salvar}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Orçamento
                  </Button>
                  <Button
                    onClick={cancelar}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </>
            )}

            {orcamento.length > 0 && (
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg p-4 mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">TOTAL ESTIMADO</p>
                  <p className="text-2xl font-bold">R$ {total.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

