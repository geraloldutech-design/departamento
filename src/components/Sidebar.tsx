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
  ShieldAlert
} from 'lucide-react';
import { UserRole } from '../types';

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
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  minRole?: UserRole[];
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, activeRole }) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'activities', label: 'Actividades & Tarefas', icon: CalendarCheck },
    { id: 'calendar', label: 'Calendário Operacional', icon: CalendarDays },
    { id: 'nominations', label: 'Nomeação dos Chefes', icon: UserCheck, badge: 'Exclusivo' },
    { id: 'employees', label: 'Funcionários (Equipa)', icon: Users },
    { id: 'sectors', label: 'Sectores EMRICH', icon: Building2 },
    { id: 'inspections', label: 'Fiscalização Técnico', icon: ClipboardCheck },
    { id: 'reports', label: 'Relatórios & Exportação', icon: FileText },
    { id: 'notes', label: 'Bloco de Notas', icon: StickyNote },
    { id: 'map', label: 'Mapa Rio Chiveve', icon: MapPin },
    { id: 'analytics', label: 'Indicadores & KPIs', icon: BarChart3 },
    { id: 'whatsapp', label: 'WhatsApp Business', icon: MessageSquare },
    { id: 'audit', label: 'Auditoria & Segurança', icon: ShieldAlert, minRole: ['Administrador', 'Director'] },
  ];

  return (
    <aside className="w-full md:w-64 p-3 md:p-4 shrink-0 flex flex-col justify-between">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3 shadow-xs space-y-1">
        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Navegação Principal
        </div>
        
        {navItems.map(item => {
          // Check role restrictions
          if (item.minRole && !item.minRole.includes(activeRole)) {
            return null;
          }

          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm dark:bg-emerald-600'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
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

      {/* Municipal Footer Banner */}
      <div className="mt-3 p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center">
        <p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
          Empresa Municipal do Rio Chiveve
        </p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
          Conselho Municipal da Beira • Sofala
        </p>
      </div>
    </aside>
  );
};
