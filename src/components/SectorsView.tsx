import React, { useState } from 'react';
import { Building2, Plus, Smartphone, Users, ShieldCheck, Mail, Check, X } from 'lucide-react';
import { Sector, UserRole } from '../types';

interface SectorsViewProps {
  sectors: Sector[];
  activeRole: UserRole;
  onSaveSector: (sector: Sector) => void;
}

export const SectorsView: React.FC<SectorsViewProps> = ({
  sectors,
  activeRole,
  onSaveSector
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSector, setFormSector] = useState<Partial<Sector>>({
    name: '',
    color: '#00875A',
    department: 'Direcção Operacional',
    headName: 'Chefe de Sector',
    headWhatsapp: '+258840000000',
    headEmail: 'chefe@emrich.co.mz',
    memberCount: 5,
    status: 'Ativo',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSector.name) return;

    const newSec: Sector = {
      id: `sec-${Date.now()}`,
      name: formSector.name,
      color: formSector.color || '#00875A',
      department: formSector.department || 'Direcção Operacional',
      headName: formSector.headName || 'Chefe',
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

        {activeRole === 'Administrador' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs shadow-sm transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            Criar Novo Sector
          </button>
        )}
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
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
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
                  <span className="text-slate-500">WhatsApp:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{sec.headWhatsapp}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <Users className="w-4 h-4 text-emerald-600" />
                {sec.memberCount} Elementos
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                Ativo em Campo
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Sector Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Criar Novo Sector
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
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Departamento</label>
                <input
                  type="text"
                  placeholder="Ex: Direcção de Engenharia e Estudos"
                  value={formSector.department}
                  onChange={(e) => setFormSector({ ...formSector, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cor do Distintivo</label>
                  <input
                    type="color"
                    value={formSector.color}
                    onChange={(e) => setFormSector({ ...formSector, color: e.target.value })}
                    className="w-full h-9 p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nº Inicial de Membros</label>
                  <input
                    type="number"
                    value={formSector.memberCount}
                    onChange={(e) => setFormSector({ ...formSector, memberCount: parseInt(e.target.value) || 1 })}
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Criar Sector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
