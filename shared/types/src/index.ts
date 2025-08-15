// Tipos para eventos do WhatsApp
export interface WhatsAppWebhookEvent {
  object: string;
  entry: WhatsAppEntry[];
}

export interface WhatsAppEntry {
  id: string;
  changes: WhatsAppChange[];
}

export interface WhatsAppChange {
  value: WhatsAppValue;
  field: string;
}

export interface WhatsAppValue {
  messaging_product: string;
  metadata: WhatsAppMetadata;
  contacts?: WhatsAppContact[];
  messages?: WhatsAppMessage[];
  statuses?: WhatsAppStatus[];
}

export interface WhatsAppMetadata {
  display_phone_number: string;
  phone_number_id: string;
}

export interface WhatsAppContact {
  profile: {
    name: string;
  };
  wa_id: string;
}

export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: {
    body: string;
  };
  type: 'text' | 'image' | 'audio' | 'video' | 'document';
}

export interface WhatsAppStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id: string;
}

// Tipos para eventos internos do sistema
export interface InternalMessageEvent {
  id: string;
  messageId: string;
  from: string;
  text: string;
  timestamp: Date;
  source: 'whatsapp';
  metadata?: Record<string, any>;
}

export interface ClassificationResult {
  messageId: string;
  isPurchase: boolean;
  category?: PurchaseCategory;
  amount?: number;
  description?: string;
  confidence: number;
  extractedData?: {
    merchantName?: string;
    location?: string;
    paymentMethod?: string;
  };
}

export interface PurchaseOrder {
  id: string;
  messageId: string;
  userId: string;
  category: PurchaseCategory;
  amount: number;
  description: string;
  merchantName?: string;
  location?: string;
  paymentMethod?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Enums
export enum PurchaseCategory {
  MERCADO = 'mercado',
  COMBUSTIVEL = 'combustivel',
  RESTAURANTE = 'restaurante',
  FARMACIA = 'farmacia',
  TRANSPORTE = 'transporte',
  ENTRETENIMENTO = 'entretenimento',
  VESTUARIO = 'vestuario',
  SAUDE = 'saude',
  EDUCACAO = 'educacao',
  CASA = 'casa',
  OUTROS = 'outros'
}

export enum EventType {
  WHATSAPP_MESSAGE_RECEIVED = 'whatsapp.message.received',
  MESSAGE_CLASSIFIED = 'message.classified',
  PURCHASE_CREATED = 'purchase.created',
  CLASSIFICATION_FAILED = 'classification.failed'
}

// Tipos para eventos de mensageria
export interface BaseEvent {
  id: string;
  type: EventType;
  timestamp: Date;
  version: string;
  source: string;
}

export interface WhatsAppMessageReceivedEvent extends BaseEvent {
  type: EventType.WHATSAPP_MESSAGE_RECEIVED;
  data: InternalMessageEvent;
}

export interface MessageClassifiedEvent extends BaseEvent {
  type: EventType.MESSAGE_CLASSIFIED;
  data: ClassificationResult;
}

export interface PurchaseCreatedEvent extends BaseEvent {
  type: EventType.PURCHASE_CREATED;
  data: PurchaseOrder;
}

export interface ClassificationFailedEvent extends BaseEvent {
  type: EventType.CLASSIFICATION_FAILED;
  data: {
    messageId: string;
    error: string;
    originalMessage: InternalMessageEvent;
  };
}

export type DomainEvent = 
  | WhatsAppMessageReceivedEvent 
  | MessageClassifiedEvent 
  | PurchaseCreatedEvent 
  | ClassificationFailedEvent;

// Tipos para Dashboard
export interface DashboardData {
  totalExpenses: number;
  totalTransactions: number;
  expensesByCategory: CategoryExpense[];
  expensesByMonth: MonthlyExpense[];
  recentTransactions: PurchaseOrder[];
}

export interface CategoryExpense {
  category: PurchaseCategory;
  amount: number;
  count: number;
  percentage: number;
}

export interface MonthlyExpense {
  month: string;
  year: number;
  amount: number;
  count: number;
}

// Tipos para resposta de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: Date;
    requestId: string;
    version: string;
  };
}

// Tipos para configuração
export interface ServiceConfig {
  port: number;
  environment: 'development' | 'production' | 'test';
  database?: {
    url: string;
  };
  rabbitmq?: {
    url: string;
    queues: Record<string, string>;
  };
  redis?: {
    url: string;
  };
  whatsapp?: {
    verifyToken: string;
    appSecret: string;
    accessToken?: string;
  };
}
