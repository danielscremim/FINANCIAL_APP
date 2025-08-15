import { z } from 'zod';

// Schema para verificação do webhook (GET)
export const webhookVerificationSchema = z.object({
  'hub.mode': z.literal('subscribe'),
  'hub.verify_token': z.string(),
  'hub.challenge': z.string()
});

// Schema para evento do WhatsApp
export const whatsappWebhookSchema = z.object({
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

// Tipos derivados dos schemas
export type WebhookVerification = z.infer<typeof webhookVerificationSchema>;
export type WhatsAppWebhookEvent = z.infer<typeof whatsappWebhookSchema>;

// Tipo para evento interno
export interface InternalMessageEvent {
  id: string;
  messageId: string;
  from: string;
  text: string;
  timestamp: Date;
  source: 'whatsapp';
  metadata?: {
    phoneNumberId: string;
    displayPhoneNumber: string;
    contactName?: string;
  };
}

// Wrapper para eventos
export interface EventWrapper<T = any> {
  id: string;
  type: string;
  timestamp: Date;
  version: string;
  source: string;
  data: T;
}

export function createEventWrapper<T>(
  type: string,
  data: T,
  source: string = 'gateway-api'
): EventWrapper<T> {
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    type,
    timestamp: new Date(),
    version: '1.0.0',
    source,
    data
  };
}
