import React, { useState } from 'react';
import { 
  Activity, 
  Sector, 
  MaterialItem, 
  VehicleItem, 
  Incident, 
  UserRole 
} from '../types';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  CheckCircle, 
  Building2, 
  Filter,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

interface ReportsGeneratorViewProps {
  activities: Activity[];
  sectors: Sector[];
  materials: MaterialItem[];
  vehicles: VehicleItem[];
  incidents: Incident[];
  activeRole: UserRole;
  currentUserName: string;
}

export const ReportsGeneratorView: React.FC<ReportsGeneratorViewProps> = ({
  activities,
  sectors,
  materials,
  vehicles,
  incidents,
  activeRole,
  currentUserName
}) => {
  const [reportType, setReportType] = useState<'Diário Operacional' | 'Semanal de Sector' | 'Mensal Direcção' | 'Anual Desempenho'>('Diário Operacional');
  const [selectedSector, setSelectedSector] = useState('Todos');

  const handlePrint = () => {
    window.print();
  };

  const filteredActivities = activities.filter(a => 
    selectedSector === 'Todos' || a.sectorName === selectedSector
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Printable CSS style injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report, #printable-report * {
            visibility: visible;
          }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Relatórios Gerenciais Automáticos</h1>
            <p className="text-sm text-slate-500">Geração de relatórios operacionais, semanais, mensais e para conselho de administração</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition font-medium text-sm shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar PDF</span>
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-slate-600 uppercase">Modelo:</span>
          <select
            value={reportType}
            onChange={e => setReportType(e.target.value as any)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Diário Operacional">Relatório Operacional Diário</option>
            <option value="Semanal de Sector">Relatório Semanal de Sector</option>
            <option value="Mensal Direcção">Relatório Mensal para Conselho de Administração</option>
            <option value="Anual Desempenho">Relatório Anual de Desempenho Global</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-slate-600 uppercase">Sector:</span>
          <select
            value={selectedSector}
            onChange={e => setSelectedSector(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700"
          >
            <option value="Todos">Todos os Sectores</option>
            {sectors.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Printable Report Document */}
      <div id="printable-report" className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-slate-900">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black text-slate-900">EMRICH</span>
              <span className="text-xs font-bold px-2 py-0.5 bg-slate-900 text-white rounded">EP</span>
            </div>
            <p className="text-xs font-bold text-slate-600 uppercase mt-1">Empresa de Manutenção do Rio Chiveve, E.P.</p>
            <p className="text-[11px] text-slate-400">Cidade da Beira • Moçambique</p>
          </div>

          <div className="text-right text-xs">
            <h2 className="text-base font-black text-slate-900 uppercase">{reportType}</h2>
            <p className="text-slate-500 mt-1">Data de Emissão: {new Date().toLocaleDateString('pt-MZ')}</p>
            <p className="text-slate-500">Gerado por: {currentUserName} ({activeRole})</p>
          </div>
        </div>

        {/* Executive Summary Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">1. Sumário de Indicadores</h3>
          <div className="grid grid-cols-4 gap-4 py-2 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-slate-500 uppercase text-[10px]">Total Actividades</p>
              <p className="text-lg font-bold">{filteredActivities.length}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-slate-500 uppercase text-[10px]">Concluídas</p>
              <p className="text-lg font-bold text-emerald-700">{filteredActivities.filter(a => a.status === 'Concluída').length}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-slate-500 uppercase text-[10px]">Em Execução</p>
              <p className="text-lg font-bold text-blue-700">{filteredActivities.filter(a => a.status === 'Em Execução').length}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-slate-500 uppercase text-[10px]">Ocorrências Ativas</p>
              <p className="text-lg font-bold text-rose-700">{incidents.filter(i => i.status !== 'Resolvida').length}</p>
            </div>
          </div>
        </div>

        {/* Activities Table */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">2. Detalhe das Ordens de Serviço & Actividades</h3>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 font-bold uppercase">
                <th className="p-2">Nº OS</th>
                <th className="p-2">Título da Actividade</th>
                <th className="p-2">Sector</th>
                <th className="p-2">Progresso</th>
                <th className="p-2 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredActivities.map(a => (
                <tr key={a.id}>
                  <td className="p-2 font-mono font-bold">{a.serviceOrderNumber}</td>
                  <td className="p-2 font-medium">{a.title}</td>
                  <td className="p-2">{a.sectorName}</td>
                  <td className="p-2 font-bold">{a.progressPercent}%</td>
                  <td className="p-2 text-right font-semibold">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures Footer */}
        <div className="pt-12 grid grid-cols-2 gap-8 text-xs text-center">
          <div>
            <div className="border-t border-slate-900 pt-2 font-bold">O Responsável pelo Sector</div>
            <p className="text-[11px] text-slate-500">Assinatura & Carimbo</p>
          </div>
          <div>
            <div className="border-t border-slate-900 pt-2 font-bold">A Direcção Geral / Conselho de Administração</div>
            <p className="text-[11px] text-slate-500">Visto & Homologação</p>
          </div>
        </div>
      </div>
    </div>
  );
};
