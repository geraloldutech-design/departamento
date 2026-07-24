import React, { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { Activity, Sector } from '../types';

interface CalendarViewProps {
  activities: Activity[];
  sectors: Sector[];
  onOpenWhatsAppPreview: (activity: Activity) => void;
}

type ViewMode = 'day' | 'week' | 'month';

export const CalendarView: React.FC<CalendarViewProps> = ({ activities, sectors, onOpenWhatsAppPreview }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 6, 24)); // July 24, 2026

  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() - 1);
    else if (viewMode === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() + 1);
    else if (viewMode === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  // Month grid helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('pt-MZ', { month: 'long', year: 'numeric' });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getActivitiesForDay = (dayNum: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return activities.filter(a => a.date === dateStr);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-emerald-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white capitalize">
              {monthName}
            </h2>
            <p className="text-xs text-slate-500">Calendário de escala e cronograma das brigadas EMRICH</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg transition ${viewMode === 'day' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Diário
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg transition ${viewMode === 'week' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Semanal
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg transition ${viewMode === 'month' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Mensal
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(2026, 6, 24))}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Hoje
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Month View Grid */}
      {viewMode === 'month' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-center py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800">
            {calendarDays.map((dayNum, idx) => {
              if (dayNum === null) {
                return <div key={`empty-${idx}`} className="min-h-[110px] bg-slate-50/50 dark:bg-slate-900/30" />;
              }

              const dayActs = getActivitiesForDay(dayNum);
              const isToday = dayNum === 24 && month === 6 && year === 2026;

              return (
                <div 
                  key={`day-${dayNum}`} 
                  className={`min-h-[110px] p-2 transition hover:bg-slate-50/80 dark:hover:bg-slate-800/30 ${
                    isToday ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {dayNum}
                    </span>
                    {dayActs.length > 0 && (
                      <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded-full">
                        {dayActs.length}
                      </span>
                    )}
                  </div>

                  {/* Day Activities Badges */}
                  <div className="space-y-1">
                    {dayActs.map(act => (
                      <div
                        key={act.id}
                        onClick={() => onOpenWhatsAppPreview(act)}
                        className="p-1 rounded text-[10px] font-semibold text-white truncate cursor-pointer shadow-xs transition hover:scale-102"
                        style={{ backgroundColor: sectors.find(s=>s.name===act.sectorName)?.color || '#00875A' }}
                        title={`${act.title} (${act.time}) - Clique para detalhes`}
                      >
                        <span className="font-extrabold opacity-90">{act.time}</span> {act.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Day / Week Fallback List */}
      {(viewMode === 'day' || viewMode === 'week') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            Cronograma Operacional Detalhado ({viewMode === 'day' ? 'Visão Diária' : 'Visão Semanal'})
          </h3>

          <div className="space-y-3">
            {activities.map(act => (
              <div 
                key={act.id} 
                onClick={() => onOpenWhatsAppPreview(act)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-12 rounded-full shrink-0" style={{ backgroundColor: sectors.find(s=>s.name===act.sectorName)?.color || '#00875A' }} />
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-emerald-600 tracking-wider block">
                      {act.sectorName} • {act.priority}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {act.title}
                    </h4>
                    <span className="text-xs text-slate-500">📍 {act.locationName} | 👤 {act.responsibleName}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">📅 {act.date}</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">⏰ {act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
