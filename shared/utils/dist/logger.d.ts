export interface LogContext {
    requestId?: string;
    userId?: string;
    messageId?: string;
    service?: string;
    [key: string]: any;
}
export declare class Logger {
    private context;
    constructor(context?: LogContext);
    child(additionalContext: LogContext): Logger;
    info(message: string, meta?: any): void;
    error(message: string, error?: Error, meta?: any): void;
    warn(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
    messageReceived(messageId: string, from: string, text: string): void;
    messageClassified(messageId: string, category: string, amount: number, confidence: number): void;
    purchaseCreated(purchaseId: string, amount: number, category: string): void;
    classificationFailed(messageId: string, reason: string): void;
    webhookReceived(signature: string, bodyLength: number): void;
    eventPublished(eventType: string, eventId: string, queue: string): void;
    eventConsumed(eventType: string, eventId: string, queue: string): void;
}
export declare const defaultLogger: Logger;
