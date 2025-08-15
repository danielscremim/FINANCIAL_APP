import { Request, Response } from 'express';
import { gatewayLogger } from '../utils/logger';
import { WhatsAppSignatureValidator } from '../utils/signature-validator';
import { MockMessagePublisher } from '../utils/mock-publisher';
import { 
  webhookVerificationSchema, 
  whatsappWebhookSchema,
  createEventWrapper,
  InternalMessageEvent,
  WhatsAppWebhookEvent
} from '../types/webhook';
import { config } from '../config';

export class WebhookController {
  private signatureValidator: WhatsAppSignatureValidator;
  private messagePublisher: MockMessagePublisher;

  constructor() {
    this.signatureValidator = new WhatsAppSignatureValidator(config.whatsapp.appSecret);
    this.messagePublisher = new MockMessagePublisher();
  }

  async initialize(): Promise<void> {
    await this.messagePublisher.connect();
  }

  /**
   * Verificação do webhook (GET) - chamado pelo WhatsApp para verificar o endpoint
   */
  async verifyWebhook(req: Request, res: Response): Promise<void> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const logger = gatewayLogger.child({ requestId });

    try {
      logger.info('Webhook verification requested');

      // Validar parâmetros de query
      const result = webhookVerificationSchema.safeParse(req.query);
      
      if (!result.success) {
        logger.warn('Invalid verification parameters', { errors: result.error.issues });
        res.status(400).json({ error: 'Invalid verification parameters' });
        return;
      }

      const { 'hub.verify_token': verifyToken, 'hub.challenge': challenge } = result.data;

      // Verificar token
      if (verifyToken !== config.whatsapp.verifyToken) {
        logger.warn('Invalid verify token');
        res.status(403).json({ error: 'Invalid verify token' });
        return;
      }

      logger.verificationChallenge(challenge);
      res.status(200).send(challenge);
    } catch (error) {
      logger.error('Error in webhook verification', error as Error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Recebe eventos do webhook (POST) - chamado pelo WhatsApp quando há novas mensagens
   */
  async receiveWebhook(req: Request, res: Response): Promise<void> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const logger = gatewayLogger.child({ requestId });

    try {
      const signature = req.headers['x-hub-signature-256'] as string;
      const body = JSON.stringify(req.body);

      logger.webhookReceived(signature, body.length);

      // Validar assinatura
      const isValidSignature = this.signatureValidator.validate(body, signature);
      logger.signatureValidated(isValidSignature);

      if (!isValidSignature) {
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }

      // Validar estrutura do webhook
      const webhookResult = whatsappWebhookSchema.safeParse(req.body);
      
      if (!webhookResult.success) {
        logger.warn('Invalid webhook structure', { errors: webhookResult.error.issues });
        res.status(400).json({ error: 'Invalid webhook structure' });
        return;
      }

      const webhookEvent = webhookResult.data;

      // Processar cada entrada
      for (const entry of webhookEvent.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages' && change.value.messages) {
            await this.processMessages(change.value.messages, change.value.metadata, logger);
          }
        }
      }

      res.status(200).json({ status: 'success' });
    } catch (error) {
      logger.error('Error processing webhook', error as Error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Processa mensagens recebidas
   */
  private async processMessages(
    messages: WhatsAppWebhookEvent['entry'][0]['changes'][0]['value']['messages'],
    metadata: WhatsAppWebhookEvent['entry'][0]['changes'][0]['value']['metadata'],
    logger: any
  ): Promise<void> {
    if (!messages) return;

    for (const message of messages) {
      // Só processar mensagens de texto por enquanto
      if (message.type !== 'text' || !message.text) {
        logger.info('Skipping non-text message', { messageId: message.id, type: message.type });
        continue;
      }

      try {
        // Criar evento interno
        const internalEvent: InternalMessageEvent = {
          id: `int_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          messageId: message.id,
          from: message.from,
          text: message.text.body,
          timestamp: new Date(parseInt(message.timestamp) * 1000),
          source: 'whatsapp',
          metadata: {
            phoneNumberId: metadata.phone_number_id,
            displayPhoneNumber: metadata.display_phone_number
          }
        };

        // Criar wrapper do evento
        const eventWrapper = createEventWrapper('whatsapp.message.received', internalEvent);

        // Publicar na fila
        await this.messagePublisher.publish('whatsapp.messages', eventWrapper);

        logger.info('Message processed successfully', { 
          messageId: message.id,
          from: message.from,
          textLength: message.text.body.length
        });
      } catch (error) {
        logger.error('Failed to process message', error as Error, { messageId: message.id });
      }
    }
  }

  async shutdown(): Promise<void> {
    await this.messagePublisher.close();
  }
}
