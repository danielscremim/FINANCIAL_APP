"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWhatsAppSignature = validateWhatsAppSignature;
exports.generateId = generateId;
exports.generateMD5Hash = generateMD5Hash;
exports.generateSHA256Hash = generateSHA256Hash;
exports.generateRandomToken = generateRandomToken;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.createDeduplicationHash = createDeduplicationHash;
const crypto = __importStar(require("crypto"));
/**
 * Valida a assinatura do webhook do WhatsApp
 * @param payload - Corpo da requisição como string
 * @param signature - Assinatura vinda no header x-hub-signature-256
 * @param secret - Secret configurado no WhatsApp
 * @returns true se a assinatura for válida
 */
function validateWhatsAppSignature(payload, signature, secret) {
    try {
        // Remove o prefixo "sha256=" da assinatura
        const expectedSignature = signature.replace('sha256=', '');
        // Calcula o HMAC SHA256 do payload usando o secret
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(payload);
        const calculatedSignature = hmac.digest('hex');
        // Compara as assinaturas de forma segura
        return crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(calculatedSignature, 'hex'));
    }
    catch (error) {
        return false;
    }
}
/**
 * Gera um ID único para eventos e mensagens
 * @returns UUID v4
 */
function generateId() {
    return crypto.randomUUID();
}
/**
 * Gera um hash MD5 de uma string
 * @param input - String para gerar hash
 * @returns Hash MD5 em hexadecimal
 */
function generateMD5Hash(input) {
    return crypto.createHash('md5').update(input).digest('hex');
}
/**
 * Gera um hash SHA256 de uma string
 * @param input - String para gerar hash
 * @returns Hash SHA256 em hexadecimal
 */
function generateSHA256Hash(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}
/**
 * Gera um token aleatório para verificação
 * @param length - Tamanho do token em bytes (padrão: 32)
 * @returns Token em hexadecimal
 */
function generateRandomToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}
/**
 * Criptografa dados sensíveis usando AES-256-GCM
 * @param data - Dados para criptografar
 * @param key - Chave de criptografia (32 bytes)
 * @returns Objeto com dados criptografados
 */
function encrypt(data, key) {
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
function decrypt(encryptedData, key) {
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
function createDeduplicationHash(messageId, content) {
    const combined = `${messageId}:${content}`;
    return generateSHA256Hash(combined);
}
