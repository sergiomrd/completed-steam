import * as CryptoJS from 'crypto-js';
import { Injectable } from '@nestjs/common';
import { environment } from '../../environments/environment';

@Injectable()
export class EncryptService {
  constructor() {}

  encrypt(value: string): string {
    if (value) {
      const encryptedValue = CryptoJS.AES.encrypt(value, environment.ENCRYPT).toString();
      return encryptedValue.replace(/\+/g, "xd3").replace(/\//g, "dx2")
    }
  }

  decrypt(textToDecrypt: string) {
    if (textToDecrypt) {
      return CryptoJS.AES.decrypt(textToDecrypt.replace(/xd3/g, "+").replace(/dx2/g, "/"), environment.ENCRYPT).toString(
        CryptoJS.enc.Utf8
      );
    }
  }

}
