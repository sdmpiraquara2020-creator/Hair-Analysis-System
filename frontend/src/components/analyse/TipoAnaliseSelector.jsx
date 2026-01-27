import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Droplets, Scissors } from "lucide-react";

export default function TipoAnaliseSelector({ tipoSelecionado, onTipoChange }) {
  return (
    <Card className="border-gray-200 bg-white shadow-sm">
      <CardContent className="p-6">
        <Label className="text-base font-semibold text-gray-900 mb-5 block">
          O que você precisa analisar?
        </Label>
        <RadioGroup value={tipoSelecionado} onValueChange={onTipoChange}>
          <div className="space-y-3">
            <div 
              onClick={() => onTipoChange('completo')}
              className={`group relative flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 border-2 cursor-pointer ${
                tipoSelecionado === 'completo' 
                  ? 'bg-gradient-to-r from-[#0A84FF] to-[#0a6fd6] border-[#0A84FF] shadow-lg shadow-blue-500/30 scale-[1.02]' 
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.01]'
              }`}
            >
              <RadioGroupItem value="completo" id="completo" className="sr-only" />
              <Label htmlFor="completo" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    tipoSelecionado === 'completo' 
                      ? 'bg-white shadow-md' 
                      : 'bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200'
                  }`}>
                    <Sparkles className={`w-6 h-6 transition-colors duration-300 ${
                      tipoSelecionado === 'completo' ? 'text-[#0A84FF]' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-semibold text-base transition-colors duration-300 ${
                      tipoSelecionado === 'completo' ? 'text-white' : 'text-gray-900'
                    }`}>Análise Completa</p>
                    <p className={`text-sm transition-colors duration-300 ${
                      tipoSelecionado === 'completo' ? 'text-blue-100' : 'text-gray-600'
                    }`}>Recomendação de alisamento, tratamento e avaliação de corte</p>
                  </div>
                </div>
              </Label>
            </div>

            <div 
              onClick={() => onTipoChange('alisamento')}
              className={`group relative flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 border-2 cursor-pointer ${
                tipoSelecionado === 'alisamento' 
                  ? 'bg-gradient-to-r from-[#0A84FF] to-[#0a6fd6] border-[#0A84FF] shadow-lg shadow-blue-500/30 scale-[1.02]' 
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.01]'
              }`}
            >
              <RadioGroupItem value="alisamento" id="alisamento" className="sr-only" />
              <Label htmlFor="alisamento" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    tipoSelecionado === 'alisamento' 
                      ? 'bg-white shadow-md' 
                      : 'bg-gradient-to-br from-purple-50 to-purple-100 group-hover:from-purple-100 group-hover:to-purple-200'
                  }`}>
                    <Sparkles className={`w-6 h-6 transition-colors duration-300 ${
                      tipoSelecionado === 'alisamento' ? 'text-[#0A84FF]' : 'text-purple-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-semibold text-base transition-colors duration-300 ${
                      tipoSelecionado === 'alisamento' ? 'text-white' : 'text-gray-900'
                    }`}>Alisamento</p>
                    <p className={`text-sm transition-colors duration-300 ${
                      tipoSelecionado === 'alisamento' ? 'text-blue-100' : 'text-gray-600'
                    }`}>Recomendação de alisamento e avaliação de corte</p>
                  </div>
                </div>
              </Label>
            </div>

            <div 
              onClick={() => onTipoChange('tratamento')}
              className={`group relative flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 border-2 cursor-pointer ${
                tipoSelecionado === 'tratamento' 
                  ? 'bg-gradient-to-r from-[#0A84FF] to-[#0a6fd6] border-[#0A84FF] shadow-lg shadow-blue-500/30 scale-[1.02]' 
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.01]'
              }`}
            >
              <RadioGroupItem value="tratamento" id="tratamento" className="sr-only" />
              <Label htmlFor="tratamento" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    tipoSelecionado === 'tratamento' 
                      ? 'bg-white shadow-md' 
                      : 'bg-gradient-to-br from-green-50 to-green-100 group-hover:from-green-100 group-hover:to-green-200'
                  }`}>
                    <Droplets className={`w-6 h-6 transition-colors duration-300 ${
                      tipoSelecionado === 'tratamento' ? 'text-[#0A84FF]' : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-semibold text-base transition-colors duration-300 ${
                      tipoSelecionado === 'tratamento' ? 'text-white' : 'text-gray-900'
                    }`}>Tratamento</p>
                    <p className={`text-sm transition-colors duration-300 ${
                      tipoSelecionado === 'tratamento' ? 'text-blue-100' : 'text-gray-600'
                    }`}>Recomendação de tratamento e avaliação de corte</p>
                  </div>
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

