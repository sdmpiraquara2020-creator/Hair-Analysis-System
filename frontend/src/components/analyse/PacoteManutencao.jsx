import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Sparkles, Edit, Save, X, Calendar, Check } from "lucide-react";

export default function PacoteManutencao({ pacote, onSave, editable = true }) {
  const [editando, setEditando] = useState(false);
  const [pacoteEdit, setPacoteEdit] = useState(pacote);

  if (!pacote || !pacote.servicos || pacote.servicos.length === 0) {
    return null;
  }

  const handleSave = () => {
    onSave(pacoteEdit);
    setEditando(false);
  };

  const handleCancel = () => {
    setPacoteEdit(pacote);
    setEditando(false);
  };

  const updateServico = (index, field, value) => {
    const novosServicos = [...pacoteEdit.servicos];
    novosServicos[index] = {
      ...novosServicos[index],
      [field]: value
    };
    
    setPacoteEdit({
      ...pacoteEdit,
      servicos: novosServicos
    });
  };

  const removerServico = (index) => {
    const novosServicos = pacoteEdit.servicos.filter((_, i) => i !== index);
    
    setPacoteEdit({
      ...pacoteEdit,
      servicos: novosServicos
    });
  };

  return (
    <Card className="glass-effect border-teal-300 bg-gradient-to-br from-teal-50 to-cyan-50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-teal-900">
              💆‍♀️ Pacote de Manutenção Inteligente
            </CardTitle>
            <Badge className="mt-2 bg-teal-100 text-teal-800 border border-teal-300">
              <Sparkles className="w-3 h-3 mr-1" />
              Recomendação Automática IA
            </Badge>
          </div>
          {editable && !editando && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditando(true)}
              className="glass-effect"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
          {editando && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Objetivo */}
        <div className="bg-white/70 rounded-lg p-4 border-2 border-teal-200">
          <p className="text-xs font-bold text-teal-600 uppercase mb-2">🎯 Objetivo</p>
          {editando ? (
            <Textarea
              value={pacoteEdit.objetivo || ""}
              onChange={(e) => setPacoteEdit({ ...pacoteEdit, objetivo: e.target.value })}
              rows={2}
              className="bg-white/50"
            />
          ) : (
            <p className="text-sm text-gray-800 font-medium">{pacote.objetivo}</p>
          )}
        </div>

        {/* Serviços */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-teal-700 uppercase">📋 Serviços Inclusos</p>
          {(editando ? pacoteEdit : pacote).servicos.map((servico, index) => (
            <div key={index} className="bg-white/70 rounded-lg p-4 border-2 border-teal-200">
              <div className="flex items-start justify-between mb-2">
                {editando ? (
                  <Input
                    value={servico.nome}
                    onChange={(e) => updateServico(index, 'nome', e.target.value)}
                    className="font-bold bg-white/50 flex-1 mr-2"
                  />
                ) : (
                  <p className="font-bold text-gray-900">{servico.nome}</p>
                )}
                {editando && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removerServico(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

                <div>
                <Label className="text-xs text-teal-600 font-semibold">Frequência</Label>
                {editando ? (
                  <Input
                    value={servico.frequencia}
                    onChange={(e) => updateServico(index, 'frequencia', e.target.value)}
                    className="bg-white/50"
                  />
                ) : (
                  <p className="text-sm text-gray-700 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {servico.frequencia}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Label className="text-xs text-teal-600 font-semibold">Justificativa</Label>
                {editando ? (
                  <Textarea
                    value={servico.justificativa}
                    onChange={(e) => updateServico(index, 'justificativa', e.target.value)}
                    rows={2}
                    className="bg-white/50"
                  />
                ) : (
                  <p className="text-xs text-gray-600 italic">{servico.justificativa}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Prazo de Retorno */}
        <div className="bg-teal-100 rounded-lg p-4 border-2 border-teal-300">
          <p className="text-xs font-bold text-teal-700 uppercase mb-1">📅 Retorno Recomendado</p>
          {editando ? (
            <Input
              value={pacoteEdit.prazo_retorno}
              onChange={(e) => setPacoteEdit({ ...pacoteEdit, prazo_retorno: e.target.value })}
              className="bg-white/50"
            />
          ) : (
            <p className="text-base font-bold text-teal-900">
              {pacote.prazo_retorno}
            </p>
          )}
        </div>

        {/* Observações */}
        {(editando || pacote.observacoes) && (
          <div className="bg-white/70 rounded-lg p-4 border-2 border-teal-200">
            <Label className="text-xs font-bold text-teal-600 uppercase mb-2 block">
              📝 Observações do Profissional
            </Label>
            {editando ? (
              <Textarea
                value={pacoteEdit.observacoes || ""}
                onChange={(e) => setPacoteEdit({ ...pacoteEdit, observacoes: e.target.value })}
                placeholder="Adicione observações personalizadas..."
                rows={3}
                className="bg-white/50"
              />
            ) : (
              pacote.observacoes && (
                <p className="text-sm text-gray-700">{pacote.observacoes}</p>
              )
            )}
          </div>
        )}

        {!editando && (
          <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
            <p className="text-xs text-teal-700 font-medium flex items-center gap-2">
              <Check className="w-4 h-4" />
              Este pacote foi gerado automaticamente pela IA com base na análise capilar realizada.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

