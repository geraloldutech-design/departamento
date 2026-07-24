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
  TransferRequest
} from '../types';

export const INITIAL_SECTORS: Sector[] = [
  {
    id: 'sec-1',
    name: 'Jardinagem',
    color: '#16A34A', // Green
    department: 'Gestão Ambiental e Espaços Verdes',
    headName: 'Eng. Manuel Macamo',
    headWhatsapp: '+258843920112',
    headEmail: 'm.macamo@emrich.co.mz',
    memberCount: 14,
    status: 'Ativo',
    description: 'Manutenção de parques, margens do Rio Chiveve e arborização urbana'
  },
  {
    id: 'sec-2',
    name: 'Limpeza',
    color: '#0284C7', // Sky Blue
    department: 'Saneamento e Resíduos Sólidos',
    headName: 'Dr. João Silva',
    headWhatsapp: '+258841234567',
    headEmail: 'j.silva@emrich.co.mz',
    memberCount: 28,
    status: 'Ativo',
    description: 'Desassoreamento de canais, recolha de resíduos e limpeza da bacia'
  },
  {
    id: 'sec-3',
    name: 'Canalização',
    color: '#2563EB', // Blue
    department: 'Infraestruturas Hidráulicas',
    headName: 'Téc. Fernando Tembe',
    headWhatsapp: '+258865432109',
    headEmail: 'f.tembe@emrich.co.mz',
    memberCount: 12,
    status: 'Ativo',
    description: 'Controlo de comportas, eclusas e tubagens do canal do Chiveve'
  },
  {
    id: 'sec-4',
    name: 'Electricidade',
    color: '#EAB308', // Amber/Yellow
    department: 'Energia e Iluminação Pública',
    headName: 'Eng. Ângelo Sitoe',
    headWhatsapp: '+258879876543',
    headEmail: 'a.sitoe@emrich.co.mz',
    memberCount: 8,
    status: 'Ativo',
    description: 'Iluminação LED dos passadiços, postes decorativos e estações de bombagem'
  },
  {
    id: 'sec-5',
    name: 'Segurança',
    color: '#DC2626', // Red
    department: 'Proteção Patrimonial e Fiscalização',
    headName: 'Insp. Carlos Langa',
    headWhatsapp: '+258842211009',
    headEmail: 'c.langa@emrich.co.mz',
    memberCount: 20,
    status: 'Ativo',
    description: 'Patrulha do parque urbano, fiscalização contra descargas ilegais'
  },
  {
    id: 'sec-6',
    name: 'Carpintaria',
    color: '#D97706', // Orange/Brown
    department: 'Manutenção e Mobiliário Urbano',
    headName: 'Mestre Bernardo Nhantumbo',
    headWhatsapp: '+258843344556',
    headEmail: 'b.nhantumbo@emrich.co.mz',
    memberCount: 6,
    status: 'Ativo',
    description: 'Reparação de pontes de madeira, bancos de jardim e passadiços'
  },
  {
    id: 'sec-7',
    name: 'Construção',
    color: '#475569', // Slate
    department: 'Obras Públicas Municipais',
    headName: 'Eng. Amélia Guambe',
    headWhatsapp: '+258861122334',
    headEmail: 'a.guambe@emrich.co.mz',
    memberCount: 18,
    status: 'Ativo',
    description: 'Gaiolas de gabião, revestimento de taludes e alvenaria dos diques'
  },
  {
    id: 'sec-8',
    name: 'Serralharia',
    color: '#6B21A8', // Purple
    department: 'Oficinas e Estruturas Metálicas',
    headName: 'Mestre Tomás Cossa',
    headWhatsapp: '+258874455667',
    headEmail: 't.cossa@emrich.co.mz',
    memberCount: 5,
    status: 'Ativo',
    description: 'Grelhas de proteção das eclusas, vedações metálicas e portões'
  }
];

export const INITIAL_NOMINATIONS: Nomination[] = [
  {
    id: 'nom-1',
    sectorId: 'sec-1',
    sectorName: 'Jardinagem',
    fullName: 'Eng. Manuel Macamo',
    cargo: 'Chefe do Sector de Jardinagem',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    whatsapp: '+258843920112',
    email: 'm.macamo@emrich.co.mz',
    startDate: '2025-01-15',
    status: 'Ativa',
    notes: 'Nomeado pelo Despacho Municipal nº 04/2025 para liderar a requalificação paisagística do Parque Urbano.',
    createdAt: '2025-01-15T08:00:00Z'
  },
  {
    id: 'nom-2',
    sectorId: 'sec-2',
    sectorName: 'Limpeza',
    fullName: 'Dr. João Silva',
    cargo: 'Chefe do Sector de Limpeza',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    whatsapp: '+258841234567',
    email: 'j.silva@emrich.co.mz',
    startDate: '2024-06-01',
    status: 'Ativa',
    notes: 'Responsável operacional pela desobstrução continuada do leito do Rio Chiveve.',
    createdAt: '2024-06-01T09:00:00Z'
  },
  {
    id: 'nom-3',
    sectorId: 'sec-3',
    sectorName: 'Canalização',
    fullName: 'Téc. Fernando Tembe',
    cargo: 'Chefe do Sector de Canalização',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    whatsapp: '+258865432109',
    email: 'f.tembe@emrich.co.mz',
    startDate: '2024-09-10',
    status: 'Ativa',
    notes: 'Especialista em drenagem urbana e automação de eclusas costeiras.',
    createdAt: '2024-09-10T10:00:00Z'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'João Silva',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    biNumber: '110293847582M',
    cargo: 'Chefe do Sector de Limpeza',
    sectorId: 'sec-2',
    sectorName: 'Limpeza',
    department: 'Saneamento e Resíduos Sólidos',
    whatsapp: '+258841234567',
    email: 'j.silva@emrich.co.mz',
    status: 'Ativo',
    admissionDate: '2022-03-15'
  },
  {
    id: 'emp-2',
    name: 'Manuel Macamo',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    biNumber: '090182736451B',
    cargo: 'Chefe do Sector de Jardinagem',
    sectorId: 'sec-1',
    sectorName: 'Jardinagem',
    department: 'Gestão Ambiental e Espaços Verdes',
    whatsapp: '+258843920112',
    email: 'm.macamo@emrich.co.mz',
    status: 'Ativo',
    admissionDate: '2021-08-01'
  },
  {
    id: 'emp-3',
    name: 'Alcina Mondlane',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    biNumber: '100293841123K',
    cargo: 'Técnica de Fiscalização Ambiental',
    sectorId: 'sec-5',
    sectorName: 'Segurança',
    department: 'Proteção Patrimonial e Fiscalização',
    whatsapp: '+258849988776',
    email: 'a.mondlane@emrich.co.mz',
    status: 'Ativo',
    admissionDate: '2023-01-10'
  },
  {
    id: 'emp-4',
    name: 'Filipe Machel',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    biNumber: '120984736281P',
    cargo: 'Operador de Escavadora Flutuante',
    sectorId: 'sec-2',
    sectorName: 'Limpeza',
    department: 'Saneamento e Resíduos Sólidos',
    whatsapp: '+258861112233',
    email: 'f.machel@emrich.co.mz',
    status: 'Ativo',
    admissionDate: '2020-05-20'
  },
  {
    id: 'emp-5',
    name: 'Graça Chauque',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    biNumber: '081239487562L',
    cargo: 'Especialista Paisagista',
    sectorId: 'sec-1',
    sectorName: 'Jardinagem',
    department: 'Gestão Ambiental e Espaços Verdes',
    whatsapp: '+258872233445',
    email: 'g.chauque@emrich.co.mz',
    status: 'Ativo',
    admissionDate: '2023-11-01'
  }
];

// Coordinates centered around Beira, Chiveve River Basin
// Lat: -19.8350 to -19.8480, Lng: 34.8320 to 34.8500
export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-101',
    serviceOrderNumber: 'OS-2026-001',
    title: 'Limpeza e Desassoreamento da Bacia de Maraza',
    description: 'Remoção de resíduos plásticos, jacintos aquáticos e sedimentos no trecho norte do Rio Chiveve próximo à Bacia de Maraza.',
    sectorId: 'sec-2',
    sectorName: 'Limpeza',
    department: 'Saneamento e Resíduos Sólidos',
    responsibleName: 'João Silva',
    responsibleWhatsapp: '+258841234567',
    locationName: 'Bacia de Maraza - Canal Norte',
    latitude: -19.8290,
    longitude: 34.8420,
    date: '2026-07-24',
    time: '07:30',
    priority: 'Alta',
    status: 'Em Execução',
    teamMembers: ['Filipe Machel', 'Arnaldo Sitoe', 'Mateus Cossa', 'Carlos Chivite'],
    materialsRequired: ['Sacos reforçados de 100L', 'Luvas industriais', 'Rastelos de aço', 'Corda de tração'],
    equipmentRequired: ['Escavadora Anfíbia EMRICH-01', 'Camião Basculante 10T'],
    photos: [
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=600'
    ],
    photosBefore: [
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=600'
    ],
    photosAfter: [],
    checklist: [
      { id: 'chk-1', text: 'Ferramentas manuais e EPIs inspecionados', completed: true },
      { id: 'chk-2', text: 'Sinalização de segurança na margem instalada', completed: true },
      { id: 'chk-3', text: 'Fotografias do estado inicial registadas', completed: true },
      { id: 'chk-4', text: 'Limpeza do leito realizada em 50%', completed: true },
      { id: 'chk-5', text: 'Transporte dos resíduos para a lixeira municipal', completed: false },
      { id: 'chk-6', text: 'Fotografias finais e fecho da área', completed: false }
    ],
    progressPercent: 65,
    inspectionNotes: 'Trabalho em progresso dentro dos parâmetros ambientais exigidos.',
    createdBy: 'Eng. Mateus Nguenha (Director Operacional)',
    createdAt: '2026-07-22T08:30:00Z',
    whatsappNotified: true,
    whatsappNotifiedAt: '2026-07-22T08:31:00Z'
  },
  {
    id: 'act-102',
    serviceOrderNumber: 'OS-2026-002',
    title: 'Poda e Manutenção do Relvado no Parque Urbano Chiveve',
    description: 'Corte de relva, rega com água tratada e poda de coqueiros ao longo dos passadiços pedonais centrais.',
    sectorId: 'sec-1',
    sectorName: 'Jardinagem',
    department: 'Gestão Ambiental e Espaços Verdes',
    responsibleName: 'Manuel Macamo',
    responsibleWhatsapp: '+258843920112',
    locationName: 'Parque Urbano do Rio Chiveve - Ponta Gea',
    latitude: -19.8395,
    longitude: 34.8380,
    date: '2026-07-24',
    time: '08:00',
    priority: 'Média',
    status: 'Planeada',
    teamMembers: ['Graça Chauque', 'Lurdes Nhamussua', 'Samuel Bila'],
    materialsRequired: ['Adubo orgânico 50kg', 'Sementes de relva macia', 'Combustível para roçadoras'],
    equipmentRequired: ['Tractor cortador de relva', 'Roçadoras Stihl (4x)', 'Arneses de segurança'],
    photos: [
      'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80&w=600'
    ],
    checklist: [
      { id: 'chk-1', text: 'Ferramentas disponíveis e testadas', completed: false },
      { id: 'chk-2', text: 'EPIs completos para toda a equipa', completed: false },
      { id: 'chk-3', text: 'Delimitação da área de trabalho', completed: false },
      { id: 'chk-4', text: 'Fotografias antes do início', completed: false }
    ],
    progressPercent: 0,
    createdBy: 'Manuel Macamo',
    createdAt: '2026-07-23T09:00:00Z',
    whatsappNotified: true,
    whatsappNotifiedAt: '2026-07-23T09:01:00Z'
  },
  {
    id: 'act-103',
    serviceOrderNumber: 'OS-2026-003',
    title: 'Manutenção Preventiva das Eclusas Principais do Porto',
    description: 'Inspecção dos pistões hidráulicos, lubrificação de engrenagens e teste de fecho automatizado contra maré alta.',
    sectorId: 'sec-3',
    sectorName: 'Canalização',
    department: 'Infraestruturas Hidráulicas',
    responsibleName: 'Fernando Tembe',
    responsibleWhatsapp: '+258865432109',
    locationName: 'Eclusa Sul - Foz do Rio Chiveve',
    latitude: -19.8450,
    longitude: 34.8335,
    date: '2026-07-23',
    time: '06:00',
    priority: 'Urgente',
    status: 'Concluída',
    teamMembers: ['Fernando Tembe', 'Inácio Machava', 'Tomás Cumbe'],
    materialsRequired: ['Massa lubrificante marinha 20L', 'Anéis de vedação de borracha'],
    equipmentRequired: ['Sensor de pressão hidráulica', 'Bomba de vácuo portátil'],
    photos: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600'
    ],
    photosBefore: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600'
    ],
    photosAfter: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600'
    ],
    checklist: [
      { id: 'chk-1', text: 'Bloqueio preventivo da comporta', completed: true },
      { id: 'chk-2', text: 'Mede pressão do sistema hidráulico', completed: true },
      { id: 'chk-3', text: 'Substituição das vedações desgastadas', completed: true },
      { id: 'chk-4', text: 'Teste de abertura e fecho sob pressão de maré', completed: true }
    ],
    progressPercent: 100,
    inspectionNotes: 'Aprovado sem restrições. Vedações novas instaladas.',
    createdBy: 'Fernando Tembe',
    createdAt: '2026-07-22T14:00:00Z',
    whatsappNotified: true,
    whatsappNotifiedAt: '2026-07-22T14:02:00Z'
  },
  {
    id: 'act-104',
    serviceOrderNumber: 'OS-2026-004',
    title: 'Substituição de Lâmpadas Solar LED nos Passadiços de Chota',
    description: 'Instalação de 12 novos luminários solares de 100W e reparação do cabo de terra no sector de Chota.',
    sectorId: 'sec-4',
    sectorName: 'Electricidade',
    department: 'Energia e Iluminação Pública',
    responsibleName: 'Ângelo Sitoe',
    responsibleWhatsapp: '+258879876543',
    locationName: 'Passadiço Pedonal - Bairro de Chota',
    latitude: -19.8320,
    longitude: 34.8460,
    date: '2026-07-22',
    time: '14:00',
    priority: 'Alta',
    status: 'Suspensa',
    teamMembers: ['Ângelo Sitoe', 'Jacinto Mabote'],
    materialsRequired: ['12x Luminárias Solares 100W', 'Fita isolante 3M', 'Braçadeiras inox'],
    equipmentRequired: ['Escada telescópica de alumínio', 'Multímetro digital Fluke'],
    photos: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=600'
    ],
    checklist: [
      { id: 'chk-1', text: 'Desligamento do circuito secundário', completed: true },
      { id: 'chk-2', text: 'Remoção dos módulos avariados', completed: true },
      { id: 'chk-3', text: 'Montagem do novo suporte metálico', completed: false },
      { id: 'chk-4', text: 'Teste de acendimento noturno', completed: false }
    ],
    progressPercent: 40,
    inspectionNotes: 'Actividade suspensa aguardando entrega de braçadeiras de inox adicionais do armazém central.',
    createdBy: 'Ângelo Sitoe',
    createdAt: '2026-07-21T11:00:00Z',
    whatsappNotified: true,
    whatsappNotifiedAt: '2026-07-21T11:05:00Z'
  }
];

// -------------------------------------------------------------
// V2.0 NEW INITIAL DATASETS
// -------------------------------------------------------------

import {
  MaterialItem,
  MaterialRequisition,
  EquipmentItem,
  VehicleItem,
  Incident,
  AttendanceRecord,
  DigitalApprovalDocument
} from '../types';

export const INITIAL_MATERIALS: MaterialItem[] = [
  {
    id: 'mat-101',
    code: 'MAT-001',
    name: 'Cimento Portand 42.5N',
    category: 'Construção',
    quantity: 180,
    unit: 'sacos',
    minQuantity: 50,
    unitPriceEstimate: 650,
    warehouseLocation: 'Armazém Central EMRICH - Prateleira A1',
    sectorName: 'Construção',
    lastRestockedAt: '2026-07-15'
  },
  {
    id: 'mat-102',
    code: 'MAT-002',
    name: 'Tubo de PVC Hydros Standard 110mm',
    category: 'Canalização',
    quantity: 45,
    unit: 'metros',
    minQuantity: 60, // LOW STOCK ALERT
    unitPriceEstimate: 420,
    warehouseLocation: 'Armazém Hidráulico - Sector B',
    sectorName: 'Canalização',
    lastRestockedAt: '2026-07-10'
  },
  {
    id: 'mat-103',
    code: 'MAT-003',
    name: 'Luminária Solar LED 100W IP67',
    category: 'Elétrico',
    quantity: 14,
    unit: 'unidades',
    minQuantity: 20, // LOW STOCK ALERT
    unitPriceEstimate: 3500,
    warehouseLocation: 'Armazém de Iluminação - Módulo E',
    sectorName: 'Electricidade',
    lastRestockedAt: '2026-06-28'
  },
  {
    id: 'mat-104',
    code: 'MAT-004',
    name: 'Massa Lubrificante Marinha Shell Gadus',
    category: 'Ferramentas Consumíveis',
    quantity: 80,
    unit: 'litros',
    minQuantity: 25,
    unitPriceEstimate: 1200,
    warehouseLocation: 'Armazém Central EMRICH - Tambores H2',
    sectorName: 'Canalização',
    lastRestockedAt: '2026-07-18'
  },
  {
    id: 'mat-105',
    code: 'MAT-005',
    name: 'Sacos Reforçados de Resíduos 100L',
    category: 'Limpeza & EPIS',
    quantity: 1200,
    unit: 'unidades',
    minQuantity: 300,
    unitPriceEstimate: 25,
    warehouseLocation: 'Armazém Saneamento - Caixa 4',
    sectorName: 'Limpeza',
    lastRestockedAt: '2026-07-20'
  },
  {
    id: 'mat-106',
    code: 'MAT-006',
    name: 'Adubo Orgânico Composto FertiChiveve',
    category: 'Jardinagem',
    quantity: 350,
    unit: 'kg',
    minQuantity: 100,
    unitPriceEstimate: 180,
    warehouseLocation: 'Viveiro Municipal de Jardinagem',
    sectorName: 'Jardinagem',
    lastRestockedAt: '2026-07-12'
  }
];

export const INITIAL_MATERIAL_REQUISITIONS: MaterialRequisition[] = [
  {
    id: 'req-001',
    requisitionNumber: 'REQ-2026-015',
    activityId: 'act-101',
    activityTitle: 'Limpeza e Desassoreamento da Bacia de Maraza',
    sectorId: 'sec-2',
    sectorName: 'Limpeza',
    requestedBy: 'João Silva',
    requestedByRole: 'Chefe do Sector',
    items: [
      { materialId: 'mat-105', materialName: 'Sacos Reforçados de Resíduos 100L', quantityRequested: 200, unit: 'unidades' }
    ],
    purpose: 'Coleta e ensacamento de lixo plástico flutuante no Canal Norte do Chiveve.',
    status: 'Aprovado (Stock Entregue)',
    validatedBy: 'Dr. João Silva',
    validatedAt: '2026-07-22T09:00:00Z',
    approvedBy: 'Eng. Mateus Nguenha',
    approvedAt: '2026-07-22T10:15:00Z',
    createdAt: '2026-07-22T08:45:00Z',
    deliveryDate: '2026-07-22T11:00:00Z'
  },
  {
    id: 'req-002',
    requisitionNumber: 'REQ-2026-016',
    activityId: 'act-104',
    activityTitle: 'Substituição de Lâmpadas Solar LED nos Passadiços de Chota',
    sectorId: 'sec-4',
    sectorName: 'Electricidade',
    requestedBy: 'Ângelo Sitoe',
    requestedByRole: 'Chefe do Sector',
    items: [
      { materialId: 'mat-103', materialName: 'Luminária Solar LED 100W IP67', quantityRequested: 12, unit: 'unidades' }
    ],
    purpose: 'Reposição de pontos de iluminação vandalizados no passadiço pedonal.',
    status: 'Validado pelo Chefe',
    validatedBy: 'Eng. Ângelo Sitoe',
    validatedAt: '2026-07-23T10:00:00Z',
    createdAt: '2026-07-23T09:30:00Z'
  }
];

export const INITIAL_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'eq-101',
    code: 'EQP-001',
    name: 'Escavadora Anfíbia Flutuante Hydromac 200',
    category: 'Máquinas Pesadas',
    serialNumber: 'HYD-2022-88219-MZ',
    condition: 'Excelente',
    assignedToName: 'Filipe Machel',
    assignedToSectorName: 'Limpeza',
    checkoutDate: '2026-07-22',
    expectedReturnDate: '2026-07-30',
    nextPreventiveMaintenanceDate: '2026-08-15',
    maintenanceHistory: [
      { id: 'm-1', date: '2026-05-10', type: 'Preventiva', description: 'Troca de filtros hidráulicos e óleo do motor CAT C7', cost: 45000, performedBy: 'Oficina Central EMRICH' }
    ]
  },
  {
    id: 'eq-102',
    code: 'EQP-002',
    name: 'Roçadora Profissional Stihl FS-460',
    category: 'Ferramentas Manuais',
    serialNumber: 'STL-992381-01',
    condition: 'Bom',
    assignedToName: 'Samuel Bila',
    assignedToSectorName: 'Jardinagem',
    checkoutDate: '2026-07-23',
    expectedReturnDate: '2026-07-25',
    nextPreventiveMaintenanceDate: '2026-08-01',
    maintenanceHistory: [
      { id: 'm-2', date: '2026-06-01', type: 'Preventiva', description: 'Substituição de vela e afinação de carburador', cost: 2500, performedBy: 'Mestre Tomás Cossa' }
    ]
  },
  {
    id: 'eq-103',
    code: 'EQP-003',
    name: 'Multímetro Digital Industrial Fluke 87V',
    category: 'Medição & Topografia',
    serialNumber: 'FLK-8812739',
    condition: 'Excelente',
    assignedToName: 'Ângelo Sitoe',
    assignedToSectorName: 'Electricidade',
    nextPreventiveMaintenanceDate: '2026-11-01',
    maintenanceHistory: []
  },
  {
    id: 'eq-104',
    code: 'EQP-004',
    name: 'Bomba de Drenagem Submersível Flygt 15KW',
    category: 'Máquinas Pesadas',
    serialNumber: 'FLY-77382-X',
    condition: 'Em Manutenção',
    assignedToSectorName: 'Canalização',
    nextPreventiveMaintenanceDate: '2026-07-28',
    maintenanceHistory: [
      { id: 'm-3', date: '2026-07-20', type: 'Correctiva', description: 'Bobinagem do estator queimado por sobretensão', cost: 28000, performedBy: 'Eletromotores da Beira Lda' }
    ]
  }
];

export const INITIAL_VEHICLES: VehicleItem[] = [
  {
    id: 'veh-101',
    plateNumber: 'MMB-48-21',
    makeModel: 'Toyota Hilux 4x4 Double Cab 2.8GD-6',
    type: 'Camioneta Pick-up',
    sectorName: 'Fiscalização',
    assignedDriver: 'Insp. Carlos Langa',
    currentKm: 48250,
    fuelType: 'Diesel',
    status: 'Operacional',
    nextServiceKm: 50000,
    fuelLogs: [
      { id: 'f-1', date: '2026-07-20', liters: 65, costTotal: 6175, kmAtRefuel: 48100, driverName: 'Carlos Langa', fuelType: 'Diesel', receiptCode: 'POSTO-PETROMOC-4481' }
    ],
    maintenanceLogs: [
      { id: 'vm-1', date: '2026-04-12', type: 'Preventiva (Revisão)', description: 'Revisão dos 40.000 KM (óleos, calços de travão e alinhamento)', costTotal: 18500, workshopName: 'Toyota Moçambique Beira', kmAtService: 40120 }
    ],
    trips: [
      { id: 'vt-1', date: '2026-07-23', driverName: 'Carlos Langa', destination: 'Patrulha do Canal de Chiveve - Ponta Gea a Munhava', purpose: 'Fiscalização de descargas ilegais de efluentes', startKm: 48200, endKm: 48250, status: 'Concluída' }
    ]
  },
  {
    id: 'veh-102',
    plateNumber: 'AAG-912-MC',
    makeModel: 'Camião Basculante MAN TGM 18.250 4x2',
    type: 'Camião de Lixo',
    sectorName: 'Limpeza',
    assignedDriver: 'Filipe Machel',
    currentKm: 112400,
    fuelType: 'Diesel',
    status: 'Operacional',
    nextServiceKm: 115000,
    fuelLogs: [
      { id: 'f-2', date: '2026-07-21', liters: 140, costTotal: 13300, kmAtRefuel: 112150, driverName: 'Filipe Machel', fuelType: 'Diesel', receiptCode: 'POSTO-TOTAL-9812' }
    ],
    maintenanceLogs: [],
    trips: []
  },
  {
    id: 'veh-103',
    plateNumber: 'MMB-12-09',
    makeModel: 'Lancha de Inspecção Fluvial Yamarin 600',
    type: 'Lancha de Inspecção',
    sectorName: 'Canalização',
    assignedDriver: 'Fernando Tembe',
    currentKm: 1850, // horas de motor / milhas
    fuelType: 'Gasolina',
    status: 'Operacional',
    nextServiceKm: 2000,
    fuelLogs: [],
    maintenanceLogs: [],
    trips: []
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-101',
    incidentNumber: 'OCO-2026-001',
    title: 'Descarte Ilegal de Entulho na Margem de Munhava',
    description: 'Foi detetada descarga clandestina de restos de demolição de alvenaria na margem leste do Rio Chiveve, obstruindo o fluxo da maré.',
    category: 'Problema Ambiental / Inundação',
    locationName: 'Canal do Chiveve - Margem de Munhava',
    latitude: -19.8250,
    longitude: 34.8480,
    photos: [
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=600'
    ],
    reportedBy: 'Alcina Mondlane (Fiscalização)',
    reportedAt: '2026-07-22T11:20:00Z',
    assignedToSector: 'Limpeza',
    responsibleName: 'João Silva',
    severity: 'Alta',
    status: 'Em Resolução',
    resolutionNotes: 'Equipa de limpeza mobilizada com camião basculante para remoção do entulho.'
  },
  {
    id: 'inc-102',
    incidentNumber: 'OCO-2026-002',
    title: 'Vandalismo no Quadro elétrico do Passadiço Central',
    description: 'Abertura forçada da caixa de proteção e corte dos cabos de alimentação dos projetores LED do Parque.',
    category: 'Roubo ou Vandalismo',
    locationName: 'Parque Urbano - Passadiço da Ponte Pedonal',
    latitude: -19.8380,
    longitude: 34.8390,
    photos: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=600'
    ],
    reportedBy: 'Insp. Carlos Langa (Segurança)',
    reportedAt: '2026-07-23T06:15:00Z',
    assignedToSector: 'Electricidade',
    responsibleName: 'Ângelo Sitoe',
    severity: 'Crítica',
    status: 'Em Análise'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-001',
    employeeId: 'emp-1',
    employeeName: 'João Silva',
    sectorName: 'Limpeza',
    date: '2026-07-24',
    status: 'Presente',
    shift: 'Manhã',
    checkInTime: '06:55',
    recordedBy: 'Chefe de Sector'
  },
  {
    id: 'att-002',
    employeeId: 'emp-2',
    employeeName: 'Manuel Macamo',
    sectorName: 'Jardinagem',
    date: '2026-07-24',
    status: 'Presente',
    shift: 'Manhã',
    checkInTime: '07:10',
    recordedBy: 'Chefe de Sector'
  },
  {
    id: 'att-003',
    employeeId: 'emp-3',
    employeeName: 'Alcina Mondlane',
    sectorName: 'Segurança',
    date: '2026-07-24',
    status: 'Presente',
    shift: 'Normal',
    checkInTime: '07:30',
    recordedBy: 'Insp. Carlos Langa'
  },
  {
    id: 'att-004',
    employeeId: 'emp-4',
    employeeName: 'Filipe Machel',
    sectorName: 'Limpeza',
    date: '2026-07-24',
    status: 'Presente',
    shift: 'Manhã',
    checkInTime: '07:05',
    recordedBy: 'João Silva'
  }
];

export const INITIAL_DIGITAL_APPROVALS: DigitalApprovalDocument[] = [
  {
    id: 'app-101',
    documentType: 'Ordem de Serviço',
    referenceId: 'OS-2026-001',
    title: 'Aprovação Hierárquica: Limpeza e Desassoreamento da Bacia de Maraza',
    sectorName: 'Limpeza',
    createdByName: 'Eng. Mateus Nguenha',
    createdByRole: 'Director',
    currentLevel: 3,
    steps: [
      { level: 1, roleRequired: 'Chefe do Sector', approverName: 'João Silva', status: 'Aprovado', signedAt: '2026-07-22T08:35:00Z', signatureHash: 'SHA256-8A91F-EMRICH' },
      { level: 2, roleRequired: 'Chefe de Departamento', approverName: 'Dr. João Silva', status: 'Aprovado', signedAt: '2026-07-22T08:50:00Z', signatureHash: 'SHA256-9B22C-EMRICH' },
      { level: 3, roleRequired: 'Director', approverName: 'Eng. Mateus Nguenha', status: 'Aprovado', signedAt: '2026-07-22T09:10:00Z', signatureHash: 'SHA256-7C33D-EMRICH' }
    ],
    finalStatus: 'Aprovado Total',
    createdAt: '2026-07-22T08:30:00Z',
    updatedAt: '2026-07-22T09:10:00Z'
  },
  {
    id: 'app-102',
    documentType: 'Requisição de Materiais',
    referenceId: 'REQ-2026-016',
    title: 'Validação de Requisição: 12x Luminárias Solar LED 100W',
    sectorName: 'Electricidade',
    createdByName: 'Ângelo Sitoe',
    createdByRole: 'Chefe do Sector',
    currentLevel: 2,
    steps: [
      { level: 1, roleRequired: 'Chefe do Sector', approverName: 'Ângelo Sitoe', status: 'Aprovado', signedAt: '2026-07-23T10:00:00Z', signatureHash: 'SHA256-11A00-EMRICH' },
      { level: 2, roleRequired: 'Chefe de Departamento', approverName: 'Eng. Ângelo Sitoe', status: 'Pendente' },
      { level: 3, roleRequired: 'Administrador', status: 'Pendente' }
    ],
    finalStatus: 'Em Aprovação',
    createdAt: '2026-07-23T09:30:00Z',
    updatedAt: '2026-07-23T10:00:00Z'
  }
];


export const INITIAL_REPORTS: ActivityReport[] = [
  {
    id: 'rep-201',
    activityId: 'act-103',
    activityTitle: 'Manutenção Preventiva das Eclusas Principais do Porto',
    sectorName: 'Canalização',
    submittedBy: 'Téc. Fernando Tembe',
    submittedByRole: 'Chefe do Sector',
    startTime: '06:00',
    endTime: '11:30',
    materialsUsed: '15 Litros de Massa Marinha Shell Gadus, 4 Anéis O-Ring Nitrílicos de 8 polegadas',
    problemsEncountered: 'Leve oxidação encontrada no pistão nº 2 devido ao salitre marítimo. Foi realizada raspagem e aplicação de primário anticorrosivo.',
    progressPercent: 100,
    summaryText: 'Manutenção concluída com total sucesso. A eclusa respondeu em 42 segundos no teste de fecho rápido de emergência.',
    photos: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600'
    ],
    digitalSignature: 'Fernando Tembe - Visto Técnico #8839',
    status: 'Aprovado',
    approvedBy: 'Eng. Mateus Nguenha',
    approvedAt: '2026-07-23T14:10:00Z',
    createdAt: '2026-07-23T12:00:00Z'
  }
];

export const INITIAL_INSPECTIONS: Inspection[] = [
  {
    id: 'insp-301',
    activityId: 'act-103',
    activityTitle: 'Manutenção Preventiva das Eclusas Principais do Porto',
    sectorName: 'Canalização',
    inspectorName: 'Alcina Mondlane',
    inspectionDate: '2026-07-23',
    isExecutionConfirmed: true,
    conformities: [
      'Substituição integral dos o-rings comprovada',
      'Lubrificação homogênea nos eixos primários',
      'EPIs e protocolo de bloqueio LOTO respeitados'
    ],
    nonConformities: [],
    observations: 'A equipa cumpriu todas as especificações técnicas da diretiva municipal de proteção costeira.',
    technicalOpinion: 'PARECER TÉCNICO Nº 44/2026: O serviço executado atende aos padrões de fiabilidade exigidos. Recomenda-se próxima revisão dentro de 90 dias.',
    photos: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600'
    ],
    decision: 'Aprovado',
    createdAt: '2026-07-23T13:45:00Z'
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Acta de Reunião com a Direção do Porto da Beira',
    content: 'Acordado reforço da fiscalização conjunta na foz do Rio Chiveve para evitar a acostagem de pequenas embarcações não autorizadas junto às eclusas. A EMRICH disponibilizará 2 fiscais por turno.',
    category: 'Actas de Reunião',
    isPinned: true,
    authorName: 'Dr. João Silva',
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-07-20T10:00:00Z'
  },
  {
    id: 'note-2',
    title: 'Lembrete: Encomenda de Coletes Refletores e Luvas Termoplásticas',
    content: 'Fazer o levantamento das necessidades do sector de Limpeza e Jardinagem antes do início do período de chuvas fortes em Outubro.',
    category: 'Lembretes',
    isPinned: false,
    authorName: 'Manuel Macamo',
    createdAt: '2026-07-21T16:30:00Z',
    updatedAt: '2026-07-21T16:30:00Z'
  }
];

export const INITIAL_WHATSAPP_LOGS: WhatsAppLog[] = [
  {
    id: 'wa-1',
    recipientPhone: '+258841234567',
    recipientName: 'João Silva',
    sectorName: 'Limpeza',
    eventTrigger: 'Nova Actividade',
    messageText: `EMPRESA MUNICIPAL DO RIO CHIVEVE (EMRICH)\n\nNova Actividade Atribuída\n\nTítulo: Limpeza e Desassoreamento da Bacia de Maraza\nSector: Limpeza\nLocal: Bacia de Maraza - Canal Norte\nData: 24/07/2026 às 07:30\nPrioridade: Alta\nResponsável: João Silva\n\nAceda à aplicação EMRICH GESTOR para consultar materiais e checklists.`,
    sentAt: '2026-07-22T08:31:00Z',
    status: 'Enviado'
  },
  {
    id: 'wa-2',
    recipientPhone: '+258843920112',
    recipientName: 'Manuel Macamo',
    sectorName: 'Jardinagem',
    eventTrigger: 'Nova Actividade',
    messageText: `EMPRESA MUNICIPAL DO RIO CHIVEVE (EMRICH)\n\nNova Actividade Atribuída\n\nTítulo: Poda e Manutenção do Relvado no Parque Urbano Chiveve\nSector: Jardinagem\nLocal: Parque Urbano do Rio Chiveve - Ponta Gea\nData: 24/07/2026 às 08:00\nPrioridade: Média\nResponsável: Manuel Macamo\n\nAceda à aplicação EMRICH GESTOR para consultar detalhes.`,
    sentAt: '2026-07-23T09:01:00Z',
    status: 'Enviado'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '2026-07-22T08:30:00Z',
    userName: 'Eng. Mateus Nguenha',
    userRole: 'Director',
    action: 'Criou Actividade',
    targetModule: 'Agendamento de Actividades',
    details: 'Actividade #act-101 (Limpeza e Desassoreamento da Bacia de Maraza) criada e atribuída ao sector de Limpeza.'
  },
  {
    id: 'aud-2',
    timestamp: '2026-07-23T12:00:00Z',
    userName: 'Fernando Tembe',
    userRole: 'Chefe do Sector',
    action: 'Submeteu Relatório',
    targetModule: 'Relatórios Operacionais',
    details: 'Relatório #rep-201 submetido para a manutenção das eclusas principais do porto com percentagem de 100%.'
  },
  {
    id: 'aud-3',
    timestamp: '2026-07-23T13:45:00Z',
    userName: 'Alcina Mondlane',
    userRole: 'Fiscalização',
    action: 'Emitiu Parecer Técnico',
    targetModule: 'Fiscalização',
    details: 'Emitido Parecer Técnico Aprovado para a actividade #act-103.'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Plano Operacional Especial para o Período de Maré Alta',
    content: 'Todos os chefes de sector devem verificar o estado das eclusas, motobombas e EPIs das equipas de piquete para as próximas 48 horas devido às marés vivas previstas no canal de Moçambique.',
    authorName: 'Eng. Mateus Nguenha',
    authorRole: 'Director Geral EMRICH',
    isUrgent: true,
    createdAt: '2026-07-23T07:00:00Z'
  }
];

export const INITIAL_TRANSFER_REQUESTS: TransferRequest[] = [
  {
    id: 'tr-1',
    employeeId: 'emp-2',
    employeeName: 'Tomas Mabote',
    fromSectorId: 'sec-2',
    fromSectorName: 'Limpeza',
    toSectorId: 'sec-1',
    toSectorName: 'Jardinagem',
    requestedBy: 'Dr. João Silva',
    requestedByRole: 'Chefe de Departamento',
    reason: 'Reforço operacional da equipa de jardinagem no Parque Urbano do Chiveve durante a época de manutenção intensiva.',
    status: 'Pendente',
    createdAt: '2026-07-23T14:00:00Z'
  }
];
