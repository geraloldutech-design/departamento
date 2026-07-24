import React, { useState } from 'react';
import { FileText, Plus, Download, CheckCircle, Clock, ShieldCheck, Check, X, FileSpreadsheet } from 'lucide-react';
import { ActivityReport, Activity, Sector, UserRole } from '../types';
import { PdfExcelService } from '../services/pdfExcelService';

interface ReportsViewProps {
  reports: ActivityReport[];
  activities: Activity[];
  sectors: Sector[];
  activeRole: UserRole;
  onSaveReport: (report: ActivityReport) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  reports,
  activities,
  sectors,
  activeRole,
  onSaveReport
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(activities[0]?.id || '');

  const [formReport, setFormReport] = useState<Partial<ActivityReport>>({
    submittedBy: 'Téc. Fernando Tembe',
    submittedByRole: 'Chefe de Sector',
    startTime: '07:30',
    endTime: '12:00',
    materialsUsed: '20 sacos de cimento, 5m3 de areia fina, luvas e fitas de isolamento',
    problemsEncountered: 'Acesso condicionado pelas águas da maré alta entre as 09:00 e as 10:30.',
    progressPercent: 100,
    summaryText: 'Serviço concluído conforme o plano de trabalhos sem incidentes de segurança.',
    digitalSignature: 'Visto Digital #9928 - Chefe do Sector'
  });

  const selectedActivity = activities.find(a => a.id === selectedActivityId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;

    const newRep: ActivityReport = {
      id: `rep-${Date.now()}`,
      activityId: selectedActivity.id,
      activityTitle: selectedActivity.title,
      sectorName: selectedActivity.sectorName,
      submittedBy: formReport.submittedBy || 'Chefe do Sector',
      submittedByRole: formReport.submittedByRole || 'Chefe de Sector',
      startTime: formReport.startTime || '08:00',
      endTime: formReport.endTime || '12:00',
      materialsUsed: formReport.materialsUsed || '',
      problemsEncountered: formReport.problemsEncountered || '',
      progressPercent: formReport.progressPercent || 100,
      summaryText: formReport.summaryText || '',
      photos: ['https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=600'],
      digitalSignature: formReport.digitalSignature || 'Assinatura Digital Validade EMRICH',
      status: 'Pendente Aprovação',
      createdAt: new Date().toISOString()
    };

    onSaveReport(newRep);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Relatórios Operacionais & Exportação
          </h2>
          <p className="text-xs text-slate-500">Submissão de relatórios de campo, assinaturas digitais e exportação de PDF/Excel</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => PdfExcelService.exportPeriodicReportPDF('Diário', activities, sectors)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition"
          >
            PDF Diário
          </button>

          <button
            onClick={() => PdfExcelService.exportPeriodicReportPDF('Mensal', activities, sectors)}
            className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold rounded-xl transition"
          >
            PDF Mensal
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Submeter Novo Relatório
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map(rep => {
          const matchingAct = activities.find(a => a.id === rep.activityId);

          return (
            <div 
              key={rep.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold text-white uppercase tracking-wider" style={{ backgroundColor: sectors.find(s=>s.name===rep.sectorName)?.color || '#00875A' }}>
                    {rep.sectorName}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Relatório #{rep.id}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {rep.activityTitle}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {rep.summaryText}
                </p>

                <div className="space-y-1 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  <p><strong>Horário:</strong> {rep.startTime} às {rep.endTime}</p>
                  <p><strong>Materiais:</strong> {rep.materialsUsed}</p>
                  <p><strong>Ocorrências:</strong> {rep.problemsEncountered || 'Sem problemas'}</p>
                  {rep.digitalSignature && (
                    <p className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                      <strong>Assinatura:</strong> {rep.digitalSignature}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">Por: {rep.submittedBy}</span>
                {matchingAct && (
                  <button
                    onClick={() => PdfExcelService.exportActivityToPDF(matchingAct, rep)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs rounded-lg hover:bg-indigo-100 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Descarregar PDF
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Submeter Relatório de Execução Operacional
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Actividade *</label>
                <select
                  value={selectedActivityId}
                  onChange={(e) => setSelectedActivityId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  {activities.map(a => (
                    <option key={a.id} value={a.id}>#{a.id} - {a.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Hora de Início</label>
                  <input
                    type="time"
                    value={formReport.startTime}
                    onChange={(e) => setFormReport({ ...formReport, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Hora de Fim</label>
                  <input
                    type="time"
                    value={formReport.endTime}
                    onChange={(e) => setFormReport({ ...formReport, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Resumo dos Trabalhos *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva o que foi realizado..."
                  value={formReport.summaryText}
                  onChange={(e) => setFormReport({ ...formReport, summaryText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Materiais Efetivamente Utilizados</label>
                <input
                  type="text"
                  placeholder="Sacos de cimento, combustível, tubos, etc."
                  value={formReport.materialsUsed}
                  onChange={(e) => setFormReport({ ...formReport, materialsUsed: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assinatura Digital / Visto do Chefe</label>
                <input
                  type="text"
                  value={formReport.digitalSignature}
                  onChange={(e) => setFormReport({ ...formReport, digitalSignature: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Submeter Relatório
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
