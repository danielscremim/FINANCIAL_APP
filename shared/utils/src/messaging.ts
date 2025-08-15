/**
 * Utilitários para mensageria com RabbitMQ
 */

// Configuração das filas
export const QUEUES = {
  WHATSAPP_MESSAGES: 'whatsapp.messages',
  MESSAGE_CLASSIFICATION: 'message.classification',
  PURCHASE_ORDERS: 'purchase.orders',
  DEAD_LETTER: 'dead.letter'
} as const;

// Configuração dos exchanges
export const EXCHANGES = {
  MAIN: 'financial.main',
  DEAD_LETTER: 'financial.dead-letter'
} as const;

// Tipos para configuração de mensageria
export interface QueueConfig {
  name: string;
  durable: boolean;
  autoDelete: boolean;
  arguments?: Record<string, any>;
}

export interface ExchangeConfig {
  name: string;
  type: 'direct' | 'topic' | 'fanout' | 'headers';
  durable: boolean;
  autoDelete: boolean;
}

export interface MessageConfig {
  queue: string;
  exchange?: string;
  routingKey?: string;
  persistent?: boolean;
  expiration?: number;
  priority?: number;
}

// Configurações padrão das filas
export const QUEUE_CONFIGS: Record<string, QueueConfig> = {
  [QUEUES.WHATSAPP_MESSAGES]: {
    name: QUEUES.WHATSAPP_MESSAGES,
    durable: true,
    autoDelete: false,
    arguments: {
      'x-dead-letter-exchange': EXCHANGES.DEAD_LETTER,
      'x-dead-letter-routing-key': QUEUES.DEAD_LETTER,
      'x-message-ttl': 24 * 60 * 60 * 1000 // 24 horas
    }
  },
  [QUEUES.MESSAGE_CLASSIFICATION]: {
    name: QUEUES.MESSAGE_CLASSIFICATION,
    durable: true,
    autoDelete: false,
    arguments: {
      'x-dead-letter-exchange': EXCHANGES.DEAD_LETTER,
      'x-dead-letter-routing-key': QUEUES.DEAD_LETTER,
      'x-message-ttl': 24 * 60 * 60 * 1000
    }
  },
  [QUEUES.PURCHASE_ORDERS]: {
    name: QUEUES.PURCHASE_ORDERS,
    durable: true,
    autoDelete: false,
    arguments: {
      'x-dead-letter-exchange': EXCHANGES.DEAD_LETTER,
      'x-dead-letter-routing-key': QUEUES.DEAD_LETTER,
      'x-message-ttl': 24 * 60 * 60 * 1000
    }
  },
  [QUEUES.DEAD_LETTER]: {
    name: QUEUES.DEAD_LETTER,
    durable: true,
    autoDelete: false
  }
};

// Configurações dos exchanges
export const EXCHANGE_CONFIGS: Record<string, ExchangeConfig> = {
  [EXCHANGES.MAIN]: {
    name: EXCHANGES.MAIN,
    type: 'direct',
    durable: true,
    autoDelete: false
  },
  [EXCHANGES.DEAD_LETTER]: {
    name: EXCHANGES.DEAD_LETTER,
    type: 'direct',
    durable: true,
    autoDelete: false
  }
};

// Wrapper para mensagens
export interface MessageWrapper<T = any> {
  id: string;
  type: string;
  timestamp: Date;
  version: string;
  source: string;
  correlationId?: string;
  replyTo?: string;
  data: T;
  metadata?: Record<string, any>;
}

/**
 * Cria um wrapper padrão para mensagens
 */
export function createMessageWrapper<T>(
  type: string,
  data: T,
  source: string,
  options: {
    id?: string;
    correlationId?: string;
    replyTo?: string;
    metadata?: Record<string, any>;
  } = {}
): MessageWrapper<T> {
  return {
    id: options.id || generateMessageId(),
    type,
    timestamp: new Date(),
    version: '1.0.0',
    source,
    correlationId: options.correlationId,
    replyTo: options.replyTo,
    data,
    metadata: options.metadata
  };
}

/**
 * Gera um ID único para mensagens
 */
function generateMessageId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `msg_${timestamp}_${random}`;
}

/**
 * Valida se uma mensagem tem o formato correto
 */
export function isValidMessage(message: any): message is MessageWrapper {
  return (
    message &&
    typeof message === 'object' &&
    typeof message.id === 'string' &&
    typeof message.type === 'string' &&
    message.timestamp instanceof Date &&
    typeof message.version === 'string' &&
    typeof message.source === 'string' &&
    message.data !== undefined
  );
}

/**
 * Configuração de retry para mensagens
 */
export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1 segundo
  maxDelay: 30000,    // 30 segundos
  backoffMultiplier: 2
};

/**
 * Calcula o delay para retry com backoff exponencial
 */
export function calculateRetryDelay(
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  const delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1);
  return Math.min(delay, config.maxDelay);
}

/**
 * Configuração de circuit breaker
 */
export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringPeriod: number;
}

export const DEFAULT_CIRCUIT_BREAKER_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,      // Número de falhas para abrir o circuito
  recoveryTimeout: 60000,   // Tempo para tentar fechar o circuito (60s)
  monitoringPeriod: 10000   // Período de monitoramento (10s)
};
