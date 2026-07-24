export type UserRole = 
  | 'Administrador'
  | 'Director'
  | 'Chefe de Departamento'
  | 'Fiscalização'
  | 'Chefe do Sector'
  | 'Funcionário';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  sectorId?: string;
  sectorName?: string;
  whatsapp?: string;
  employeeCode?: string;
}

export type SectorName = 
  | 'Jardinagem'
  | 'Limpeza'
  | 'Canalização'
  | 'Electricidade'
  | 'Segurança'
  | 'Carpintaria'
  | 'Construção'
  | 'Serralharia'
  | string;

export interface Sector {
  id: string;
  name: SectorName;
  color: string;
  department: string;
  headName: string;
  headWhatsapp: string;
  headEmail: string;
  memberCount: number;
  status: 'Ativo' | 'Inativo';
  description?: string;
}

export interface Nomination {
  id: string;
  sectorId: string;
  sectorName: string;
  fullName: string;
  cargo: string;
  photoUrl: string;
  whatsapp: string;
  email: string;
  startDate: string;
  endDate?: string;
  status: 'Ativa' | 'Concluída' | 'Revogada' | 'Exonerado(a)';
  notes?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  photoUrl: string;
  biNumber: string;
  cargo: string;
  sectorId: string;
  sectorName: string;
  department: string;
  whatsapp: string;
  email: string;
  status: 'Ativo' | 'Férias' | 'Licença' | 'Inativo';
  admissionDate: string;
  vacationDaysLeft?: number;
  shiftScale?: 'Manhã' | 'Tarde' | 'Noite' | 'Normal' | 'Escala 24/48';
}

export type ActivityPriority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';
export type ActivityStatus = 
  | 'Planeada'
  | 'Aprovada'
  | 'Em Execução'
  | 'Suspensa'
  | 'Concluída'
  | 'Rejeitada'
  | 'Pendente' 
  | 'Em Andamento' 
  | 'Atrasada' 
  | 'Cancelada';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Activity {
  id: string;
  serviceOrderNumber: string; // E.g., "OS-2026-001"
  title: string;
  description: string;
  sectorId: string;
  sectorName: string;
  department: string;
  responsibleName: string;
  responsibleWhatsapp: string;
  locationName: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  priority: ActivityPriority;
  status: ActivityStatus;
  teamMembers?: string[]; // Equipa envolvida
  materialsRequired: string[];
  equipmentRequired: string[];
  photos: string[]; // General or original photos
  photosBefore?: string[]; // Fotografias Antes
  photosAfter?: string[]; // Fotografias Depois
  checklist: ChecklistItem[];
  progressPercent: number;
  inspectionNotes?: string; // Observações da fiscalização
  createdBy: string;
  createdAt: string;
  whatsappNotified: boolean;
  whatsappNotifiedAt?: string;
}

// -------------------------------------------------------------
// 2. MATERIAIS & ARMAZÉM / STOCK
// -------------------------------------------------------------
export interface MaterialItem {
  id: string;
  code: string; // Ex: MAT-012
  name: string;
  category: 'Construção' | 'Canalização' | 'Elétrico' | 'Limpeza & EPIS' | 'Jardinagem' | 'Ferramentas Consumíveis';
  quantity: number;
  unit: 'kg' | 'metros' | 'unidades' | 'litros' | 'sacos' | 'caixas' | 'rolos';
  minQuantity: number;
  unitPriceEstimate: number; // MZN
  warehouseLocation: string;
  sectorName?: string;
  lastRestockedAt: string;
}

export interface RequisitionItem {
  materialId: string;
  materialName: string;
  quantityRequested: number;
  unit: string;
}

export interface MaterialRequisition {
  id: string;
  requisitionNumber: string; // Ex: REQ-2026-042
  activityId?: string;
  activityTitle?: string;
  sectorId: string;
  sectorName: string;
  requestedBy: string;
  requestedByRole: UserRole;
  items: RequisitionItem[];
  purpose: string;
  status: 'Pendente (Solicitado)' | 'Validado pelo Chefe' | 'Aprovado (Stock Entregue)' | 'Rejeitado';
  validatedBy?: string;
  validatedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  deliveryDate?: string;
}

// -------------------------------------------------------------
// 3. FERRAMENTAS E EQUIPAMENTOS
// -------------------------------------------------------------
export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'Preventiva' | 'Correctiva';
  description: string;
  cost: number;
  performedBy: string;
}

export interface EquipmentItem {
  id: string;
  code: string; // Ex: FER-089
  name: string;
  category: 'Máquinas Pesadas' | 'Equipamento Elétrico' | 'Ferramentas Manuais' | 'Medição & Topografia' | 'Proteção Individual';
  serialNumber: string;
  condition: 'Excelente' | 'Bom' | 'Regular' | 'Danificado' | 'Em Manutenção';
  assignedToName?: string;
  assignedToSectorName?: string;
  checkoutDate?: string;
  expectedReturnDate?: string;
  nextPreventiveMaintenanceDate?: string;
  maintenanceHistory: MaintenanceRecord[];
}

// -------------------------------------------------------------
// 4. GESTÃO DE VIATURAS
// -------------------------------------------------------------
export interface FuelLog {
  id: string;
  date: string;
  liters: number;
  costTotal: number;
  kmAtRefuel: number;
  driverName: string;
  fuelType: 'Diesel' | 'Gasolina';
  receiptCode?: string;
}

export interface VehicleMaintenance {
  id: string;
  date: string;
  type: 'Preventiva (Revisão)' | 'Correctiva (Avaria)';
  description: string;
  costTotal: number;
  workshopName: string;
  kmAtService: number;
}

export interface VehicleTrip {
  id: string;
  date: string;
  driverName: string;
  destination: string;
  purpose: string;
  startKm: number;
  endKm: number;
  status: 'Em Viagem' | 'Concluída';
}

export interface VehicleItem {
  id: string;
  plateNumber: string; // Ex: MMB-48-21
  makeModel: string; // Ex: Toyota Hilux 4x4 Single Cab
  type: 'Camioneta Pick-up' | 'Camião de Lixo' | 'Trator & Reboque' | 'Camião Cisterna' | 'Motociclo' | 'Lancha de Inspecção';
  sectorName: string;
  assignedDriver: string;
  currentKm: number;
  fuelType: 'Diesel' | 'Gasolina';
  status: 'Operacional' | 'Em Manutenção' | 'Inactiva';
  nextServiceKm: number;
  fuelLogs: FuelLog[];
  maintenanceLogs: VehicleMaintenance[];
  trips: VehicleTrip[];
}

// -------------------------------------------------------------
// 5. GESTÃO DE OCORRÊNCIAS
// -------------------------------------------------------------
export type IncidentCategory = 
  | 'Avaria Técnica' 
  | 'Roubo ou Vandalismo' 
  | 'Danos na Infraestrutura' 
  | 'Problema Ambiental / Inundação' 
  | 'Reclamação de Cidadão / Munícipe';

export type IncidentSeverity = 'Baixa' | 'Média' | 'Alta' | 'Crítica';

export type IncidentStatus = 'Registada' | 'Em Análise' | 'Em Resolução' | 'Resolvida' | 'Arquivada';

export interface Incident {
  id: string;
  incidentNumber: string; // Ex: OCO-2026-001
  title: string;
  description: string;
  category: IncidentCategory;
  locationName: string;
  latitude: number;
  longitude: number;
  photos: string[];
  reportedBy: string;
  reportedAt: string;
  assignedToSector: string;
  responsibleName?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  resolutionNotes?: string;
  resolvedAt?: string;
}

// -------------------------------------------------------------
// 6. GESTÃO DE RECURSOS HUMANOS / PRESENÇAS
// -------------------------------------------------------------
export type AttendanceStatus = 
  | 'Presente' 
  | 'Falta Justificada' 
  | 'Falta Injustificada' 
  | 'Atraso' 
  | 'Licença Médica' 
  | 'Férias';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  sectorName: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  shift: 'Manhã' | 'Tarde' | 'Noite' | 'Normal';
  checkInTime?: string;
  notes?: string;
  recordedBy: string;
}

// -------------------------------------------------------------
// 7. COMUNICAÇÃO INSTITUCIONAL (COMUNICADOS OFICIAIS)
// -------------------------------------------------------------
export interface ReadReceipt {
  userId: string;
  userName: string;
  userRole: UserRole;
  readAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  isUrgent: boolean;
  targetSectors?: string[]; // If empty, for all
  attachments?: string[];
  createdAt: string;
  readReceipts?: ReadReceipt[];
}

// -------------------------------------------------------------
// 10. APROVAÇÃO DIGITAL E ASSINATURA ELETRÓNICA
// -------------------------------------------------------------
export interface ApprovalStep {
  level: 1 | 2 | 3;
  roleRequired: UserRole;
  approverName?: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  signedAt?: string;
  signatureHash?: string;
  comments?: string;
}

export interface DigitalApprovalDocument {
  id: string;
  documentType: 'Ordem de Serviço' | 'Requisição de Materiais' | 'Relatório Operacional' | 'Parecer de Fiscalização' | 'Transferência de Quadros';
  referenceId: string; // Ex: OS ID or Req ID
  title: string;
  sectorName: string;
  createdByName: string;
  createdByRole: UserRole;
  currentLevel: 1 | 2 | 3;
  steps: ApprovalStep[];
  digitalSignatureCanvas?: string; // base64
  finalStatus: 'Em Aprovação' | 'Aprovado Total' | 'Rejeitado';
  createdAt: string;
  updatedAt: string;
}

export interface ActivityReport {
  id: string;
  activityId: string;
  activityTitle: string;
  sectorName: string;
  submittedBy: string;
  submittedByRole: string;
  startTime: string;
  endTime: string;
  materialsUsed: string;
  problemsEncountered: string;
  progressPercent: number;
  summaryText: string;
  photos: string[];
  videos?: string[];
  documents?: string[];
  digitalSignature?: string; // base64 or signature string
  approvalDocumentId?: string;
  status: 'Pendente Aprovação' | 'Aprovado' | 'Rejeitado';
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface Inspection {
  id: string;
  activityId: string;
  activityTitle: string;
  sectorName: string;
  inspectorName: string;
  inspectionDate: string;
  isExecutionConfirmed: boolean;
  conformities: string[];
  nonConformities: string[];
  observations: string;
  technicalOpinion: string; // Parecer técnico
  photos: string[];
  decision: 'Aprovado' | 'Reprovado' | 'Aprovado com Ressalvas';
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'Notas Rápidas' | 'Ideias' | 'Lembretes' | 'Actas de Reunião' | 'Observações Operacionais';
  isPinned: boolean;
  authorName: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppLog {
  id: string;
  recipientPhone: string;
  recipientName: string;
  sectorName: string;
  eventTrigger: 'Nova Actividade' | 'Alteração' | 'Cancelamento' | 'Conclusão' | 'Novo Relatório' | 'Nova Fiscalização' | 'Aviso Urgente' | 'Reunião';
  messageText: string;
  sentAt: string;
  status: 'Enviado' | 'Entregue' | 'Falha Simulação';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetModule: string;
  details: string;
}

export interface TransferRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  fromSectorId: string;
  fromSectorName: string;
  toSectorId: string;
  toSectorName: string;
  requestedBy: string;
  requestedByRole: UserRole;
  reason: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

