import { z } from 'zod';

// Schema para validação de webhook do WhatsApp
export const WhatsAppWebhookSchema = z.object({
  object: z.string(),
  entry: z.array(z.object({
    id: z.string(),
    changes: z.array(z.object({
      value: z.object({
        messaging_product: z.string(),
        metadata: z.object({
          display_phone_number: z.string(),
          phone_number_id: z.string()
        }),
        contacts: z.array(z.object({
          profile: z.object({
            name: z.string()
          }),
          wa_id: z.string()
        })).optional(),
        messages: z.array(z.object({
          from: z.string(),
          id: z.string(),
          timestamp: z.string(),
          text: z.object({
            body: z.string()
          }).optional(),
          type: z.enum(['text', 'image', 'audio', 'video', 'document'])
        })).optional(),
        statuses: z.array(z.object({
          id: z.string(),
          status: z.enum(['sent', 'delivered', 'read', 'failed']),
          timestamp: z.string(),
          recipient_id: z.string()
        })).optional()
      }),
      field: z.string()
    }))
  }))
});

// Schema para validação de mensagem interna
export const InternalMessageSchema = z.object({
  id: z.string(),
  messageId: z.string(),
  from: z.string(),
  text: z.string(),
  timestamp: z.date(),
  source: z.literal('whatsapp'),
  metadata: z.record(z.any()).optional()
});

// Schema para resultado de classificação
export const ClassificationResultSchema = z.object({
  messageId: z.string(),
  isPurchase: z.boolean(),
  category: z.enum([
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
  amount: z.number().positive().optional(),
  description: z.string().optional(),
  confidence: z.number().min(0).max(1),
  extractedData: z.object({
    merchantName: z.string().optional(),
    location: z.string().optional(),
    paymentMethod: z.string().optional()
  }).optional()
});

// Schema para ordem de compra
export const PurchaseOrderSchema = z.object({
  id: z.string(),
  messageId: z.string(),
  userId: z.string(),
  category: z.enum([
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
  amount: z.number().positive(),
  description: z.string(),
  merchantName: z.string().optional(),
  location: z.string().optional(),
  paymentMethod: z.string().optional(),
  timestamp: z.date(),
  metadata: z.record(z.any()).optional()
});

// Schema para configuração de ambiente
export const ServiceConfigSchema = z.object({
  port: z.number().int().positive(),
  environment: z.enum(['development', 'production', 'test']),
  database: z.object({
    url: z.string().url()
  }).optional(),
  rabbitmq: z.object({
    url: z.string().url(),
    queues: z.record(z.string())
  }).optional(),
  redis: z.object({
    url: z.string().url()
  }).optional(),
  whatsapp: z.object({
    verifyToken: z.string(),
    appSecret: z.string(),
    accessToken: z.string().optional()
  }).optional()
});

// Utilitários de validação
export class ValidationError extends Error {
  constructor(
    message: string,
    public issues: z.ZodIssue[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(
      'Validation failed',
      result.error.issues
    );
  }
  return result.data;
}

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodIssue[];
} {
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
export function validateCurrency(value: string): number | null {
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
export function validatePhoneNumber(phone: string): boolean {
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Verifica se tem pelo menos 10 dígitos e no máximo 15
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}
