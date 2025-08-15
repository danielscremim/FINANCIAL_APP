/**
 * Sistema de tratamento de erros padronizado
 */

// Tipos de erro do sistema
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  BUSINESS_ERROR = 'BUSINESS_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  MESSAGING_ERROR = 'MESSAGING_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

// Códigos de erro específicos
export enum ErrorCode {
  // Validation errors (1000-1999)
  INVALID_REQUEST_BODY = 'INVALID_REQUEST_BODY',
  INVALID_PHONE_NUMBER = 'INVALID_PHONE_NUMBER',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  INVALID_CATEGORY = 'INVALID_CATEGORY',
  
  // Business errors (2000-2999)
  MESSAGE_NOT_PURCHASE = 'MESSAGE_NOT_PURCHASE',
  DUPLICATE_MESSAGE = 'DUPLICATE_MESSAGE',
  CLASSIFICATION_FAILED = 'CLASSIFICATION_FAILED',
  
  // External service errors (3000-3999)
  WHATSAPP_API_ERROR = 'WHATSAPP_API_ERROR',
  WHATSAPP_SIGNATURE_INVALID = 'WHATSAPP_SIGNATURE_INVALID',
  
  // Database errors (4000-4999)
  DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
  PURCHASE_CREATION_FAILED = 'PURCHASE_CREATION_FAILED',
  
  // Messaging errors (5000-5999)
  QUEUE_CONNECTION_ERROR = 'QUEUE_CONNECTION_ERROR',
  MESSAGE_PUBLISH_FAILED = 'MESSAGE_PUBLISH_FAILED',
  MESSAGE_CONSUME_FAILED = 'MESSAGE_CONSUME_FAILED'
}

// Classe base para erros customizados
export abstract class AppError extends Error {
  abstract readonly type: ErrorType;
  abstract readonly code: ErrorCode;
  abstract readonly statusCode: number;
  
  public readonly timestamp: Date;
  public readonly correlationId?: string;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    correlationId?: string,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.correlationId = correlationId;
    this.context = context;
    
    // Manter stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      type: this.type,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      correlationId: this.correlationId,
      context: this.context
    };
  }
}

// Erro de validação
export class AppValidationError extends AppError {
  readonly type = ErrorType.VALIDATION_ERROR;
  readonly statusCode = 400;

  constructor(
    public readonly code: ErrorCode,
    message: string,
    correlationId?: string,
    public readonly validationErrors?: Array<{
      field: string;
      message: string;
      value?: any;
    }>
  ) {
    super(message, correlationId, { validationErrors });
  }
}

// Erro de negócio
export class BusinessError extends AppError {
  readonly type = ErrorType.BUSINESS_ERROR;
  readonly statusCode = 422;

  constructor(
    public readonly code: ErrorCode,
    message: string,
    correlationId?: string,
    context?: Record<string, any>
  ) {
    super(message, correlationId, context);
  }
}

// Erro de serviço externo
export class ExternalServiceError extends AppError {
  readonly type = ErrorType.EXTERNAL_SERVICE_ERROR;
  readonly statusCode = 502;

  constructor(
    public readonly code: ErrorCode,
    message: string,
    correlationId?: string,
    public readonly serviceName?: string,
    public readonly originalError?: Error
  ) {
    super(message, correlationId, { serviceName, originalError: originalError?.message });
  }
}

// Erro de banco de dados
export class DatabaseError extends AppError {
  readonly type = ErrorType.DATABASE_ERROR;
  readonly statusCode = 503;

  constructor(
    public readonly code: ErrorCode,
    message: string,
    correlationId?: string,
    public readonly operation?: string,
    public readonly originalError?: Error
  ) {
    super(message, correlationId, { operation, originalError: originalError?.message });
  }
}

// Erro de mensageria
export class MessagingError extends AppError {
  readonly type = ErrorType.MESSAGING_ERROR;
  readonly statusCode = 503;

  constructor(
    public readonly code: ErrorCode,
    message: string,
    correlationId?: string,
    public readonly queue?: string,
    public readonly originalError?: Error
  ) {
    super(message, correlationId, { queue, originalError: originalError?.message });
  }
}

// Erro de autenticação
export class AuthenticationError extends AppError {
  readonly type = ErrorType.AUTHENTICATION_ERROR;
  readonly code = ErrorCode.WHATSAPP_SIGNATURE_INVALID;
  readonly statusCode = 401;

  constructor(
    message: string = 'Authentication failed',
    correlationId?: string,
    context?: Record<string, any>
  ) {
    super(message, correlationId, context);
  }
}

// Erro não encontrado
export class NotFoundError extends AppError {
  readonly type = ErrorType.NOT_FOUND_ERROR;
  readonly statusCode = 404;

  constructor(
    public readonly code: ErrorCode,
    message: string,
    correlationId?: string,
    public readonly resource?: string
  ) {
    super(message, correlationId, { resource });
  }
}

// Erro interno do servidor
export class InternalError extends AppError {
  readonly type = ErrorType.INTERNAL_ERROR;
  readonly statusCode = 500;

  constructor(
    public readonly code: ErrorCode,
    message: string,
    correlationId?: string,
    public readonly originalError?: Error
  ) {
    super(message, correlationId, { originalError: originalError?.message });
  }
}

// Handler de erro padrão
export function handleError(error: unknown, correlationId?: string): AppError {
  // Se já é um erro conhecido, retorna como está
  if (error instanceof AppError) {
    return error;
  }

  // Se é um Error padrão, converte para InternalError
  if (error instanceof Error) {
    return new InternalError(
      ErrorCode.DATABASE_CONNECTION_ERROR,
      error.message,
      correlationId,
      error
    );
  }

  // Se não é nem Error, cria um erro genérico
  return new InternalError(
    ErrorCode.DATABASE_CONNECTION_ERROR,
    'Unknown error occurred',
    correlationId
  );
}

// Wrapper para async/await com tratamento de erro
export async function safeAsync<T>(
  fn: () => Promise<T>,
  correlationId?: string
): Promise<[T | null, AppError | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    return [null, handleError(error, correlationId)];
  }
}

// Retry com backoff exponencial
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  backoffMultiplier: number = 2,
  correlationId?: string
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      const delay = initialDelay * Math.pow(backoffMultiplier, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw handleError(lastError, correlationId);
}
