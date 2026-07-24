import React, { useState } from 'react';
import { Building2, Plus, Smartphone, Users, ShieldCheck, Mail, Check, X, Lock } from 'lucide-react';
import { Sector, UserRole } from '../types';

interface SectorsViewProps {
  sectors: Sector[];
  activeRole: UserRole;
  onSaveSector: (sector: Sector) => void;
  onUnauthorizedAction: (attemptedOp: string) => void;
}

export const SectorsView: React.FC<SectorsViewProps> = ({
  sectors,
  activeRole,
  onSaveSector,
  onUnauthorizedAction
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);

  const [formSector, setFormSector] = useState<Partial<Sector>>({
    name: '',
    color: '#00875A',
    department: 'Direcção Operacional de Infraestruturas',
    headName: 'Aguardando Nomeação',
    headWhatsapp: '+258840000000',
    headEmail: 'chefe@emrich.co.mz',
    memberCount: 5,
    status: 'Ativo',
    description: ''
  });

  const handleOpenCreateSector = () => {
    if (activeRole !== 'Administrador') {
      onUnauthorizedAction('Criar ou configurar novo sector operacional por ' + activeRole);
      return;
    }
    setEditingSector(null);
    setFormSector({
      name: '',
      color: '#00875A',
      department: 'Direcção Operacional de Infraestruturas',
      headName: 'Aguardando Nomeação',
      headWhatsapp: '+258840000000',
      headEmail: 'chefe@emrich.co.mz',
      memberCount: 5,
      status: 'Ativo',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditSector = (sec: Sector) => {
    if (activeRole !== 'Administrador' && activeRole !== 'Director') {
      onUnauthorizedAction('Alterar dados estruturais do sector ' + sec.name + ' por ' + activeRole);
      return;
    }
    setEditingSector(sec);
    setFormSector(sec);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSector.name) return;

    if (activeRole !== 'Administrador' && activeRole !== 'Director') {
      onUnauthorizedAction('Gravar alterações do sector por ' + activeRole);
      return;
    }

    const newSec: Sector = {
      id: editingSector ? editingSector.id : `sec-${Date.now()}`,
      name: formSector.name as any,
      color: formSector.color || '#00875A',
      department: formSector.department || 'Direcção Operacional',
      headName: formSector.headName || 'Aguardando Nomeação',
      headWhatsapp: formSector.headWhatsapp || '+258840000000',
      headEmail: formSector.headEmail || '',
      memberCount: formSector.memberCount || 5,
      status: (formSector.status as any) || 'Ativo',
      description: formSector.description || ''
    };

    onSaveSector(newSec);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Sectores Operacionais da EMRICH
          </h2>
          <p className="text-xs text-slate-500">Estrutura organizacional das brigadas da Empresa Municipal do Rio Chiveve</p>
        </div>

        <button
          onClick={handleOpenCreateSector}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Criar Novo Sector
        </button>
      </div>

      {/* Security Note */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          <strong>Proteção de Integridade:</strong> Apenas o <strong>Administrador</strong> e a <strong>Direcção</strong> possuem permissões para configurar novos sectores, alterar departamentos ou contactos de WhatsApp de chefias.
        </span>
      </div>

      {/* Sectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sectors.map(sec => (
          <div 
            key={sec.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-emerald-500/50 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: sec.color }} />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {sec.name}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                  sec.status === 'Ativo' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  {sec.status}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {sec.department}
              </p>

              {sec.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {sec.description}
                </p>
              )}

              <div className="space-y-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500">Chefe Nomeado:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{sec.headName}</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500">WhatsApp Oficial:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{sec.headWhatsapp}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <Users className="w-4 h-4 text-emerald-600" />
                {sec.memberCount} Elementos
              </span>
              
              {(activeRole === 'Administrador' || activeRole === 'Director') ? (
                <button
                  onClick={() => handleOpenEditSector(sec)}
                  className="text-xs font-extrabold text-emerald-600 hover:underline"
                >
                  Editar Sector
                </button>
              ) : (
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Protegido
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New/Edit Sector Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                {editingSector ? 'Editar Sector Operacional' : 'Criar Novo Sector Operacional'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome do Sector *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Topografia & Geodesia"
                  value={formSector.name}
                  onChange={(e) => setFormSector({ ...formSector, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Departamento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Direcção Operacional e Saneamento"
                  value={formSector.department}
                  onChange={(e) => setFormSector({ ...formSector, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Chefe Nomeado</label>
                  <input
                    type="text"
                    placeholder="Nome do Chefe"
                    value={formSector.headName}
                    onChange={(e) => setFormSector({ ...formSector, headName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">WhatsApp Institucional</label>
                  <input
                    type="text"
                    placeholder="+25884xxxxxxx"
                    value={formSector.headWhatsapp}
                    onChange={(e) => setFormSector({ ...formSector, headWhatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Descrição das Competências</label>
                <textarea
                  rows={2}
                  placeholder="Atribuições e responsabilidade operacional da brigada..."
                  value={formSector.description}
                  onChange={(e) => setFormSector({ ...formSector, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Salvar Sector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
