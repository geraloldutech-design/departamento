import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ActivitiesView } from './components/ActivitiesView';
import { CalendarView } from './components/CalendarView';
import { NominationsView } from './components/NominationsView';
import { EmployeesView } from './components/EmployeesView';
import { SectorsView } from './components/SectorsView';
import { InspectionsView } from './components/InspectionsView';
import { ReportsView } from './components/ReportsView';
import { NotesView } from './components/NotesView';
import { MapView } from './components/MapView';
import { AnalyticsView } from './components/AnalyticsView';
import { WhatsAppDrawer } from './components/WhatsAppDrawer';
import { AuditBackupView } from './components/AuditBackupView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { LoginModal } from './components/LoginModal';
import { AccessDeniedModal } from './components/AccessDeniedModal';

// V2.0 New Views
import { MaterialsView } from './components/MaterialsView';
import { EquipmentView } from './components/EquipmentView';
import { VehiclesView } from './components/VehiclesView';
import { IncidentsView } from './components/IncidentsView';
import { AttendanceView } from './components/AttendanceView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { AiAssistantView } from './components/AiAssistantView';
import { ExecutiveDashboardView } from './components/ExecutiveDashboardView';
import { DigitalApprovalsView } from './components/DigitalApprovalsView';
import { ReportsGeneratorView } from './components/ReportsGeneratorView';

import { StorageService } from './services/storageService';
import { WhatsAppService } from './services/whatsappService';
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
  MaintenanceRecord,
  VehicleItem,
  FuelLog,
  VehicleMaintenance,
  Incident,
  IncidentStatus,
  AttendanceRecord,
  DigitalApprovalDocument
} from './types';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [activeRole, setActiveRole] = useState<UserRole>(() => StorageService.getActiveRole());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('emrich_theme') === 'dark';
  });
  const [isOffline, setIsOffline] = useState<boolean>(() => StorageService.getIsOffline());
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Security Access Denied Modal State
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState(false);
  const [attemptedOperation, setAttemptedOperation] = useState('');

  // Domain State
  const [sectors, setSectors] = useState<Sector[]>(() => StorageService.getSectors());
  const [nominations, setNominations] = useState<Nomination[]>(() => StorageService.getNominations());
  const [employees, setEmployees] = useState<Employee[]>(() => StorageService.getEmployees());
  const [activities, setActivities] = useState<Activity[]>(() => StorageService.getActivities());
  const [reports, setReports] = useState<ActivityReport[]>(() => StorageService.getReports());
  const [inspections, setInspections] = useState<Inspection[]>(() => StorageService.getInspections());
  const [notes, setNotes] = useState<Note[]>(() => StorageService.getNotes());
  const [whatsappLogs, setWhatsappLogs] = useState<WhatsAppLog[]>(() => StorageService.getWhatsAppLogs());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => StorageService.getAnnouncements());
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>(() => StorageService.getTransferRequests());

  // V2.0 Domain States
  const [materials, setMaterials] = useState<MaterialItem[]>(() => StorageService.getMaterials());
  const [requisitions, setRequisitions] = useState<MaterialRequisition[]>(() => StorageService.getRequisitions());
  const [equipment, setEquipment] = useState<EquipmentItem[]>(() => StorageService.getEquipment());
  const [vehicles, setVehicles] = useState<VehicleItem[]>(() => StorageService.getVehicles());
  const [incidents, setIncidents] = useState<Incident[]>(() => StorageService.getIncidents());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => StorageService.getAttendance());
  const [approvals, setApprovals] = useState<DigitalApprovalDocument[]>(() => StorageService.getApprovals());

  // Modals & Drawers State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isWhatsAppDrawerOpen, setIsWhatsAppDrawerOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedActivityForModal, setSelectedActivityForModal] = useState<Activity | null>(null);
  const [isNominationModalOpen, setIsNominationModalOpen] = useState(false);

  // Sync dark mode HTML class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('emrich_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('emrich_theme', 'light');
    }
  }, [isDarkMode]);

  // Global Keyboard Shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Security Access Denied Trigger
  const handleUnauthorizedAction = (opName: string) => {
    setAttemptedOperation(opName);
    setIsAccessDeniedOpen(true);

    StorageService.addAuditLog(
      currentUser?.name || 'Utilizador Corrente',
      activeRole,
      'Acesso Negado (Bloqueio RBAC)',
      'Segurança & Controlo de Permissões',
      `MENSAGEM: Acesso negado. Não possui permissões para efectuar esta operação. Operação tentada: ${opName}. Dispositivo: Browser Client • Beira Node.`
    );
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Sync Role change
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    StorageService.setActiveRole(role);
    if (currentUser) {
      const updatedUser = { ...currentUser, role };
      setCurrentUser(updatedUser);
      StorageService.setCurrentUser(updatedUser);
    }
    StorageService.addAuditLog('Utilizador', role, 'Alternou Perfil de Acesso', 'Segurança', `Perfil do utilizador alterado para ${role}.`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Login / Change Collaborator handler
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    StorageService.setCurrentUser(user);
    StorageService.addAuditLog(
      user.name, 
      user.role, 
      'Início de Sessão (Login)', 
      'Sessão & Autenticação', 
      `Colaborador ${user.name} iniciou sessão no Sector ${user.sectorName || 'Geral'} como ${user.role}.`
    );
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Toggle Offline Simulator
  const handleToggleOffline = () => {
    const nextOffline = !isOffline;
    setIsOffline(nextOffline);
    StorageService.setIsOffline(nextOffline);
    
    if (!nextOffline) {
      const queue = StorageService.getOfflineQueue();
      if (queue.length > 0) {
        StorageService.clearOfflineQueue();
        StorageService.addAuditLog('Sistema Offline Sync', activeRole, 'Sincronizou Dados Offline', 'Sistema', `${queue.length} operações offline sincronizadas com o servidor.`);
        setAuditLogs(StorageService.getAuditLogs());
      }
    }
  };

  // Activity Handlers
  const handleSaveActivity = (activity: Activity, isNew: boolean) => {
    let updated: Activity[];
    if (isNew) {
      updated = [activity, ...activities];
      WhatsAppService.sendActivityNotification(activity, 'Nova Actividade');
    } else {
      updated = activities.map(a => a.id === activity.id ? activity : a);
      WhatsAppService.sendActivityNotification(activity, 'Alteração');
    }

    setActivities(updated);
    StorageService.saveActivities(updated);
    setWhatsappLogs(StorageService.getWhatsAppLogs());

    StorageService.addAuditLog(
      currentUser?.name || 'Utilizador', 
      activeRole, 
      isNew ? 'Criou Actividade' : 'Atualizou Actividade', 
      'Agendamento de Actividades', 
      `Actividade "${activity.title}" (${activity.sectorName}) guardada com sucesso.`
    );
    setAuditLogs(StorageService.getAuditLogs());

    setIsActivityModalOpen(false);
    setSelectedActivityForModal(null);
  };

  const handleDeleteActivity = (id: string) => {
    if (activeRole !== 'Administrador' && activeRole !== 'Director') {
      handleUnauthorizedAction('Eliminar actividade do cronograma');
      return;
    }

    const updated = activities.filter(a => a.id !== id);
    setActivities(updated);
    StorageService.saveActivities(updated);

    StorageService.addAuditLog(currentUser?.name || 'Utilizador', activeRole, 'Eliminou Actividade', 'Agendamento de Actividades', `Actividade #${id} removida do sistema.`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleQuickUpdateActivityStatus = (id: string, status: Activity['status']) => {
    const updated = activities.map(a => {
      if (a.id === id) {
        const progressPercent = status === 'Concluída' ? 100 : a.progressPercent;
        const updatedAct = { ...a, status, progressPercent };
        WhatsAppService.sendActivityNotification(updatedAct, status === 'Concluída' ? 'Conclusão' : 'Alteração');
        return updatedAct;
      }
      return a;
    });

    setActivities(updated);
    StorageService.saveActivities(updated);
    setWhatsappLogs(StorageService.getWhatsAppLogs());
  };

  // Nomination Handler (Auto WhatsApp & Sector Sync)
  const handleSaveNomination = (nomination: Nomination) => {
    if (activeRole !== 'Administrador' && activeRole !== 'Director' && activeRole !== 'Chefe de Departamento') {
      handleUnauthorizedAction('Nomeação/Exoneração de Chefe de Sector');
      return;
    }

    const exists = nominations.some(n => n.id === nomination.id);
    let updatedNoms: Nomination[];
    if (exists) {
      updatedNoms = nominations.map(n => n.id === nomination.id ? nomination : n);
    } else {
      updatedNoms = [nomination, ...nominations];
    }

    setNominations(updatedNoms);
    StorageService.saveNominations(updatedNoms);

    // Auto update sector WhatsApp contact and head if active
    if (nomination.status === 'Ativa') {
      WhatsAppService.updateSectorHeadWhatsAppFromNomination(nomination);
      const freshSectors = StorageService.getSectors();
      setSectors(freshSectors);

      // Also update future activities assigned to this sector
      const updatedActivities = activities.map(act => {
        if (act.sectorId === nomination.sectorId || act.sectorName === nomination.sectorName) {
          return {
            ...act,
            responsibleName: nomination.fullName,
            responsibleWhatsapp: nomination.whatsapp
          };
        }
        return act;
      });
      setActivities(updatedActivities);
      StorageService.saveActivities(updatedActivities);
    }

    const isExoneration = nomination.status === 'Exonerado(a)' || nomination.status === 'Revogada';

    StorageService.addAuditLog(
      currentUser?.name || 'Utilizador', 
      activeRole, 
      isExoneration ? 'Efectuou Exoneração de Chefe' : 'Efectuou Nomeação de Chefe', 
      'Nomeação dos Chefes', 
      `${isExoneration ? 'Exonerado' : 'Nomeado'} ${nomination.fullName} como ${nomination.cargo} do sector de ${nomination.sectorName}.`
    );
    setAuditLogs(StorageService.getAuditLogs());
    setIsNominationModalOpen(false);
  };

  // Transfer Request Handlers
  const handleRequestTransfer = (req: TransferRequest) => {
    const updated = [req, ...transferRequests];
    setTransferRequests(updated);
    StorageService.saveTransferRequests(updated);

    StorageService.addAuditLog(
      currentUser?.name || 'Chefe de Departamento',
      activeRole,
      'Solicitou Transferência de Sector',
      'Transferência de Colaboradores',
      `Solicitada transferência do colaborador ${req.employeeName} do sector ${req.fromSectorName} para ${req.toSectorName}.`
    );
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleApproveTransfer = (reqId: string) => {
    if (activeRole !== 'Administrador') {
      handleUnauthorizedAction('Aprovação formal de transferência de colaborador');
      return;
    }

    const req = transferRequests.find(r => r.id === reqId);
    if (!req) return;

    // 1. Update request status
    const updatedRequests = transferRequests.map(r => 
      r.id === reqId 
        ? { ...r, status: 'Aprovado' as const, approvedBy: currentUser?.name || 'Administrador', approvedAt: new Date().toISOString() } 
        : r
    );
    setTransferRequests(updatedRequests);
    StorageService.saveTransferRequests(updatedRequests);

    // 2. Update employee sector
    const targetSector = sectors.find(s => s.id === req.toSectorId || s.name === req.toSectorName);
    const updatedEmployees = employees.map(emp => {
      if (emp.id === req.employeeId) {
        return {
          ...emp,
          sectorId: req.toSectorId,
          sectorName: req.toSectorName,
          department: targetSector?.department || emp.department
        };
      }
      return emp;
    });
    setEmployees(updatedEmployees);
    StorageService.saveEmployees(updatedEmployees);

    // 3. Recalculate member count for sectors
    const updatedSectors = sectors.map(sec => {
      const count = updatedEmployees.filter(e => e.sectorId === sec.id || e.sectorName === sec.name).length;
      return { ...sec, memberCount: count };
    });
    setSectors(updatedSectors);
    StorageService.saveSectors(updatedSectors);

    // 4. Audit Log
    StorageService.addAuditLog(
      currentUser?.name || 'Administrador',
      activeRole,
      'Aprovou Transferência de Sector',
      'Transferência de Colaboradores',
      `Aprovada a transferência do colaborador ${req.employeeName} para o sector ${req.toSectorName}.`
    );
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleRejectTransfer = (reqId: string) => {
    if (activeRole !== 'Administrador') {
      handleUnauthorizedAction('Rejeição formal de transferência de colaborador');
      return;
    }

    const updatedRequests = transferRequests.map(r => 
      r.id === reqId ? { ...r, status: 'Rejeitado' as const } : r
    );
    setTransferRequests(updatedRequests);
    StorageService.saveTransferRequests(updatedRequests);

    StorageService.addAuditLog(
      currentUser?.name || 'Administrador',
      activeRole,
      'Rejeitou Transferência de Sector',
      'Transferência de Colaboradores',
      `Rejeitado o pedido de transferência #${reqId}.`
    );
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Employee Handler
  const handleSaveEmployee = (emp: Employee) => {
    if (activeRole === 'Funcionário' || activeRole === 'Chefe do Sector') {
      handleUnauthorizedAction('Alteração de sector e dados de colaborador');
      return;
    }

    const exists = employees.some(e => e.id === emp.id);
    let updated: Employee[];
    if (exists) {
      updated = employees.map(e => e.id === emp.id ? emp : e);
    } else {
      updated = [emp, ...employees];
    }
    setEmployees(updated);
    StorageService.saveEmployees(updated);

    StorageService.addAuditLog(
      currentUser?.name || 'Utilizador',
      activeRole,
      exists ? 'Atualizou Colaborador' : 'Cadastrou Colaborador',
      'Quadros de Pessoal',
      `Colaborador ${emp.name} (${emp.cargo}) guardado no sector ${emp.sectorName}.`
    );
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleDeleteEmployee = (id: string) => {
    if (activeRole !== 'Administrador') {
      handleUnauthorizedAction('Remover colaborador do sistema');
      return;
    }

    const updated = employees.filter(e => e.id !== id);
    setEmployees(updated);
    StorageService.saveEmployees(updated);

    StorageService.addAuditLog(currentUser?.name || 'Administrador', activeRole, 'Eliminou Colaborador', 'Quadros de Pessoal', `Colaborador #${id} removido.`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Sector Handler
  const handleSaveSector = (sec: Sector) => {
    if (activeRole !== 'Administrador' && activeRole !== 'Director') {
      handleUnauthorizedAction('Configuração de sector operacional');
      return;
    }

    const exists = sectors.some(s => s.id === sec.id);
    let updated: Sector[];
    if (exists) {
      updated = sectors.map(s => s.id === sec.id ? sec : s);
    } else {
      updated = [sec, ...sectors];
    }
    setSectors(updated);
    StorageService.saveSectors(updated);

    StorageService.addAuditLog(
      currentUser?.name || 'Administrador',
      activeRole,
      exists ? 'Atualizou Sector Operacional' : 'Criou Sector Operacional',
      'Sectores EMRICH',
      `Sector ${sec.name} guardado com chefe ${sec.headName} (${sec.headWhatsapp}).`
    );
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Inspection Handler
  const handleSaveInspection = (insp: Inspection) => {
    const updated = [insp, ...inspections];
    setInspections(updated);
    StorageService.saveInspections(updated);

    StorageService.addAuditLog('Utilizador', activeRole, 'Emitiu Parecer Técnico', 'Fiscalização', `Emitido parecer técnico ${insp.decision} para a actividade ${insp.activityTitle}.`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Report Handler
  const handleSaveReport = (rep: ActivityReport) => {
    const updated = [rep, ...reports];
    setReports(updated);
    StorageService.saveReports(updated);

    StorageService.addAuditLog('Utilizador', activeRole, 'Submeteu Relatório', 'Relatórios', `Submetido relatório para a actividade ${rep.activityTitle}.`);
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Notes Handler
  const handleSaveNote = (note: Note) => {
    const updated = [note, ...notes];
    setNotes(updated);
    StorageService.saveNotes(updated);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    StorageService.saveNotes(updated);
  };

  const handleTogglePinNote = (id: string) => {
    const updated = notes.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
    setNotes(updated);
    StorageService.saveNotes(updated);
  };

  // Announcement Handler
  const handleCreateAnnouncement = () => {
    if (activeRole !== 'Administrador' && activeRole !== 'Director') {
      handleUnauthorizedAction('Publicar comunicado oficial');
      return;
    }

    const title = prompt('Título do Comunicado Oficial:');
    const content = prompt('Conteúdo do Comunicado:');
    if (title && content) {
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        title,
        content,
        authorName: currentUser?.name || 'Conselho de Administração',
        authorRole: activeRole,
        isUrgent: true,
        createdAt: new Date().toISOString()
      };
      const updated = [newAnn, ...announcements];
      setAnnouncements(updated);
      StorageService.saveAnnouncements(updated);

      StorageService.addAuditLog(currentUser?.name || 'Administração', activeRole, 'Publicou Comunicado', 'Dashboard', `Publicado comunicado "${title}".`);
      setAuditLogs(StorageService.getAuditLogs());
    }
  };

  // V2.0 Handlers
  const handleSaveMaterial = (mat: MaterialItem) => {
    const updated = [mat, ...materials.filter(m => m.id !== mat.id)];
    setMaterials(updated);
    StorageService.saveMaterials(updated);
  };

  const handleRequestMaterial = (req: MaterialRequisition) => {
    const updated = [req, ...requisitions];
    setRequisitions(updated);
    StorageService.saveRequisitions(updated);
  };

  const handleValidateRequisition = (reqId: string) => {
    const updated = requisitions.map(r => 
      r.id === reqId ? { ...r, status: 'Validado pelo Chefe' as const, validatedBy: currentUser?.name || 'Chefe de Departamento' } : r
    );
    setRequisitions(updated);
    StorageService.saveRequisitions(updated);
  };

  const handleApproveRequisition = (reqId: string) => {
    const req = requisitions.find(r => r.id === reqId);
    if (!req) return;

    // 1. Update requisition status
    const updatedReqs = requisitions.map(r => 
      r.id === reqId ? { ...r, status: 'Aprovado (Stock Entregue)' as const, approvedBy: currentUser?.name || 'Administrador' } : r
    );
    setRequisitions(updatedReqs);
    StorageService.saveRequisitions(updatedReqs);

    // 2. Decrement stock for requested items automatically
    let updatedMaterials = [...materials];
    req.items.forEach(it => {
      updatedMaterials = updatedMaterials.map(m => {
        if (m.id === it.materialId) {
          const newQty = Math.max(0, m.quantity - it.quantityRequested);
          return { ...m, quantity: newQty };
        }
        return m;
      });
    });
    setMaterials(updatedMaterials);
    StorageService.saveMaterials(updatedMaterials);
  };

  const handleRejectRequisition = (reqId: string) => {
    const updated = requisitions.map(r => 
      r.id === reqId ? { ...r, status: 'Rejeitado' as const } : r
    );
    setRequisitions(updated);
    StorageService.saveRequisitions(updated);
  };

  const handleSaveEquipment = (eq: EquipmentItem) => {
    const updated = [eq, ...equipment.filter(e => e.id !== eq.id)];
    setEquipment(updated);
    StorageService.saveEquipment(updated);
  };

  const handleAddMaintenance = (eqId: string, record: MaintenanceRecord) => {
    const updated = equipment.map(e => {
      if (e.id === eqId) {
        return {
          ...e,
          condition: 'Em Manutenção' as const,
          maintenanceHistory: [...e.maintenanceHistory, record]
        };
      }
      return e;
    });
    setEquipment(updated);
    StorageService.saveEquipment(updated);
  };

  const handleSaveVehicle = (v: VehicleItem) => {
    const updated = [v, ...vehicles.filter(ve => ve.id !== v.id)];
    setVehicles(updated);
    StorageService.saveVehicles(updated);
  };

  const handleAddFuelLog = (vehicleId: string, log: FuelLog) => {
    const updated = vehicles.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          currentKm: Math.max(v.currentKm, log.kmAtRefuel),
          fuelLogs: [...v.fuelLogs, log]
        };
      }
      return v;
    });
    setVehicles(updated);
    StorageService.saveVehicles(updated);
  };

  const handleAddVehicleMaintenance = (vehicleId: string, log: VehicleMaintenance) => {
    const updated = vehicles.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          maintenanceLogs: [...v.maintenanceLogs, log]
        };
      }
      return v;
    });
    setVehicles(updated);
    StorageService.saveVehicles(updated);
  };

  const handleSaveIncident = (inc: Incident) => {
    const updated = [inc, ...incidents.filter(i => i.id !== inc.id)];
    setIncidents(updated);
    StorageService.saveIncidents(updated);
  };

  const handleUpdateIncidentStatus = (incId: string, status: IncidentStatus, notes?: string) => {
    const updated = incidents.map(i => {
      if (i.id === incId) {
        return {
          ...i,
          status,
          resolutionNotes: notes || i.resolutionNotes,
          resolvedAt: status === 'Resolvida' ? new Date().toISOString() : i.resolvedAt
        };
      }
      return i;
    });
    setIncidents(updated);
    StorageService.saveIncidents(updated);
  };

  const handleRecordAttendance = (record: AttendanceRecord) => {
    const updated = [record, ...attendance.filter(a => !(a.employeeId === record.employeeId && a.date === record.date))];
    setAttendance(updated);
    StorageService.saveAttendance(updated);
  };

  const handleMarkAnnouncementRead = (annId: string) => {
    const updated = announcements.map(a => {
      if (a.id === annId) {
        const receipts = a.readReceipts || [];
        const alreadyRead = receipts.some(r => r.userName === (currentUser?.name || 'Utilizador'));
        if (!alreadyRead) {
          return {
            ...a,
            readReceipts: [
              ...receipts,
              {
                userId: currentUser?.id || 'u-1',
                userName: currentUser?.name || 'Utilizador',
                userRole: activeRole,
                readAt: new Date().toISOString()
              }
            ]
          };
        }
      }
      return a;
    });
    setAnnouncements(updated);
    StorageService.saveAnnouncements(updated);
  };

  const handleSignApproval = (approvalId: string, level: 1 | 2 | 3, signatureCanvasData: string, comments?: string) => {
    const hash = `HASH-EMRICH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const updated = approvals.map(app => {
      if (app.id === approvalId) {
        const nextSteps = app.steps.map(s => {
          if (s.level === level) {
            return {
              ...s,
              status: 'Aprovado' as const,
              approverName: currentUser?.name || 'Aprovador Digital',
              signedAt: new Date().toISOString(),
              signatureHash: hash,
              comments
            };
          }
          return s;
        });

        const nextLevel = level < 3 ? (level + 1 as 1 | 2 | 3) : 3;
        const allApproved = nextSteps.every(s => s.status === 'Aprovado');

        return {
          ...app,
          steps: nextSteps,
          currentLevel: nextLevel,
          finalStatus: allApproved ? ('Aprovado Total' as const) : app.finalStatus
        };
      }
      return app;
    });

    setApprovals(updated);
    StorageService.saveApprovals(updated);
  };

  // Restore Backup
  const handleRestoreBackup = (backupData: any) => {
    if (backupData.sectors) { StorageService.saveSectors(backupData.sectors); setSectors(backupData.sectors); }
    if (backupData.nominations) { StorageService.saveNominations(backupData.nominations); setNominations(backupData.nominations); }
    if (backupData.employees) { StorageService.saveEmployees(backupData.employees); setEmployees(backupData.employees); }
    if (backupData.activities) { StorageService.saveActivities(backupData.activities); setActivities(backupData.activities); }
    if (backupData.reports) { StorageService.saveReports(backupData.reports); setReports(backupData.reports); }
    if (backupData.inspections) { StorageService.saveInspections(backupData.inspections); setInspections(backupData.inspections); }
    if (backupData.notes) { StorageService.saveNotes(backupData.notes); setNotes(backupData.notes); }
    if (backupData.transferRequests) { StorageService.saveTransferRequests(backupData.transferRequests); setTransferRequests(backupData.transferRequests); }
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Reset Data Handler
  const handleResetData = () => {
    if (activeRole !== 'Administrador') {
      handleUnauthorizedAction('Reset de fábrica / Limpeza de dados');
      return;
    }

    if (confirm('Tem a certeza que deseja restaurar os dados iniciais da EMRICH? Todos os registos guardados localmente serão repostos.')) {
      StorageService.resetToDefaultData();
      setSectors(StorageService.getSectors());
      setNominations(StorageService.getNominations());
      setEmployees(StorageService.getEmployees());
      setActivities(StorageService.getActivities());
      setReports(StorageService.getReports());
      setInspections(StorageService.getInspections());
      setNotes(StorageService.getNotes());
      setWhatsappLogs(StorageService.getWhatsAppLogs());
      setAuditLogs(StorageService.getAuditLogs());
      setAnnouncements(StorageService.getAnnouncements());
      setTransferRequests(StorageService.getTransferRequests());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
        onOpenWhatsAppDrawer={() => setIsWhatsAppDrawerOpen(true)}
        unreadNotificationsCount={whatsappLogs.length}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row relative">
        
        {/* Sidebar Navigation */}
        <Sidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeRole={activeRole}
          currentUser={currentUser}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Dynamic View Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              activities={activities}
              sectors={sectors}
              announcements={announcements}
              activeRole={activeRole}
              onNavigateTab={setActiveTab}
              onOpenNewActivityModal={() => {
                setSelectedActivityForModal(null);
                setIsActivityModalOpen(true);
              }}
              onOpenNewNominationModal={() => setIsNominationModalOpen(true)}
              onOpenNewAnnouncementModal={handleCreateAnnouncement}
              onQuickUpdateActivityStatus={handleQuickUpdateActivityStatus}
            />
          )}

          {activeTab === 'executive-dashboard' && (
            <ExecutiveDashboardView
              activities={activities}
              sectors={sectors}
              materials={materials}
              vehicles={vehicles}
              incidents={incidents}
              employees={employees}
              activeRole={activeRole}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'ai-assistant' && (
            <AiAssistantView
              activities={activities}
              reports={reports}
              inspections={inspections}
              sectors={sectors}
              materials={materials}
              vehicles={vehicles}
              incidents={incidents}
            />
          )}

          {activeTab === 'materials' && (
            <MaterialsView
              materials={materials}
              requisitions={requisitions}
              sectors={sectors}
              activeRole={activeRole}
              currentUserName={currentUser?.name || 'Utilizador'}
              onSaveMaterial={handleSaveMaterial}
              onRequestMaterial={handleRequestMaterial}
              onValidateRequisition={handleValidateRequisition}
              onApproveRequisition={handleApproveRequisition}
              onRejectRequisition={handleRejectRequisition}
            />
          )}

          {activeTab === 'equipment' && (
            <EquipmentView
              equipment={equipment}
              sectors={sectors}
              activeRole={activeRole}
              onSaveEquipment={handleSaveEquipment}
              onAddMaintenance={handleAddMaintenance}
            />
          )}

          {activeTab === 'vehicles' && (
            <VehiclesView
              vehicles={vehicles}
              sectors={sectors}
              activeRole={activeRole}
              onSaveVehicle={handleSaveVehicle}
              onAddFuelLog={handleAddFuelLog}
              onAddVehicleMaintenance={handleAddVehicleMaintenance}
            />
          )}

          {activeTab === 'incidents' && (
            <IncidentsView
              incidents={incidents}
              sectors={sectors}
              activeRole={activeRole}
              currentUserName={currentUser?.name || 'Utilizador'}
              onSaveIncident={handleSaveIncident}
              onUpdateIncidentStatus={handleUpdateIncidentStatus}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              employees={employees}
              attendance={attendance}
              sectors={sectors}
              activeRole={activeRole}
              currentUserName={currentUser?.name || 'Utilizador'}
              onRecordAttendance={handleRecordAttendance}
            />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementsView
              announcements={announcements}
              sectors={sectors}
              activeRole={activeRole}
              currentUserId={currentUser?.id || 'u-1'}
              currentUserName={currentUser?.name || 'Utilizador'}
              onSaveAnnouncement={(ann) => {
                const updated = [ann, ...announcements];
                setAnnouncements(updated);
                StorageService.saveAnnouncements(updated);
              }}
              onMarkAsRead={handleMarkAnnouncementRead}
            />
          )}

          {activeTab === 'digital-approvals' && (
            <DigitalApprovalsView
              approvals={approvals}
              activeRole={activeRole}
              currentUserName={currentUser?.name || 'Utilizador'}
              onSignApproval={handleSignApproval}
              onRejectApproval={(id) => {
                const updated = approvals.map(a => a.id === id ? { ...a, finalStatus: 'Rejeitado' as const } : a);
                setApprovals(updated);
                StorageService.saveApprovals(updated);
              }}
            />
          )}

          {activeTab === 'reports-generator' && (
            <ReportsGeneratorView
              activities={activities}
              sectors={sectors}
              materials={materials}
              vehicles={vehicles}
              incidents={incidents}
              activeRole={activeRole}
              currentUserName={currentUser?.name || 'Utilizador'}
            />
          )}

          {activeTab === 'activities' && (
            <ActivitiesView
              activities={activities}
              sectors={sectors}
              activeRole={activeRole}
              onSaveActivity={handleSaveActivity}
              onDeleteActivity={handleDeleteActivity}
              onOpenWhatsAppPreview={(act) => {
                WhatsAppService.sendActivityNotification(act, 'Nova Actividade');
                setWhatsappLogs(StorageService.getWhatsAppLogs());
                setIsWhatsAppDrawerOpen(true);
              }}
              isModalOpen={isActivityModalOpen}
              onCloseModal={() => {
                setIsActivityModalOpen(false);
                setSelectedActivityForModal(null);
              }}
              selectedActivityForModal={selectedActivityForModal}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              activities={activities}
              sectors={sectors}
              onOpenWhatsAppPreview={(act) => {
                WhatsAppService.sendActivityNotification(act, 'Nova Actividade');
                setWhatsappLogs(StorageService.getWhatsAppLogs());
                setIsWhatsAppDrawerOpen(true);
              }}
            />
          )}

          {activeTab === 'nominations' && (
            <NominationsView
              nominations={nominations}
              sectors={sectors}
              activeRole={activeRole}
              onSaveNomination={handleSaveNomination}
              isModalOpen={isNominationModalOpen}
              onCloseModal={() => setIsNominationModalOpen(false)}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeesView
              employees={employees}
              sectors={sectors}
              activeRole={activeRole}
              currentUser={currentUser}
              transferRequests={transferRequests}
              onSaveEmployee={handleSaveEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              onRequestTransfer={handleRequestTransfer}
              onApproveTransfer={handleApproveTransfer}
              onRejectTransfer={handleRejectTransfer}
              onUnauthorizedAction={handleUnauthorizedAction}
            />
          )}

          {activeTab === 'sectors' && (
            <SectorsView
              sectors={sectors}
              activeRole={activeRole}
              onSaveSector={handleSaveSector}
              onUnauthorizedAction={handleUnauthorizedAction}
            />
          )}

          {activeTab === 'inspections' && (
            <InspectionsView
              inspections={inspections}
              activities={activities}
              activeRole={activeRole}
              onSaveInspection={handleSaveInspection}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              reports={reports}
              activities={activities}
              sectors={sectors}
              activeRole={activeRole}
              onSaveReport={handleSaveReport}
            />
          )}

          {activeTab === 'notes' && (
            <NotesView
              notes={notes}
              activeRole={activeRole}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              onTogglePinNote={handleTogglePinNote}
            />
          )}

          {activeTab === 'map' && (
            <MapView
              activities={activities}
              sectors={sectors}
              onOpenWhatsAppPreview={(act) => {
                WhatsAppService.sendActivityNotification(act, 'Nova Actividade');
                setWhatsappLogs(StorageService.getWhatsAppLogs());
                setIsWhatsAppDrawerOpen(true);
              }}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              activities={activities}
              sectors={sectors}
              inspections={inspections}
            />
          )}

          {activeTab === 'whatsapp' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Painel do WhatsApp Business Platform
              </h2>
              <p className="text-xs text-slate-500">
                Módulo de controlo e envio automatizado de despatches e alertas por WhatsApp...
              </p>
              <button
                onClick={() => setIsWhatsAppDrawerOpen(true)}
                className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
              >
                Abrir Emissor do WhatsApp
              </button>
            </div>
          )}

          {activeTab === 'audit' && (
            <AuditBackupView
              auditLogs={auditLogs}
              activeRole={activeRole}
              onResetData={handleResetData}
              onRestoreBackup={handleRestoreBackup}
              onAuditLogLogged={() => setAuditLogs(StorageService.getAuditLogs())}
            />
          )}
        </main>

      </div>

      {/* Global WhatsApp Drawer */}
      <WhatsAppDrawer
        isOpen={isWhatsAppDrawerOpen}
        onClose={() => setIsWhatsAppDrawerOpen(false)}
        logs={whatsappLogs}
        sectors={sectors}
        activities={activities}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        activities={activities}
        employees={employees}
        nominations={nominations}
        notes={notes}
        sectors={sectors}
        onSelectResult={(tab) => setActiveTab(tab)}
      />

      {/* Login & Sector Selection Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        sectors={sectors}
        employees={employees}
        onLogin={handleLogin}
      />

      {/* Global Security Access Denied Modal */}
      <AccessDeniedModal
        isOpen={isAccessDeniedOpen}
        onClose={() => setIsAccessDeniedOpen(false)}
        currentUser={currentUser}
        activeRole={activeRole}
        attemptedOperation={attemptedOperation}
      />

    </div>
  );
}
