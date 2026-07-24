import React, { useState } from 'react';
import { ClipboardCheck, Plus, CheckCircle2, XCircle, AlertCircle, FileText, Check, X, ShieldAlert } from 'lucide-react';
import { Inspection, Activity, UserRole } from '../types';

interface InspectionsViewProps {
  inspections: Inspection[];
  activities: Activity[];
  activeRole: UserRole;
  onSaveInspection: (inspection: Inspection) => void;
}

export const InspectionsView: React.FC<InspectionsViewProps> = ({
  inspections,
  activities,
  activeRole,
  onSaveInspection
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(activities[0]?.id || '');

  const [formInspection, setFormInspection] = useState<Partial<Inspection>>({
    inspectorName: 'Alcina Mondlane (Fiscal EMRICH)',
    inspectionDate: new Date().toISOString().split('T')[0],
    isExecutionConfirmed: true,
    conformities: ['Protocolos de sinalização e segurança respeitados', 'Trabalhos executados conforme especificação técnica'],
    nonConformities: [],
    observations: 'Inspecção realizada no local com verificação fotográfica e medição física.',
    technicalOpinion: 'PARECER TÉCNICO Nº 45/2026: O serviço executado pela equipa do sector atende plenamente aos requisitos de fiabilidade.',
    photos: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600'],
    decision: 'Aprovado'
  });

  const [newConformity, setNewConformity] = useState('');
  const [newNonConformity, setNewNonConformity] = useState('');

  const selectedActivity = activities.find(a => a.id === selectedActivityId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;

    const newInsp: Inspection = {
      id: `insp-${Date.now()}`,
      activityId: selectedActivity.id,
      activityTitle: selectedActivity.title,
      sectorName: selectedActivity.sectorName,
      inspectorName: formInspection.inspectorName || 'Fiscalização EMRICH',
      inspectionDate: formInspection.inspectionDate || new Date().toISOString().split('T')[0],
      isExecutionConfirmed: formInspection.isExecutionConfirmed ?? true,
      conformities: formInspection.conformities || [],
      nonConformities: formInspection.nonConformities || [],
      observations: formInspection.observations || '',
      technicalOpinion: formInspection.technicalOpinion || 'Parecer sem observações.',
      photos: formInspection.photos || [],
      decision: (formInspection.decision as any) || 'Aprovado',
      createdAt: new Date().toISOString()
    };

    onSaveInspection(newInsp);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-purple-600" />
            Módulo de Fiscalização & Pareceres Técnicos
          </h2>
          <p className="text-xs text-slate-500">Auditoria no local, conformidades, registo fotográfico e aprovação técnica de serviços</p>
        </div>

        {(activeRole === 'Fiscalização' || activeRole === 'Administrador' || activeRole === 'Director') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Emitir Parecer Técnico
          </button>
        )}
      </div>

      {/* Inspections History List */}
      <div className="space-y-4">
        {inspections.map(insp => (
          <div 
            key={insp.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {insp.sectorName} • Inspecção #{insp.id}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {insp.activityTitle}
                </h3>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                insp.decision === 'Aprovado' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                insp.decision === 'Reprovado' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {insp.decision.toUpperCase()}
              </span>
            </div>

            {/* Technical Opinion Banner */}
            <div className="bg-purple-50 dark:bg-purple-950/40 p-3.5 rounded-xl border border-purple-200 dark:border-purple-800/60 text-xs text-purple-950 dark:text-purple-200 font-mono leading-relaxed">
              <strong>{insp.technicalOpinion}</strong>
            </div>

            {/* Conformities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Conformidades
                </span>
                {insp.conformities.map((c, i) => (
                  <p key={i} className="text-emerald-800 dark:text-emerald-200">• {c}</p>
                ))}
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40">
                <span className="font-bold text-red-900 dark:text-red-300 flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-red-600" /> Não Conformidades
                </span>
                {insp.nonConformities.length === 0 ? (
                  <p className="text-slate-500 italic">Nenhuma não conformidade encontrada.</p>
                ) : (
                  insp.nonConformities.map((nc, i) => (
                    <p key={i} className="text-red-800 dark:text-red-200">• {nc}</p>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Inspector: {insp.inspectorName}</span>
              <span>Data da Inspecção: {insp.inspectionDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Technical Opinion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-purple-600" />
                Emitir Parecer Técnico de Fiscalização
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Actividade a Fiscalizar *</label>
                <select
                  value={selectedActivityId}
                  onChange={(e) => setSelectedActivityId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  {activities.map(a => (
                    <option key={a.id} value={a.id}>#{a.id} - {a.title} ({a.sectorName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Parecer Técnico Oficial *</label>
                <textarea
                  rows={3}
                  required
                  value={formInspection.technicalOpinion}
                  onChange={(e) => setFormInspection({ ...formInspection, technicalOpinion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Decisão Final da Fiscalização</label>
                  <select
                    value={formInspection.decision}
                    onChange={(e) => setFormInspection({ ...formInspection, decision: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                  >
                    <option value="Aprovado">Aprovado</option>
                    <option value="Aprovado com Ressalvas">Aprovado com Ressalvas</option>
                    <option value="Reprovado">Reprovado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Inspector Responsável</label>
                  <input
                    type="text"
                    value={formInspection.inspectorName}
                    onChange={(e) => setFormInspection({ ...formInspection, inspectorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Emitir Parecer Oficial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
