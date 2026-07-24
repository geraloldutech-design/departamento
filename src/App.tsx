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
  User 
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

  // Sync Role change
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    StorageService.setActiveRole(role);
    if (currentUser) {
      const updatedUser = { ...currentUser, role };
      setCurrentUser(updatedUser);
      StorageService.setCurrentUser(updatedUser);
    }
    StorageService.addAuditLog('Utilizador', role, 'Alternou Perfil', 'Perfil', `Perfil do utilizador alterado para ${role}.`);
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
      'Login do Colaborador', 
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
      // Sincronização automática quando volta online
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
      // Dispatch automated WhatsApp log
      WhatsAppService.sendActivityNotification(activity, 'Nova Actividade');
    } else {
      updated = activities.map(a => a.id === activity.id ? activity : a);
      WhatsAppService.sendActivityNotification(activity, 'Alteração');
    }

    setActivities(updated);
    StorageService.saveActivities(updated);
    setWhatsappLogs(StorageService.getWhatsAppLogs());

    StorageService.addAuditLog(
      'Utilizador', 
      activeRole, 
      isNew ? 'Criou Actividade' : 'Atualizou Actividade', 
      'Actividades', 
      `Actividade "${activity.title}" (${activity.sectorName}) guardada com sucesso.`
    );
    setAuditLogs(StorageService.getAuditLogs());

    setIsActivityModalOpen(false);
    setSelectedActivityForModal(null);
  };

  const handleDeleteActivity = (id: string) => {
    const updated = activities.filter(a => a.id !== id);
    setActivities(updated);
    StorageService.saveActivities(updated);

    StorageService.addAuditLog('Utilizador', activeRole, 'Eliminou Actividade', 'Actividades', `Actividade #${id} removida do sistema.`);
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

  // Nomination Handler (Auto WhatsApp Contact Sync)
  const handleSaveNomination = (nomination: Nomination) => {
    const exists = nominations.some(n => n.id === nomination.id);
    let updatedNoms: Nomination[];
    if (exists) {
      updatedNoms = nominations.map(n => n.id === nomination.id ? nomination : n);
    } else {
      updatedNoms = [nomination, ...nominations];
    }

    setNominations(updatedNoms);
    StorageService.saveNominations(updatedNoms);

    // Auto update sector WhatsApp contact if active
    if (nomination.status === 'Ativa') {
      WhatsAppService.updateSectorHeadWhatsAppFromNomination(nomination);
      setSectors(StorageService.getSectors());
    }

    const isExoneration = nomination.status === 'Exonerado(a)' || nomination.status === 'Revogada';

    StorageService.addAuditLog(
      currentUser?.name || 'Utilizador', 
      activeRole, 
      isExoneration ? 'Efectuou Exoneração de Chefe' : 'Efectuou Nomeação de Chefe', 
      'Nomeação e Exoneração dos Chefes', 
      `${isExoneration ? 'Exonerado' : 'Nomeado'} ${nomination.fullName} como ${nomination.cargo} do sector de ${nomination.sectorName}.`
    );
    setAuditLogs(StorageService.getAuditLogs());
    setIsNominationModalOpen(false);
  };

  // Employee Handler
  const handleSaveEmployee = (emp: Employee) => {
    const exists = employees.some(e => e.id === emp.id);
    let updated: Employee[];
    if (exists) {
      updated = employees.map(e => e.id === emp.id ? emp : e);
    } else {
      updated = [emp, ...employees];
    }
    setEmployees(updated);
    StorageService.saveEmployees(updated);
  };

  const handleDeleteEmployee = (id: string) => {
    const updated = employees.filter(e => e.id !== id);
    setEmployees(updated);
    StorageService.saveEmployees(updated);
  };

  // Sector Handler
  const handleSaveSector = (sec: Sector) => {
    const updated = [sec, ...sectors];
    setSectors(updated);
    StorageService.saveSectors(updated);
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
    const title = prompt('Título do Comunicado Oficial:');
    const content = prompt('Conteúdo do Comunicado:');
    if (title && content) {
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        title,
        content,
        authorName: activeRole === 'Director' ? 'Eng. Mateus Nguenha' : 'Administração EMRICH',
        authorRole: activeRole,
        isUrgent: true,
        createdAt: new Date().toISOString()
      };
      const updated = [newAnn, ...announcements];
      setAnnouncements(updated);
      StorageService.saveAnnouncements(updated);
    }
  };

  // Reset Data Handler
  const handleResetData = () => {
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
              onSaveEmployee={handleSaveEmployee}
              onDeleteEmployee={handleDeleteEmployee}
            />
          )}

          {activeTab === 'sectors' && (
            <SectorsView
              sectors={sectors}
              activeRole={activeRole}
              onSaveSector={handleSaveSector}
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
                Abertura da gaveta lateral de despachos e simulação do WhatsApp...
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

    </div>
  );
}
