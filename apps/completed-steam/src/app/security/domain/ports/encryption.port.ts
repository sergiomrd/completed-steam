import { InjectionToken } from '@angular/core';

export interface IEncryptionService {
  encrypt(text: string): string;
  decrypt(text: string): string;
}

export const ENCRYPTION_PORT = new InjectionToken<IEncryptionService>('ENCRYPTION_PORT');
