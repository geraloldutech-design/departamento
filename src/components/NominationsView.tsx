import React, { useState } from 'react';
import { UserCheck, Plus, Smartphone, Mail, Calendar, ShieldCheck, History, Check, X } from 'lucide-react';
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

  // Form State
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
      endDate: formNomination.endDate,
      status: (formNomination.status as any) || 'Ativa',
      notes: formNomination.notes || '',
      createdAt: new Date().toISOString()
    };

    onSaveNomination(newNomination);
  };

  const filteredNominations = nominations.filter(n => {
    return selectedSectorFilter === 'todos' || n.sectorName === selectedSectorFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-black tracking-tight">MÓDULO EXCLUSIVO: NOMEAÇÃO DOS CHEFES</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Registo oficial de despaços e nomeações dos responsáveis de sector da EMRICH. Ao registar uma nova nomeação, o destinatário automático do WhatsApp do sector é atualizado em tempo real.
          </p>
        </div>

        {(activeRole === 'Administrador' || activeRole === 'Director') && (
          <button
            onClick={onCloseModal}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nova Nomeação de Chefe
          </button>
        )}
      </div>

      {/* Filter Sector Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-600" />
          Histórico de Nomeações Oficiais ({filteredNominations.length})
        </span>

        <select
          value={selectedSectorFilter}
          onChange={(e) => setSelectedSectorFilter(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
        >
          <option value="todos">Todos os Sectores</option>
          {sectors.map(s => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Nominations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNominations.map(nom => (
          <div 
            key={nom.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-emerald-500 transition space-y-4"
          >
            <div className="flex items-start gap-3">
              <img 
                src={nom.photoUrl} 
                alt={nom.fullName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40 shrink-0" 
              />
              <div className="space-y-1 overflow-hidden">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold text-white uppercase tracking-wider inline-block" style={{ backgroundColor: sectors.find(s=>s.name===nom.sectorName)?.color || '#00875A' }}>
                  {nom.sectorName}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {nom.fullName}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {nom.cargo}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-mono font-semibold">{nom.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="truncate">{nom.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Início: {nom.startDate} {nom.endDate ? `| Fim: ${nom.endDate}` : '(Atual em Exercício)'}</span>
              </div>
            </div>

            {nom.notes && (
              <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200/40 dark:border-amber-800/40">
                "{nom.notes}"
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                WhatsApp Auto-Sincronizado
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                nom.status === 'Ativa' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {nom.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Nomination Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                Registar Nova Nomeação de Chefe
              </h3>
              <button onClick={onCloseModal} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome Completo do Responsável *</label>
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
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Data da Nomeação</label>
                  <input
                    type="date"
                    value={formNomination.startDate}
                    onChange={(e) => setFormNomination({ ...formNomination, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">URL da Fotografia</label>
                  <input
                    type="text"
                    value={formNomination.photoUrl}
                    onChange={(e) => setFormNomination({ ...formNomination, photoUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
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

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                ⚡ <strong>Aviso Automático:</strong> Ao guardar, o contacto de WhatsApp do sector será instantaneamente atualizado para <strong>{formNomination.whatsapp || 'novo número'}</strong>.
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Efetuar Nomeação & Sincronizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
