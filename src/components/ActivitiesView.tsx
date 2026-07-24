import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Smartphone, 
  FileText, 
  Trash2, 
  Edit3, 
  Copy, 
  X, 
  Check,
  Package,
  Wrench,
  CheckSquare
} from 'lucide-react';
import { Activity, Sector, ActivityPriority, ActivityStatus, ChecklistItem, UserRole } from '../types';
import { PdfExcelService } from '../services/pdfExcelService';

interface ActivitiesViewProps {
  activities: Activity[];
  sectors: Sector[];
  activeRole: UserRole;
  onSaveActivity: (activity: Activity, isNew: boolean) => void;
  onDeleteActivity: (activityId: string) => void;
  onOpenWhatsAppPreview: (activity: Activity) => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
  selectedActivityForModal?: Activity | null;
}

const PRESET_LOCATIONS = [
  { name: 'Bacia de Maraza - Canal Norte', lat: -19.8290, lng: 34.8420 },
  { name: 'Parque Urbano do Rio Chiveve - Ponta Gea', lat: -19.8395, lng: 34.8380 },
  { name: 'Eclusa Sul - Foz do Rio Chiveve', lat: -19.8450, lng: 34.8335 },
  { name: 'Passadiço Pedonal - Bairro de Chota', lat: -19.8320, lng: 34.8460 },
  { name: 'Ponte Metalica - Gotite', lat: -19.8370, lng: 34.8410 },
  { name: 'Canal Central - Macurungo', lat: -19.8410, lng: 34.8450 },
  { name: 'Dique de Proteção - Estoril', lat: -19.8250, lng: 34.8500 }
];

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  activities,
  sectors,
  activeRole,
  onSaveActivity,
  onDeleteActivity,
  onOpenWhatsAppPreview,
  isModalOpen,
  onCloseModal,
  selectedActivityForModal
}) => {
  const [filterSector, setFilterSector] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State
  const [formActivity, setFormActivity] = useState<Partial<Activity>>({
    title: '',
    description: '',
    sectorId: sectors[0]?.id || '',
    sectorName: sectors[0]?.name || 'Jardinagem',
    department: sectors[0]?.department || 'Gestão Ambiental',
    responsibleName: sectors[0]?.headName || 'Chefe Responsável',
    responsibleWhatsapp: sectors[0]?.headWhatsapp || '+258840000000',
    locationName: PRESET_LOCATIONS[0].name,
    latitude: PRESET_LOCATIONS[0].lat,
    longitude: PRESET_LOCATIONS[0].lng,
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    priority: 'Média',
    status: 'Pendente',
    materialsRequired: ['Sacos de lixo', 'Luvas de proteção'],
    equipmentRequired: ['Ferramentas manuais'],
    photos: ['https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=600'],
    checklist: [
      { id: '1', text: 'EPIs e sinalização de segurança', completed: false },
      { id: '2', text: 'Fotografias antes do início', completed: false }
    ],
    progressPercent: 0
  });

  const [newMaterial, setNewMaterial] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [newChecklistText, setNewChecklistText] = useState('');

  // Populate edit form when modal opens with existing activity
  React.useEffect(() => {
    if (selectedActivityForModal) {
      setFormActivity(selectedActivityForModal);
    } else {
      const defaultSec = sectors[0] || { id: 'sec-1', name: 'Jardinagem', department: 'Gestão Ambiental', headName: 'Manuel Macamo', headWhatsapp: '+258843920112' };
      setFormActivity({
        title: '',
        description: '',
        sectorId: defaultSec.id,
        sectorName: defaultSec.name,
        department: defaultSec.department,
        responsibleName: defaultSec.headName,
        responsibleWhatsapp: defaultSec.headWhatsapp,
        locationName: PRESET_LOCATIONS[0].name,
        latitude: PRESET_LOCATIONS[0].lat,
        longitude: PRESET_LOCATIONS[0].lng,
        date: new Date().toISOString().split('T')[0],
        time: '08:00',
        priority: 'Média',
        status: 'Pendente',
        materialsRequired: ['Sacos reforçados', 'Luvas nitrílicas'],
        equipmentRequired: ['Enxadas', 'Rastelos'],
        photos: ['https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=600'],
        checklist: [
          { id: 'chk-1', text: 'Ferramentas e EPIs inspecionados', completed: false },
          { id: 'chk-2', text: 'Fotografias do estado inicial', completed: false }
        ],
        progressPercent: 0
      });
    }
  }, [selectedActivityForModal, isModalOpen, sectors]);

  // Handle Sector Change in Form to auto-populate Head info
  const handleSectorChange = (secId: string) => {
    const sec = sectors.find(s => s.id === secId || s.name === secId);
    if (sec) {
      setFormActivity(prev => ({
        ...prev,
        sectorId: sec.id,
        sectorName: sec.name,
        department: sec.department,
        responsibleName: sec.headName,
        responsibleWhatsapp: sec.headWhatsapp
      }));
    }
  };

  // Filter Logic
  const filteredActivities = activities.filter(act => {
    const matchesSector = filterSector === 'todos' || act.sectorName === filterSector;
    const matchesStatus = filterStatus === 'todos' || act.status === filterStatus;
    const matchesQuery = 
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.responsibleName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesStatus && matchesQuery;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formActivity.title || !formActivity.sectorName) return;

    const isNew = !formActivity.id;
    const activityToSave: Activity = {
      id: formActivity.id || `act-${Date.now()}`,
      title: formActivity.title || 'Actividade sem Título',
      description: formActivity.description || '',
      sectorId: formActivity.sectorId || 'sec-1',
      sectorName: formActivity.sectorName || 'Jardinagem',
      department: formActivity.department || 'Gestão Ambiental',
      responsibleName: formActivity.responsibleName || 'Responsável',
      responsibleWhatsapp: formActivity.responsibleWhatsapp || '+258840000000',
      locationName: formActivity.locationName || 'Rio Chiveve',
      latitude: formActivity.latitude || -19.8395,
      longitude: formActivity.longitude || 34.8380,
      date: formActivity.date || new Date().toISOString().split('T')[0],
      time: formActivity.time || '08:00',
      priority: (formActivity.priority as ActivityPriority) || 'Média',
      status: (formActivity.status as ActivityStatus) || 'Pendente',
      materialsRequired: formActivity.materialsRequired || [],
      equipmentRequired: formActivity.equipmentRequired || [],
      photos: formActivity.photos || [],
      checklist: formActivity.checklist || [],
      progressPercent: formActivity.progressPercent || 0,
      createdBy: activeRole,
      createdAt: formActivity.createdAt || new Date().toISOString(),
      whatsappNotified: true,
      whatsappNotifiedAt: new Date().toISOString()
    };

    onSaveActivity(activityToSave, isNew);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
            Agendamento e Controlo de Actividades
          </h2>
          <p className="text-xs text-slate-500">Planeamento, distribuição de tarefas e checklists operacionais</p>
        </div>

        <button
          onClick={onCloseModal} // Opens fresh modal when selected is null
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Nova Actividade Operacional
        </button>
      </div>

      {/* Filter Matrix */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por título, local ou responsável..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          
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

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
          >
            <option value="todos">Todos os Estados</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Concluída">Concluída</option>
            <option value="Atrasada">Atrasada</option>
            <option value="Cancelada">Cancelada</option>
          </select>

          <button
            onClick={() => PdfExcelService.exportActivitiesToExcel(filteredActivities)}
            className="px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold shrink-0"
          >
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredActivities.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            Nenhuma atividade encontrada para os filtros selecionados.
          </div>
        ) : (
          filteredActivities.map(act => (
            <div 
              key={act.id} 
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2.5 py-1 rounded-md text-[11px] font-extrabold text-white uppercase tracking-wider"
                      style={{ backgroundColor: sectors.find(s=>s.name===act.sectorName)?.color || '#00875A' }}
                    >
                      {act.sectorName}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      act.priority === 'Urgente' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                      act.priority === 'Alta' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {act.priority}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    act.status === 'Concluída' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    act.status === 'Em Andamento' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' :
                    act.status === 'Atrasada' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {act.status}
                  </span>
                </div>

                {/* Title & Desc */}
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {act.description}
                  </p>
                </div>

                {/* Info row */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">Localização</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">📍 {act.locationName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">Data / Hora</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">📅 {act.date} às {act.time}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">Responsável WhatsApp</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">👤 {act.responsibleName} ({act.responsibleWhatsapp})</span>
                  </div>
                </div>

                {/* Checklist progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
                    <span>Progresso de Execução</span>
                    <span>{act.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-300" 
                      style={{ width: `${act.progressPercent}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenWhatsAppPreview(act)}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                  title="Abrir payload do WhatsApp"
                >
                  <Smartphone className="w-4 h-4" />
                  WhatsApp
                </button>

                <button
                  onClick={() => PdfExcelService.exportActivityToPDF(act)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  title="Exportar PDF"
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDeleteActivity(act.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Activity Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-600" />
                {selectedActivityForModal ? 'Editar Actividade' : 'Agendar Nova Actividade Operacional'}
              </h3>
              <button 
                onClick={onCloseModal}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              {/* Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Título da Actividade *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Desassoreamento e Limpeza da Bacia de Maraza"
                    value={formActivity.title}
                    onChange={(e) => setFormActivity({ ...formActivity, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Descrição Detalhada das Operações
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Especifique os trabalhos a realizar, procedimentos de segurança e meta operacional..."
                    value={formActivity.description}
                    onChange={(e) => setFormActivity({ ...formActivity, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Sector & Priority Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sector Responsável *
                  </label>
                  <select
                    value={formActivity.sectorId}
                    onChange={(e) => handleSectorChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    {sectors.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={formActivity.priority}
                    onChange={(e) => setFormActivity({ ...formActivity, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estado
                  </label>
                  <select
                    value={formActivity.status}
                    onChange={(e) => setFormActivity({ ...formActivity, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluída">Concluída</option>
                    <option value="Atrasada">Atrasada</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>
              </div>

              {/* Responsible Info (Auto-populated with WhatsApp) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div>
                  <label className="block font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
                    Responsável (Chefe do Sector)
                  </label>
                  <input
                    type="text"
                    value={formActivity.responsibleName}
                    onChange={(e) => setFormActivity({ ...formActivity, responsibleName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-emerald-900 dark:text-emerald-300 mb-1 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp Destinatário (Notificação Automática)
                  </label>
                  <input
                    type="text"
                    value={formActivity.responsibleWhatsapp}
                    onChange={(e) => setFormActivity({ ...formActivity, responsibleWhatsapp: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              {/* Location & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Localização no Rio Chiveve / Beira
                  </label>
                  <select
                    value={formActivity.locationName}
                    onChange={(e) => {
                      const loc = PRESET_LOCATIONS.find(l => l.name === e.target.value);
                      if (loc) {
                        setFormActivity({
                          ...formActivity,
                          locationName: loc.name,
                          latitude: loc.lat,
                          longitude: loc.lng
                        });
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    {PRESET_LOCATIONS.map(loc => (
                      <option key={loc.name} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Data / Hora
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="date"
                      value={formActivity.date}
                      onChange={(e) => setFormActivity({ ...formActivity, date: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    <input
                      type="time"
                      value={formActivity.time}
                      onChange={(e) => setFormActivity({ ...formActivity, time: e.target.value })}
                      className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Checklist Builder */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  Checklist de Verificação Operacional
                </label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Adicionar item de checklist..."
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newChecklistText.trim()) {
                        setFormActivity({
                          ...formActivity,
                          checklist: [
                            ...(formActivity.checklist || []),
                            { id: `chk-${Date.now()}`, text: newChecklistText.trim(), completed: false }
                          ]
                        });
                        setNewChecklistText('');
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg"
                  >
                    + Adicionar
                  </button>
                </div>

                <div className="space-y-1 mt-2 max-h-32 overflow-y-auto">
                  {formActivity.checklist?.map((chk, idx) => (
                    <div key={chk.id} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200">
                      <span>• {chk.text}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formActivity.checklist?.filter(c => c.id !== chk.id);
                          setFormActivity({ ...formActivity, checklist: updated });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {selectedActivityForModal ? 'Guardar Alterações' : 'Criar & Notificar WhatsApp'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
