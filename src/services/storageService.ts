import {
  Sector,
  Nomination,
  Employee,
  Activity,
  ActivityReport,
  Inspection,
  Note,
  WhatsAppLog,
  AuditLog,
  Announcement,
  UserRole,
  User
} from '../types';

import {
  INITIAL_SECTORS,
  INITIAL_NOMINATIONS,
  INITIAL_EMPLOYEES,
  INITIAL_ACTIVITIES,
  INITIAL_REPORTS,
  INITIAL_INSPECTIONS,
  INITIAL_NOTES,
  INITIAL_WHATSAPP_LOGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ANNOUNCEMENTS
} from '../data/initialData';

const KEYS = {
  SECTORS: 'emrich_sectors_v1',
  NOMINATIONS: 'emrich_nominations_v1',
  EMPLOYEES: 'emrich_employees_v1',
  ACTIVITIES: 'emrich_activities_v1',
  REPORTS: 'emrich_reports_v1',
  INSPECTIONS: 'emrich_inspections_v1',
  NOTES: 'emrich_notes_v1',
  WHATSAPP_LOGS: 'emrich_whatsapp_logs_v1',
  AUDIT_LOGS: 'emrich_audit_logs_v1',
  ANNOUNCEMENTS: 'emrich_announcements_v1',
  ACTIVE_ROLE: 'emrich_active_role_v1',
  CURRENT_USER: 'emrich_current_user_v1',
  IS_OFFLINE: 'emrich_is_offline_v1',
  OFFLINE_QUEUE: 'emrich_offline_queue_v1'
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (err) {
    console.error(`Error loading key ${key} from storage:`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key} to storage:`, err);
  }
}

export const StorageService = {
  getSectors(): Sector[] {
    return getItem<Sector[]>(KEYS.SECTORS, INITIAL_SECTORS);
  },
  saveSectors(sectors: Sector[]): void {
    setItem(KEYS.SECTORS, sectors);
  },

  getNominations(): Nomination[] {
    return getItem<Nomination[]>(KEYS.NOMINATIONS, INITIAL_NOMINATIONS);
  },
  saveNominations(nominations: Nomination[]): void {
    setItem(KEYS.NOMINATIONS, nominations);
  },

  getEmployees(): Employee[] {
    return getItem<Employee[]>(KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
  },
  saveEmployees(employees: Employee[]): void {
    setItem(KEYS.EMPLOYEES, employees);
  },

  getActivities(): Activity[] {
    return getItem<Activity[]>(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  },
  saveActivities(activities: Activity[]): void {
    setItem(KEYS.ACTIVITIES, activities);
  },

  getReports(): ActivityReport[] {
    return getItem<ActivityReport[]>(KEYS.REPORTS, INITIAL_REPORTS);
  },
  saveReports(reports: ActivityReport[]): void {
    setItem(KEYS.REPORTS, reports);
  },

  getInspections(): Inspection[] {
    return getItem<Inspection[]>(KEYS.INSPECTIONS, INITIAL_INSPECTIONS);
  },
  saveInspections(inspections: Inspection[]): void {
    setItem(KEYS.INSPECTIONS, inspections);
  },

  getNotes(): Note[] {
    return getItem<Note[]>(KEYS.NOTES, INITIAL_NOTES);
  },
  saveNotes(notes: Note[]): void {
    setItem(KEYS.NOTES, notes);
  },

  getWhatsAppLogs(): WhatsAppLog[] {
    return getItem<WhatsAppLog[]>(KEYS.WHATSAPP_LOGS, INITIAL_WHATSAPP_LOGS);
  },
  saveWhatsAppLogs(logs: WhatsAppLog[]): void {
    setItem(KEYS.WHATSAPP_LOGS, logs);
  },

  getAuditLogs(): AuditLog[] {
    return getItem<AuditLog[]>(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
  addAuditLog(userName: string, userRole: UserRole, action: string, targetModule: string, details: string): AuditLog[] {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName,
      userRole,
      action,
      targetModule,
      details
    };
    const updated = [newLog, ...logs];
    setItem(KEYS.AUDIT_LOGS, updated);
    return updated;
  },

  getAnnouncements(): Announcement[] {
    return getItem<Announcement[]>(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },
  saveAnnouncements(announcements: Announcement[]): void {
    setItem(KEYS.ANNOUNCEMENTS, announcements);
  },

  getActiveRole(): UserRole {
    return getItem<UserRole>(KEYS.ACTIVE_ROLE, 'Administrador');
  },
  setActiveRole(role: UserRole): void {
    setItem(KEYS.ACTIVE_ROLE, role);
  },

  getCurrentUser(): User | null {
    return getItem<User | null>(KEYS.CURRENT_USER, {
      id: 'usr-default',
      name: 'Manuel Alberto',
      email: 'm.alberto@emrich.co.mz',
      role: 'Chefe do Sector',
      sectorName: 'Jardinagem',
      department: 'Departamento de Infraestruturas',
      employeeCode: 'EMP-0142'
    });
  },
  setCurrentUser(user: User | null): void {
    setItem(KEYS.CURRENT_USER, user);
    if (user?.role) {
      this.setActiveRole(user.role);
    }
  },

  getIsOffline(): boolean {
    return getItem<boolean>(KEYS.IS_OFFLINE, false);
  },
  setIsOffline(isOffline: boolean): void {
    setItem(KEYS.IS_OFFLINE, isOffline);
  },

  getOfflineQueue(): any[] {
    return getItem<any[]>(KEYS.OFFLINE_QUEUE, []);
  },
  addToOfflineQueue(actionItem: any): void {
    const queue = this.getOfflineQueue();
    queue.push({ ...actionItem, queuedAt: new Date().toISOString() });
    setItem(KEYS.OFFLINE_QUEUE, queue);
  },
  clearOfflineQueue(): void {
    setItem(KEYS.OFFLINE_QUEUE, []);
  },

  resetToDefaultData(): void {
    setItem(KEYS.SECTORS, INITIAL_SECTORS);
    setItem(KEYS.NOMINATIONS, INITIAL_NOMINATIONS);
    setItem(KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    setItem(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    setItem(KEYS.REPORTS, INITIAL_REPORTS);
    setItem(KEYS.INSPECTIONS, INITIAL_INSPECTIONS);
    setItem(KEYS.NOTES, INITIAL_NOTES);
    setItem(KEYS.WHATSAPP_LOGS, INITIAL_WHATSAPP_LOGS);
    setItem(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    setItem(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    setItem(KEYS.OFFLINE_QUEUE, []);
  }
};
