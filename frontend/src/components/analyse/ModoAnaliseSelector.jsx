import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Camera, GitCompare, Layers, Video } from "lucide-react";

export default function ModoAnaliseSelector({ modoSelecionado, onModoChange }) {
  return (
    <Card className="border-gray-200 bg-white shadow-sm">
      <CardContent className="p-6">
        <Label className="text-base font-semibold text-gray-900 mb-5 block">
          Modo de Análise
        </Label>
        <RadioGroup value={modoSelecionado} onValueChange={onModoChange}>
          <div className="space-y-3">
            <div 
              onClick={() => onModoChange('simples')}
              className={`group relative flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 border-2 cursor-pointer ${
                modoSelecionado === 'simples' 
                  ? 'bg-gradient-to-r from-[#0A84FF] to-[#0a6fd6] border-[#0A84FF] shadow-lg shadow-blue-500/30 scale-[1.02]' 
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.01]'
              }`}
            >
              <RadioGroupItem value="simples" id="simples" className="sr-only" />
              <Label htmlFor="simples" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    modoSelecionado === 'simples' 
                      ? 'bg-white shadow-md' 
                      : 'bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200'
                  }`}>
                    <Camera className={`w-6 h-6 transition-colors duration-300 ${
                      modoSelecionado === 'simples' ? 'text-[#0A84FF]' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-semibold text-base transition-colors duration-300 ${
                      modoSelecionado === 'simples' ? 'text-white' : 'text-gray-900'
                    }`}>Análise Simples</p>
                    <p className={`text-sm transition-colors duration-300 ${
                      modoSelecionado === 'simples' ? 'text-blue-100' : 'text-gray-600'
                    }`}>Uma única imagem do cabelo</p>
                  </div>
                </div>
              </Label>
            </div>

            <div 
              onClick={() => onModoChange('video')}
              className={`group relative flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 border-2 cursor-pointer ${
                modoSelecionado === 'video' 
                  ? 'bg-gradient-to-r from-[#0A84FF] to-[#0a6fd6] border-[#0A84FF] shadow-lg shadow-blue-500/30 scale-[1.02]' 
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.01]'
              }`}
            >
              <RadioGroupItem value="video" id="video" className="sr-only" />
              <Label htmlFor="video" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    modoSelecionado === 'video' 
                      ? 'bg-white shadow-md' 
                      : 'bg-gradient-to-br from-purple-50 to-purple-100 group-hover:from-purple-100 group-hover:to-purple-200'
                  }`}>
                    <Video className={`w-6 h-6 transition-colors duration-300 ${
                      modoSelecionado === 'video' ? 'text-[#0A84FF]' : 'text-purple-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-semibold text-base transition-colors duration-300 ${
                      modoSelecionado === 'video' ? 'text-white' : 'text-gray-900'
                    }`}>Análise por Vídeo</p>
                    <p className={`text-sm transition-colors duration-300 ${
                      modoSelecionado === 'video' ? 'text-blue-100' : 'text-gray-600'
                    }`}>10 segundos - movimento e brilho dinâmico</p>
                  </div>
                </div>
              </Label>
            </div>

            <div 
              onClick={() => onModoChange('antes_depois')}
              className={`group relative flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 border-2 cursor-pointer ${
                modoSelecionado === 'antes_depois' 
                  ? 'bg-gradient-to-r from-[#0A84FF] to-[#0a6fd6] border-[#0A84FF] shadow-lg shadow-blue-500/30 scale-[1.02]' 
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.01]'
              }`}
            >
              <RadioGroupItem value="antes_depois" id="antes_depois" className="sr-only" />
              <Label htmlFor="antes_depois" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    modoSelecionado === 'antes_depois' 
                      ? 'bg-white shadow-md' 
                      : 'bg-gradient-to-br from-green-50 to-green-100 group-hover:from-green-100 group-hover:to-green-200'
                  }`}>
                    <GitCompare className={`w-6 h-6 transition-colors duration-300 ${
                      modoSelecionado === 'antes_depois' ? 'text-[#0A84FF]' : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-semibold text-base transition-colors duration-300 ${
                      modoSelecionado === 'antes_depois' ? 'text-white' : 'text-gray-900'
                    }`}>Antes x Depois</p>
                    <p className={`text-sm transition-colors duration-300 ${
                      modoSelecionado === 'antes_depois' ? 'text-blue-100' : 'text-gray-600'
                    }`}>Compare resultados do tratamento</p>
                  </div>
                </div>
              </Label>
            </div>

            <div 
              onClick={() => onModoChange('raiz_comprimento')}
              className={`group relative flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 border-2 cursor-pointer ${
                modoSelecionado === 'raiz_comprimento' 
                  ? 'bg-gradient-to-r from-[#0A84FF] to-[#0a6fd6] border-[#0A84FF] shadow-lg shadow-blue-500/30 scale-[1.02]' 
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.01]'
              }`}
            >
              <RadioGroupItem value="raiz_comprimento" id="raiz_comprimento" className="sr-only" />
              <Label htmlFor="raiz_comprimento" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    modoSelecionado === 'raiz_comprimento' 
                      ? 'bg-white shadow-md' 
                      : 'bg-gradient-to-br from-orange-50 to-orange-100 group-hover:from-orange-100 group-hover:to-orange-200'
                  }`}>
                    <Layers className={`w-6 h-6 transition-colors duration-300 ${
                      modoSelecionado === 'raiz_comprimento' ? 'text-[#0A84FF]' : 'text-orange-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-semibold text-base transition-colors duration-300 ${
                      modoSelecionado === 'raiz_comprimento' ? 'text-white' : 'text-gray-900'
                    }`}>Raiz x Comprimento</p>
                    <p className={`text-sm transition-colors duration-300 ${
                      modoSelecionado === 'raiz_comprimento' ? 'text-blue-100' : 'text-gray-600'
                    }`}>Analise raiz e pontas separadamente</p>
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

