# Gateway API

Microserviço responsável por receber webhooks do WhatsApp e publicar eventos na fila de mensagens.

## Funcionalidades

- ✅ Verificação de webhook do WhatsApp
- ✅ Validação de assinatura de requisições
- ✅ Processamento de mensagens recebidas
- ✅ Publicação de eventos no RabbitMQ
- ✅ Logs estruturados
- ✅ Health check
- ✅ Tratamento de erros

## Configuração

### Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

### WhatsApp Cloud API

1. Acesse o [Meta for Developers](https://developers.facebook.com/)
2. Crie uma aplicação e configure o WhatsApp Cloud API
3. Configure o webhook URL: `https://your-domain.com/webhook`
4. Configure o verify token no arquivo `.env`

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t gateway-api .
docker run -p 3000:3000 --env-file .env gateway-api
```

## Endpoints

### GET /webhook
Verificação do webhook pelo WhatsApp.

**Query Parameters:**
- `hub.mode`: "subscribe"
- `hub.verify_token`: Token configurado
- `hub.challenge`: Challenge do WhatsApp

### POST /webhook
Recebe eventos do WhatsApp.

**Headers:**
- `x-hub-signature-256`: Assinatura HMAC SHA256

### GET /health
Health check do serviço.

## Eventos Publicados

### whatsapp.message.received

Publicado na fila `whatsapp.messages` quando uma nova mensagem é recebida.

```json
{
  "id": "evt_123",
  "type": "whatsapp.message.received",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "source": "gateway-api",
  "data": {
    "id": "int_456",
    "messageId": "wamid.123",
    "from": "5511999999999",
    "text": "Mercado Carrefour R$ 150,00",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "source": "whatsapp",
    "metadata": {
      "phoneNumberId": "123456789",
      "displayPhoneNumber": "5511999999999"
    }
  }
}
```

## Logs

O serviço gera logs estruturados em JSON com os seguintes campos:

- `timestamp`: Data/hora do evento
- `level`: Nível do log (info, warn, error, debug)
- `message`: Mensagem do log
- `service`: "gateway-api"
- `requestId`: ID único da requisição
- `event`: Tipo do evento (webhook_received, signature_validated, etc.)

## Monitoramento

### Health Check

```bash
curl http://localhost:3000/health
```

### Métricas

- Total de webhooks recebidos
- Total de mensagens processadas
- Falhas de validação de assinatura
- Erros de publicação na fila
