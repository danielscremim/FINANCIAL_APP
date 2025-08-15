/**
 * Sistema de tratamento de erros padronizado
 */
export declare enum ErrorType {
    VALIDATION_ERROR = "VALIDATION_ERROR",
    BUSINESS_ERROR = "BUSINESS_ERROR",
    EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
    DATABASE_ERROR = "DATABASE_ERROR",
    MESSAGING_ERROR = "MESSAGING_ERROR",
    AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
    AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
    NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
    RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",
    INTERNAL_ERROR = "INTERNAL_ERROR"
}
export declare enum ErrorCode {
    INVALID_REQUEST_BODY = "INVALID_REQUEST_BODY",
    INVALID_PHONE_NUMBER = "INVALID_PHONE_NUMBER",
    INVALID_AMOUNT = "INVALID_AMOUNT",
    INVALID_CATEGORY = "INVALID_CATEGORY",
    MESSAGE_NOT_PURCHASE = "MESSAGE_NOT_PURCHASE",
    DUPLICATE_MESSAGE = "DUPLICATE_MESSAGE",
    CLASSIFICATION_FAILED = "CLASSIFICATION_FAILED",
    WHATSAPP_API_ERROR = "WHATSAPP_API_ERROR",
    WHATSAPP_SIGNATURE_INVALID = "WHATSAPP_SIGNATURE_INVALID",
    DATABASE_CONNECTION_ERROR = "DATABASE_CONNECTION_ERROR",
    PURCHASE_CREATION_FAILED = "PURCHASE_CREATION_FAILED",
    QUEUE_CONNECTION_ERROR = "QUEUE_CONNECTION_ERROR",
    MESSAGE_PUBLISH_FAILED = "MESSAGE_PUBLISH_FAILED",
    MESSAGE_CONSUME_FAILED = "MESSAGE_CONSUME_FAILED"
}
export declare abstract class AppError extends Error {
    abstract readonly type: ErrorType;
    abstract readonly code: ErrorCode;
    abstract readonly statusCode: number;
    readonly timestamp: Date;
    readonly correlationId?: string;
    readonly context?: Record<string, any>;
    constructor(message: string, correlationId?: string, context?: Record<string, any>);
    toJSON(): {
        type: ErrorType;
        code: ErrorCode;
        message: string;
        statusCode: number;
        timestamp: Date;
        correlationId: string | undefined;
        context: Record<string, any> | undefined;
    };
}
export declare class AppValidationError extends AppError {
    readonly code: ErrorCode;
    readonly validationErrors?: Array<{
        field: string;
        message: string;
        value?: any;
    }> | undefined;
    readonly type = ErrorType.VALIDATION_ERROR;
    readonly statusCode = 400;
    constructor(code: ErrorCode, message: string, correlationId?: string, validationErrors?: Array<{
        field: string;
        message: string;
        value?: any;
    }> | undefined);
}
export declare class BusinessError extends AppError {
    readonly code: ErrorCode;
    readonly type = ErrorType.BUSINESS_ERROR;
    readonly statusCode = 422;
    constructor(code: ErrorCode, message: string, correlationId?: string, context?: Record<string, any>);
}
export declare class ExternalServiceError extends AppError {
    readonly code: ErrorCode;
    readonly serviceName?: string | undefined;
    readonly originalError?: Error | undefined;
    readonly type = ErrorType.EXTERNAL_SERVICE_ERROR;
    readonly statusCode = 502;
    constructor(code: ErrorCode, message: string, correlationId?: string, serviceName?: string | undefined, originalError?: Error | undefined);
}
export declare class DatabaseError extends AppError {
    readonly code: ErrorCode;
    readonly operation?: string | undefined;
    readonly originalError?: Error | undefined;
    readonly type = ErrorType.DATABASE_ERROR;
    readonly statusCode = 503;
    constructor(code: ErrorCode, message: string, correlationId?: string, operation?: string | undefined, originalError?: Error | undefined);
}
export declare class MessagingError extends AppError {
    readonly code: ErrorCode;
    readonly queue?: string | undefined;
    readonly originalError?: Error | undefined;
    readonly type = ErrorType.MESSAGING_ERROR;
    readonly statusCode = 503;
    constructor(code: ErrorCode, message: string, correlationId?: string, queue?: string | undefined, originalError?: Error | undefined);
}
export declare class AuthenticationError extends AppError {
    readonly type = ErrorType.AUTHENTICATION_ERROR;
    readonly code = ErrorCode.WHATSAPP_SIGNATURE_INVALID;
    readonly statusCode = 401;
    constructor(message?: string, correlationId?: string, context?: Record<string, any>);
}
export declare class NotFoundError extends AppError {
    readonly code: ErrorCode;
    readonly resource?: string | undefined;
    readonly type = ErrorType.NOT_FOUND_ERROR;
    readonly statusCode = 404;
    constructor(code: ErrorCode, message: string, correlationId?: string, resource?: string | undefined);
}
export declare class InternalError extends AppError {
    readonly code: ErrorCode;
    readonly originalError?: Error | undefined;
    readonly type = ErrorType.INTERNAL_ERROR;
    readonly statusCode = 500;
    constructor(code: ErrorCode, message: string, correlationId?: string, originalError?: Error | undefined);
}
export declare function handleError(error: unknown, correlationId?: string): AppError;
export declare function safeAsync<T>(fn: () => Promise<T>, correlationId?: string): Promise<[T | null, AppError | null]>;
export declare function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries?: number, initialDelay?: number, backoffMultiplier?: number, correlationId?: string): Promise<T>;
