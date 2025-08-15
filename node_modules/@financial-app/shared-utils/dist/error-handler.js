"use strict";
/**
 * Sistema de tratamento de erros padronizado
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = exports.NotFoundError = exports.AuthenticationError = exports.MessagingError = exports.DatabaseError = exports.ExternalServiceError = exports.BusinessError = exports.AppValidationError = exports.AppError = exports.ErrorCode = exports.ErrorType = void 0;
exports.handleError = handleError;
exports.safeAsync = safeAsync;
exports.retryWithBackoff = retryWithBackoff;
// Tipos de erro do sistema
var ErrorType;
(function (ErrorType) {
    ErrorType["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorType["BUSINESS_ERROR"] = "BUSINESS_ERROR";
    ErrorType["EXTERNAL_SERVICE_ERROR"] = "EXTERNAL_SERVICE_ERROR";
    ErrorType["DATABASE_ERROR"] = "DATABASE_ERROR";
    ErrorType["MESSAGING_ERROR"] = "MESSAGING_ERROR";
    ErrorType["AUTHENTICATION_ERROR"] = "AUTHENTICATION_ERROR";
    ErrorType["AUTHORIZATION_ERROR"] = "AUTHORIZATION_ERROR";
    ErrorType["NOT_FOUND_ERROR"] = "NOT_FOUND_ERROR";
    ErrorType["RATE_LIMIT_ERROR"] = "RATE_LIMIT_ERROR";
    ErrorType["INTERNAL_ERROR"] = "INTERNAL_ERROR";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
// Códigos de erro específicos
var ErrorCode;
(function (ErrorCode) {
    // Validation errors (1000-1999)
    ErrorCode["INVALID_REQUEST_BODY"] = "INVALID_REQUEST_BODY";
    ErrorCode["INVALID_PHONE_NUMBER"] = "INVALID_PHONE_NUMBER";
    ErrorCode["INVALID_AMOUNT"] = "INVALID_AMOUNT";
    ErrorCode["INVALID_CATEGORY"] = "INVALID_CATEGORY";
    // Business errors (2000-2999)
    ErrorCode["MESSAGE_NOT_PURCHASE"] = "MESSAGE_NOT_PURCHASE";
    ErrorCode["DUPLICATE_MESSAGE"] = "DUPLICATE_MESSAGE";
    ErrorCode["CLASSIFICATION_FAILED"] = "CLASSIFICATION_FAILED";
    // External service errors (3000-3999)
    ErrorCode["WHATSAPP_API_ERROR"] = "WHATSAPP_API_ERROR";
    ErrorCode["WHATSAPP_SIGNATURE_INVALID"] = "WHATSAPP_SIGNATURE_INVALID";
    // Database errors (4000-4999)
    ErrorCode["DATABASE_CONNECTION_ERROR"] = "DATABASE_CONNECTION_ERROR";
    ErrorCode["PURCHASE_CREATION_FAILED"] = "PURCHASE_CREATION_FAILED";
    // Messaging errors (5000-5999)
    ErrorCode["QUEUE_CONNECTION_ERROR"] = "QUEUE_CONNECTION_ERROR";
    ErrorCode["MESSAGE_PUBLISH_FAILED"] = "MESSAGE_PUBLISH_FAILED";
    ErrorCode["MESSAGE_CONSUME_FAILED"] = "MESSAGE_CONSUME_FAILED";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
// Classe base para erros customizados
class AppError extends Error {
    constructor(message, correlationId, context) {
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
exports.AppError = AppError;
// Erro de validação
class AppValidationError extends AppError {
    constructor(code, message, correlationId, validationErrors) {
        super(message, correlationId, { validationErrors });
        this.code = code;
        this.validationErrors = validationErrors;
        this.type = ErrorType.VALIDATION_ERROR;
        this.statusCode = 400;
    }
}
exports.AppValidationError = AppValidationError;
// Erro de negócio
class BusinessError extends AppError {
    constructor(code, message, correlationId, context) {
        super(message, correlationId, context);
        this.code = code;
        this.type = ErrorType.BUSINESS_ERROR;
        this.statusCode = 422;
    }
}
exports.BusinessError = BusinessError;
// Erro de serviço externo
class ExternalServiceError extends AppError {
    constructor(code, message, correlationId, serviceName, originalError) {
        super(message, correlationId, { serviceName, originalError: originalError?.message });
        this.code = code;
        this.serviceName = serviceName;
        this.originalError = originalError;
        this.type = ErrorType.EXTERNAL_SERVICE_ERROR;
        this.statusCode = 502;
    }
}
exports.ExternalServiceError = ExternalServiceError;
// Erro de banco de dados
class DatabaseError extends AppError {
    constructor(code, message, correlationId, operation, originalError) {
        super(message, correlationId, { operation, originalError: originalError?.message });
        this.code = code;
        this.operation = operation;
        this.originalError = originalError;
        this.type = ErrorType.DATABASE_ERROR;
        this.statusCode = 503;
    }
}
exports.DatabaseError = DatabaseError;
// Erro de mensageria
class MessagingError extends AppError {
    constructor(code, message, correlationId, queue, originalError) {
        super(message, correlationId, { queue, originalError: originalError?.message });
        this.code = code;
        this.queue = queue;
        this.originalError = originalError;
        this.type = ErrorType.MESSAGING_ERROR;
        this.statusCode = 503;
    }
}
exports.MessagingError = MessagingError;
// Erro de autenticação
class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed', correlationId, context) {
        super(message, correlationId, context);
        this.type = ErrorType.AUTHENTICATION_ERROR;
        this.code = ErrorCode.WHATSAPP_SIGNATURE_INVALID;
        this.statusCode = 401;
    }
}
exports.AuthenticationError = AuthenticationError;
// Erro não encontrado
class NotFoundError extends AppError {
    constructor(code, message, correlationId, resource) {
        super(message, correlationId, { resource });
        this.code = code;
        this.resource = resource;
        this.type = ErrorType.NOT_FOUND_ERROR;
        this.statusCode = 404;
    }
}
exports.NotFoundError = NotFoundError;
// Erro interno do servidor
class InternalError extends AppError {
    constructor(code, message, correlationId, originalError) {
        super(message, correlationId, { originalError: originalError?.message });
        this.code = code;
        this.originalError = originalError;
        this.type = ErrorType.INTERNAL_ERROR;
        this.statusCode = 500;
    }
}
exports.InternalError = InternalError;
// Handler de erro padrão
function handleError(error, correlationId) {
    // Se já é um erro conhecido, retorna como está
    if (error instanceof AppError) {
        return error;
    }
    // Se é um Error padrão, converte para InternalError
    if (error instanceof Error) {
        return new InternalError(ErrorCode.DATABASE_CONNECTION_ERROR, error.message, correlationId, error);
    }
    // Se não é nem Error, cria um erro genérico
    return new InternalError(ErrorCode.DATABASE_CONNECTION_ERROR, 'Unknown error occurred', correlationId);
}
// Wrapper para async/await com tratamento de erro
async function safeAsync(fn, correlationId) {
    try {
        const result = await fn();
        return [result, null];
    }
    catch (error) {
        return [null, handleError(error, correlationId)];
    }
}
// Retry com backoff exponencial
async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000, backoffMultiplier = 2, correlationId) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
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
