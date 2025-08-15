"use strict";
/**
 * Utilitários para mensageria com RabbitMQ
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CIRCUIT_BREAKER_CONFIG = exports.DEFAULT_RETRY_CONFIG = exports.EXCHANGE_CONFIGS = exports.QUEUE_CONFIGS = exports.EXCHANGES = exports.QUEUES = void 0;
exports.createMessageWrapper = createMessageWrapper;
exports.isValidMessage = isValidMessage;
exports.calculateRetryDelay = calculateRetryDelay;
// Configuração das filas
exports.QUEUES = {
    WHATSAPP_MESSAGES: 'whatsapp.messages',
    MESSAGE_CLASSIFICATION: 'message.classification',
    PURCHASE_ORDERS: 'purchase.orders',
    DEAD_LETTER: 'dead.letter'
};
// Configuração dos exchanges
exports.EXCHANGES = {
    MAIN: 'financial.main',
    DEAD_LETTER: 'financial.dead-letter'
};
// Configurações padrão das filas
exports.QUEUE_CONFIGS = {
    [exports.QUEUES.WHATSAPP_MESSAGES]: {
        name: exports.QUEUES.WHATSAPP_MESSAGES,
        durable: true,
        autoDelete: false,
        arguments: {
            'x-dead-letter-exchange': exports.EXCHANGES.DEAD_LETTER,
            'x-dead-letter-routing-key': exports.QUEUES.DEAD_LETTER,
            'x-message-ttl': 24 * 60 * 60 * 1000 // 24 horas
        }
    },
    [exports.QUEUES.MESSAGE_CLASSIFICATION]: {
        name: exports.QUEUES.MESSAGE_CLASSIFICATION,
        durable: true,
        autoDelete: false,
        arguments: {
            'x-dead-letter-exchange': exports.EXCHANGES.DEAD_LETTER,
            'x-dead-letter-routing-key': exports.QUEUES.DEAD_LETTER,
            'x-message-ttl': 24 * 60 * 60 * 1000
        }
    },
    [exports.QUEUES.PURCHASE_ORDERS]: {
        name: exports.QUEUES.PURCHASE_ORDERS,
        durable: true,
        autoDelete: false,
        arguments: {
            'x-dead-letter-exchange': exports.EXCHANGES.DEAD_LETTER,
            'x-dead-letter-routing-key': exports.QUEUES.DEAD_LETTER,
            'x-message-ttl': 24 * 60 * 60 * 1000
        }
    },
    [exports.QUEUES.DEAD_LETTER]: {
        name: exports.QUEUES.DEAD_LETTER,
        durable: true,
        autoDelete: false
    }
};
// Configurações dos exchanges
exports.EXCHANGE_CONFIGS = {
    [exports.EXCHANGES.MAIN]: {
        name: exports.EXCHANGES.MAIN,
        type: 'direct',
        durable: true,
        autoDelete: false
    },
    [exports.EXCHANGES.DEAD_LETTER]: {
        name: exports.EXCHANGES.DEAD_LETTER,
        type: 'direct',
        durable: true,
        autoDelete: false
    }
};
/**
 * Cria um wrapper padrão para mensagens
 */
function createMessageWrapper(type, data, source, options = {}) {
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
function generateMessageId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return `msg_${timestamp}_${random}`;
}
/**
 * Valida se uma mensagem tem o formato correto
 */
function isValidMessage(message) {
    return (message &&
        typeof message === 'object' &&
        typeof message.id === 'string' &&
        typeof message.type === 'string' &&
        message.timestamp instanceof Date &&
        typeof message.version === 'string' &&
        typeof message.source === 'string' &&
        message.data !== undefined);
}
exports.DEFAULT_RETRY_CONFIG = {
    maxRetries: 3,
    initialDelay: 1000, // 1 segundo
    maxDelay: 30000, // 30 segundos
    backoffMultiplier: 2
};
/**
 * Calcula o delay para retry com backoff exponencial
 */
function calculateRetryDelay(attempt, config = exports.DEFAULT_RETRY_CONFIG) {
    const delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1);
    return Math.min(delay, config.maxDelay);
}
exports.DEFAULT_CIRCUIT_BREAKER_CONFIG = {
    failureThreshold: 5, // Número de falhas para abrir o circuito
    recoveryTimeout: 60000, // Tempo para tentar fechar o circuito (60s)
    monitoringPeriod: 10000 // Período de monitoramento (10s)
};
