# Sistema Financeiro - WhatsApp Integration

Sistema de microserviços para registrar compras através de mensagens do WhatsApp e gerar dashboards financeiros.

## Arquitetura

O sistema é composto por 6 microserviços:

- **gateway-api**: Recebe webhooks do WhatsApp e valida assinaturas
- **whatsapp-service**: Processa eventos do WhatsApp
- **message-orchestrator**: Orquestra o fluxo de mensagens
- **classifier-service**: Classifica e extrai dados das mensagens
- **order-service**: Persiste compras no banco de dados
- **dashboard-service**: Expõe APIs para dashboards

## Tecnologias

- Node.js + TypeScript
- Docker & Docker Compose
- PostgreSQL
- RabbitMQ
- Prisma ORM
- Clean Architecture
- SOLID Principles

## Como executar

1. Clone o repositório
2. Execute `docker-compose up -d` para subir a infraestrutura
3. Execute `npm run dev` em cada serviço

## Estrutura do Projeto

```
├── services/
│   ├── gateway-api/
│   ├── whatsapp-service/
│   ├── message-orchestrator/
│   ├── classifier-service/
│   ├── order-service/
│   └── dashboard-service/
├── shared/
│   ├── types/
│   └── utils/
├── infrastructure/
│   ├── docker-compose.yml
│   └── postgres/
└── frontend/
    └── dashboard/
```

## Desenvolvimento

### Semana 1 - Fundamentos ✅
- [x] Estrutura do monorepo
- [x] Docker Compose com PostgreSQL e RabbitMQ
- [x] Gateway API básico
- [x] Tipos compartilhados (shared/types)
- [x] Utilitários compartilhados (shared/utils)
- [x] Sistema de logs estruturados
- [x] Validação de assinaturas WhatsApp
- [x] Health checks e monitoramento básico
- [x] **TESTADO: Gateway API funcionando na porta 3000** ✅
- [x] **TESTADO: Validação de segurança funcionando** ✅
- [x] **TESTADO: Tratamento de erros 404** ✅

### Semana 2 - Integração WhatsApp
- [ ] Configuração Meta Developer
- [ ] Webhook do WhatsApp
- [ ] WhatsApp Service

### Semana 3 - Processamento
- [ ] Message Orchestrator
- [ ] Classifier Service
- [ ] Order Service com Prisma

### Semana 4 - Dashboard
- [ ] Dashboard Service
- [ ] Frontend com gráficos
- [ ] Testes e documentação
