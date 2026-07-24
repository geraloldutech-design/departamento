import React, { useState } from 'react';
import { Incident, IncidentCategory, IncidentSeverity, IncidentStatus, Sector, UserRole } from '../types';
import { 
  AlertOctagon, 
  Plus, 
  Search, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Camera, 
  ShieldAlert,
  Building
} from 'lucide-react';

interface IncidentsViewProps {
  incidents: Incident[];
  sectors: Sector[];
  activeRole: UserRole;
  currentUserName: string;
  onSaveIncident: (inc: Incident) => void;
  onUpdateIncidentStatus: (incId: string, status: IncidentStatus, notes?: string) => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  sectors,
  activeRole,
  currentUserName,
  onSaveIncident,
  onUpdateIncidentStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('Todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIncidentForUpdate, setSelectedIncidentForUpdate] = useState<Incident | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Form New Incident
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('Avaria Técnica');
  const [locationName, setLocationName] = useState('Canal do Rio Chiveve - Ponta Gea');
  const [assignedToSector, setAssignedToSector] = useState(sectors[0]?.name || 'Limpeza');
  const [severity, setSeverity] = useState<IncidentSeverity>('Média');
  const [photoUrl, setPhotoUrl] = useState('');

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSev = severityFilter === 'Todos' || inc.severity === severityFilter;
    return matchesSearch && matchesSev;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newInc: Incident = {
      id: `inc-${Date.now()}`,
      incidentNumber: `OCO-2026-${Math.floor(100 + Math.random() * 900)}`,
      title,
      description,
      category,
      locationName,
      latitude: -19.8350,
      longitude: 34.8380,
      photos: photoUrl ? [photoUrl] : ['https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=600'],
      reportedBy: currentUserName,
      reportedAt: new Date().toISOString(),
      assignedToSector,
      severity,
      status: 'Registada'
    };

    onSaveIncident(newInc);
    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleStatusChange = (status: IncidentStatus) => {
    if (!selectedIncidentForUpdate) return;
    onUpdateIncidentStatus(selectedIncidentForUpdate.id, status, resolutionNotes);
    setSelectedIncidentForUpdate(null);
    setResolutionNotes('');
  };

  const getSeverityBadge = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'Crítica':
        return <span className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-md text-xs uppercase animate-pulse">Crítica</span>;
      case 'Alta':
        return <span className="px-2.5 py-1 bg-amber-500 text-white font-bold rounded-md text-xs uppercase">Alta</span>;
      case 'Média':
        return <span className="px-2.5 py-1 bg-blue-500 text-white font-bold rounded-md text-xs uppercase">Média</span>;
      case 'Baixa':
        return <span className="px-2.5 py-1 bg-slate-500 text-white font-bold rounded-md text-xs uppercase">Baixa</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestão de Ocorrências e Incidentes</h1>
            <p className="text-sm text-slate-500">Registo de avarias, vandalismo, danos estruturais e reclamações de cidadãos</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition font-medium text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Registar Ocorrência</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar ocorrência por número, título ou local..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="Todos">Todas Severidades</option>
            <option value="Crítica">Crítica</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>
        </div>
      </div>

      {/* Incidents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredIncidents.map(inc => (
          <div key={inc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-rose-900 text-white rounded">
                      {inc.incidentNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{inc.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-2">{inc.title}</h3>
                </div>
                {getSeverityBadge(inc.severity)}
              </div>

              <p className="text-xs text-slate-600 mt-3">{inc.description}</p>

              <div className="mt-4 space-y-2 text-xs text-slate-500">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Local: <strong className="text-slate-800">{inc.locationName}</strong></span>
                </div>

                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>Sector Atribuído: <strong className="text-slate-800">{inc.assignedToSector}</strong></span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Reportado por: <strong className="text-slate-700">{inc.reportedBy}</strong> em {new Date(inc.reportedAt).toLocaleString('pt-MZ')}</span>
                </div>

                {inc.resolutionNotes && (
                  <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-emerald-900 text-xs mt-2">
                    <strong>Notas de Resolução:</strong> {inc.resolutionNotes}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                inc.status === 'Resolvida' ? 'bg-emerald-100 text-emerald-800' :
                inc.status === 'Em Resolução' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {inc.status}
              </span>

              <button
                onClick={() => setSelectedIncidentForUpdate(inc)}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition"
              >
                Actualizar Estado
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD INCIDENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Registar Nova Ocorrência</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Título da Ocorrência</label>
                <input
                  type="text"
                  placeholder="Ex: Descarte ilegal de entulho na margem"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  >
                    <option value="Avaria Técnica">Avaria Técnica</option>
                    <option value="Roubo ou Vandalismo">Roubo ou Vandalismo</option>
                    <option value="Danos na Infraestrutura">Danos na Infraestrutura</option>
                    <option value="Problema Ambiental / Inundação">Problema Ambiental</option>
                    <option value="Reclamação de Cidadão / Munícipe">Reclamação de Cidadão</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Severidade</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Descrição Detalhada</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Descreva a ocorrência constatada..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Localização</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={e => setLocationName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Sector Responsável</label>
                  <select
                    value={assignedToSector}
                    onChange={e => setAssignedToSector(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  >
                    {sectors.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
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
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium"
                >
                  Registar Ocorrência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE STATUS */}
      {selectedIncidentForUpdate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 text-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Actualizar Resolução da Ocorrência</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedIncidentForUpdate.incidentNumber} - {selectedIncidentForUpdate.title}</p>

            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Observações de Resolução</label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="Escreva acções tomadas ou detalhes para resolução..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleStatusChange('Em Análise')}
                  className="p-2.5 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100"
                >
                  Em Análise
                </button>
                <button
                  onClick={() => handleStatusChange('Em Resolução')}
                  className="p-2.5 bg-amber-50 text-amber-700 rounded-lg font-semibold hover:bg-amber-100"
                >
                  Em Resolução
                </button>
                <button
                  onClick={() => handleStatusChange('Resolvida')}
                  className="p-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 col-span-2"
                >
                  Marcar como Resolvida
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedIncidentForUpdate(null)}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
