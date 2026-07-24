import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  CalendarCheck, 
  UserCheck, 
  Users, 
  Building2, 
  ClipboardCheck, 
  FileText, 
  StickyNote, 
  MapPin, 
  BarChart3, 
  MessageSquare, 
  ShieldAlert,
  Menu,
  ChevronLeft,
  X,
  LogIn
} from 'lucide-react';
import { UserRole, User } from '../types';

export type NavTab = 
  | 'dashboard'
  | 'activities'
  | 'calendar'
  | 'nominations'
  | 'employees'
  | 'sectors'
  | 'inspections'
  | 'reports'
  | 'notes'
  | 'map'
  | 'analytics'
  | 'whatsapp'
  | 'audit';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeRole: UserRole;
  currentUser?: User | null;
  onOpenLoginModal?: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  category: 'principal' | 'gestao' | 'analise';
  minRole?: UserRole[];
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  activeRole,
  currentUser,
  onOpenLoginModal,
  isOpen,
  onToggle
}) => {
  const navItems: NavItem[] = [
    // Category: Principal
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard, category: 'principal' },
    { id: 'activities', label: 'Actividades & Tarefas', icon: CalendarCheck, category: 'principal' },
    { id: 'calendar', label: 'Calendário Operacional', icon: CalendarDays, category: 'principal' },
    { id: 'map', label: 'Mapa do Parque Urbano', icon: MapPin, category: 'principal' },

    // Category: Gestao
    { id: 'nominations', label: 'Nomeação dos Chefes', icon: UserCheck, category: 'gestao', badge: 'Exclusivo' },
    { id: 'employees', label: 'Funcionários (Equipa)', icon: Users, category: 'gestao' },
    { id: 'sectors', label: 'Sectores EMRICH', icon: Building2, category: 'gestao' },

    // Category: Analise
    { id: 'inspections', label: 'Fiscalização Técnico', icon: ClipboardCheck, category: 'analise' },
    { id: 'reports', label: 'Relatórios & Exportação', icon: FileText, category: 'analise' },
    { id: 'analytics', label: 'Indicadores & KPIs', icon: BarChart3, category: 'analise' },
    { id: 'notes', label: 'Bloco de Notas', icon: StickyNote, category: 'analise' },
    { id: 'whatsapp', label: 'WhatsApp Business', icon: MessageSquare, category: 'analise' },
    { id: 'audit', label: 'Auditoria & Segurança', icon: ShieldAlert, category: 'analise', minRole: ['Administrador', 'Director'] },
  ];

  const categories = [
    { id: 'principal', title: 'Módulo Principal' },
    { id: 'gestao', title: 'Gestão & Pessoal' },
    { id: 'analise', title: 'Controlo & Análise' },
  ];

  if (!isOpen) {
    // Collapsed compact bar for desktop
    return (
      <aside className="hidden md:flex flex-col items-center py-4 px-2 w-16 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 shrink-0 space-y-3 transition-all duration-300 z-30">
        <button
          onClick={onToggle}
          className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 transition border border-emerald-200/60 dark:border-emerald-800"
          title="Expandir Menu Lateral (3 Barras)"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800 my-1" />

        <div className="space-y-1.5 w-full flex flex-col items-center overflow-y-auto">
          {navItems.map(item => {
            if (item.minRole && !item.minRole.includes(activeRole)) return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`p-2.5 rounded-2xl transition-all relative group ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                
                {/* Floating Tooltip */}
                <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50 shadow-md">
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      <div 
        className="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 animate-in fade-in"
        onClick={onToggle}
      />

      {/* Expanded Sidebar Navigation */}
      <aside className="fixed md:static inset-y-0 left-0 w-72 md:w-64 z-50 md:z-auto p-3 md:p-4 shrink-0 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-950/50 md:bg-transparent backdrop-blur-md md:backdrop-blur-none transition-all duration-300">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3.5 shadow-md md:shadow-xs space-y-4 max-h-[85vh] overflow-y-auto">
          
          {/* Header Controls inside Sidebar */}
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Menu className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Menu de Funções
              </span>
            </div>
            
            <button
              onClick={onToggle}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
              title="Recolher Menu"
            >
              <ChevronLeft className="w-4 h-4 hidden md:block" />
              <X className="w-4 h-4 md:hidden" />
            </button>
          </div>

          {/* Logged in Collaborator Card */}
          {onOpenLoginModal && (
            <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Colaborador Atual
                </span>
                <button
                  type="button"
                  onClick={onOpenLoginModal}
                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200 underline flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  Trocar / Sector
                </button>
              </div>
              <div className="space-y-0.5">
                <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{currentUser?.name || 'Manuel Alberto'}</span>
                  {currentUser?.sectorName && (
                    <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white rounded-full">
                      {currentUser.sectorName}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {currentUser?.role || activeRole} • {currentUser?.employeeCode || 'EMP-0142'}
                </div>
              </div>
            </div>
          )}

          {categories.map(cat => {
            const catItems = navItems.filter(i => i.category === cat.id);
            if (catItems.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {cat.title}
                </div>

                {catItems.map(item => {
                  if (item.minRole && !item.minRole.includes(activeRole)) return null;

                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        if (window.innerWidth < 768) {
                          onToggle(); // Close mobile drawer on selection
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm dark:bg-emerald-600 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50/80 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider ${
                          isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}

        </div>

        {/* Municipal Footer Banner */}
        <div className="mt-3 p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center">
          <p className="text-[11px] font-black text-slate-800 dark:text-slate-200">
            EMRICH • Infraestruturas
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Dep. Infraestruturas • Parque Urbano
          </p>
        </div>
      </aside>
    </>
  );
};

