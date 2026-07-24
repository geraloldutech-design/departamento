import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  Wifi, 
  WifiOff, 
  Sun, 
  Moon, 
  Smartphone,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenGlobalSearch: () => void;
  onOpenWhatsAppDrawer: () => void;
  unreadNotificationsCount: number;
}

const ROLES: { role: UserRole; label: string; desc: string }[] = [
  { role: 'Administrador', label: 'Administrador', desc: 'Acesso total & Gestão do Sistema' },
  { role: 'Director', label: 'Director Geral', desc: 'Visão Estratégica & Aprovações' },
  { role: 'Chefe de Departamento', label: 'Chefe de Dept.', desc: 'Gestão dos Sectores' },
  { role: 'Fiscalização', label: 'Fiscalização', desc: 'Inspeção & Parecer Técnico' },
  { role: 'Chefe do Sector', label: 'Chefe do Sector', desc: 'Atribuição & Relatórios' },
  { role: 'Funcionário', label: 'Funcionário', desc: 'Execução de Tarefas' },
];

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onRoleChange,
  isDarkMode,
  onToggleDarkMode,
  isOffline,
  onToggleOffline,
  onOpenGlobalSearch,
  onOpenWhatsAppDrawer,
  unreadNotificationsCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-emerald-950/95 backdrop-blur-md text-white shadow-sm dark:bg-slate-900/95 border-b border-emerald-900/50 dark:border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Institution */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 backdrop-blur border border-emerald-400/30 flex items-center justify-center font-bold text-lg text-emerald-300 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg tracking-tight text-white">EMRICH GESTOR</h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-extrabold bg-emerald-800/80 text-emerald-200 rounded-full border border-emerald-600/40">
                Rio Chiveve - Beira
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/70 dark:text-slate-400 hidden sm:block">
              Empresa Municipal do Rio Chiveve
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Global Search Button */}
          <button
            onClick={onOpenGlobalSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-100 text-xs border border-emerald-700/50 transition shadow-xs"
            title="Pesquisa Global"
          >
            <Search className="w-4 h-4 text-emerald-300" />
            <span className="hidden md:inline font-medium">Pesquisar...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-emerald-950 text-emerald-300 rounded-lg border border-emerald-800 font-mono">⌘K</kbd>
          </button>

          {/* Role Switcher */}
          <div className="relative group">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 text-xs text-white border border-emerald-700/60 cursor-pointer shadow-xs transition">
              <UserCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <div className="text-left">
                <span className="block text-[9px] text-emerald-300 uppercase font-extrabold leading-none">Perfil</span>
                <span className="font-semibold text-xs leading-tight">{activeRole}</span>
              </div>
            </div>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 py-2 hidden group-hover:block z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Alternar Perfil do Utilizador
              </div>
              {ROLES.map(r => (
                <button
                  key={r.role}
                  onClick={() => onRoleChange(r.role)}
                  className={`w-full text-left px-3.5 py-2 text-xs flex flex-col hover:bg-emerald-50 dark:hover:bg-slate-800 transition ${
                    activeRole === r.role ? 'bg-emerald-50/80 text-emerald-900 font-bold dark:bg-slate-800 dark:text-emerald-400' : ''
                  }`}
                >
                  <span className="font-semibold">{r.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Offline Mode Toggle Button */}
          <button
            onClick={onToggleOffline}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold border transition shadow-xs ${
              isOffline 
                ? 'bg-amber-500/20 text-amber-200 border-amber-400/40 animate-pulse' 
                : 'bg-emerald-900/60 text-emerald-200 border-emerald-700/50 hover:bg-emerald-800/80'
            }`}
            title={isOffline ? 'Modo Offline Ativo - Alterações gravadas localmente' : 'Modo Online'}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline text-amber-200">Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-emerald-300" />
                <span className="hidden sm:inline text-emerald-200">Online</span>
              </>
            )}
          </button>

          {/* WhatsApp Drawer Trigger */}
          <button
            onClick={onOpenWhatsAppDrawer}
            className="relative p-2 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 transition shadow-xs"
            title="WhatsApp Business Platform & Notificações"
          >
            <Smartphone className="w-4 h-4 text-emerald-300" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 text-emerald-950 font-black text-[10px] flex items-center justify-center animate-bounce shadow-xs">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Light/Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 transition shadow-xs"
            title="Alternar Modo Claro / Escuro"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-emerald-200" />}
          </button>

        </div>
      </div>
    </header>
  );
};
