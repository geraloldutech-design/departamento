import React from 'react';
import { 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ClipboardCheck, 
  Plus, 
  UserPlus, 
  Megaphone, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  Building2,
  Smartphone
} from 'lucide-react';
import { Activity, Sector, Announcement, UserRole } from '../types';

interface DashboardViewProps {
  activities: Activity[];
  sectors: Sector[];
  announcements: Announcement[];
  activeRole: UserRole;
  onNavigateTab: (tab: any) => void;
  onOpenNewActivityModal: () => void;
  onOpenNewNominationModal: () => void;
  onOpenNewAnnouncementModal: () => void;
  onQuickUpdateActivityStatus: (activityId: string, status: Activity['status']) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  activities,
  sectors,
  announcements,
  activeRole,
  onNavigateTab,
  onOpenNewActivityModal,
  onOpenNewNominationModal,
  onOpenNewAnnouncementModal,
  onQuickUpdateActivityStatus
}) => {
  const total = activities.length;
  const inProgress = activities.filter(a => a.status === 'Em Andamento').length;
  const completed = activities.filter(a => a.status === 'Concluída').length;
  const delayed = activities.filter(a => a.status === 'Atrasada').length;
  const pending = activities.filter(a => a.status === 'Pendente').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayActivities = activities.filter(a => a.date === todayStr || a.status === 'Em Andamento');

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Director Announcements */}
      {announcements.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xs border border-emerald-800/40 relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 shrink-0">
                <Megaphone className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider font-black text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                  COMUNICADO OFICIAL DA DIRECÇÃO EMRICH
                </span>
                <h2 className="text-base sm:text-lg font-bold mt-1 text-white">
                  {announcements[0].title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-3xl leading-relaxed">
                  {announcements[0].content}
                </p>
                <div className="text-[11px] text-emerald-300 mt-2 flex items-center gap-2">
                  <span>Emissor: {announcements[0].authorName} ({announcements[0].authorRole})</span>
                  <span>•</span>
                  <span>{new Date(announcements[0].createdAt).toLocaleDateString('pt-MZ')}</span>
                </div>
              </div>
            </div>

            {(activeRole === 'Administrador' || activeRole === 'Director') && (
              <button
                onClick={onOpenNewAnnouncementModal}
                className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 transition shadow-xs"
              >
                + Comunicado
              </button>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Actividades</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{total}</span>
            <span className="text-[10px] block text-slate-500 mt-0.5">Total Registadas</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-sky-500/40 transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Em Andamento</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400">{inProgress}</span>
            <span className="text-[10px] block text-sky-600/80 font-semibold mt-0.5">Em Execução Ativa</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Concluídas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{completed}</span>
            <span className="text-[10px] block text-emerald-600/80 font-semibold mt-0.5">Finalizadas Sucesso</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Atrasadas</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">{delayed}</span>
            <span className="text-[10px] block text-amber-600/80 font-semibold mt-0.5">Atenção Necessária</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Relatórios</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">12</span>
            <span className="text-[10px] block text-slate-500 mt-0.5">Dos Sectores</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Fiscalização</span>
            <ClipboardCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">4</span>
            <span className="text-[10px] block text-slate-500 mt-0.5">Pendentes Parecer</span>
          </div>
        </div>

      </div>

      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center gap-2.5 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mr-1">
          Ações Rápidas:
        </span>
        
        <button
          onClick={onOpenNewActivityModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Agendar Actividade
        </button>

        {(activeRole === 'Administrador' || activeRole === 'Director') && (
          <button
            onClick={onOpenNewNominationModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
          >
            <UserPlus className="w-4 h-4" />
            Nomear Chefe de Sector
          </button>
        )}

        <button
          onClick={() => onNavigateTab('reports')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          Emitir Relatório PDF
        </button>

        <button
          onClick={() => onNavigateTab('map')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
        >
          <MapPin className="w-4 h-4 text-sky-600" />
          Ver Mapa do Chiveve
        </button>

        <button
          onClick={() => onNavigateTab('whatsapp')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition ml-auto"
        >
          <Smartphone className="w-4 h-4 text-emerald-600" />
          WhatsApp Auto-Dispatch
        </button>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Today's / Urgent Activities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-600" />
                Actividades Operacionais em Foco
              </h2>
              <p className="text-xs text-slate-500">Trabalhos em andamento ou agendados para hoje</p>
            </div>
            
            <button
              onClick={() => onNavigateTab('activities')}
              className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1"
            >
              Ver Todas ({total})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todayActivities.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-slate-500 text-xs shadow-xs">
                Nenhuma actividade agendada para hoje. Clique em "Agendar Actividade" para criar uma nova tarefa.
              </div>
            ) : (
              todayActivities.map(act => (
                <div 
                  key={act.id} 
                  className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white" style={{ backgroundColor: sectors.find(s=>s.name===act.sectorName)?.color || '#00875A' }}>
                        {act.sectorName}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        act.priority === 'Urgente' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                        act.priority === 'Alta' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {act.priority}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        📍 {act.locationName}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {act.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {act.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span>👤 {act.responsibleName}</span>
                      <span>⏰ {act.time}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Progress: {act.progressPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Quick status button */}
                  <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <select
                      value={act.status}
                      onChange={(e) => onQuickUpdateActivityStatus(act.id, e.target.value as any)}
                      className="text-xs px-3 py-1.5 rounded-xl border border-slate-300/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em Andamento">Em Andamento</option>
                      <option value="Concluída">Concluída</option>
                      <option value="Atrasada">Atrasada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Sectors Status Matrix & Mini Statistics */}
        <div className="space-y-6">
          
          {/* Sectors Overview */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Sectores Operacionais ({sectors.length})
              </h3>
              <button
                onClick={() => onNavigateTab('sectors')}
                className="text-[11px] text-emerald-600 font-bold hover:underline"
              >
                Gerir
              </button>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {sectors.map(sec => (
                <div 
                  key={sec.id}
                  className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between text-xs border border-slate-100 dark:border-slate-800/60"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: sec.color }} />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{sec.name}</span>
                      <span className="block text-[10px] text-slate-500">Chefe: {sec.headName}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-slate-700">
                      {sec.memberCount} func.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Mission Reminder */}
          <div className="p-5 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Missão Municipal Rio Chiveve
            </h4>
            <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed font-medium">
              O Rio Chiveve é a principal artéria de drenagem natural da Cidade da Beira. Mantenha os canais limpos, as eclusas operacionais e a fiscalização ativa.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
