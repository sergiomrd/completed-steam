import { Injectable, inject } from '@angular/core';
import { SessionInfo } from '../../domain';
import { STORAGE_PORT } from '../../infrastructure';
import { ENCRYPTION_PORT } from '../../../security/domain';

@Injectable({
  providedIn: 'root'
})
export class ManageSessionUseCase {
  private readonly storage = inject(STORAGE_PORT);
  private readonly crypto = inject(ENCRYPTION_PORT);

  private readonly STORAGE_KEY = 'id';

  getSession(): SessionInfo | null {
    const rawId = this.storage.getItem(this.STORAGE_KEY);
    if (!rawId) {
      return null;
    }
    return this.parseId(rawId);
  }

  saveSession(rawId: string): SessionInfo | null {
    this.storage.setItem(this.STORAGE_KEY, rawId);
    return this.parseId(rawId);
  }

  clearSession(): void {
    this.storage.removeItem(this.STORAGE_KEY);
  }

  parseId(rawId: string): SessionInfo | null {
    if (!rawId) return null;

    if (rawId.includes('sample')) {
      return {
        rawId,
        steamId: rawId,
        isSample: true
      };
    }

    const decrypted = this.crypto.decrypt(rawId);
    if (decrypted && decrypted.length >= 17) {
      return {
        rawId,
        steamId: decrypted,
        isSample: false
      };
    }

    return null;
  }
}
