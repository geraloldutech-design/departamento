import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Wifi, 
  WifiOff, 
  Sun, 
  Moon, 
  Smartphone,
  UserCheck,
  Menu,
  X,
  LogIn,
  Building2
} from 'lucide-react';
import { UserRole, User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onOpenLoginModal: () => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenGlobalSearch: () => void;
  onOpenWhatsAppDrawer: () => void;
  unreadNotificationsCount: number;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
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
  currentUser,
  onOpenLoginModal,
  activeRole,
  onRoleChange,
  isDarkMode,
  onToggleDarkMode,
  isOffline,
  onToggleOffline,
  onOpenGlobalSearch,
  onOpenWhatsAppDrawer,
  unreadNotificationsCount,
  isSidebarOpen,
  onToggleSidebar
}) => {
  return (
    <header className="sticky top-0 z-40 bg-emerald-950/95 backdrop-blur-md text-white shadow-sm dark:bg-slate-900/95 border-b border-emerald-900/50 dark:border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Left: 3-Bars Toggle + Brand & Institution */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2.5 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800/90 text-emerald-200 border border-emerald-700/60 transition shadow-xs flex items-center justify-center shrink-0"
            title={isSidebarOpen ? "Ocultar Menu Lateral (3 Barras)" : "Mostrar Menu Lateral (3 Barras)"}
            aria-label="Alternar Menu Lateral"
          >
            {isSidebarOpen ? <X className="w-5 h-5 text-emerald-300" /> : <Menu className="w-5 h-5 text-emerald-300" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 backdrop-blur border border-emerald-400/30 flex items-center justify-center font-bold text-lg text-emerald-300 shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg tracking-tight text-white">EMRICH GESTOR</h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-extrabold bg-emerald-800/80 text-emerald-200 rounded-full border border-emerald-600/40">
                  Infraestruturas • Parque Urbano
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/70 dark:text-slate-400 hidden sm:block">
                Departamento de Infraestruturas • Empresa Municipal do Rio Chiveve (Beira)
              </p>
            </div>
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

          {/* Logged in Collaborator Badge & Login/Sector Button */}
          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-900/90 to-teal-900/90 hover:from-emerald-800 hover:to-teal-800 text-xs text-white border border-emerald-500/40 shadow-xs transition group text-left"
            title="Clique para Entrar ou Alterar Colaborador, Sector e Função"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition">
              <UserCheck className="w-4 h-4" />
            </div>
            
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-white leading-none">
                  {currentUser?.name || 'Colaborador'}
                </span>
                {currentUser?.sectorName && (
                  <span className="px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-200 rounded border border-emerald-400/30">
                    {currentUser.sectorName}
                  </span>
                )}
              </div>
              <span className="block text-[10px] text-emerald-300/80 leading-tight">
                {currentUser?.role || activeRole}
              </span>
            </div>

            <div className="sm:hidden text-left">
              <span className="block text-[10px] font-bold text-white leading-none">{currentUser?.name || 'Login'}</span>
              <span className="block text-[9px] text-emerald-300">{currentUser?.sectorName || activeRole}</span>
            </div>
          </button>

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
