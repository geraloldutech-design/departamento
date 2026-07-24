import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  KeyRound, 
  Lock, 
  X, 
  CheckCircle2, 
  ArrowRight,
  HardHat,
  Users,
  Briefcase
} from 'lucide-react';
import { UserRole, Sector, User, Employee } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  sectors: Sector[];
  employees: Employee[];
  onLogin: (user: User) => void;
}

const ROLES_LIST: { role: UserRole; title: string; desc: string; badge: string }[] = [
  { role: 'Administrador', title: 'Administrador do Sistema', desc: 'Acesso total, auditoria, configurações e segurança', badge: 'Acesso Total' },
  { role: 'Director', title: 'Director Municipal / Geral', desc: 'Direcção executiva, relatórios gerais e comunicados', badge: 'Estratégico' },
  { role: 'Chefe de Departamento', title: 'Chefe de Departamento', desc: 'Gestão global do Departamento de Infraestruturas', badge: 'Gestão Dep.' },
  { role: 'Chefe do Sector', title: 'Chefe de Sector', desc: 'Liderança operacional das equipas no terreno', badge: 'Operacional' },
  { role: 'Fiscalização', title: 'Fiscal Técnico / Vistorias', desc: 'Inspeção de infraestruturas, obras e pareceres', badge: 'Técnico' },
  { role: 'Funcionário', title: 'Funcionário do Parque', desc: 'Registo de tarefas diárias e execução das frentes de trabalho', badge: 'Equipa' },
];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  sectors,
  employees,
  onLogin
}) => {
  const [selectedName, setSelectedName] = useState<string>(currentUser?.name || 'Manuel Alberto');
  const [selectedSector, setSelectedSector] = useState<string>(currentUser?.sectorName || 'Jardinagem');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser?.role || 'Chefe do Sector');
  const [employeeCode, setEmployeeCode] = useState<string>(currentUser?.employeeCode || 'EMP-0142');
  const [pinCode, setPinCode] = useState<string>('1234');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleQuickSelectEmployee = (emp: Employee) => {
    setSelectedName(emp.name);
    setSelectedSector(emp.sectorName);
    if (emp.cargo.toLowerCase().includes('chefe')) {
      setSelectedRole('Chefe do Sector');
    } else if (emp.cargo.toLowerCase().includes('fiscal')) {
      setSelectedRole('Fiscalização');
    } else {
      setSelectedRole('Funcionário');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedName.trim()) {
      setErrorMsg('Por favor introduza o seu nome de colaborador.');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: selectedName.trim(),
      email: `${selectedName.toLowerCase().replace(/\s+/g, '.')}@emrich.co.mz`,
      role: selectedRole,
      sectorName: selectedSector,
      department: 'Departamento de Infraestruturas',
      employeeCode: employeeCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`
    };

    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-black tracking-wider bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-400/30">
                EMRICH GESTOR • Beira
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                Portal de Acesso do Colaborador
              </h2>
              <p className="text-xs text-emerald-100/80">
                Identifique-se e selecione o seu Sector e Função no Parque Urbano
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-bold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Quick Select Employee Pill List */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Selecione da Lista de Colaboradores Registados:</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Sugestão Rápida</span>
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {employees.slice(0, 5).map(emp => (
                <button
                  type="button"
                  key={emp.id}
                  onClick={() => handleQuickSelectEmployee(emp)}
                  className={`px-3 py-1.5 rounded-2xl border text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                    selectedName === emp.name 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{emp.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Employee Name & Code Input */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Nome do Colaborador *
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={selectedName}
                  onChange={(e) => setSelectedName(e.target.value)}
                  placeholder="Ex: Manuel Alberto"
                  className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Código / NUIT
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  placeholder="EMP-0142"
                  className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Sector Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              1. Selecionar Sector de Atuação do Parque Urbano *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {sectors.map(sec => {
                const isSelected = selectedSector === sec.name;
                return (
                  <button
                    type="button"
                    key={sec.id}
                    onClick={() => setSelectedSector(sec.name)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sec.color }} />
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white mt-2">
                      {sec.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {sec.memberCount} elementos
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role / Function Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              2. Selecionar Função / Perfil de Utilizador *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
              {ROLES_LIST.map(r => {
                const isSelected = selectedRole === r.role;
                return (
                  <button
                    type="button"
                    key={r.role}
                    onClick={() => setSelectedRole(r.role)}
                    className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 ${
                      isSelected
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'}`}>
                      <HardHat className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          {r.title}
                        </span>
                      </div>
                      <p className={`text-[10px] leading-tight ${isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {r.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PIN Access simulation */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">Palavra-passe / PIN de Acesso</span>
                <span className="text-[10px] text-slate-500">Padrão de demonstração: 1234</span>
              </div>
            </div>
            <input
              type="password"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-center font-mono font-bold text-xs"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition"
            >
              <span>Entrar na Plataforma</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
