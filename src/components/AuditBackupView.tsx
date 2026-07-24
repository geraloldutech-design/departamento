import React from 'react';
import { ShieldAlert, Download, RefreshCw, Lock, CheckCircle2 } from 'lucide-react';
import { AuditLog, UserRole } from '../types';
import { StorageService } from '../services/storageService';

interface AuditBackupViewProps {
  auditLogs: AuditLog[];
  activeRole: UserRole;
  onResetData: () => void;
}

export const AuditBackupView: React.FC<AuditBackupViewProps> = ({ auditLogs, activeRole, onResetData }) => {
  const handleExportBackup = () => {
    const backupData = {
      sectors: StorageService.getSectors(),
      nominations: StorageService.getNominations(),
      employees: StorageService.getEmployees(),
      activities: StorageService.getActivities(),
      reports: StorageService.getReports(),
      inspections: StorageService.getInspections(),
      notes: StorageService.getNotes(),
      auditLogs: StorageService.getAuditLogs(),
      exportedAt: new Date().toISOString()
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EMRICH_GESTOR_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            Registo de Auditoria & Segurança do Sistema
          </h2>
          <p className="text-xs text-slate-500">Histórico de ações, backups e permissões do sistema EMRICH GESTOR</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            Descarregar Backup JSON
          </button>

          {activeRole === 'Administrador' && (
            <button
              onClick={onResetData}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-xl font-semibold text-xs transition"
              title="Restaurar dados iniciais"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Dados
            </button>
          )}
        </div>
      </div>

      {/* Audit Log Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          Registo Inviolável de Auditoria ({auditLogs.length} Entradas)
        </h3>

        <div className="space-y-3">
          {auditLogs.map(log => (
            <div 
              key={log.id} 
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{log.userName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                    {log.userRole}
                  </span>
                  <span className="text-slate-400">• {log.targetModule}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{log.details}</p>
              </div>

              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                {new Date(log.timestamp).toLocaleString('pt-MZ')}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
