// Middleware adicional de segurança para webhooks
import { Request, Response, NextFunction } from 'express';

// IPs oficiais do Meta/WhatsApp (exemplo)
const WHATSAPP_IPS = [
  '31.13.64.0/18',
  '31.13.24.0/21',
  '66.220.144.0/20',
  '69.63.176.0/20',
  '69.171.224.0/19',
  '74.119.76.0/22',
  '103.4.96.0/22',
  '129.134.0.0/17',
  '157.240.0.0/17',
  '173.252.64.0/18',
  '179.60.192.0/22',
  '185.60.216.0/22',
  '204.15.20.0/22'
];

export function validateWhatsAppIP(req: Request, res: Response, next: NextFunction) {
  // Em desenvolvimento, pular validação de IP
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Verificar se IP está na whitelist do WhatsApp
  // Implementação completa requer biblioteca de CIDR
  
  next();
}

// Middleware para logging de tentativas suspeitas
export function logSuspiciousActivity(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers['user-agent'];
  const referer = req.headers.referer;
  
  // Log para análise
  console.log({
    ip: req.ip,
    userAgent,
    referer,
    url: req.url,
    method: req.method,
    timestamp: new Date()
  });
  
  next();
}
