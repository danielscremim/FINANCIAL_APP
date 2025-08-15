import winston from 'winston';

// Configuração do logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, service, requestId, ...meta }) => {
      return JSON.stringify({
        timestamp,
        level,
        message,
        service: service || process.env.SERVICE_NAME || 'unknown',
        requestId,
        ...meta
      });
    })
  ),
  defaultMeta: {
    service: process.env.SERVICE_NAME || 'financial-app'
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Interface para contexto de log
export interface LogContext {
  requestId?: string;
  userId?: string;
  messageId?: string;
  service?: string;
  [key: string]: any;
}

// Classe wrapper para logger estruturado
export class Logger {
  private context: LogContext = {};

  constructor(context: LogContext = {}) {
    this.context = context;
  }

  // Criar novo logger com contexto adicional
  child(additionalContext: LogContext): Logger {
    return new Logger({ ...this.context, ...additionalContext });
  }

  info(message: string, meta: any = {}): void {
    logger.info(message, { ...this.context, ...meta });
  }

  error(message: string, error?: Error, meta: any = {}): void {
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

  warn(message: string, meta: any = {}): void {
    logger.warn(message, { ...this.context, ...meta });
  }

  debug(message: string, meta: any = {}): void {
    logger.debug(message, { ...this.context, ...meta });
  }

  // Logs específicos para eventos de negócio
  messageReceived(messageId: string, from: string, text: string): void {
    this.info('Message received from WhatsApp', {
      messageId,
      from,
      textLength: text.length,
      event: 'message_received'
    });
  }

  messageClassified(messageId: string, category: string, amount: number, confidence: number): void {
    this.info('Message classified successfully', {
      messageId,
      category,
      amount,
      confidence,
      event: 'message_classified'
    });
  }

  purchaseCreated(purchaseId: string, amount: number, category: string): void {
    this.info('Purchase created successfully', {
      purchaseId,
      amount,
      category,
      event: 'purchase_created'
    });
  }

  classificationFailed(messageId: string, reason: string): void {
    this.warn('Message classification failed', {
      messageId,
      reason,
      event: 'classification_failed'
    });
  }

  webhookReceived(signature: string, bodyLength: number): void {
    this.info('Webhook received from WhatsApp', {
      signaturePresent: !!signature,
      bodyLength,
      event: 'webhook_received'
    });
  }

  eventPublished(eventType: string, eventId: string, queue: string): void {
    this.info('Event published to message queue', {
      eventType,
      eventId,
      queue,
      event: 'event_published'
    });
  }

  eventConsumed(eventType: string, eventId: string, queue: string): void {
    this.info('Event consumed from message queue', {
      eventType,
      eventId,
      queue,
      event: 'event_consumed'
    });
  }
}

// Instância padrão do logger
export const defaultLogger = new Logger();
