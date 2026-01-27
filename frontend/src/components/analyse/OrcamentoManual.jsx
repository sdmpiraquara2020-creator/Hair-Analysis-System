import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Edit } from "lucide-react";

export default function OrcamentoManual({ orcamento = [], onChange }) {
  // Garante que orcamento sempre seja um array
  const safeOrcamento = Array.isArray(orcamento) ? orcamento : [];
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({ servico: "", descricao: "", valor: "" });

  const handleAddItem = () => {
    if (newItem.servico && newItem.valor) {
      const parsedValue = parseFloat(newItem.valor.replace(',', '.'));
      if (!isNaN(parsedValue)) {
        onChange([...safeOrcamento, { ...newItem, valor: parsedValue }]);
        setNewItem({ servico: "", descricao: "", valor: "" });
      }
    }
  };

  const handleUpdateItem = (index) => {
    if (editingItem !== null && newItem.servico && newItem.valor) {
      const parsedValue = parseFloat(newItem.valor.replace(',', '.'));
      if (!isNaN(parsedValue)) {
        const updatedOrcamento = [...safeOrcamento];
        updatedOrcamento[index] = { ...newItem, valor: parsedValue };
        onChange(updatedOrcamento);
        setEditingItem(null);
        setNewItem({ servico: "", descricao: "", valor: "" });
      }
    }
  };

  const handleDeleteItem = (index) => {
    onChange(safeOrcamento.filter((_, i) => i !== index));
  };

  const startEditing = (item, index) => {
    setEditingItem(index);
    setNewItem({
      servico: item.servico,
      descricao: item.descricao || "",
      valor: item.valor.toFixed(2).replace('.', ',')
    });
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setNewItem({ servico: "", descricao: "", valor: "" });
  };

  return (
    <Card className="glass-effect border-white/40">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          📝 Gerenciar Orçamento Manual
        </CardTitle>
      </CardHeader>
      <CardContent>
        {safeOrcamento.length > 0 && (
          <div className="space-y-2 mb-4">
            {safeOrcamento.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-2 border-b last:border-b-0 border-gray-200">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.servico}</p>
                  {item.descricao && <p className="text-sm text-gray-600">{item.descricao}</p>}
                  <p className="text-sm text-gray-700 font-medium">R$ {item.valor.toFixed(2).replace('.', ',')}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => startEditing(item, index)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-bold text-gray-800">{editingItem !== null ? "Editar Item" : "Adicionar Novo Item"}</h4>
          <Input
            placeholder="Serviço (ex: Alisamento)"
            value={newItem.servico}
            onChange={(e) => setNewItem({ ...newItem, servico: e.target.value })}
          />
          <Textarea
            placeholder="Descrição (opcional)"
            value={newItem.descricao}
            onChange={(e) => setNewItem({ ...newItem, descricao: e.target.value })}
          />
          <Input
            placeholder="Valor (ex: 250,00)"
            value={newItem.valor}
            onChange={(e) => setNewItem({ ...newItem, valor: e.target.value.replace(/[^0-9,.]/g, '') })}
            type="text"
          />
          <div className="flex gap-2">
            {editingItem !== null ? (
              <>
                <Button onClick={() => handleUpdateItem(editingItem)} className="w-full">
                  Salvar Edição
                </Button>
                <Button variant="outline" onClick={cancelEditing} className="w-full">
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={handleAddItem} className="w-full">
                <PlusCircle className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

