import React from 'react';
import { ShieldAlert, X, Lock, FileWarning, Check } from 'lucide-react';
import { UserRole, User } from '../types';

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  activeRole: UserRole;
  attemptedOperation: string;
}

export const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeRole,
  attemptedOperation
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-300 dark:border-rose-900 space-y-5 relative overflow-hidden my-8">
        
        {/* Background glow accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-rose-100 dark:border-rose-900/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 shadow-xs">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white rounded-full">
                Alerta de Segurança
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                Acesso Negado
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Exact Message */}
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 space-y-2">
          <div className="flex items-start gap-2.5">
            <Lock className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <p className="font-extrabold text-sm leading-snug">
              Acesso negado. Não possui permissões para efectuar esta operação.
            </p>
          </div>
        </div>

        {/* Details Box */}
        <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span className="font-medium text-slate-400">Colaborador:</span>
            <span className="font-bold text-slate-900 dark:text-white">{currentUser?.name || 'Utilizador Corrente'}</span>
          </div>

          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span className="font-medium text-slate-400">Perfil Registado:</span>
            <span className="font-extrabold text-rose-700 dark:text-rose-400 uppercase text-[11px] bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
              {currentUser?.role || activeRole}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span className="font-medium text-slate-400">Operação Tentada:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 max-w-[200px] truncate text-right">
              {attemptedOperation}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <FileWarning className="w-3 h-3 text-rose-500" />
              Diário de Auditoria #{Math.floor(10000 + Math.random() * 90000)}
            </span>
            <span>{new Date().toLocaleTimeString('pt-MZ')}</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-center italic">
          Esta ocorrência foi bloqueada pelo controlo de permissões RBAC e registada permanentemente no Diário de Auditoria para fiscalização do Administrador e Direcção.
        </p>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Compreendido & Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
