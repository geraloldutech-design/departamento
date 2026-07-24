import React, { useState } from 'react';
import { StickyNote, Plus, Pin, Search, Trash2, Share2, Check, X, FileText } from 'lucide-react';
import { Note, UserRole } from '../types';

interface NotesViewProps {
  notes: Note[];
  activeRole: UserRole;
  onSaveNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onTogglePinNote: (noteId: string) => void;
}

const CATEGORIES: Note['category'][] = [
  'Actas de Reunião',
  'Lembretes',
  'Notas Rápidas',
  'Ideias',
  'Observações Operacionais'
];

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  activeRole,
  onSaveNote,
  onDeleteNote,
  onTogglePinNote
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formNote, setFormNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    category: 'Notas Rápidas',
    isPinned: false
  });

  const filteredNotes = notes.filter(n => {
    const matchesCat = activeCategory === 'todos' || n.category === activeCategory;
    const matchesQuery = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Sort pinned notes to top
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNote.title || !formNote.content) return;

    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: formNote.title,
      content: formNote.content,
      category: formNote.category || 'Notas Rápidas',
      isPinned: formNote.isPinned || false,
      authorName: activeRole,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveNote(newNote);
    setIsModalOpen(false);
    setFormNote({ title: '', content: '', category: 'Notas Rápidas', isPinned: false });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-amber-500" />
            Bloco de Notas Operacional
          </h2>
          <p className="text-xs text-slate-500">Notas rápidas, actas de reunião, lembretes e apontamentos de campo</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Criar Nova Nota
        </button>
      </div>

      {/* Filter and Category Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar em todas as notas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveCategory('todos')}
            className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition ${
              activeCategory === 'todos' 
                ? 'bg-amber-500 text-slate-950 font-bold' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Todas ({notes.length})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition ${
                activeCategory === cat 
                  ? 'bg-amber-500 text-slate-950 font-bold' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {cat} ({notes.filter(n=>n.category===cat).length})
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.map(note => (
          <div 
            key={note.id}
            className={`rounded-2xl border p-5 shadow-sm transition flex flex-col justify-between space-y-3 ${
              note.isPinned 
                ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                  {note.category}
                </span>

                <button
                  onClick={() => onTogglePinNote(note.id)}
                  className={`p-1 rounded-lg transition ${
                    note.isPinned ? 'text-amber-600 bg-amber-200/60 dark:bg-amber-800/60' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title={note.isPinned ? 'Desafixar nota' : 'Fixar nota no topo'}
                >
                  <Pin className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {note.title}
              </h3>

              <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>✍️ {note.authorName} • {new Date(note.createdAt).toLocaleDateString('pt-MZ')}</span>
              
              <button
                onClick={() => onDeleteNote(note.id)}
                className="text-slate-400 hover:text-red-500 transition"
                title="Eliminar Nota"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-amber-500" />
                Criar Nova Nota / Acta
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Título *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Acta da reunião com o Conselho Municipal"
                  value={formNote.title}
                  onChange={(e) => setFormNote({ ...formNote, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Categoria</label>
                <select
                  value={formNote.category}
                  onChange={(e) => setFormNote({ ...formNote, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Conteúdo da Nota *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escreva os pontos discutidos, lembretes ou apontamentos..."
                  value={formNote.content}
                  onChange={(e) => setFormNote({ ...formNote, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={formNote.isPinned}
                  onChange={(e) => setFormNote({ ...formNote, isPinned: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="pinCheck" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Fixar esta nota no topo
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Guardar Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
