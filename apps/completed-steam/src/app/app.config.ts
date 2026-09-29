import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from './app.routes';
import {
  GAME_API_PORT,
  HttpGameApiAdapter,
  USER_API_PORT,
  HttpUserApiAdapter,
  ENCRYPTION_PORT,
  CryptoJsEncryptionAdapter,
  STORAGE_PORT,
  LocalStorageAdapter
} from './infrastructure';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(),
    provideAnimations(),
    { provide: GAME_API_PORT, useClass: HttpGameApiAdapter },
    { provide: USER_API_PORT, useClass: HttpUserApiAdapter },
    { provide: ENCRYPTION_PORT, useClass: CryptoJsEncryptionAdapter },
    { provide: STORAGE_PORT, useClass: LocalStorageAdapter }
  ]
};

