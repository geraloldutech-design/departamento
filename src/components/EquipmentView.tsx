import React, { useState } from 'react';
import { EquipmentItem, MaintenanceRecord, UserRole, Sector } from '../types';
import { 
  Wrench, 
  Plus, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Calendar,
  DollarSign,
  ShieldAlert
} from 'lucide-react';

interface EquipmentViewProps {
  equipment: EquipmentItem[];
  sectors: Sector[];
  activeRole: UserRole;
  onSaveEquipment: (eq: EquipmentItem) => void;
  onAddMaintenance: (eqId: string, record: MaintenanceRecord) => void;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({
  equipment,
  sectors,
  activeRole,
  onSaveEquipment,
  onAddMaintenance
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [conditionFilter, setConditionFilter] = useState('Todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMaintModalOpen, setIsMaintModalOpen] = useState(false);
  const [selectedEqForMaint, setSelectedEqForMaint] = useState<EquipmentItem | null>(null);

  // New Equipment Form
  const [code, setCode] = useState(`EQP-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<EquipmentItem['category']>('Ferramentas Manuais');
  const [serialNumber, setSerialNumber] = useState('');
  const [condition, setCondition] = useState<EquipmentItem['condition']>('Excelente');
  const [assignedToName, setAssignedToName] = useState('');
  const [assignedToSectorName, setAssignedToSectorName] = useState(sectors[0]?.name || 'Jardinagem');

  // Maintenance Form
  const [maintType, setMaintType] = useState<'Preventiva' | 'Correctiva'>('Preventiva');
  const [maintDesc, setMaintDesc] = useState('');
  const [maintCost, setMaintCost] = useState(1500);
  const [maintBy, setMaintBy] = useState('Oficina Central EMRICH');

  const filteredEquipment = equipment.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCond = conditionFilter === 'Todos' || e.condition === conditionFilter;
    return matchesSearch && matchesCond;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEq: EquipmentItem = {
      id: `eq-${Date.now()}`,
      code,
      name,
      category,
      serialNumber: serialNumber || 'SN-EMRICH-GEN',
      condition,
      assignedToName: assignedToName || undefined,
      assignedToSectorName: assignedToSectorName || undefined,
      checkoutDate: assignedToName ? new Date().toISOString().split('T')[0] : undefined,
      nextPreventiveMaintenanceDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maintenanceHistory: []
    };

    onSaveEquipment(newEq);
    setIsAddModalOpen(false);
    setName('');
  };

  const handleMaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEqForMaint || !maintDesc.trim()) return;

    const newRec: MaintenanceRecord = {
      id: `maint-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: maintType,
      description: maintDesc,
      cost: Number(maintCost),
      performedBy: maintBy
    };

    onAddMaintenance(selectedEqForMaint.id, newRec);
    setIsMaintModalOpen(false);
    setMaintDesc('');
  };

  const getConditionBadge = (cond: EquipmentItem['condition']) => {
    switch (cond) {
      case 'Excelente':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">Excelente</span>;
      case 'Bom':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">Bom</span>;
      case 'Regular':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">Regular</span>;
      case 'Danificado':
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-semibold">Danificado</span>;
      case 'Em Manutenção':
        return <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-semibold">Em Manutenção</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestão de Ferramentas e Equipamentos</h1>
            <p className="text-sm text-slate-500">Controlo de atibuição, estado de conservação e histórico de manutenção preventiva</p>
          </div>
        </div>

        {(activeRole === 'Administrador' || activeRole === 'Director' || activeRole === 'Chefe de Departamento' || activeRole === 'Chefe do Sector') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Equipamento</span>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por nome, código ou nº de série..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={conditionFilter}
            onChange={e => setConditionFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Todos">Todos os Estados</option>
            <option value="Excelente">Excelente</option>
            <option value="Bom">Bom</option>
            <option value="Regular">Regular</option>
            <option value="Danificado">Danificado</option>
            <option value="Em Manutenção">Em Manutenção</option>
          </select>
        </div>
      </div>

      {/* Grid of Equipment */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEquipment.map(eq => (
          <div key={eq.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                    {eq.code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-1">{eq.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">S/N: {eq.serialNumber}</p>
                </div>
                {getConditionBadge(eq.condition)}
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span>Responsável: <strong className="text-slate-800">{eq.assignedToName || 'Em Armazém'}</strong></span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Próxima Manutenção: <strong className="text-slate-800">{eq.nextPreventiveMaintenanceDate || 'N/A'}</strong></span>
                </div>

                {eq.maintenanceHistory.length > 0 && (
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                    <p className="text-xs font-semibold text-slate-700 mb-1">Última Manutenção:</p>
                    <p className="text-slate-600 italic">"{eq.maintenanceHistory[eq.maintenanceHistory.length - 1].description}"</p>
                    <p className="text-slate-400 text-[10px] mt-1">{eq.maintenanceHistory[eq.maintenanceHistory.length - 1].date} - {eq.maintenanceHistory[eq.maintenanceHistory.length - 1].cost} MZN</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">{eq.category}</span>
              <button
                onClick={() => {
                  setSelectedEqForMaint(eq);
                  setIsMaintModalOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold transition"
              >
                + Registar Manutenção
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD EQUIPMENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Cadastrar Novo Equipamento</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Código</label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  >
                    <option value="Máquinas Pesadas">Máquinas Pesadas</option>
                    <option value="Equipamento Elétrico">Equipamento Elétrico</option>
                    <option value="Ferramentas Manuais">Ferramentas Manuais</option>
                    <option value="Medição & Topografia">Medição & Topografia</option>
                    <option value="Proteção Individual">Proteção Individual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Nome do Equipamento / Ferramenta</label>
                <input
                  type="text"
                  placeholder="Ex: Roçadora Profissional Stihl FS-460"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Número de Série / Chassis</label>
                  <input
                    type="text"
                    placeholder="Ex: SN-88291-MZ"
                    value={serialNumber}
                    onChange={e => setSerialNumber(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Estado de Conservação</label>
                  <select
                    value={condition}
                    onChange={e => setCondition(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  >
                    <option value="Excelente">Excelente</option>
                    <option value="Bom">Bom</option>
                    <option value="Regular">Regular</option>
                    <option value="Danificado">Danificado</option>
                    <option value="Em Manutenção">Em Manutenção</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Responsável Inicial / Operador</label>
                <input
                  type="text"
                  placeholder="Ex: Samuel Bila (ou deixe em branco se no armazém)"
                  value={assignedToName}
                  onChange={e => setAssignedToName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MAINTENANCE */}
      {isMaintModalOpen && selectedEqForMaint && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Registar Manutenção</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedEqForMaint.name} ({selectedEqForMaint.code})</p>

            <form onSubmit={handleMaintSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Tipo de Manutenção</label>
                <select
                  value={maintType}
                  onChange={e => setMaintType(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                >
                  <option value="Preventiva">Preventiva (Revisão periódica)</option>
                  <option value="Correctiva">Correctiva (Avaria/Reparação)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Descrição do Serviço Realizado</label>
                <textarea
                  rows={3}
                  value={maintDesc}
                  onChange={e => setMaintDesc(e.target.value)}
                  placeholder="Substituição de filtro, óleo, afinação..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Custo Total (MZN)</label>
                  <input
                    type="number"
                    value={maintCost}
                    onChange={e => setMaintCost(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Executado por</label>
                  <input
                    type="text"
                    value={maintBy}
                    onChange={e => setMaintBy(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMaintModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Gravar Histórico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
