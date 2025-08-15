/**
 * Utilitários para mensageria com RabbitMQ
 */
export declare const QUEUES: {
    readonly WHATSAPP_MESSAGES: "whatsapp.messages";
    readonly MESSAGE_CLASSIFICATION: "message.classification";
    readonly PURCHASE_ORDERS: "purchase.orders";
    readonly DEAD_LETTER: "dead.letter";
};
export declare const EXCHANGES: {
    readonly MAIN: "financial.main";
    readonly DEAD_LETTER: "financial.dead-letter";
};
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
export declare const QUEUE_CONFIGS: Record<string, QueueConfig>;
export declare const EXCHANGE_CONFIGS: Record<string, ExchangeConfig>;
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
export declare function createMessageWrapper<T>(type: string, data: T, source: string, options?: {
    id?: string;
    correlationId?: string;
    replyTo?: string;
    metadata?: Record<string, any>;
}): MessageWrapper<T>;
/**
 * Valida se uma mensagem tem o formato correto
 */
export declare function isValidMessage(message: any): message is MessageWrapper;
/**
 * Configuração de retry para mensagens
 */
export interface RetryConfig {
    maxRetries: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
}
export declare const DEFAULT_RETRY_CONFIG: RetryConfig;
/**
 * Calcula o delay para retry com backoff exponencial
 */
export declare function calculateRetryDelay(attempt: number, config?: RetryConfig): number;
/**
 * Configuração de circuit breaker
 */
export interface CircuitBreakerConfig {
    failureThreshold: number;
    recoveryTimeout: number;
    monitoringPeriod: number;
}
export declare const DEFAULT_CIRCUIT_BREAKER_CONFIG: CircuitBreakerConfig;
