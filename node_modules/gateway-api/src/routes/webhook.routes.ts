import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';

export function createWebhookRoutes(webhookController: WebhookController): Router {
  const router = Router();

  // GET /webhook - Verificação do webhook
  router.get('/', (req, res) => webhookController.verifyWebhook(req, res));

  // POST /webhook - Receber eventos
  router.post('/', (req, res) => webhookController.receiveWebhook(req, res));

  return router;
}
