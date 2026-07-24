import { Activity, WhatsAppLog, Nomination } from '../types';
import { StorageService } from './storageService';

export const WhatsAppService = {
  formatPhoneNumber(phone: string): string {
    return phone.replace(/[^0-9]/g, '');
  },

  generateActivityMessage(activity: Activity, eventType: WhatsAppLog['eventTrigger'] = 'Nova Actividade'): string {
    const header = `*EMPRESA MUNICIPAL DO RIO CHIVEVE (EMRICH)*\n\n📌 *${eventType.toUpperCase()}*`;
    const details = `\n\n*Título:* ${activity.title}` +
      `\n*Sector:* ${activity.sectorName}` +
      `\n*Local:* ${activity.locationName}` +
      `\n*Data/Hora:* ${activity.date} às ${activity.time}` +
      `\n*Prioridade:* ${activity.priority}` +
      `\n*Responsável:* ${activity.responsibleName}` +
      `\n*Descrição:* ${activity.description}`;

    const footer = `\n\nPor favor aceda ao *EMRICH GESTOR* para confirmar a lista de materiais, checklists e submeter o relatório de execução.`;

    return `${header}${details}${footer}`;
  },

  sendActivityNotification(activity: Activity, eventType: WhatsAppLog['eventTrigger'] = 'Nova Actividade', customRecipientPhone?: string, customRecipientName?: string): WhatsAppLog {
    const phone = customRecipientPhone || activity.responsibleWhatsapp || '+258840000000';
    const name = customRecipientName || activity.responsibleName || 'Responsável do Sector';
    const messageText = this.generateActivityMessage(activity, eventType);

    const log: WhatsAppLog = {
      id: `wa-${Date.now()}`,
      recipientPhone: phone,
      recipientName: name,
      sectorName: activity.sectorName,
      eventTrigger: eventType,
      messageText,
      sentAt: new Date().toISOString(),
      status: StorageService.getIsOffline() ? 'Falha Simulação' : 'Enviado'
    };

    const existingLogs = StorageService.getWhatsAppLogs();
    StorageService.saveWhatsAppLogs([log, ...existingLogs]);

    return log;
  },

  updateSectorHeadWhatsAppFromNomination(nomination: Nomination): void {
    const sectors = StorageService.getSectors();
    const sectorIndex = sectors.findIndex(s => s.id === nomination.sectorId || s.name === nomination.sectorName);

    if (sectorIndex !== -1) {
      sectors[sectorIndex].headName = nomination.fullName;
      sectors[sectorIndex].headWhatsapp = nomination.whatsapp;
      sectors[sectorIndex].headEmail = nomination.email;
      StorageService.saveSectors(sectors);

      // Audit Log
      StorageService.addAuditLog(
        'Sistema EMRICH',
        'Administrador',
        'Atualização Automática de Contacto WhatsApp',
        'Nomeação dos Chefes',
        `Contacto de WhatsApp do Sector ${nomination.sectorName} atualizado para ${nomination.fullName} (${nomination.whatsapp}).`
      );
    }
  },

  openWhatsAppWeb(phone: string, text: string): void {
    const cleanPhone = this.formatPhoneNumber(phone);
    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    window.open(url, '_blank');
  }
};
