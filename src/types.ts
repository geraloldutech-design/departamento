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
  whatsapp?: string;
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
  status: 'Ativa' | 'Concluída' | 'Revogada';
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
}

export type ActivityPriority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';
export type ActivityStatus = 'Pendente' | 'Em Andamento' | 'Concluída' | 'Atrasada' | 'Cancelada';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Activity {
  id: string;
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
  materialsRequired: string[];
  equipmentRequired: string[];
  photos: string[];
  checklist: ChecklistItem[];
  progressPercent: number;
  createdBy: string;
  createdAt: string;
  whatsappNotified: boolean;
  whatsappNotifiedAt?: string;
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

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  isUrgent: boolean;
  createdAt: string;
}
