import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  port: number;
  environment: 'development' | 'production' | 'test';
  whatsapp: {
    verifyToken: string;
    appSecret: string;
    accessToken?: string;
  };
  rabbitmq: {
    url: string;
  };
  cors: {
    origin: string;
  };
  rateLimit: {
    requests: number;
    windowMs: number;
  };
}

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

function getEnvNumber(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (!value) return defaultValue;
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${name} must be a number`);
  }
  return num;
}

export const config: Config = {
  port: getEnvNumber('PORT', 3000),
  environment: (process.env.NODE_ENV as any) || 'development',
  whatsapp: {
    verifyToken: getEnvVar('WHATSAPP_VERIFY_TOKEN'),
    appSecret: getEnvVar('WHATSAPP_APP_SECRET'),
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN
  },
  rabbitmq: {
    url: getEnvVar('RABBITMQ_URL', 'amqp://financial_user:financial_pass@localhost:5672')
  },
  cors: {
    origin: getEnvVar('CORS_ORIGIN', '*')
  },
  rateLimit: {
    requests: getEnvNumber('RATE_LIMIT_REQUESTS', 100),
    windowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000) // 15 minutos
  }
};
