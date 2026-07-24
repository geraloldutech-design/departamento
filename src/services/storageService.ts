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
  User,
  TransferRequest,
  MaterialItem,
  MaterialRequisition,
  EquipmentItem,
  VehicleItem,
  Incident,
  AttendanceRecord,
  DigitalApprovalDocument
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
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TRANSFER_REQUESTS,
  INITIAL_MATERIALS,
  INITIAL_MATERIAL_REQUISITIONS,
  INITIAL_EQUIPMENT,
  INITIAL_VEHICLES,
  INITIAL_INCIDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_DIGITAL_APPROVALS
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
  TRANSFER_REQUESTS: 'emrich_transfer_requests_v1',
  ACTIVE_ROLE: 'emrich_active_role_v1',
  CURRENT_USER: 'emrich_current_user_v1',
  IS_OFFLINE: 'emrich_is_offline_v1',
  OFFLINE_QUEUE: 'emrich_offline_queue_v1',
  MATERIALS: 'emrich_materials_v2',
  MATERIAL_REQUISITIONS: 'emrich_material_requisitions_v2',
  EQUIPMENT: 'emrich_equipment_v2',
  VEHICLES: 'emrich_vehicles_v2',
  INCIDENTS: 'emrich_incidents_v2',
  ATTENDANCE: 'emrich_attendance_v2',
  DIGITAL_APPROVALS: 'emrich_digital_approvals_v2'
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

  getTransferRequests(): TransferRequest[] {
    return getItem<TransferRequest[]>(KEYS.TRANSFER_REQUESTS, INITIAL_TRANSFER_REQUESTS);
  },
  saveTransferRequests(requests: TransferRequest[]): void {
    setItem(KEYS.TRANSFER_REQUESTS, requests);
  },

  // ---------------- V2.0 NEW STORAGE METHODS ----------------
  getMaterials(): MaterialItem[] {
    return getItem<MaterialItem[]>(KEYS.MATERIALS, INITIAL_MATERIALS);
  },
  saveMaterials(materials: MaterialItem[]): void {
    setItem(KEYS.MATERIALS, materials);
  },

  getMaterialRequisitions(): MaterialRequisition[] {
    return getItem<MaterialRequisition[]>(KEYS.MATERIAL_REQUISITIONS, INITIAL_MATERIAL_REQUISITIONS);
  },
  saveMaterialRequisitions(requisitions: MaterialRequisition[]): void {
    setItem(KEYS.MATERIAL_REQUISITIONS, requisitions);
  },
  getRequisitions(): MaterialRequisition[] {
    return this.getMaterialRequisitions();
  },
  saveRequisitions(requisitions: MaterialRequisition[]): void {
    this.saveMaterialRequisitions(requisitions);
  },

  getEquipment(): EquipmentItem[] {
    return getItem<EquipmentItem[]>(KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
  },
  saveEquipment(equipment: EquipmentItem[]): void {
    setItem(KEYS.EQUIPMENT, equipment);
  },

  getVehicles(): VehicleItem[] {
    return getItem<VehicleItem[]>(KEYS.VEHICLES, INITIAL_VEHICLES);
  },
  saveVehicles(vehicles: VehicleItem[]): void {
    setItem(KEYS.VEHICLES, vehicles);
  },

  getIncidents(): Incident[] {
    return getItem<Incident[]>(KEYS.INCIDENTS, INITIAL_INCIDENTS);
  },
  saveIncidents(incidents: Incident[]): void {
    setItem(KEYS.INCIDENTS, incidents);
  },

  getAttendance(): AttendanceRecord[] {
    return getItem<AttendanceRecord[]>(KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  },
  saveAttendance(attendance: AttendanceRecord[]): void {
    setItem(KEYS.ATTENDANCE, attendance);
  },

  getDigitalApprovals(): DigitalApprovalDocument[] {
    return getItem<DigitalApprovalDocument[]>(KEYS.DIGITAL_APPROVALS, INITIAL_DIGITAL_APPROVALS);
  },
  saveDigitalApprovals(approvals: DigitalApprovalDocument[]): void {
    setItem(KEYS.DIGITAL_APPROVALS, approvals);
  },
  getApprovals(): DigitalApprovalDocument[] {
    return this.getDigitalApprovals();
  },
  saveApprovals(approvals: DigitalApprovalDocument[]): void {
    this.saveDigitalApprovals(approvals);
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
    setItem(KEYS.TRANSFER_REQUESTS, INITIAL_TRANSFER_REQUESTS);
    setItem(KEYS.MATERIALS, INITIAL_MATERIALS);
    setItem(KEYS.MATERIAL_REQUISITIONS, INITIAL_MATERIAL_REQUISITIONS);
    setItem(KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
    setItem(KEYS.VEHICLES, INITIAL_VEHICLES);
    setItem(KEYS.INCIDENTS, INITIAL_INCIDENTS);
    setItem(KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    setItem(KEYS.DIGITAL_APPROVALS, INITIAL_DIGITAL_APPROVALS);
    setItem(KEYS.OFFLINE_QUEUE, []);
  }
};

