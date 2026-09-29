export interface IEncryptionService {
  encrypt(plainText: string): string;
  decrypt(cipherText: string): string;
}

export const ENCRYPTION_SERVICE_TOKEN = Symbol('IEncryptionService');
