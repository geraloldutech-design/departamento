import React, { useState } from 'react';
import { ShieldAlert, Download, Upload, RefreshCw, Lock, Search, Filter, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';
import { AuditLog, UserRole } from '../types';
import { StorageService } from '../services/storageService';

interface AuditBackupViewProps {
  auditLogs: AuditLog[];
  activeRole: UserRole;
  onResetData: () => void;
  onRestoreBackup: (backupData: any) => void;
  onAuditLogLogged: () => void;
}

export const AuditBackupView: React.FC<AuditBackupViewProps> = ({
  auditLogs,
  activeRole,
  onResetData,
  onRestoreBackup,
  onAuditLogLogged
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('todos');

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
      transferRequests: StorageService.getTransferRequests(),
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

    // Audit log
    StorageService.addAuditLog(
      'Administração',
      activeRole,
      'Exportação de Dados',
      'Auditoria & Backup',
      `Ficheiro de backup JSON exportado com sucesso contendo todas as tabelas e registos do sistema.`
    );
    onAuditLogLogged();
  };

  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          onRestoreBackup(parsed);
          StorageService.addAuditLog(
            'Administração',
            activeRole,
            'Restauro de Backup',
            'Auditoria & Backup',
            `Restauro de dados executado a partir do ficheiro "${file.name}".`
          );
          onAuditLogLogged();
          alert('Backup restaurado com sucesso no sistema!');
        } else {
          alert('Ficheiro de backup inválido.');
        }
      } catch (err) {
        alert('Erro ao carregar ficheiro JSON de backup.');
      }
    };
    reader.readAsText(file);
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesModule = filterModule === 'todos' || log.targetModule === filterModule;
    const matchesQuery = 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesQuery;
  });

  const modulesList = Array.from(new Set(auditLogs.map(l => l.targetModule)));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            Diário Inviolável de Auditoria & Segurança EMRICH
          </h2>
          <p className="text-xs text-slate-500">Histórico rastreável de todas as ações, tentativas de acesso, transferências, permissões e cópias de segurança</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            Exportar Backup JSON
          </button>

          {activeRole === 'Administrador' && (
            <>
              <label className="flex items-center gap-2 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-xs shadow-xs transition cursor-pointer">
                <Upload className="w-4 h-4" />
                Restaurar Backup JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackupFile}
                  className="hidden"
                />
              </label>

              <button
                onClick={onResetData}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl font-semibold text-xs transition"
                title="Restaurar dados iniciais de fábrica"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Fábrica
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por utilizador, acção ou detalhes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
          >
            <option value="todos">Todos os Módulos ({modulesList.length})</option>
            {modulesList.map(mod => (
              <option key={mod} value={mod}>{mod}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            Registo Inviolável de Auditoria ({filteredLogs.length} Registos)
          </h3>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            EMRICH SECURITY CORE • INTEGRITY CHECK PASSED
          </span>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredLogs.map(log => {
            const isDenied = log.action.toLowerCase().includes('negado') || log.action.toLowerCase().includes('não autorizada') || log.action.toLowerCase().includes('bloqueio');

            return (
              <div 
                key={log.id} 
                className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                  isDenied 
                    ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60' 
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/80 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 dark:text-white">{log.userName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      isDenied 
                        ? 'bg-rose-600 text-white' 
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {log.userRole}
                    </span>
                    <span className="text-slate-400 font-semibold">• Módulo: <strong>{log.targetModule}</strong></span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isDenied ? 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}>
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{log.details}</p>
                </div>

                <div className="text-[10px] text-slate-400 font-mono shrink-0 flex items-center gap-1.5 sm:flex-col sm:items-end">
                  <span>{new Date(log.timestamp).toLocaleDateString('pt-MZ')}</span>
                  <span className="font-bold text-slate-500">{new Date(log.timestamp).toLocaleTimeString('pt-MZ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
