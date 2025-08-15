import { gatewayLogger } from './logger';

export interface MessagePublisher {
  connect(): Promise<void>;
  publish(queue: string, message: any): Promise<void>;
  close(): Promise<void>;
}

// Implementação mock para desenvolvimento inicial
export class MockMessagePublisher implements MessagePublisher {
  private connected = false;

  async connect(): Promise<void> {
    gatewayLogger.info('Mock publisher connecting...');
    this.connected = true;
    gatewayLogger.info('Mock publisher connected successfully');
  }

  async publish(queue: string, message: any): Promise<void> {
    if (!this.connected) {
      throw new Error('Publisher not connected');
    }

    gatewayLogger.info('Mock publisher: message published', {
      queue,
      messageId: message.id,
      messageType: message.type
    });

    // Em produção, aqui seria a publicação real no RabbitMQ
    console.log(`[MOCK] Publishing to queue ${queue}:`, JSON.stringify(message, null, 2));
  }

  async close(): Promise<void> {
    gatewayLogger.info('Mock publisher closing...');
    this.connected = false;
    gatewayLogger.info('Mock publisher closed');
  }
}
