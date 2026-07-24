import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Clock, AlertTriangle, ShieldCheck, PieChart } from 'lucide-react';
import { Activity, Sector, Inspection } from '../types';

interface AnalyticsViewProps {
  activities: Activity[];
  sectors: Sector[];
  inspections: Inspection[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ activities, sectors, inspections }) => {
  const total = activities.length;
  const completed = activities.filter(a => a.status === 'Concluída').length;
  const inProgress = activities.filter(a => a.status === 'Em Andamento').length;
  const delayed = activities.filter(a => a.status === 'Atrasada').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const approvedInspections = inspections.filter(i => i.decision === 'Aprovado').length;
  const inspectionRate = inspections.length > 0 ? Math.round((approvedInspections / inspections.length) * 100) : 100;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          Estatísticas e Indicadores Globais de Desempenho (KPIs)
        </h2>
        <p className="text-xs text-slate-500">Métricas de produtividade por sector, taxas de conclusão e cumprimento da fiscalização</p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Taxa de Conclusão</span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{completionRate}%</div>
            <span className="text-[11px] text-slate-400">{completed} de {total} concluídas</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold text-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Conformidade Fiscal</span>
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">{inspectionRate}%</div>
            <span className="text-[11px] text-slate-400">{approvedInspections} inspecções aprovadas</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold text-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Tempo Médio Execução</span>
            <div className="text-3xl font-black text-sky-600 dark:text-sky-400 mt-1">4.5h</div>
            <span className="text-[11px] text-slate-400">Por intervenção em campo</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center font-bold text-lg">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Actividades Atrasadas</span>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{delayed}</div>
            <span className="text-[11px] text-slate-400">Impedimentos temporários</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold text-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Visual Productivity Bars by Sector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          Volume de Trabalhos por Sector Operacional
        </h3>

        <div className="space-y-3">
          {sectors.map(sec => {
            const secActs = activities.filter(a => a.sectorName === sec.name);
            const secCompleted = secActs.filter(a => a.status === 'Concluída').length;
            const percentage = total > 0 ? Math.round((secActs.length / total) * 100) : 0;

            return (
              <div key={sec.id} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{sec.name} ({sec.headName})</span>
                  <span className="text-slate-500">{secActs.length} actividades ({secCompleted} concluídas)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.max(percentage, 8)}%`, backgroundColor: sec.color }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
