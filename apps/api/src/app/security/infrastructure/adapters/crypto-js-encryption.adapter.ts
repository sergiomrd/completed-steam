import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { IEncryptionService } from '../../domain';

@Injectable()
export class CryptoJsEncryptionAdapter implements IEncryptionService {
  private readonly secretKey: string;

  constructor(secretKey?: string) {
    this.secretKey = secretKey || process.env.ENCRYPT || 'Y4AkaAlapñA.BdsaA';
  }

  encrypt(plainText: string): string {
    if (!plainText) return '';
    const encrypted = CryptoJS.AES.encrypt(plainText, this.secretKey).toString();
    return encrypted.replace(/\+/g, 'xd3').replace(/\//g, 'dx2');
  }

  decrypt(cipherText: string): string {
    if (!cipherText) return '';
    try {
      const sanitized = cipherText.replace(/xd3/g, '+').replace(/dx2/g, '/');
      const bytes = CryptoJS.AES.decrypt(sanitized, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || cipherText;
    } catch {
      return cipherText;
    }
  }
}

// Backwards-compatible alias
export const CryptoJsEncryptionService = CryptoJsEncryptionAdapter;
export type CryptoJsEncryptionService = CryptoJsEncryptionAdapter;
