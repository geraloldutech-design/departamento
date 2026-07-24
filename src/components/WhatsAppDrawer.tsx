import React, { useState } from 'react';
import { Smartphone, Send, ExternalLink, CheckCheck, Clock, X, MessageSquare, AlertCircle } from 'lucide-react';
import { WhatsAppLog, Sector, Activity } from '../types';
import { WhatsAppService } from '../services/whatsappService';

interface WhatsAppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: WhatsAppLog[];
  sectors: Sector[];
  activities: Activity[];
}

export const WhatsAppDrawer: React.FC<WhatsAppDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  sectors,
  activities
}) => {
  if (!isOpen) return null;

  const [selectedRecipientPhone, setSelectedRecipientPhone] = useState(sectors[0]?.headWhatsapp || '+258841234567');
  const [selectedRecipientName, setSelectedRecipientName] = useState(sectors[0]?.headName || 'João Silva');
  const [customMessage, setCustomMessage] = useState(
    `EMPRESA MUNICIPAL DO RIO CHIVEVE (EMRICH)\n\nAviso Operacional Urgente: Favor reforçar as equipas de piquete junto às eclusas para a maré alta de hoje.`
  );

  const handleSendDirect = () => {
    WhatsAppService.openWhatsAppWeb(selectedRecipientPhone, customMessage);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg h-full p-6 shadow-2xl overflow-y-auto border-l border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  WhatsApp Business API Platform
                </h3>
                <p className="text-[11px] text-slate-500">Comunicação automática oficial EMRICH</p>
              </div>
            </div>

            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Instant Dispacther Form */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-3 text-xs">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Send className="w-4 h-4 text-emerald-600" />
              Emissor Direto de Mensagem WhatsApp
            </h4>

            <div>
              <label className="block text-emerald-900 dark:text-emerald-300 font-semibold mb-1">Destinatário (Chefe de Sector)</label>
              <select
                value={selectedRecipientPhone}
                onChange={(e) => {
                  setSelectedRecipientPhone(e.target.value);
                  const sec = sectors.find(s => s.headWhatsapp === e.target.value);
                  if (sec) setSelectedRecipientName(sec.headName);
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
              >
                {sectors.map(s => (
                  <option key={s.id} value={s.headWhatsapp}>
                    {s.name} - {s.headName} ({s.headWhatsapp})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-emerald-900 dark:text-emerald-300 font-semibold mb-1">Texto Formatado</label>
              <textarea
                rows={4}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans text-xs"
              />
            </div>

            <button
              onClick={handleSendDirect}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir no WhatsApp Web / Telemóvel
            </button>
          </div>

          {/* Sent Logs Timeline */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              Histórico de Envios Automáticos ({logs.length})
            </h4>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {logs.map(log => (
                <div 
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {log.eventTrigger} • {log.sectorName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.sentAt).toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 text-[11px] font-mono whitespace-pre-wrap bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    {log.messageText}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Para: {log.recipientName} ({log.recipientPhone})</span>
                    <span className="text-emerald-600 font-bold">✓ {log.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-500">
          Integração Oficial Meta WhatsApp Business API • EMRICH 2026
        </div>

      </div>
    </div>
  );
};
