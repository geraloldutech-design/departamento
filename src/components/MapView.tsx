import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Compass, Layers, ExternalLink } from 'lucide-react';
import { Activity, Sector } from '../types';

interface MapViewProps {
  activities: Activity[];
  sectors: Sector[];
  onOpenWhatsAppPreview: (activity: Activity) => void;
}

export const MapView: React.FC<MapViewProps> = ({ activities, sectors, onOpenWhatsAppPreview }) => {
  const [selectedSector, setSelectedSector] = useState('todos');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(activities[0] || null);

  const filteredActivities = activities.filter(act => {
    return selectedSector === 'todos' || act.sectorName === selectedSector;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-600" />
            Mapa Operacional do Rio Chiveve (Beira, Sofala)
          </h2>
          <p className="text-xs text-slate-500">Localização geográfica em tempo real das frentes de trabalho e eclusas</p>
        </div>

        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
        >
          <option value="todos">Todos os Sectores</option>
          {sectors.map(s => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Interactive Visual Map Box */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg relative min-h-[420px] flex flex-col justify-between p-6">
          
          {/* Top Info Overlay */}
          <div className="flex items-center justify-between gap-2 z-10 bg-slate-950/80 backdrop-blur p-3 rounded-xl border border-slate-800 text-xs text-white">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin" />
              <span className="font-bold">Bacia do Rio Chiveve - Cidade da Beira</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">GPS Ref: -19.8395, 34.8380</span>
          </div>

          {/* Interactive Pins Representation */}
          <div className="relative my-8 h-64 bg-slate-950/50 rounded-xl border border-slate-800/80 p-4 overflow-hidden flex items-center justify-center">
            
            {/* Visual River Vector Curve Background */}
            <svg className="absolute inset-0 w-full h-full text-sky-950/60" fill="none" stroke="currentColor">
              <path d="M 20 200 Q 150 50, 300 150 T 600 80" strokeWidth="24" strokeLinecap="round" />
            </svg>

            {/* Pins on the canvas */}
            <div className="absolute inset-0 p-6 flex flex-wrap items-center justify-around gap-6">
              {filteredActivities.map((act, index) => {
                const secColor = sectors.find(s => s.name === act.sectorName)?.color || '#00875A';
                const isSelected = selectedActivity?.id === act.id;

                return (
                  <button
                    key={act.id}
                    onClick={() => setSelectedActivity(act)}
                    className={`relative group flex flex-col items-center transition transform hover:scale-110 ${
                      isSelected ? 'scale-110 z-20' : 'z-10'
                    }`}
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xl border-2 transition ${
                        isSelected ? 'border-white ring-4 ring-emerald-500/50' : 'border-slate-900'
                      }`}
                      style={{ backgroundColor: secColor }}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>

                    <span className="mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-950 text-white border border-slate-700 whitespace-nowrap shadow-md">
                      {act.sectorName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map Footer Note */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3 z-10">
            <span>Selecione um ponto no mapa para ver a ordem de serviço</span>
            <span className="text-emerald-400 font-bold">{filteredActivities.length} Pontos Ativos</span>
          </div>

        </div>

        {/* Selected Activity Details Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          {selectedActivity ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold text-white uppercase" style={{ backgroundColor: sectors.find(s=>s.name===selectedActivity.sectorName)?.color || '#00875A' }}>
                  {selectedActivity.sectorName}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedActivity.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedActivity.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {selectedActivity.description}
                </p>
              </div>

              <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <p><strong>Local:</strong> {selectedActivity.locationName}</p>
                <p><strong>Coordenadas:</strong> {selectedActivity.latitude}, {selectedActivity.longitude}</p>
                <p><strong>Data/Hora:</strong> {selectedActivity.date} às {selectedActivity.time}</p>
                <p><strong>Responsável:</strong> {selectedActivity.responsibleName} ({selectedActivity.responsibleWhatsapp})</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    const url = `https://maps.google.com/?q=${selectedActivity.latitude},${selectedActivity.longitude}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  <Navigation className="w-4 h-4" />
                  Navegar no Google Maps
                </button>

                <button
                  onClick={() => onOpenWhatsAppPreview(selectedActivity)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs rounded-xl transition"
                >
                  Ver Ficha WhatsApp
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Selecione uma actividade para visualizar os detalhes de localização.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
