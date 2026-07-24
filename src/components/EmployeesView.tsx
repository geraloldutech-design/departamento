import React, { useState } from 'react';
import { Users, Plus, Search, Filter, FileText, Check, X, ArrowRightLeft, ShieldCheck, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { Employee, Sector, UserRole, User, TransferRequest } from '../types';
import { PdfExcelService } from '../services/pdfExcelService';

interface EmployeesViewProps {
  employees: Employee[];
  sectors: Sector[];
  activeRole: UserRole;
  currentUser: User | null;
  transferRequests: TransferRequest[];
  onSaveEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  onRequestTransfer: (req: TransferRequest) => void;
  onApproveTransfer: (reqId: string) => void;
  onRejectTransfer: (reqId: string) => void;
  onUnauthorizedAction: (attemptedOp: string) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  sectors,
  activeRole,
  currentUser,
  transferRequests,
  onSaveEmployee,
  onDeleteEmployee,
  onRequestTransfer,
  onApproveTransfer,
  onRejectTransfer,
  onUnauthorizedAction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSector, setFilterSector] = useState('todos');
  const [activeTab, setActiveTab] = useState<'colaboradores' | 'transferencias'>('colaboradores');
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [transferTargetEmployee, setTransferTargetEmployee] = useState<Employee | null>(null);

  // Transfer Form State
  const [targetSectorId, setTargetSectorId] = useState<string>(sectors[0]?.id || '');
  const [transferReason, setTransferReason] = useState<string>('');

  // Form State for Employee
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

  const handleOpenCreateModal = () => {
    // Check permissions: Funcionário or Chefe do Sector cannot register new staff directly without Dept Head / Director / Admin authorization
    if (activeRole === 'Funcionário' || activeRole === 'Chefe do Sector') {
      onUnauthorizedAction('Tentativa de registar/alterar colaborador por ' + activeRole);
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleOpenTransferModal = (emp: Employee) => {
    // Check permission: Transfer request requires Chefe de Departamento, Director or Administrador
    if (activeRole !== 'Chefe de Departamento' && activeRole !== 'Director' && activeRole !== 'Administrador') {
      onUnauthorizedAction('Solicitação de transferência de sector de colaborador por ' + activeRole);
      return;
    }

    setTransferTargetEmployee(emp);
    const availableSector = sectors.find(s => s.id !== emp.sectorId);
    setTargetSectorId(availableSector ? availableSector.id : sectors[0]?.id || '');
    setTransferReason('Solicitação de transferência por necessidade de serviço no sector de destino.');
  };

  const handleSubmitTransferRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTargetEmployee) return;

    const targetSec = sectors.find(s => s.id === targetSectorId);
    if (!targetSec) return;

    const newReq: TransferRequest = {
      id: `tr-${Date.now()}`,
      employeeId: transferTargetEmployee.id,
      employeeName: transferTargetEmployee.name,
      fromSectorId: transferTargetEmployee.sectorId,
      fromSectorName: transferTargetEmployee.sectorName,
      toSectorId: targetSec.id,
      toSectorName: targetSec.name,
      requestedBy: currentUser?.name || 'Chefe de Departamento',
      requestedByRole: activeRole,
      reason: transferReason || 'Transferência entre sectores por decisão administrativa.',
      status: 'Pendente',
      createdAt: new Date().toISOString()
    };

    onRequestTransfer(newReq);
    setTransferTargetEmployee(null);
  };

  const handleSubmitEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmployee.name || !formEmployee.biNumber) return;

    if (activeRole === 'Funcionário' || activeRole === 'Chefe do Sector') {
      onUnauthorizedAction('Alteração não autorizada de sector e dados de colaborador por ' + activeRole);
      return;
    }

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
    setIsCreateModalOpen(false);
  };

  const pendingTransferCount = transferRequests.filter(r => r.status === 'Pendente').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Quadro de Pessoal & Transferências EMRICH
          </h2>
          <p className="text-xs text-slate-500">Registo central do pessoal operacional, chefias e fluxo de transferências de sector</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => PdfExcelService.exportEmployeesToExcel(filteredEmployees)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl font-semibold text-xs transition"
          >
            <FileText className="w-4 h-4" />
            Excel
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Funcionário
          </button>
        </div>
      </div>

      {/* Tabs Bar: Colaboradores vs Transferencias */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('colaboradores')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition flex items-center gap-2 ${
            activeTab === 'colaboradores'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Quadros por Sector ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transferencias')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition flex items-center gap-2 relative ${
            activeTab === 'transferencias'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Solicitações de Transferência ({transferRequests.length})</span>
          {pendingTransferCount > 0 && (
            <span className="px-1.5 py-0.5 text-[9px] font-black bg-amber-500 text-slate-950 rounded-full">
              {pendingTransferCount} Pendente(s)
            </span>
          )}
        </button>
      </div>

      {/* VIEW 1: COLABORADORES */}
      {activeTab === 'colaboradores' && (
        <div className="space-y-6">
          
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
                      Sector de {emp.sectorName}
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

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenTransferModal(emp)}
                      className="px-2 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-extrabold text-[10px] border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition flex items-center gap-1"
                      title="Solicitar Transferência de Sector"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      Transferir
                    </button>

                    {activeRole === 'Administrador' && (
                      <button
                        type="button"
                        onClick={() => onDeleteEmployee(emp.id)}
                        className="text-xs text-rose-500 hover:underline font-semibold"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* VIEW 2: TRANSFERENCIAS */}
      {activeTab === 'transferencias' && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs space-y-1">
            <h4 className="font-extrabold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Fluxo Obrigatório de Transferência de Colaboradores
            </h4>
            <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
              Conforme as diretrizes organizacionais: <strong>Chefe de Departamento → Solicitação</strong> | <strong>Administrador → Aprovação</strong> | <strong>Sistema → Actualização Automática do Sector e Histórico</strong>. Nenhuma alteração ocorre sem aprovação prévia.
            </p>
          </div>

          <div className="space-y-3">
            {transferRequests.map(req => (
              <div 
                key={req.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      {req.employeeName}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Solicitado por: <strong>{req.requestedBy}</strong> ({req.requestedByRole})
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      req.status === 'Pendente' 
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/40' 
                        : req.status === 'Aprovado'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      Sector Origem: <strong>{req.fromSectorName}</strong>
                    </span>
                    <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      Sector Destino: <strong>{req.toSectorName}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    "{req.reason}"
                  </p>
                </div>

                {/* Actions for Admin */}
                <div className="flex items-center gap-2 shrink-0">
                  {req.status === 'Pendente' && activeRole === 'Administrador' && (
                    <>
                      <button
                        type="button"
                        onClick={() => onApproveTransfer(req.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Aprovar Transferência
                      </button>
                      <button
                        type="button"
                        onClick={() => onRejectTransfer(req.id)}
                        className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-extrabold text-xs border border-rose-200 dark:border-rose-800 transition flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeitar
                      </button>
                    </>
                  )}

                  {req.status === 'Pendente' && activeRole !== 'Administrador' && (
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Aguardando Aprovação do Administrador
                    </span>
                  )}

                  {req.status === 'Aprovado' && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Aprovado por {req.approvedBy || 'Administrador'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Transfer Request Modal */}
      {transferTargetEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sky-200 dark:border-sky-900 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-sky-800 dark:text-sky-300 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-sky-600" />
                Solicitar Transferência de Sector
              </h3>
              <button onClick={() => setTransferTargetEmployee(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTransferRequest} className="space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between">
                <div>
                  <span className="block font-extrabold text-slate-900 dark:text-white">
                    {transferTargetEmployee.name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Sector Actual: <strong>{transferTargetEmployee.sectorName}</strong>
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-sky-600 text-white">
                  {transferTargetEmployee.cargo}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Novo Sector de Destino *
                </label>
                <select
                  value={targetSectorId}
                  onChange={(e) => setTargetSectorId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                >
                  {sectors.map(s => (
                    <option key={s.id} value={s.id} disabled={s.id === transferTargetEmployee.sectorId}>
                      Sector de {s.name} {s.id === transferTargetEmployee.sectorId ? '(Sector Actual)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Motivação / Fundamentação do Pedido *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex: Reforço de contingente em virtude da empreitada de manutenção da bacia de contenção..."
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
                ⚠️ O pedido será submetido como <strong>Pendente</strong> para decisão formal e validação do <strong>Administrador do Sistema</strong>.
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTransferTargetEmployee(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Submeter Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Employee Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Cadastrar Novo Funcionário
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEmployee} className="space-y-3 text-xs">
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
                  onClick={() => setIsCreateModalOpen(false)}
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
