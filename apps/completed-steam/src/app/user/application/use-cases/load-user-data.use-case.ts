import { Injectable, inject } from '@angular/core';
import { User } from '../../domain';
import { USER_API_PORT } from '../../infrastructure';
import { ENCRYPTION_PORT } from '../../../security/domain';

@Injectable({
  providedIn: 'root'
})
export class LoadUserDataUseCase {
  private readonly userApi = inject(USER_API_PORT);
  private readonly crypto = inject(ENCRYPTION_PORT);

  async execute(steamId: string): Promise<User | null> {
    if (steamId.includes('sample')) {
      return {
        steamid: 'sample',
        completedGames: []
      };
    }

    const encryptedId = this.crypto.encrypt(steamId);
    return this.userApi.findUser(encryptedId);
  }
}
