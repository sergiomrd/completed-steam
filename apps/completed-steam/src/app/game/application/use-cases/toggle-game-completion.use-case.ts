import { Injectable, inject } from '@angular/core';
import { ToggleGameCompletionRequest, ToggleGameCompletionResponse } from '../../domain';
import { USER_API_PORT } from '../../../user/infrastructure';
import { ENCRYPTION_PORT } from '../../../security/domain';

@Injectable({
  providedIn: 'root'
})
export class ToggleGameCompletionUseCase {
  private readonly userApi = inject(USER_API_PORT);
  private readonly crypto = inject(ENCRYPTION_PORT);

  async execute(request: ToggleGameCompletionRequest): Promise<ToggleGameCompletionResponse> {
    const { steamId, appid, completed, currentCompleted } = request;
    const completedSet = new Set(currentCompleted);

    if (completed) {
      completedSet.add(appid);
    } else {
      completedSet.delete(appid);
    }

    const updatedCompletedGames = Array.from(completedSet);

    if (!steamId.includes('sample')) {
      const encryptedId = this.crypto.encrypt(steamId);
      await this.userApi.updateUser({
        steamid: encryptedId,
        completedGames: updatedCompletedGames
      });
    }

    return { completedGames: updatedCompletedGames };
  }
}
