# 🌐 Tutorial: Expor Aplicação Local para Meta WhatsApp

## 📋 **Situação Atual:**
- Sua aplicação está rodando em `http://localhost:3000`
- Meta precisa acessar seu webhook via internet
- Precisamos criar um tunnel público

## 🚀 **Opções para Expor sua Aplicação:**

### **Opção 1: Localtunnel (Mais Simples)**
```bash
# Instalar
npm install -g localtunnel

# Expor aplicação
lt --port 3000
```

### **Opção 2: ngrok (Mais Robusto)**
1. Baixe em: https://ngrok.com/download
2. Execute: `ngrok http 3000`

### **Opção 3: Para Teste Rápido - Usar Webhook Test**
Use um serviço como webhook.site para capturar as requisições primeiro.

## 🔧 **Vamos tentar Localtunnel:**

Execute estes comandos no seu terminal:

```bash
# Instalar localtunnel globalmente
npm install -g localtunnel

# Expor sua aplicação na porta 3000
lt --port 3000
```

Isso vai gerar uma URL como: `https://xyz123.loca.lt`

## 📝 **Configuração no Meta:**

Quando tiver a URL pública, configure no Meta:

**Webhook URL:** `https://sua-url-publica.loca.lt/webhook`
**Verify Token:** `meu_token_verificacao_whatsapp_123`

## 🔍 **Próximos Passos:**

1. Execute o localtunnel
2. Copie a URL gerada
3. Configure no Meta Dashboard
4. Teste o webhook

**Quer que eu ajude com alguma dessas opções?**
