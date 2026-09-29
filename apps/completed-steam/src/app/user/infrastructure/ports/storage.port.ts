import { InjectionToken } from '@angular/core';

export interface IStoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const STORAGE_PORT = new InjectionToken<IStoragePort>('STORAGE_PORT');
