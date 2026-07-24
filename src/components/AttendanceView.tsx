import React, { useState } from 'react';
import { Employee, AttendanceRecord, AttendanceStatus, UserRole, Sector } from '../types';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  UserX, 
  Briefcase, 
  FileSpreadsheet, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

interface AttendanceViewProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  sectors: Sector[];
  activeRole: UserRole;
  currentUserName: string;
  onRecordAttendance: (record: AttendanceRecord) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  employees,
  attendance,
  sectors,
  activeRole,
  currentUserName,
  onRecordAttendance
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSector, setSelectedSector] = useState('Todos');

  const filteredEmployees = employees.filter(e => 
    selectedSector === 'Todos' || e.sectorName === selectedSector
  );

  const getAttendanceForEmpAndDate = (empId: string) => {
    return attendance.find(a => a.employeeId === empId && a.date === selectedDate);
  };

  const handleMarkStatus = (emp: Employee, status: AttendanceStatus) => {
    const newRecord: AttendanceRecord = {
      id: `att-${emp.id}-${selectedDate}`,
      employeeId: emp.id,
      employeeName: emp.name,
      sectorName: emp.sectorName,
      date: selectedDate,
      status,
      shift: 'Manhã',
      checkInTime: status === 'Presente' ? new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' }) : undefined,
      recordedBy: currentUserName
    };

    onRecordAttendance(newRecord);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestão de Recursos Humanos & Assiduidade</h1>
            <p className="text-sm text-slate-500">Folha de ponto diária, mapa de presenças, escalas de turno e licenças</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent border-none focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Sector Filter */}
      <div className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-slate-200">
        <span className="text-xs font-semibold text-slate-600 uppercase">Filtrar Sector:</span>
        <select
          value={selectedSector}
          onChange={e => setSelectedSector(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:ring-2 focus:ring-teal-500"
        >
          <option value="Todos">Todos os Sectores ({employees.length} funcionários)</option>
          {sectors.map(s => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Registo de Presenças - {selectedDate}</h3>
          <p className="text-xs text-slate-500">Clique nos botões para registar presenças directamente</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                <th className="p-4">Colaborador / Cargo</th>
                <th className="p-4">Sector</th>
                <th className="p-4">Escala de Turno</th>
                <th className="p-4">Estado Registado</th>
                <th className="p-4 text-right">Acções Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredEmployees.map(emp => {
                const rec = getAttendanceForEmpAndDate(emp.id);

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={emp.photoUrl}
                          alt={emp.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{emp.name}</p>
                          <p className="text-[11px] text-slate-500">{emp.cargo}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium">
                        {emp.sectorName}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600">
                      {emp.shiftScale || 'Normal (07:30 - 15:30)'}
                    </td>

                    <td className="p-4">
                      {rec ? (
                        <span className={`px-2.5 py-1 rounded-full font-semibold ${
                          rec.status === 'Presente' ? 'bg-emerald-100 text-emerald-800' :
                          rec.status === 'Falta Injustificada' ? 'bg-rose-100 text-rose-800' :
                          rec.status === 'Atraso' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {rec.status} {rec.checkInTime ? `(${rec.checkInTime})` : ''}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Não Registado</span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleMarkStatus(emp, 'Presente')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition ${
                          rec?.status === 'Presente' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        Presente
                      </button>

                      <button
                        onClick={() => handleMarkStatus(emp, 'Falta Injustificada')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition ${
                          rec?.status === 'Falta Injustificada' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                      >
                        Falta
                      </button>

                      <button
                        onClick={() => handleMarkStatus(emp, 'Atraso')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition ${
                          rec?.status === 'Atraso' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        Atraso
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
