"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.ServiceConfigSchema = exports.PurchaseOrderSchema = exports.ClassificationResultSchema = exports.InternalMessageSchema = exports.WhatsAppWebhookSchema = void 0;
exports.validateOrThrow = validateOrThrow;
exports.validate = validate;
exports.validateCurrency = validateCurrency;
exports.validatePhoneNumber = validatePhoneNumber;
const zod_1 = require("zod");
// Schema para validação de webhook do WhatsApp
exports.WhatsAppWebhookSchema = zod_1.z.object({
    object: zod_1.z.string(),
    entry: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        changes: zod_1.z.array(zod_1.z.object({
            value: zod_1.z.object({
                messaging_product: zod_1.z.string(),
                metadata: zod_1.z.object({
                    display_phone_number: zod_1.z.string(),
                    phone_number_id: zod_1.z.string()
                }),
                contacts: zod_1.z.array(zod_1.z.object({
                    profile: zod_1.z.object({
                        name: zod_1.z.string()
                    }),
                    wa_id: zod_1.z.string()
                })).optional(),
                messages: zod_1.z.array(zod_1.z.object({
                    from: zod_1.z.string(),
                    id: zod_1.z.string(),
                    timestamp: zod_1.z.string(),
                    text: zod_1.z.object({
                        body: zod_1.z.string()
                    }).optional(),
                    type: zod_1.z.enum(['text', 'image', 'audio', 'video', 'document'])
                })).optional(),
                statuses: zod_1.z.array(zod_1.z.object({
                    id: zod_1.z.string(),
                    status: zod_1.z.enum(['sent', 'delivered', 'read', 'failed']),
                    timestamp: zod_1.z.string(),
                    recipient_id: zod_1.z.string()
                })).optional()
            }),
            field: zod_1.z.string()
        }))
    }))
});
// Schema para validação de mensagem interna
exports.InternalMessageSchema = zod_1.z.object({
    id: zod_1.z.string(),
    messageId: zod_1.z.string(),
    from: zod_1.z.string(),
    text: zod_1.z.string(),
    timestamp: zod_1.z.date(),
    source: zod_1.z.literal('whatsapp'),
    metadata: zod_1.z.record(zod_1.z.any()).optional()
});
// Schema para resultado de classificação
exports.ClassificationResultSchema = zod_1.z.object({
    messageId: zod_1.z.string(),
    isPurchase: zod_1.z.boolean(),
    category: zod_1.z.enum([
        'mercado',
        'combustivel',
        'restaurante',
        'farmacia',
        'transporte',
        'entretenimento',
        'vestuario',
        'saude',
        'educacao',
        'casa',
        'outros'
    ]).optional(),
    amount: zod_1.z.number().positive().optional(),
    description: zod_1.z.string().optional(),
    confidence: zod_1.z.number().min(0).max(1),
    extractedData: zod_1.z.object({
        merchantName: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        paymentMethod: zod_1.z.string().optional()
    }).optional()
});
// Schema para ordem de compra
exports.PurchaseOrderSchema = zod_1.z.object({
    id: zod_1.z.string(),
    messageId: zod_1.z.string(),
    userId: zod_1.z.string(),
    category: zod_1.z.enum([
        'mercado',
        'combustivel',
        'restaurante',
        'farmacia',
        'transporte',
        'entretenimento',
        'vestuario',
        'saude',
        'educacao',
        'casa',
        'outros'
    ]),
    amount: zod_1.z.number().positive(),
    description: zod_1.z.string(),
    merchantName: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    paymentMethod: zod_1.z.string().optional(),
    timestamp: zod_1.z.date(),
    metadata: zod_1.z.record(zod_1.z.any()).optional()
});
// Schema para configuração de ambiente
exports.ServiceConfigSchema = zod_1.z.object({
    port: zod_1.z.number().int().positive(),
    environment: zod_1.z.enum(['development', 'production', 'test']),
    database: zod_1.z.object({
        url: zod_1.z.string().url()
    }).optional(),
    rabbitmq: zod_1.z.object({
        url: zod_1.z.string().url(),
        queues: zod_1.z.record(zod_1.z.string())
    }).optional(),
    redis: zod_1.z.object({
        url: zod_1.z.string().url()
    }).optional(),
    whatsapp: zod_1.z.object({
        verifyToken: zod_1.z.string(),
        appSecret: zod_1.z.string(),
        accessToken: zod_1.z.string().optional()
    }).optional()
});
// Utilitários de validação
class ValidationError extends Error {
    constructor(message, issues) {
        super(message);
        this.issues = issues;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
function validateOrThrow(schema, data) {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new ValidationError('Validation failed', result.error.issues);
    }
    return result.data;
}
function validate(schema, data) {
    const result = schema.safeParse(data);
    if (result.success) {
        return {
            success: true,
            data: result.data
        };
    }
    return {
        success: false,
        errors: result.error.issues
    };
}
// Validação específica para valores monetários
function validateCurrency(value) {
    // Remove espaços e caracteres não numéricos exceto vírgula e ponto
    const cleaned = value.replace(/[^\d,.]/g, '');
    // Converte vírgula para ponto (padrão brasileiro)
    const normalized = cleaned.replace(',', '.');
    const number = parseFloat(normalized);
    if (isNaN(number) || number <= 0) {
        return null;
    }
    // Arredonda para 2 casas decimais
    return Math.round(number * 100) / 100;
}
// Validação de telefone (WhatsApp)
function validatePhoneNumber(phone) {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    // Verifica se tem pelo menos 10 dígitos e no máximo 15
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}
