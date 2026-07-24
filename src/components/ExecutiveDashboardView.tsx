import React from 'react';
import { 
  Activity, 
  Sector, 
  MaterialItem, 
  VehicleItem, 
  Incident, 
  Employee,
  UserRole 
} from '../types';
import { 
  TrendingUp, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Package, 
  Truck, 
  Users,
  ShieldAlert,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';

interface ExecutiveDashboardViewProps {
  activities: Activity[];
  sectors: Sector[];
  materials: MaterialItem[];
  vehicles: VehicleItem[];
  incidents: Incident[];
  employees: Employee[];
  activeRole: UserRole;
  onNavigateTab: (tab: string) => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  activities,
  sectors,
  materials,
  vehicles,
  incidents,
  employees,
  activeRole,
  onNavigateTab
}) => {
  // KPI Calculations
  const totalActivities = activities.length;
  const completedActivities = activities.filter(a => a.status === 'Concluída').length;
  const inProgressActivities = activities.filter(a => a.status === 'Em Execução' || a.status === 'Em Andamento').length;
  const delayedActivities = activities.filter(a => a.status === 'Atrasada' || a.status === 'Suspensa').length;
  const completionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  // Costs calculation
  const totalFuelCost = vehicles.reduce((sum, v) => sum + v.fuelLogs.reduce((flSum, fl) => flSum + fl.costTotal, 0), 0);
  const totalMaterialsValue = materials.reduce((sum, m) => sum + (m.quantity * m.unitPriceEstimate), 0);
  const totalVehicleMaintCost = vehicles.reduce((sum, v) => sum + v.maintenanceLogs.reduce((mlSum, ml) => mlSum + ml.costTotal, 0), 0);
  const totalOperationalEstimate = totalFuelCost + totalMaterialsValue + totalVehicleMaintCost;

  // Chart 1: Status Distribution
  const statusChartData = [
    { name: 'Concluídas', value: completedActivities, color: '#10B981' },
    { name: 'Em Execução', value: inProgressActivities, color: '#3B82F6' },
    { name: 'Atrasadas / Suspensas', value: delayedActivities, color: '#F59E0B' },
    { name: 'Planeadas', value: activities.filter(a => a.status === 'Planeada' || a.status === 'Pendente').length, color: '#6B7280' }
  ];

  // Chart 2: Productivity by Sector
  const sectorProductivityData = sectors.map(s => {
    const secActivities = activities.filter(a => a.sectorName === s.name);
    const secCompleted = secActivities.filter(a => a.status === 'Concluída').length;
    return {
      sector: s.name,
      Total: secActivities.length,
      Concluídas: secCompleted
    };
  });

  // Chart 3: Cost Distribution
  const costChartData = [
    { category: 'Combustível Frota', cost: totalFuelCost, fill: '#3B82F6' },
    { category: 'Stock de Materiais', cost: totalMaterialsValue, fill: '#10B981' },
    { category: 'Manutenção de Viaturas', cost: totalVehicleMaintCost, fill: '#8B5CF6' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 rounded-2xl shadow-lg border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider">
              EMRICH GESTOR 2.0
            </span>
            <span className="text-xs text-slate-400 font-mono">Bacia do Rio Chiveve • Beira</span>
          </div>
          <h1 className="text-2xl font-black mt-2">Painel Executivo Operacional</h1>
          <p className="text-xs text-slate-300 mt-1">Visão consolidada de indicadores de desempenho, custos operacionais e alertas críticos</p>
        </div>

        <button
          onClick={() => onNavigateTab('ai-assistant')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-md shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Consultar IA EMRICH</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taxa de Conclusão</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{completionRate}%</p>
          <p className="text-xs text-slate-500">{completedActivities} de {totalActivities} actividades concluídas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Custo Operacional Total</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalOperationalEstimate.toLocaleString('pt-MZ')} <span className="text-xs font-normal text-slate-500">MZN</span></p>
          <p className="text-xs text-slate-500">Combustível + Stock + Manutenção</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alertas de Stock Baixo</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600">{materials.filter(m => m.quantity <= m.minQuantity).length}</p>
          <p className="text-xs text-slate-500">Materiais abaixo da reserva mínima</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ocorrências Ativas</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-600">{incidents.filter(i => i.status !== 'Resolvida' && i.status !== 'Arquivada').length}</p>
          <p className="text-xs text-slate-500">{incidents.filter(i => i.severity === 'Crítica').length} críticas em atendimento</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Sector Productivity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Produtividade por Sector Operacional</h3>
              <p className="text-xs text-slate-500">Actividades totais vs concluídas por equipa</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorProductivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="sector" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Total" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Concluídas" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Pie Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Distribuição de Estado das Actividades</h3>
              <p className="text-xs text-slate-500">Visão percentual das Ordens de Serviço</p>
            </div>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Operational Costs Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Estrutura de Custos Operacionais (MZN)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase">Combustível Frota</p>
            <p className="text-xl font-bold text-blue-600">{totalFuelCost.toLocaleString('pt-MZ')} MZN</p>
            <p className="text-[11px] text-slate-400">Total de abastecimentos de viaturas</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase">Valor de Stock de Armazém</p>
            <p className="text-xl font-bold text-emerald-600">{totalMaterialsValue.toLocaleString('pt-MZ')} MZN</p>
            <p className="text-[11px] text-slate-400">Património em inventário activo</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase">Manutenção de Viaturas</p>
            <p className="text-xl font-bold text-purple-600">{totalVehicleMaintCost.toLocaleString('pt-MZ')} MZN</p>
            <p className="text-[11px] text-slate-400">Revisões e reparações mecânicas</p>
          </div>
        </div>
      </div>
    </div>
  );
};
