"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLogger = exports.Logger = void 0;
const winston_1 = __importDefault(require("winston"));
// Configuração do logger
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json(), winston_1.default.format.printf(({ timestamp, level, message, service, requestId, ...meta }) => {
        return JSON.stringify({
            timestamp,
            level,
            message,
            service: service || process.env.SERVICE_NAME || 'unknown',
            requestId,
            ...meta
        });
    })),
    defaultMeta: {
        service: process.env.SERVICE_NAME || 'financial-app'
    },
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
        })
    ]
});
// Classe wrapper para logger estruturado
class Logger {
    constructor(context = {}) {
        this.context = {};
        this.context = context;
    }
    // Criar novo logger com contexto adicional
    child(additionalContext) {
        return new Logger({ ...this.context, ...additionalContext });
    }
    info(message, meta = {}) {
        logger.info(message, { ...this.context, ...meta });
    }
    error(message, error, meta = {}) {
        logger.error(message, {
            ...this.context,
            ...meta,
            error: error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
    warn(message, meta = {}) {
        logger.warn(message, { ...this.context, ...meta });
    }
    debug(message, meta = {}) {
        logger.debug(message, { ...this.context, ...meta });
    }
    // Logs específicos para eventos de negócio
    messageReceived(messageId, from, text) {
        this.info('Message received from WhatsApp', {
            messageId,
            from,
            textLength: text.length,
            event: 'message_received'
        });
    }
    messageClassified(messageId, category, amount, confidence) {
        this.info('Message classified successfully', {
            messageId,
            category,
            amount,
            confidence,
            event: 'message_classified'
        });
    }
    purchaseCreated(purchaseId, amount, category) {
        this.info('Purchase created successfully', {
            purchaseId,
            amount,
            category,
            event: 'purchase_created'
        });
    }
    classificationFailed(messageId, reason) {
        this.warn('Message classification failed', {
            messageId,
            reason,
            event: 'classification_failed'
        });
    }
    webhookReceived(signature, bodyLength) {
        this.info('Webhook received from WhatsApp', {
            signaturePresent: !!signature,
            bodyLength,
            event: 'webhook_received'
        });
    }
    eventPublished(eventType, eventId, queue) {
        this.info('Event published to message queue', {
            eventType,
            eventId,
            queue,
            event: 'event_published'
        });
    }
    eventConsumed(eventType, eventId, queue) {
        this.info('Event consumed from message queue', {
            eventType,
            eventId,
            queue,
            event: 'event_consumed'
        });
    }
}
exports.Logger = Logger;
// Instância padrão do logger
exports.defaultLogger = new Logger();
