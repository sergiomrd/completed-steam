import { Injectable, inject } from '@angular/core';
import { PlayerSummaries } from '@completed-steam/api-interfaces';
import { USER_API_PORT } from '../../infrastructure';
import { ENCRYPTION_PORT } from '../../../security/domain';
import { USER_SAMPLE } from '../../../shared/models/const/sample.const';

@Injectable({
  providedIn: 'root'
})
export class LoadUserProfileUseCase {
  private readonly userApi = inject(USER_API_PORT);
  private readonly crypto = inject(ENCRYPTION_PORT);

  async execute(steamId: string): Promise<PlayerSummaries | null> {
    if (steamId.includes('sample')) {
      return USER_SAMPLE;
    }

    const encryptedId = this.crypto.encrypt(steamId);
    return this.userApi.getPlayerSummary(encryptedId);
  }
}
