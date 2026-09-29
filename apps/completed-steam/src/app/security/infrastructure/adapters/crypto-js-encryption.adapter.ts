import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { IEncryptionService } from '../../domain';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoJsEncryptionAdapter implements IEncryptionService {
  encrypt(value: string): string {
    if (value) {
      const encryptedValue = CryptoJS.AES.encrypt(value, environment.ENCRYPT).toString();
      return encryptedValue.replace(/\+/g, 'xd3').replace(/\//g, 'dx2');
    }
    return '';
  }

  decrypt(textToDecrypt: string): string {
    if (textToDecrypt) {
      try {
        return CryptoJS.AES.decrypt(
          textToDecrypt.replace(/xd3/g, '+').replace(/dx2/g, '/'),
          environment.ENCRYPT
        ).toString(CryptoJS.enc.Utf8);
      } catch {
        return textToDecrypt;
      }
    }
    return '';
  }
}

// Backwards-compatible alias
export const CryptoJSEncryptionAdapter = CryptoJsEncryptionAdapter;
export type CryptoJSEncryptionAdapter = CryptoJsEncryptionAdapter;
