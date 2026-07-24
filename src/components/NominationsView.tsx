import React, { useState } from 'react';
import { UserCheck, Plus, Smartphone, Mail, Calendar, ShieldCheck, History, Check, X, UserX, MessageSquare, AlertCircle } from 'lucide-react';
import { Nomination, Sector, UserRole } from '../types';

interface NominationsViewProps {
  nominations: Nomination[];
  sectors: Sector[];
  activeRole: UserRole;
  onSaveNomination: (nomination: Nomination) => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
}

export const NominationsView: React.FC<NominationsViewProps> = ({
  nominations,
  sectors,
  activeRole,
  onSaveNomination,
  isModalOpen,
  onCloseModal
}) => {
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('todos');
  const [actionType, setActionType] = useState<'Nomeação' | 'Exoneração'>('Nomeação');

  // Direct Exoneration Modal Target
  const [exonerateTarget, setExonerateTarget] = useState<Nomination | null>(null);
  const [exonerationDate, setExonerationDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [exonerationReason, setExonerationReason] = useState<string>('Exonerado do cargo conforme Despacho do Conselho de Administração da EMRICH.');

  // Form State for Main Modal
  const [formNomination, setFormNomination] = useState<Partial<Nomination>>({
    sectorId: sectors[0]?.id || '',
    sectorName: sectors[0]?.name || 'Jardinagem',
    fullName: '',
    cargo: 'Chefe do Sector',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    whatsapp: '+258840000000',
    email: 'chefe@emrich.co.mz',
    startDate: new Date().toISOString().split('T')[0],
    status: 'Ativa',
    notes: 'Nomeado por Despacho do Conselho de Administração da EMRICH.'
  });

  const handleSectorChange = (secId: string) => {
    const sec = sectors.find(s => s.id === secId || s.name === secId);
    if (sec) {
      setFormNomination(prev => ({
        ...prev,
        sectorId: sec.id,
        sectorName: sec.name,
        cargo: `Chefe do Sector de ${sec.name}`
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNomination.fullName || !formNomination.sectorName) return;

    const isExoneracao = actionType === 'Exoneração';

    const newNomination: Nomination = {
      id: `nom-${Date.now()}`,
      sectorId: formNomination.sectorId || 'sec-1',
      sectorName: formNomination.sectorName || 'Jardinagem',
      fullName: formNomination.fullName,
      cargo: formNomination.cargo || 'Chefe de Sector',
      photoUrl: formNomination.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      whatsapp: formNomination.whatsapp || '+258840000000',
      email: formNomination.email || 'chefe@emrich.co.mz',
      startDate: formNomination.startDate || new Date().toISOString().split('T')[0],
      endDate: isExoneracao ? (formNomination.endDate || new Date().toISOString().split('T')[0]) : undefined,
      status: isExoneracao ? 'Exonerado(a)' : 'Ativa',
      notes: formNomination.notes || (isExoneracao ? 'Exonerado do cargo conforme Despacho Municipal.' : 'Nomeado por Despacho do Conselho de Administração.'),
      createdAt: new Date().toISOString()
    };

    onSaveNomination(newNomination);
  };

  const handleConfirmExoneration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exonerateTarget) return;

    const exoneratedNomination: Nomination = {
      ...exonerateTarget,
      status: 'Exonerado(a)',
      endDate: exonerationDate,
      notes: `${exonerateTarget.notes ? exonerateTarget.notes + ' | ' : ''}EXONERAÇÃO (${exonerationDate}): ${exonerationReason}`
    };

    onSaveNomination(exoneratedNomination);
    setExonerateTarget(null);
  };

  const filteredNominations = nominations.filter(n => {
    return selectedSectorFilter === 'todos' || n.sectorName === selectedSectorFilter;
  });

  const canManageNominations = activeRole === 'Administrador' || activeRole === 'Director' || activeRole === 'Chefe de Departamento';

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 shadow-lg border border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-black tracking-tight">NOMEAÇÃO E EXONERAÇÃO DOS CHEFES DE SECTOR</h2>
          </div>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
            Gestão oficial de despachos administrativos de Nomeação e Exoneração dos responsáveis de sector.
            A alteração de chefe atualiza automaticamente o número de WhatsApp do sector e o acesso no portal.
          </p>
        </div>

        {canManageNominations && (
          <button
            onClick={onCloseModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            Novo Acto (Nomeação / Exoneração)
          </button>
        )}
      </div>

      {/* Filter Sector Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-600" />
          Histórico de Actos Oficiais de Nomeação / Exoneração ({filteredNominations.length})
        </span>

        <select
          value={selectedSectorFilter}
          onChange={(e) => setSelectedSectorFilter(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
        >
          <option value="todos">Todos os Sectores</option>
          {sectors.map(s => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Nominations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNominations.map(nom => {
          const isExonerated = nom.status === 'Exonerado(a)' || nom.status === 'Revogada' || nom.status === 'Concluída';
          const cleanPhone = nom.whatsapp.replace(/[^\d+]/g, '');

          return (
            <div 
              key={nom.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl border p-5 shadow-xs transition space-y-4 relative ${
                isExonerated 
                  ? 'border-slate-300 dark:border-slate-800 opacity-90' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <img 
                  src={nom.photoUrl} 
                  alt={nom.fullName}
                  className={`w-14 h-14 rounded-2xl object-cover border-2 shrink-0 ${
                    isExonerated ? 'border-slate-400 grayscale' : 'border-emerald-500/50'
                  }`} 
                />
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-extrabold text-white uppercase tracking-wider inline-block" 
                      style={{ backgroundColor: sectors.find(s=>s.name===nom.sectorName)?.color || '#00875A' }}
                    >
                      {nom.sectorName}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      isExonerated 
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300/40' 
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40'
                    }`}>
                      {nom.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {nom.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    {nom.cargo}
                  </p>
                </div>
              </div>

              {/* Contact & Dates */}
              <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-mono font-bold">{nom.whatsapp}</span>
                  </div>
                  <a
                    href={`https://wa.me/${cleanPhone.replace('+', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition"
                    title="Conversar diretamente no WhatsApp"
                  >
                    <MessageSquare className="w-3 h-3" />
                    Contactar
                  </a>
                </div>

                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="truncate">{nom.email}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Início: <strong>{nom.startDate}</strong> {nom.endDate ? `| Fim: ${nom.endDate}` : '(Em Exercício)'}</span>
                </div>
              </div>

              {nom.notes && (
                <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-200/40 dark:border-amber-800/40">
                  "{nom.notes}"
                </p>
              )}

              {/* Action bar on card */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  WhatsApp Ativo
                </span>

                {!isExonerated && canManageNominations && (
                  <button
                    type="button"
                    onClick={() => {
                      setExonerateTarget(nom);
                      setExonerationDate(new Date().toISOString().split('T')[0]);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold border border-rose-200 dark:border-rose-800 transition"
                  >
                    <UserX className="w-3 h-3" />
                    Exonerar Chefe
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Exoneration Modal */}
      {exonerateTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 dark:border-rose-900 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <UserX className="w-5 h-5" />
                Exonerar Chefe do Sector
              </h3>
              <button onClick={() => setExonerateTarget(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmExoneration} className="space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-extrabold text-slate-900 dark:text-white">
                    {exonerateTarget.fullName}
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">
                    {exonerateTarget.cargo} • Sector de {exonerateTarget.sectorName}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Data Efetiva da Exoneração *
                </label>
                <input
                  type="date"
                  required
                  value={exonerationDate}
                  onChange={(e) => setExonerationDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Referência do Despacho / Motivo de Exoneração *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex: Conforme Despacho Municipal nº 18/2026 de reestruturação do Departamento de Infraestruturas..."
                  value={exonerationReason}
                  onChange={(e) => setExonerationReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setExonerateTarget(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md flex items-center gap-1.5"
                >
                  <UserX className="w-4 h-4" />
                  Confirmar Exoneração
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Nomination / Exoneration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                Registar Acto Administrativo de Chefe de Sector
              </h3>
              <button onClick={onCloseModal} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Action Type selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tipo de Acto Administrativo *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActionType('Nomeação')}
                    className={`p-2.5 rounded-2xl border font-black text-xs transition flex items-center justify-center gap-2 ${
                      actionType === 'Nomeação'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Nomeação</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType('Exoneração')}
                    className={`p-2.5 rounded-2xl border font-black text-xs transition flex items-center justify-center gap-2 ${
                      actionType === 'Exoneração'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <UserX className="w-4 h-4" />
                    <span>Exoneração</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Sector *</label>
                <select
                  value={formNomination.sectorId}
                  onChange={(e) => handleSectorChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  {sectors.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo do Responsável *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Eng. Manuel Macamo"
                  value={formNomination.fullName}
                  onChange={(e) => setFormNomination({ ...formNomination, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Número de WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+25884xxxxxxx"
                    value={formNomination.whatsapp}
                    onChange={(e) => setFormNomination({ ...formNomination, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Institucional</label>
                  <input
                    type="email"
                    placeholder="exemplo@emrich.co.mz"
                    value={formNomination.email}
                    onChange={(e) => setFormNomination({ ...formNomination, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Data de Início</label>
                  <input
                    type="date"
                    value={formNomination.startDate}
                    onChange={(e) => setFormNomination({ ...formNomination, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                {actionType === 'Exoneração' && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Data da Exoneração</label>
                    <input
                      type="date"
                      value={formNomination.endDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormNomination({ ...formNomination, endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Observações do Despacho</label>
                <textarea
                  rows={2}
                  placeholder="Referência do despacho municipal ou nota institucional..."
                  value={formNomination.notes}
                  onChange={(e) => setFormNomination({ ...formNomination, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className={`p-3 rounded-xl text-[11px] border ${
                actionType === 'Nomeação' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              }`}>
                ⚡ <strong>Sincronização Automática:</strong> O contacto oficial de WhatsApp do sector de {formNomination.sectorName} será atualizado para <strong>{formNomination.whatsapp || 'novo número'}</strong>.
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white font-bold shadow-md flex items-center gap-2 ${
                    actionType === 'Nomeação' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  Efetuar {actionType} & Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
