import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { appApi } from "@/api/appClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, User, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ClienteSelector({ selectedCliente, onSelectCliente }) {
  const [nomeTemporario, setNomeTemporario] = useState("");
  const [modo, setModo] = useState("lista");
  const [busca, setBusca] = useState("");

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => appApi.entities.Cliente.list(),
  });

  const clientesFiltrados = clientes.filter(c => {
    const termo = busca.toLowerCase();
    const nome = c.nome?.toLowerCase() || '';
    const telefone = c.telefone?.replace(/\D/g, '') || '';
    const numerosBusca = busca.replace(/\D/g, '');
    
    return nome.includes(termo) || telefone.includes(numerosBusca);
  });

  const handleNovoCliente = () => {
    if (nomeTemporario.trim()) {
      onSelectCliente({ nome: nomeTemporario, temporario: true });
    }
  };

  return (
    <Card className="glass-effect border-white/40">
      <CardContent className="p-6">
        <Label className="text-base font-bold text-gray-900 mb-4 block">
          Nome para a análise
        </Label>
        
        {modo === "lista" ? (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={busca}
                onChange={(e) => {
                  const valor = e.target.value;
                  setBusca(valor);
                  
                  // Auto-selecionar cliente ao digitar telefone
                  if (valor.length >= 8) {
                    const numeroLimpo = valor.replace(/\D/g, '');
                    const clienteEncontrado = clientes.find(c => {
                      const telefoneCliente = c.telefone?.replace(/\D/g, '') || '';
                      return telefoneCliente.includes(numeroLimpo);
                    });
                    
                    if (clienteEncontrado) {
                      onSelectCliente(clienteEncontrado);
                    }
                  }
                }}
                className="bg-white/50 border-white/50 pl-10"
              />
            </div>
            <Select
              value={selectedCliente?.id || ""}
              onValueChange={(id) => {
                if (id === "novo") {
                  setModo("novo");
                } else {
                  const cliente = clientes.find(c => c.id === id);
                  onSelectCliente(cliente);
                }
              }}
            >
              <SelectTrigger className="bg-white/50 border-white/50">
                <SelectValue placeholder="Selecione um cliente ou prossiga sem cadastro" />
              </SelectTrigger>
              <SelectContent>
                {clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {cliente.nome} - {cliente.telefone}
                      </div>
                    </SelectItem>
                  ))
                ) : busca ? (
                  <SelectItem value="nenhum" disabled>
                    Nenhum cliente encontrado
                  </SelectItem>
                ) : null}
                <SelectItem value="novo">
                  <div className="flex items-center gap-2 text-[#1A1A1A] font-semibold">
                    <Plus className="w-4 h-4" />
                    Continuar sem cliente cadastrado
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              💡 Você poderá vincular a um cliente depois da análise
            </p>
          </div>
        ) : (
          <div className="space-y-4 p-4 bg-white/50 rounded-lg border-2 border-white/50">
            <Label className="text-sm font-semibold text-gray-700">Digite o nome para identificar esta análise</Label>
            <Input
              placeholder="Ex: Cliente do Instagram, Maria Silva, etc..."
              value={nomeTemporario}
              onChange={(e) => setNomeTemporario(e.target.value)}
              className="bg-white/70 border-[#D1D1D6]"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleNovoCliente}
                disabled={!nomeTemporario.trim()}
                className="flex-1 bg-[#E5E5E7] text-[#1A1A1A] hover:bg-[#2C2C2E] hover:text-white transition-all duration-200 font-semibold"
              >
                Confirmar
              </Button>
              <Button
                onClick={() => setModo("lista")}
                variant="outline"
                className="flex-1 glass-effect border-[#D1D1D6]"
              >
                Voltar
              </Button>
            </div>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              💡 Você poderá vincular a um cliente depois da análise
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

