import { Injectable, computed, inject, signal } from '@angular/core';
import { PlayerSummaries } from '@completed-steam/api-interfaces';
import { User } from '../../domain';
import {
  LoadUserProfileUseCase,
  LoadUserDataUseCase,
  ManageSessionUseCase
} from '../../application';

@Injectable({
  providedIn: 'root'
})
export class UserStore {
  private readonly loadUserProfileUseCase = inject(LoadUserProfileUseCase);
  private readonly loadUserDataUseCase = inject(LoadUserDataUseCase);
  private readonly sessionUseCase = inject(ManageSessionUseCase);

  // State Signals
  readonly steamId = signal<string>('');
  readonly rawId = signal<string>('');
  readonly profile = signal<PlayerSummaries | null>(null);
  readonly user = signal<User | null>(null);
  readonly loading = signal<boolean>(false);
  readonly initialized = signal<boolean>(false);

  // Computed Signals
  readonly isAuthenticated = computed(() => !!this.steamId());
  readonly isSample = computed(() => this.steamId().includes('sample'));
  readonly playerName = computed(() => this.profile()?.personaname || '');
  readonly avatarUrl = computed(() => this.profile()?.avatarfull || '');
  readonly profileUrl = computed(() => this.profile()?.profileurl || '');

  initSession(paramId?: string): { steamId: string; rawId: string } | null {
    let session = paramId ? this.sessionUseCase.saveSession(paramId) : this.sessionUseCase.getSession();
    if (!session && paramId) {
      session = this.sessionUseCase.parseId(paramId);
    }

    if (session) {
      this.rawId.set(session.rawId);
      this.steamId.set(session.steamId);
      this.initialized.set(true);
      return { steamId: session.steamId, rawId: session.rawId };
    }

    return null;
  }

  async loadProfile(): Promise<void> {
    const id = this.steamId();
    if (!id) return;

    this.loading.set(true);
    try {
      const summary = await this.loadUserProfileUseCase.execute(id);
      this.profile.set(summary);
    } finally {
      this.loading.set(false);
    }
  }

  async loadUser(): Promise<void> {
    const id = this.steamId();
    if (!id) return;

    this.loading.set(true);
    try {
      const userData = await this.loadUserDataUseCase.execute(id);
      this.user.set(userData);
    } finally {
      this.loading.set(false);
    }
  }

  logout(): void {
    this.sessionUseCase.clearSession();
    this.steamId.set('');
    this.rawId.set('');
    this.profile.set(null);
    this.user.set(null);
    this.initialized.set(false);
  }
}
