import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appApi } from "@/api/appClient";

export default function FeedbackButtons({ analise, onFeedback }) {
  const [showComment, setShowComment] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [comentario, setComentario] = useState("");
  const queryClient = useQueryClient();

  const feedbackMutation = useMutation({
    mutationFn: async ({ feedbackPositivo, comentario }) => {
      console.log("💾 [FeedbackButtons] Salvando feedback:", {
        analiseId: analise.id,
        feedbackPositivo,
        comentario
      });

      // 1. Atualizar análise com feedback
      await appApi.entities.Analise.update(analise.id, {
        feedback_positivo: feedbackPositivo,
        feedback_comentario: comentario,
        confirmado_por_profissional: true,
        resultado_satisfatorio: feedbackPositivo
      });

      console.log("✅ [FeedbackButtons] Análise atualizada");

      // 2. Buscar todos os serviços para obter IDs
      const todosServicos = await appApi.entities.Servico.list();
      console.log("📋 [FeedbackButtons] Serviços carregados:", todosServicos.length);

      // 3. Registrar métrica de aprendizado para alisamento
      if (analise.recomendacao_alisamento && analise.recomendacao_alisamento !== 'N/A') {
        const servicoNome = analise.alisamento_escolhido || analise.recomendacao_alisamento;
        const servico = todosServicos.find(s => s.nome === servicoNome);
        
        if (servico) {
          console.log("📊 [FeedbackButtons] Registrando métrica para alisamento:", servicoNome);
          
          await appApi.entities.AprendizadoMetrica.create({
            servico_id: servico.id,
            servico_nome: servicoNome,
            tipo_fio: analise.tipo_fio,
            volume_capilar: analise.volume_capilar,
            estrutura_fio: analise.estrutura_fio,
            nivel_dano: analise.nivel_dano,
            foi_recomendado: true,
            foi_escolhido: true,
            resultado_satisfatorio: feedbackPositivo,
            score_compatibilidade: analise.score_compatibilidade_alisamento || 0,
            analise_id: analise.id
          });

          // 4. INCREMENTAR SCORE DO SERVIÇO
          if (feedbackPositivo) {
            const scoreAtual = servico.score_aprendizado || 0;
            const novoScore = scoreAtual + 5; // +5 pontos por feedback positivo
            
            console.log("🎯 [FeedbackButtons] Atualizando score:", {
              servico: servicoNome,
              scoreAtual,
              novoScore
            });
            
            await appApi.entities.Servico.update(servico.id, {
              score_aprendizado: novoScore
            });
            
            console.log("✅ [FeedbackButtons] Score atualizado!");
          }
        } else {
          console.warn("⚠️ [FeedbackButtons] Serviço não encontrado:", servicoNome);
        }
      }

      // 5. Registrar métrica para tratamento
      if (analise.recomendacao_tratamento && analise.recomendacao_tratamento !== 'N/A') {
        const servicoNome = analise.tratamento_escolhido || analise.recomendacao_tratamento;
        const servico = todosServicos.find(s => s.nome === servicoNome);
        
        if (servico) {
          console.log("📊 [FeedbackButtons] Registrando métrica para tratamento:", servicoNome);
          
          await appApi.entities.AprendizadoMetrica.create({
            servico_id: servico.id,
            servico_nome: servicoNome,
            tipo_fio: analise.tipo_fio,
            volume_capilar: analise.volume_capilar,
            estrutura_fio: analise.estrutura_fio,
            nivel_dano: analise.nivel_dano,
            foi_recomendado: true,
            foi_escolhido: true,
            resultado_satisfatorio: feedbackPositivo,
            analise_id: analise.id
          });

          // INCREMENTAR SCORE DO SERVIÇO
          if (feedbackPositivo) {
            const scoreAtual = servico.score_aprendizado || 0;
            const novoScore = scoreAtual + 5;
            
            console.log("🎯 [FeedbackButtons] Atualizando score tratamento:", {
              servico: servicoNome,
              scoreAtual,
              novoScore
            });
            
            await appApi.entities.Servico.update(servico.id, {
              score_aprendizado: novoScore
            });
            
            console.log("✅ [FeedbackButtons] Score tratamento atualizado!");
          }
        }
      }

      console.log("✅ [FeedbackButtons] Feedback completo registrado!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analises'] });
      queryClient.invalidateQueries({ queryKey: ['analises-historico'] });
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
      queryClient.invalidateQueries({ queryKey: ['aprendizado-metricas'] });
      setShowComment(false);
      setFeedbackType(null);
      setComentario("");
      if (onFeedback) {
        onFeedback({ feedback_positivo: feedbackType === 'positive', feedback_comentario: comentario });
      }
    },
    onError: (error) => {
      console.error("❌ [FeedbackButtons] Erro ao salvar feedback:", error);
      alert(`Erro ao salvar feedback: ${error.message}`);
    }
  });

  const handleFeedbackClick = (type) => {
    setFeedbackType(type);
    setShowComment(true);
  };

  const handleSubmit = () => {
    if (!comentario.trim()) {
      alert('Por favor, adicione um comentário sobre o resultado');
      return;
    }

    feedbackMutation.mutate({
      feedbackPositivo: feedbackType === 'positive',
      comentario: comentario
    });
  };

  const hasFeedback = analise.feedback_positivo !== undefined && analise.feedback_positivo !== null;

  if (hasFeedback) {
    return (
      <Card className={`glass-effect ${analise.feedback_positivo ? 'border-green-300 bg-green-50' : 'border-orange-300 bg-orange-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {analise.feedback_positivo ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-bold text-green-800">✅ Análise Avaliada Positivamente</p>
                  {analise.feedback_comentario && (
                    <p className="text-sm text-green-700 mt-1">{analise.feedback_comentario}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <ThumbsDown className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="font-bold text-orange-800">Análise Precisa de Ajustes</p>
                  {analise.feedback_comentario && (
                    <p className="text-sm text-orange-700 mt-1">{analise.feedback_comentario}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-blue-300 bg-blue-50">
      <CardContent className="p-4">
        {!showComment ? (
          <>
            <p className="text-sm font-semibold text-blue-900 mb-3">
              📊 Avaliar Resultado da Análise
            </p>
            <p className="text-xs text-blue-700 mb-4">
              Seu feedback ajuda a IA a melhorar as recomendações futuras
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => handleFeedbackClick('positive')}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={feedbackMutation.isPending}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Recomendação Correta
              </Button>
              <Button
                onClick={() => handleFeedbackClick('negative')}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                disabled={feedbackMutation.isPending}
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Precisa Melhorar
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-blue-900">
              {feedbackType === 'positive' ? '✅ Ótimo!' : '⚠️ O que poderia melhorar?'}
            </p>
            <Textarea
              placeholder="Descreva o resultado obtido, o que funcionou bem ou o que precisa ajustar..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={3}
              className="bg-white"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={feedbackMutation.isPending || !comentario.trim()}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {feedbackMutation.isPending ? 'Salvando...' : 'Enviar Avaliação'}
              </Button>
              <Button
                onClick={() => {
                  setShowComment(false);
                  setFeedbackType(null);
                  setComentario("");
                }}
                variant="outline"
                disabled={feedbackMutation.isPending}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

