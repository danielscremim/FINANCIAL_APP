import { createHash, createHmac, timingSafeEqual } from 'crypto';

/**
 * Valida a assinatura do webhook do WhatsApp
 */
export class WhatsAppSignatureValidator {
  constructor(private appSecret: string) {}

  /**
   * Valida se a assinatura é válida
   * @param body - Corpo da requisição como string
   * @param signature - Header x-hub-signature-256
   * @returns true se válida
   */
  validate(body: string, signature: string): boolean {
    try {
      if (!signature || !signature.startsWith('sha256=')) {
        return false;
      }

      const expectedSignature = signature.substring(7); // Remove 'sha256='
      const hmac = createHmac('sha256', this.appSecret);
      hmac.update(body);
      const calculatedSignature = hmac.digest('hex');

      // Comparação segura contra timing attacks
      return timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(calculatedSignature, 'hex')
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Gera hash para deduplicação de mensagens
   */
  generateDeduplicationHash(messageId: string, content: string): string {
    const combined = `${messageId}:${content}`;
    return createHash('sha256').update(combined).digest('hex');
  }
}
