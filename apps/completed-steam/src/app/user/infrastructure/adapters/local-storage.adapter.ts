import { Injectable } from '@angular/core';
import type { IStoragePort } from '../ports/storage.port';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageAdapter implements IStoragePort {
  getItem(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  }

  setItem(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  }

  removeItem(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  }
}
