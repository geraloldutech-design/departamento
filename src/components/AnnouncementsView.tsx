import React, { useState } from 'react';
import { Announcement, UserRole, Sector } from '../types';
import { 
  Megaphone, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Clock, 
  User, 
  Send
} from 'lucide-react';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  sectors: Sector[];
  activeRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  onSaveAnnouncement: (ann: Announcement) => void;
  onMarkAsRead: (annId: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  sectors,
  activeRole,
  currentUserId,
  currentUserName,
  onSaveAnnouncement,
  onMarkAsRead
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAnnReceipts, setSelectedAnnReceipts] = useState<Announcement | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      authorName: currentUserName,
      authorRole: activeRole,
      isUrgent,
      createdAt: new Date().toISOString(),
      readReceipts: [
        {
          userId: currentUserId,
          userName: currentUserName,
          userRole: activeRole,
          readAt: new Date().toISOString()
        }
      ]
    };

    onSaveAnnouncement(newAnn);
    setIsAddModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Megaphone className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Comunicação Institucional & Comunicados</h1>
            <p className="text-sm text-slate-500">Avisos oficiais da Direcção, directivas de segurança e confirmação de leitura</p>
          </div>
        </div>

        {(activeRole === 'Administrador' || activeRole === 'Director' || activeRole === 'Chefe de Departamento') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Comunicado</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map(ann => {
          const hasRead = ann.readReceipts?.some(r => r.userName === currentUserName);
          const readCount = ann.readReceipts?.length || 0;

          return (
            <div 
              key={ann.id} 
              className={`bg-white rounded-2xl p-6 border shadow-sm transition ${
                ann.isUrgent ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  {ann.isUrgent && (
                    <span className="px-2.5 py-1 bg-amber-500 text-white font-bold rounded-md text-xs uppercase flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Urgente</span>
                    </span>
                  )}
                  <h3 className="font-bold text-slate-900 text-lg">{ann.title}</h3>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{ann.authorName}</strong> ({ann.authorRole})
                  </span>
                  <span>•</span>
                  <span>{new Date(ann.createdAt).toLocaleString('pt-MZ')}</span>
                </div>
              </div>

              <div className="my-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {ann.content}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedAnnReceipts(ann)}
                  className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-800 font-medium"
                >
                  <Eye className="w-4 h-4 text-purple-600" />
                  <span>{readCount} Leituras Confirmadas</span>
                </button>

                <div>
                  {hasRead ? (
                    <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Lido por si</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onMarkAsRead(ann.id)}
                      className="px-4 py-1.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
                    >
                      Marcar como Lido
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: NEW ANNOUNCEMENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Publicar Comunicado Oficial</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Título do Comunicado</label>
                <input
                  type="text"
                  placeholder="Ex: Directiva de Segurança para Período de Maré Viva"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Conteúdo do Comunicado</label>
                <textarea
                  rows={5}
                  placeholder="Escreva o texto oficial..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={isUrgent}
                  onChange={e => setIsUrgent(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="urgentCheck" className="font-semibold text-slate-800">
                  Marcar como Comunicado Urgente (Aviso com Destaque)
                </label>
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Comunicado</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: READ RECEIPTS LIST */}
      {selectedAnnReceipts && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 text-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Confirmações de Leitura</h3>
            <p className="text-slate-500 mb-4">{selectedAnnReceipts.title}</p>

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
              {selectedAnnReceipts.readReceipts && selectedAnnReceipts.readReceipts.length > 0 ? (
                selectedAnnReceipts.readReceipts.map((r, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{r.userName}</p>
                      <p className="text-[11px] text-slate-400">{r.userRole}</p>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-mono">
                      {new Date(r.readAt).toLocaleString('pt-MZ')}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic py-4 text-center">Nenhuma confirmação registada ainda.</p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedAnnReceipts(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
