import * as crypto from 'crypto';

/**
 * Valida a assinatura do webhook do WhatsApp
 * @param payload - Corpo da requisição como string
 * @param signature - Assinatura vinda no header x-hub-signature-256
 * @param secret - Secret configurado no WhatsApp
 * @returns true se a assinatura for válida
 */
export function validateWhatsAppSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Remove o prefixo "sha256=" da assinatura
    const expectedSignature = signature.replace('sha256=', '');
    
    // Calcula o HMAC SHA256 do payload usando o secret
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const calculatedSignature = hmac.digest('hex');
    
    // Compara as assinaturas de forma segura
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(calculatedSignature, 'hex')
    );
  } catch (error) {
    return false;
  }
}

/**
 * Gera um ID único para eventos e mensagens
 * @returns UUID v4
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Gera um hash MD5 de uma string
 * @param input - String para gerar hash
 * @returns Hash MD5 em hexadecimal
 */
export function generateMD5Hash(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}

/**
 * Gera um hash SHA256 de uma string
 * @param input - String para gerar hash
 * @returns Hash SHA256 em hexadecimal
 */
export function generateSHA256Hash(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Gera um token aleatório para verificação
 * @param length - Tamanho do token em bytes (padrão: 32)
 * @returns Token em hexadecimal
 */
export function generateRandomToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Criptografa dados sensíveis usando AES-256-GCM
 * @param data - Dados para criptografar
 * @param key - Chave de criptografia (32 bytes)
 * @returns Objeto com dados criptografados
 */
export function encrypt(data: string, key: string): {
  encrypted: string;
  iv: string;
  tag: string;
} {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher('aes-256-gcm', key);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  };
}

/**
 * Descriptografa dados usando AES-256-GCM
 * @param encryptedData - Dados criptografados
 * @param key - Chave de descriptografia
 * @returns Dados descriptografados
 */
export function decrypt(encryptedData: {
  encrypted: string;
  iv: string;
  tag: string;
}, key: string): string {
  const decipher = crypto.createDecipher('aes-256-gcm', key);
  decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Cria um hash determinístico para deduplicação
 * Usado para evitar processar a mesma mensagem múltiplas vezes
 * @param messageId - ID da mensagem
 * @param content - Conteúdo da mensagem
 * @returns Hash para deduplicação
 */
export function createDeduplicationHash(messageId: string, content: string): string {
  const combined = `${messageId}:${content}`;
  return generateSHA256Hash(combined);
}
