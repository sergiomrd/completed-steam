import * as CryptoJS from 'crypto-js';
import { Injectable } from '@nestjs/common';
import { environment } from '../../environments/environment';

@Injectable()
export class EncryptService {
  constructor() {}

  encrypt(value: string): string {
    if (value) {
      return CryptoJS.AES.encrypt(value, environment.ENCRYPT).toString();
    }
  }

  decrypt(textToDecrypt: string) {
    if (textToDecrypt) {
      return CryptoJS.AES.decrypt(textToDecrypt.replace(/xd/g, "+").replace(/dx/g, "/"), environment.ENCRYPT).toString(
        CryptoJS.enc.Utf8
      );
    }
  }

}
