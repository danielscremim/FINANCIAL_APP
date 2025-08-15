import winston from 'winston';

// Configuração do logger específico para o Gateway API
const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, requestId, ...meta }) => {
      return JSON.stringify({
        timestamp,
        level,
        message,
        service: 'gateway-api',
        requestId,
        ...meta
      });
    })
  ),
  defaultMeta: {
    service: 'gateway-api'
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

export interface LogContext {
  requestId?: string;
  messageId?: string;
  from?: string;
  [key: string]: any;
}

export class Logger {
  private context: LogContext = {};

  constructor(context: LogContext = {}) {
    this.context = context;
  }

  child(additionalContext: LogContext): Logger {
    return new Logger({ ...this.context, ...additionalContext });
  }

  info(message: string, meta: any = {}): void {
    winstonLogger.info(message, { ...this.context, ...meta });
  }

  error(message: string, error?: Error, meta: any = {}): void {
    winstonLogger.error(message, {
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
    winstonLogger.warn(message, { ...this.context, ...meta });
  }

  debug(message: string, meta: any = {}): void {
    winstonLogger.debug(message, { ...this.context, ...meta });
  }

  // Logs específicos do Gateway
  webhookReceived(signature: string, bodyLength: number): void {
    this.info('WhatsApp webhook received', {
      hasSignature: !!signature,
      bodyLength,
      event: 'webhook_received'
    });
  }

  signatureValidated(isValid: boolean): void {
    if (isValid) {
      this.info('Webhook signature validated successfully', {
        event: 'signature_validated'
      });
    } else {
      this.warn('Webhook signature validation failed', {
        event: 'signature_validation_failed'
      });
    }
  }

  messageForwarded(messageId: string, queueName: string): void {
    this.info('Message forwarded to queue', {
      messageId,
      queueName,
      event: 'message_forwarded'
    });
  }

  verificationChallenge(challenge: string): void {
    this.info('Verification challenge received', {
      challengeLength: challenge.length,
      event: 'verification_challenge'
    });
  }
}

export const gatewayLogger = new Logger();
