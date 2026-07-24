import React, { useState } from 'react';
import { Search, X, CalendarCheck, Users, UserCheck, StickyNote, Building2, ChevronRight } from 'lucide-react';
import { Activity, Employee, Nomination, Note, Sector } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  employees: Employee[];
  nominations: Nomination[];
  notes: Note[];
  sectors: Sector[];
  onSelectResult: (tab: any, item?: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  activities,
  employees,
  nominations,
  notes,
  sectors,
  onSelectResult
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();

  const matchedActivities = q ? activities.filter(a => a.title.toLowerCase().includes(q) || a.locationName.toLowerCase().includes(q) || a.sectorName.toLowerCase().includes(q)) : [];
  const matchedEmployees = q ? employees.filter(e => e.name.toLowerCase().includes(q) || e.cargo.toLowerCase().includes(q) || e.biNumber.toLowerCase().includes(q)) : [];
  const matchedNominations = q ? nominations.filter(n => n.fullName.toLowerCase().includes(q) || n.sectorName.toLowerCase().includes(q)) : [];
  const matchedNotes = q ? notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-4 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        
        {/* Search Bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Pesquisa global: digite o nome de uma actividade, funcionário, chefe ou nota..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent outline-none text-slate-900 dark:text-white"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto space-y-4 text-xs pr-1">
          {!q ? (
            <div className="p-8 text-center text-slate-400">
              Comece a digitar para pesquisar em toda a plataforma EMRICH GESTOR.
            </div>
          ) : (
            <>
              {/* Activities */}
              {matchedActivities.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold uppercase text-[10px] text-emerald-600 flex items-center gap-1">
                    <CalendarCheck className="w-3.5 h-3.5" /> Actividades ({matchedActivities.length})
                  </span>
                  {matchedActivities.map(a => (
                    <div 
                      key={a.id} 
                      onClick={() => { onSelectResult('activities', a); onClose(); }}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{a.title}</span>
                        <span className="block text-[10px] text-slate-500">📍 {a.locationName} • {a.sectorName}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Employees */}
              {matchedEmployees.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold uppercase text-[10px] text-sky-600 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Funcionários ({matchedEmployees.length})
                  </span>
                  {matchedEmployees.map(e => (
                    <div 
                      key={e.id} 
                      onClick={() => { onSelectResult('employees', e); onClose(); }}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{e.name}</span>
                        <span className="block text-[10px] text-slate-500">{e.cargo} • {e.sectorName}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Nominations */}
              {matchedNominations.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold uppercase text-[10px] text-indigo-600 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Nomeações ({matchedNominations.length})
                  </span>
                  {matchedNominations.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => { onSelectResult('nominations', n); onClose(); }}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{n.fullName}</span>
                        <span className="block text-[10px] text-slate-500">{n.cargo} • {n.sectorName}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              {matchedNotes.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold uppercase text-[10px] text-amber-600 flex items-center gap-1">
                    <StickyNote className="w-3.5 h-3.5" /> Bloco de Notas ({matchedNotes.length})
                  </span>
                  {matchedNotes.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => { onSelectResult('notes', n); onClose(); }}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                        <span className="block text-[10px] text-slate-500 line-clamp-1">{n.content}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {matchedActivities.length === 0 && matchedEmployees.length === 0 && matchedNominations.length === 0 && matchedNotes.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                  Nenhum resultado encontrado para "{query}".
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
