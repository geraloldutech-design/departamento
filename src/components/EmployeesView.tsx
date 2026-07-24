import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Smartphone, Mail, FileText, Check, X, ShieldCheck } from 'lucide-react';
import { Employee, Sector, UserRole } from '../types';
import { PdfExcelService } from '../services/pdfExcelService';

interface EmployeesViewProps {
  employees: Employee[];
  sectors: Sector[];
  activeRole: UserRole;
  onSaveEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  sectors,
  activeRole,
  onSaveEmployee,
  onDeleteEmployee
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSector, setFilterSector] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formEmployee, setFormEmployee] = useState<Partial<Employee>>({
    name: '',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    biNumber: '',
    cargo: 'Operador de Campo',
    sectorId: sectors[0]?.id || 'sec-1',
    sectorName: sectors[0]?.name || 'Jardinagem',
    department: sectors[0]?.department || 'Gestão Ambiental',
    whatsapp: '+258840000000',
    email: 'funcionario@emrich.co.mz',
    status: 'Ativo',
    admissionDate: new Date().toISOString().split('T')[0]
  });

  const handleSectorChange = (secId: string) => {
    const sec = sectors.find(s => s.id === secId || s.name === secId);
    if (sec) {
      setFormEmployee(prev => ({
        ...prev,
        sectorId: sec.id,
        sectorName: sec.name,
        department: sec.department
      }));
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSec = filterSector === 'todos' || emp.sectorName === filterSector;
    const matchesQuery = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.biNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.cargo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSec && matchesQuery;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmployee.name || !formEmployee.biNumber) return;

    const newEmp: Employee = {
      id: formEmployee.id || `emp-${Date.now()}`,
      name: formEmployee.name,
      photoUrl: formEmployee.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      biNumber: formEmployee.biNumber,
      cargo: formEmployee.cargo || 'Operador',
      sectorId: formEmployee.sectorId || 'sec-1',
      sectorName: formEmployee.sectorName || 'Jardinagem',
      department: formEmployee.department || 'Gestão Ambiental',
      whatsapp: formEmployee.whatsapp || '+258840000000',
      email: formEmployee.email || '',
      status: (formEmployee.status as any) || 'Ativo',
      admissionDate: formEmployee.admissionDate || new Date().toISOString().split('T')[0]
    };

    onSaveEmployee(newEmp);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Cadastro de Funcionários EMRICH
          </h2>
          <p className="text-xs text-slate-500">Registo central do pessoal operacional e técnico dos sectores</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => PdfExcelService.exportEmployeesToExcel(filteredEmployees)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl font-semibold text-xs transition"
          >
            <FileText className="w-4 h-4" />
            Excel
          </button>

          {(activeRole === 'Administrador' || activeRole === 'Director' || activeRole === 'Chefe de Departamento') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Funcionário
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome, BI ou cargo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
          >
            <option value="todos">Todos os Sectores</option>
            {sectors.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map(emp => (
          <div 
            key={emp.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-emerald-500/50 transition flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start gap-3">
              <img 
                src={emp.photoUrl} 
                alt={emp.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" 
              />
              <div className="overflow-hidden space-y-0.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white inline-block" style={{ backgroundColor: sectors.find(s=>s.name===emp.sectorName)?.color || '#00875A' }}>
                  {emp.sectorName}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {emp.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {emp.cargo}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">BI:</span>
                <span className="font-mono font-semibold">{emp.biNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">WhatsApp:</span>
                <span className="font-mono font-semibold">{emp.whatsapp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Admissão:</span>
                <span>{emp.admissionDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                emp.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {emp.status}
              </span>

              {activeRole === 'Administrador' && (
                <button
                  onClick={() => onDeleteEmployee(emp.id)}
                  className="text-xs text-red-500 hover:underline font-semibold"
                >
                  Remover
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Cadastrar Novo Funcionário
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alcina Mondlane"
                  value={formEmployee.name}
                  onChange={(e) => setFormEmployee({ ...formEmployee, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nº do BI *</label>
                  <input
                    type="text"
                    required
                    placeholder="110293847582M"
                    value={formEmployee.biNumber}
                    onChange={(e) => setFormEmployee({ ...formEmployee, biNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cargo / Função *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Operador de Escavadora"
                    value={formEmployee.cargo}
                    onChange={(e) => setFormEmployee({ ...formEmployee, cargo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Sector *</label>
                  <select
                    value={formEmployee.sectorId}
                    onChange={(e) => handleSectorChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    {sectors.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+25884xxxxxxx"
                    value={formEmployee.whatsapp}
                    onChange={(e) => setFormEmployee({ ...formEmployee, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
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
                  Salvar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
