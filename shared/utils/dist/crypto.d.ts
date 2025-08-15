/**
 * Valida a assinatura do webhook do WhatsApp
 * @param payload - Corpo da requisição como string
 * @param signature - Assinatura vinda no header x-hub-signature-256
 * @param secret - Secret configurado no WhatsApp
 * @returns true se a assinatura for válida
 */
export declare function validateWhatsAppSignature(payload: string, signature: string, secret: string): boolean;
/**
 * Gera um ID único para eventos e mensagens
 * @returns UUID v4
 */
export declare function generateId(): string;
/**
 * Gera um hash MD5 de uma string
 * @param input - String para gerar hash
 * @returns Hash MD5 em hexadecimal
 */
export declare function generateMD5Hash(input: string): string;
/**
 * Gera um hash SHA256 de uma string
 * @param input - String para gerar hash
 * @returns Hash SHA256 em hexadecimal
 */
export declare function generateSHA256Hash(input: string): string;
/**
 * Gera um token aleatório para verificação
 * @param length - Tamanho do token em bytes (padrão: 32)
 * @returns Token em hexadecimal
 */
export declare function generateRandomToken(length?: number): string;
/**
 * Criptografa dados sensíveis usando AES-256-GCM
 * @param data - Dados para criptografar
 * @param key - Chave de criptografia (32 bytes)
 * @returns Objeto com dados criptografados
 */
export declare function encrypt(data: string, key: string): {
    encrypted: string;
    iv: string;
    tag: string;
};
/**
 * Descriptografa dados usando AES-256-GCM
 * @param encryptedData - Dados criptografados
 * @param key - Chave de descriptografia
 * @returns Dados descriptografados
 */
export declare function decrypt(encryptedData: {
    encrypted: string;
    iv: string;
    tag: string;
}, key: string): string;
/**
 * Cria um hash determinístico para deduplicação
 * Usado para evitar processar a mesma mensagem múltiplas vezes
 * @param messageId - ID da mensagem
 * @param content - Conteúdo da mensagem
 * @returns Hash para deduplicação
 */
export declare function createDeduplicationHash(messageId: string, content: string): string;
