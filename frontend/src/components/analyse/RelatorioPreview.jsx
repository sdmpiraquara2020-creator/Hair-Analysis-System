import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText, Download, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import OrcamentoMultiServicos from "./OrcamentoMultiServicos";

export default function RelatorioPreview({ 
  analise, 
  servicos,
  logoUrl,
  open, 
  onOpenChange,
  onExport 
}) {
  const [tipoRelatorio, setTipoRelatorio] = useState("com_orcamento");
  const [orcamentoData, setOrcamentoData] = useState(null);

  const handleExport = () => {
    onExport({
      tipoRelatorio,
      orcamento: tipoRelatorio === "com_orcamento" ? orcamentoData : []
    });
  };

  const handleOrcamentoSave = (data) => {
    console.log('💰 [RelatorioPreview] Orçamento salvo:', data);
    setOrcamentoData(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-2xl font-semibold shadow-sm">
              <FileText className="w-6 h-6" />
            </span>
            <DialogTitle className="text-2xl font-semibold text-gray-900 tracking-tight">Pré-visualização do Relatório</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-bold">Tipo de Relatório</Label>
            <RadioGroup value={tipoRelatorio} onValueChange={setTipoRelatorio}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
                <RadioGroupItem value="tecnico_completo" id="tecnico" />
                <Label htmlFor="tecnico" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Relatório Técnico Completo</div>
                  <div className="text-sm text-gray-600">Análise detalhada sem valores financeiros</div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border-2 border-purple-300 hover:border-purple-400 transition-colors bg-purple-50 cursor-pointer">
                <RadioGroupItem value="com_orcamento" id="orcamento" />
                <Label htmlFor="orcamento" className="flex-1 cursor-pointer">
                  <div className="font-semibold flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Relatório com Orçamento
                  </div>
                  <div className="text-sm text-gray-600">Inclui análise técnica + valores dos serviços</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-8 text-white text-center">
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="w-24 h-24 mx-auto mb-4 bg-white rounded-full p-2"
              onError={(e) => {
                e.target.src = 'https://storage.googleapis.com/msgsndr/AKZP7FLChKyP2Gicbjwq/media/67731e0f1bdf3def4c4f7bfc.jpeg';
              }}
            />
            <h1 className="text-3xl font-bold mb-2">Analyzer SDM IA</h1>
            <p className="text-purple-100">Relatório de Análise Capilar Profissional</p>
            <p className="text-sm mt-2">
              {format(new Date(analise.created_date || Date.now()), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
            <Badge className="mt-3 bg-pink-500 text-white">
              {analise.modo_analise === "simples" ? "Análise Simples" : 
               analise.modo_analise === "antes_depois" ? "Análise Comparativa" :
               analise.modo_analise === "raiz_comprimento" ? "Raiz x Comprimento" :
               analise.modo_analise === "video" ? "Análise por Vídeo" : "Análise Manual"}
            </Badge>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              📋 Informações do Cliente
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">Cliente</p>
                <p className="font-bold">{analise.cliente_nome}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">Data</p>
                <p className="font-bold">
                  {format(new Date(analise.created_date || Date.now()), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>

          {tipoRelatorio === "com_orcamento" && (
            <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                Configurar Orçamento
              </h3>
              <OrcamentoMultiServicos
                analise={analise}
                onSave={handleOrcamentoSave}
                mode="preview"
              />
            </div>
          )}

          {tipoRelatorio === "tecnico_completo" && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>ℹ️ Relatório Técnico:</strong> Este relatório conterá apenas as informações de análise capilar, 
                recomendações de serviços e cuidados, sem incluir valores financeiros.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-purple-500 to-indigo-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

