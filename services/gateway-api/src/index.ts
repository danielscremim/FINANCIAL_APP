import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { createWebhookRoutes } from './routes/webhook.routes';
import { WebhookController } from './controllers/webhook.controller';
import { gatewayLogger } from './utils/logger';

class GatewayApp {
  private app: express.Application;
  private webhookController: WebhookController;

  constructor() {
    this.app = express();
    this.webhookController = new WebhookController();
  }

  async initialize(): Promise<void> {
    await this.setupMiddlewares();
    await this.setupRoutes();
    await this.webhookController.initialize();
  }

  private async setupMiddlewares(): Promise<void> {
    // Security
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: true
    }));

    // Logging
    this.app.use(morgan('combined', {
      stream: {
        write: (message: string) => {
          gatewayLogger.info(message.trim(), { source: 'http' });
        }
      }
    }));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request ID middleware
    this.app.use((req, res, next) => {
      req.requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      res.setHeader('X-Request-ID', req.requestId);
      next();
    });
  }

  private async setupRoutes(): Promise<void> {
    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'gateway-api',
        version: '1.0.0'
      });
    });

    // Webhook routes
    this.app.use('/webhook', createWebhookRoutes(this.webhookController));

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
      });
    });

    // Error handler
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      gatewayLogger.error('Unhandled error', err, { requestId: req.requestId });
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: config.environment === 'development' ? err.message : 'Something went wrong',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    });
  }

  async start(): Promise<void> {
    try {
      await this.initialize();
      
      this.app.listen(config.port, () => {
        gatewayLogger.info(`Gateway API started successfully`, {
          port: config.port,
          environment: config.environment
        });
      });

      // Graceful shutdown
      process.on('SIGTERM', () => this.shutdown());
      process.on('SIGINT', () => this.shutdown());
    } catch (error) {
      gatewayLogger.error('Failed to start Gateway API', error as Error);
      process.exit(1);
    }
  }

  private async shutdown(): Promise<void> {
    gatewayLogger.info('Shutting down Gateway API...');
    
    try {
      await this.webhookController.shutdown();
      gatewayLogger.info('Gateway API shutdown completed');
      process.exit(0);
    } catch (error) {
      gatewayLogger.error('Error during shutdown', error as Error);
      process.exit(1);
    }
  }
}

// Extender interface do Request para incluir requestId
declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

// Iniciar aplicação
if (require.main === module) {
  const app = new GatewayApp();
  app.start().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
  });
}

export default GatewayApp;
