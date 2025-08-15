import { connect, Connection, Channel } from 'amqplib';
import { gatewayLogger } from './logger';

export interface MessagePublisher {
  connect(): Promise<void>;
  publish(queue: string, message: any): Promise<void>;
  close(): Promise<void>;
}

export class RabbitMQPublisher implements MessagePublisher {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  constructor(private rabbitmqUrl: string) {}

  async connect(): Promise<void> {
    try {
      gatewayLogger.info('Connecting to RabbitMQ', { url: this.rabbitmqUrl });
      
      this.connection = await connect(this.rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      // Configurar filas
      await this.setupQueues();

      gatewayLogger.info('Connected to RabbitMQ successfully');
    } catch (error) {
      gatewayLogger.error('Failed to connect to RabbitMQ', error as Error);
      throw error;
    }
  }

  private async setupQueues(): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    // Criar exchange principal
    await this.channel.assertExchange('financial.main', 'direct', { durable: true });
    
    // Criar exchange de dead letter
    await this.channel.assertExchange('financial.dead-letter', 'direct', { durable: true });

    // Fila para mensagens do WhatsApp
    await this.channel.assertQueue('whatsapp.messages', {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'financial.dead-letter',
        'x-dead-letter-routing-key': 'dead.letter',
        'x-message-ttl': 24 * 60 * 60 * 1000 // 24 horas
      }
    });

    // Fila de dead letter
    await this.channel.assertQueue('dead.letter', { durable: true });

    // Bind filas aos exchanges
    await this.channel.bindQueue('whatsapp.messages', 'financial.main', 'whatsapp.messages');
    await this.channel.bindQueue('dead.letter', 'financial.dead-letter', 'dead.letter');

    gatewayLogger.info('RabbitMQ queues configured successfully');
  }

  async publish(queue: string, message: any): Promise<void> {
    if (!this.channel) {
      throw new Error('Publisher not connected');
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      
      const published = this.channel.publish(
        'financial.main',
        queue,
        messageBuffer,
        {
          persistent: true,
          timestamp: Date.now(),
          messageId: message.id || `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`
        }
      );

      if (!published) {
        throw new Error('Failed to publish message to queue');
      }

      gatewayLogger.messageForwarded(message.id, queue);
    } catch (error) {
      gatewayLogger.error('Failed to publish message', error as Error, { queue, messageId: message.id });
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
      gatewayLogger.info('RabbitMQ connection closed');
    } catch (error) {
      gatewayLogger.error('Error closing RabbitMQ connection', error as Error);
    }
  }
}
