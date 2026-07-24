import React, { useState } from 'react';
import { Activity, ActivityReport, Inspection, Sector, MaterialItem, VehicleItem, Incident } from '../types';
import { 
  Sparkles, 
  Bot, 
  Send, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  Loader2,
  RefreshCw,
  BarChart3
} from 'lucide-react';

interface AiAssistantViewProps {
  activities: Activity[];
  reports: ActivityReport[];
  inspections: Inspection[];
  sectors: Sector[];
  materials: MaterialItem[];
  vehicles: VehicleItem[];
  incidents: Incident[];
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  activities,
  reports,
  inspections,
  sectors,
  materials,
  vehicles,
  incidents
}) => {
  const [prompt, setPrompt] = useState('');
  const [responseMarkdown, setResponseMarkdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const prepareContext = () => {
    return {
      summaryStats: {
        totalActivities: activities.length,
        delayedActivities: activities.filter(a => a.status === 'Atrasada' || a.status === 'Suspensa').length,
        completedActivities: activities.filter(a => a.status === 'Concluída').length,
        lowStockMaterials: materials.filter(m => m.quantity <= m.minQuantity).length,
        criticalIncidents: incidents.filter(i => i.severity === 'Crítica' || i.severity === 'Alta').length
      },
      activitiesList: activities.map(a => ({
        os: a.serviceOrderNumber,
        title: a.title,
        sector: a.sectorName,
        status: a.status,
        progress: a.progressPercent,
        priority: a.priority,
        date: a.date
      })),
      incidentsList: incidents.map(i => ({
        number: i.incidentNumber,
        title: i.title,
        severity: i.severity,
        status: i.status,
        sector: i.assignedToSector
      })),
      sectorsList: sectors.map(s => ({
        name: s.name,
        members: s.memberCount
      }))
    };
  };

  const handleQuery = async (customPrompt?: string, taskType?: string) => {
    const activePrompt = customPrompt || prompt;
    if (!activePrompt.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          taskType: taskType || 'Análise Operacional',
          context: prepareContext()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro na resposta do servidor Gemini');
      }

      setResponseMarkdown(data.text);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Erro ao conectar com o Assistente IA.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-indigo-900/50">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-400/30 backdrop-blur-md">
            <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">Assistente IA EMRICH</h1>
              <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-sm text-indigo-200 mt-1">Inteligência Operacional, Resumos de Fiscalização e Análise de Produtividade em Tempo Real</p>
          </div>
        </div>
      </div>

      {/* Quick Action Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => handleQuery(
            'Analise todas as actividades pendentes, atrasadas e suspensas da EMRICH e identifique os principais gargalos operacionais e riscos de incumprimento.',
            'Análise de Riscos e Gargalos'
          )}
          disabled={isLoading}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition text-left space-y-2 group"
        >
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl w-fit group-hover:scale-105 transition">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Gargalos & Actividades Atrasadas</h3>
          <p className="text-xs text-slate-500">Identificar tarefas críticas em risco de incumprimento e sugerir mitigações.</p>
        </button>

        <button
          onClick={() => handleQuery(
            'Elabore um Relatório Executivo Diário Sintetizado em formato estruturado para a Direcção Geral da EMRICH, destacando os progressos do dia e prioridades.',
            'Relatório Executivo Diário'
          )}
          disabled={isLoading}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition text-left space-y-2 group"
        >
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit group-hover:scale-105 transition">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Sintetizar Relatório Diário</h3>
          <p className="text-xs text-slate-500">Gerar resumo executivo para a Direcção Geral com KPIs e destaques.</p>
        </button>

        <button
          onClick={() => handleQuery(
            'Com base na força de trabalho e materiais disponíveis, crie uma lista de 5 prioridades operacionais recomendadas para a próxima semana.',
            'Prioridades Operacionais'
          )}
          disabled={isLoading}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition text-left space-y-2 group"
        >
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-fit group-hover:scale-105 transition">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Prioridades da Semana</h3>
          <p className="text-xs text-slate-500">Recomendar alocação inteligente de equipas e recursos para os sectores.</p>
        </button>

        <button
          onClick={() => handleQuery(
            'Faça uma análise de produtividade comparativa por sector (Limpeza, Jardinagem, Canalização, etc.) e avalie o impacto do stock de materiais.',
            'Análise de Produtividade'
          )}
          disabled={isLoading}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition text-left space-y-2 group"
        >
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit group-hover:scale-105 transition">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Produtividade dos Sectores</h3>
          <p className="text-xs text-slate-500">Avaliar desempenho dos sectores e alocação de recursos em armazém.</p>
        </button>
      </div>

      {/* Prompt Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <label className="block font-bold text-slate-900 text-sm">Fazer Consulta Personalizada ao Assistente IA:</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ex: Como posso otimizar a desobstrução das eclusas com a equipa de canalização?"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleQuery()}
            disabled={isLoading}
            className="flex-1 p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleQuery()}
            disabled={isLoading || !prompt.trim()}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition flex items-center space-x-2 shrink-0 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Analisar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Response Box */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-800">O Assistente IA EMRICH está a analisar o banco de dados...</p>
          <p className="text-xs text-slate-500">A cruzar dados de actividades, fiscalizações, stock e frota de viaturas.</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-rose-800 text-sm flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {responseMarkdown && !isLoading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">Parecer do Assistente IA EMRICH</h3>
            </div>
            <button
              onClick={() => setResponseMarkdown(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Limpar Análise
            </button>
          </div>

          <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-5 rounded-xl border border-slate-100">
            {responseMarkdown}
          </div>
        </div>
      )}
    </div>
  );
};
