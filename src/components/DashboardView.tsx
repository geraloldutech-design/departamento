import React, { useState } from 'react';
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
  Smartphone,
  ShieldCheck,
  Trees,
  Zap,
  Sparkles,
  HardHat,
  Filter,
  Check
} from 'lucide-react';
import { Activity, Sector, Announcement, UserRole, User } from '../types';

interface DashboardViewProps {
  currentUser?: User | null;
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
  currentUser,
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
  const [filterTab, setFilterTab] = useState<'all' | 'inProgress' | 'urgent' | 'completed'>('all');

  const total = activities.length;
  const inProgress = activities.filter(a => a.status === 'Em Andamento').length;
  const completed = activities.filter(a => a.status === 'Concluída').length;
  const delayed = activities.filter(a => a.status === 'Atrasada').length;
  const pending = activities.filter(a => a.status === 'Pendente').length;

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter activities for feed
  const filteredActivities = activities.filter(a => {
    if (filterTab === 'inProgress') return a.status === 'Em Andamento';
    if (filterTab === 'urgent') return a.priority === 'Urgente' || a.status === 'Atrasada';
    if (filterTab === 'completed') return a.status === 'Concluída';
    return true; // 'all'
  });

  const formattedDate = new Date().toLocaleDateString('pt-MZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Welcome & Live Operational Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-800/40 relative overflow-hidden">
        {/* Background Decorative Accent Rings */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-48 h-48 rounded-full bg-teal-500/10 blur-xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                DEPARTAMENTO DE INFRAESTRUTURAS • PARQUE URBANO
              </span>
              <span className="text-xs text-emerald-200/80 font-medium capitalize">
                📅 {formattedDate} • Beira, Sofala
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 flex-wrap">
              Bem-vindo(a) Sr(a). <span className="text-emerald-300 underline decoration-emerald-500">{currentUser?.name || 'Manuel Alberto'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed font-medium">
              Exercendo as funções de <strong className="text-white bg-emerald-800/80 px-2 py-0.5 rounded-lg border border-emerald-600/40">{currentUser?.role || activeRole}</strong> do <strong className="text-emerald-300 font-bold">Sector de {currentUser?.sectorName || 'Jardinagem'}</strong> — Departamento de Infraestruturas e Parques Urbanos da Cidade da Beira.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-emerald-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-700/50 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-emerald-300 leading-none">Estado do Parque Urbano</span>
                <span className="text-xs font-extrabold text-white">Infraestruturas & Verdes 100% Ativas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Announcement Banner inside Hero if exists */}
        {announcements.length > 0 && (
          <div className="mt-5 pt-4 border-t border-emerald-800/60 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 shrink-0 mt-0.5">
                <Megaphone className="w-5 h-5 animate-bounce text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-wider font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                    COMUNICADO DA DIRECÇÃO
                  </span>
                  <span className="text-[10px] text-emerald-300/80">{announcements[0].authorName} ({announcements[0].authorRole})</span>
                </div>
                <p className="text-xs font-bold text-white mt-0.5">
                  {announcements[0].title}: <span className="font-normal text-emerald-100/90">{announcements[0].content}</span>
                </p>
              </div>
            </div>

            {(activeRole === 'Administrador' || activeRole === 'Director') && (
              <button
                onClick={onOpenNewAnnouncementModal}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 transition shadow-xs"
              >
                + Comunicado
              </button>
            )}
          </div>
        )}
      </div>

      {/* Parque Urbano Infrastructure & Green Space Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Trees className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Espaços Verdes & Jardins</span>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100">88% Mantidos & Regados</div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Poda e Jardinagem em Dia</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Rede Elétrica & Iluminação</span>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100">95% Lâmpadas Operacionais</div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Postes e Leds Verificados</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Mobiliário Urbano</span>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100">Bancos e Lixeiras Ok</div>
            <span className="text-[10px] text-slate-500 font-semibold">Manutenção e Pintura</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shrink-0">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Edificações & Obras</span>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100">Instalações Conservadas</div>
            <span className="text-[10px] text-slate-500 font-semibold">Inspeção Preventiva Ativa</span>
          </div>
        </div>
      </div>

      {/* Modern KPI Cards Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Card 1: Total */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-md transition group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Actividades</span>
            <div className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{total}</span>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
              <span>Registadas no sistema</span>
              <span className="text-emerald-600 font-bold">100%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Em Andamento */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-sky-500/50 hover:shadow-md transition group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Em Execução</span>
            <div className="p-2 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-sky-600 dark:text-sky-400 tracking-tight">{inProgress}</span>
            <div className="flex items-center justify-between text-[10px] text-sky-600/80 mt-1 font-semibold">
              <span>Equipas no terreno</span>
              <span>{total > 0 ? Math.round((inProgress / total) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Concluídas */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-md transition group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Concluídas</span>
            <div className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-500 group-hover:scale-110 transition">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{completed}</span>
            <div className="flex items-center justify-between text-[10px] text-emerald-600/80 mt-1 font-semibold">
              <span>Finalizadas sucesso</span>
              <span>{total > 0 ? Math.round((completed / total) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Card 4: Atrasadas */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-amber-500/50 hover:shadow-md transition group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Atrasadas</span>
            <div className="p-2 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-500 group-hover:scale-110 transition">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight">{delayed}</span>
            <div className="flex items-center justify-between text-[10px] text-amber-600/80 mt-1 font-semibold">
              <span>Atenção necessária</span>
              <span>{total > 0 ? Math.round((delayed / total) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Card 5: Relatórios */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-md transition group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Relatórios</span>
            <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500 group-hover:scale-110 transition">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">12</span>
            <span className="text-[10px] block text-slate-500 mt-1 font-semibold">Emitidos este mês</span>
          </div>
        </div>

        {/* Card 6: Fiscalização */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-purple-500/50 hover:shadow-md transition group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Fiscalização</span>
            <div className="p-2 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-500 group-hover:scale-110 transition">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-purple-600 dark:text-purple-400 tracking-tight">4</span>
            <span className="text-[10px] block text-slate-500 mt-1 font-semibold">Pendentes de parecer</span>
          </div>
        </div>

      </div>

      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center gap-2.5 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mr-1">
          Ações Rápidas:
        </span>
        
        <button
          onClick={onOpenNewActivityModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Agendar Actividade
        </button>

        {(activeRole === 'Administrador' || activeRole === 'Director') && (
          <button
            onClick={onOpenNewNominationModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
          >
            <UserPlus className="w-4 h-4" />
            Nomear Chefe de Sector
          </button>
        )}

        <button
          onClick={() => onNavigateTab('reports')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          Emitir Relatório PDF
        </button>

        <button
          onClick={() => onNavigateTab('map')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
        >
          <MapPin className="w-4 h-4 text-sky-600" />
          Ver Mapa do Chiveve
        </button>

        <button
          onClick={() => onNavigateTab('whatsapp')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition ml-auto"
        >
          <Smartphone className="w-4 h-4 text-emerald-600" />
          WhatsApp Auto-Dispatch
        </button>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Filterable Task Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-600" />
                Actividades Operacionais em Foco
              </h2>
              <p className="text-xs text-slate-500">Filtrar por estado e prioridade para acompanhamento direto</p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl self-start sm:self-auto">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filterTab === 'all'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Todas ({total})
              </button>
              <button
                onClick={() => setFilterTab('inProgress')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filterTab === 'inProgress'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Em Andamento ({inProgress})
              </button>
              <button
                onClick={() => setFilterTab('urgent')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filterTab === 'urgent'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Urgentes / Atrasadas ({delayed})
              </button>
            </div>
          </div>

          {/* Activity Cards List */}
          <div className="space-y-3">
            {filteredActivities.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-slate-500 text-xs shadow-xs">
                Nenhuma actividade encontrada para este filtro. Clique em "Agendar Actividade" para registrar uma nova tarefa.
              </div>
            ) : (
              filteredActivities.map(act => {
                const sectorObj = sectors.find(s => s.name === act.sectorName);
                const sectorColor = sectorObj?.color || '#00875A';

                return (
                  <div 
                    key={act.id} 
                    className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span 
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white shadow-xs" 
                          style={{ backgroundColor: sectorColor }}
                        >
                          {act.sectorName}
                        </span>
                        
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          act.priority === 'Urgente' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                          act.priority === 'Alta' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {act.priority}
                        </span>

                        <span className="text-xs text-slate-500 font-medium">
                          📍 {act.locationName}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
                        {act.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {act.description}
                      </p>

                      {/* Mini Progress bar */}
                      <div className="space-y-1 pt-1 max-w-md">
                        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                          <span>Progresso: {act.progressPercent}%</span>
                          <span>Responsável: {act.responsibleName}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${act.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                        <span>📅 Data: {act.date}</span>
                        <span>⏰ Horário: {act.time}</span>
                      </div>
                    </div>

                    {/* Quick status selector */}
                    <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                      <select
                        value={act.status}
                        onChange={(e) => onQuickUpdateActivityStatus(act.id, e.target.value as any)}
                        className="text-xs px-3 py-2 rounded-xl border border-slate-300/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Concluída">Concluída</option>
                        <option value="Atrasada">Atrasada</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Sectors Workload & Performance */}
        <div className="space-y-6">
          
          {/* Sectors Overview & Workload distribution */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Sectores Operacionais EMRICH ({sectors.length})
              </h3>
              <button
                onClick={() => onNavigateTab('sectors')}
                className="text-[11px] text-emerald-600 font-bold hover:underline"
              >
                Ver Todos
              </button>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {sectors.map(sec => {
                const sectorActivities = activities.filter(a => a.sectorName === sec.name);
                const totalSec = sectorActivities.length;
                const completedSec = sectorActivities.filter(a => a.status === 'Concluída').length;
                const percentSec = totalSec > 0 ? Math.round((completedSec / totalSec) * 100) : 0;

                return (
                  <div 
                    key={sec.id}
                    className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 space-y-2 border border-slate-100 dark:border-slate-800/60 hover:border-emerald-500/30 transition"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: sec.color }} />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{sec.name}</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                        {sec.memberCount} func.
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 flex justify-between">
                      <span>Chefe: {sec.headName}</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{completedSec}/{totalSec} Concluídas ({percentSec}%)</span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentSec}%`, backgroundColor: sec.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Environmental Mission Reminder */}
          <div className="p-5 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
              <Trees className="w-4 h-4 text-emerald-600" />
              Missão do Dep. de Infraestruturas & Espaços Verdes
            </h4>
            <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed font-medium">
              Garantir a preservação e valorização contínua de todo o Parque Urbano da Beira — zelando pelas áreas verdes, iluminação pública, saneamento, edificações e conforto dos cidadãos.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
