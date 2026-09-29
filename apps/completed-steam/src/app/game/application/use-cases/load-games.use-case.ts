import { Injectable, inject } from '@angular/core';
import { Game, Filters, LoadGamesRequest, LoadGamesResponse } from '../../domain';
import { GAME_API_PORT } from '../../infrastructure';
import { ENCRYPTION_PORT } from '../../../security/domain';
import { SAMPLE_GAMES, SAMPLE_GAMES_COMPLETED } from '../../../shared/models/const/sample.const';

@Injectable({
  providedIn: 'root'
})
export class LoadGamesUseCase {
  private readonly gameApi = inject(GAME_API_PORT);
  private readonly crypto = inject(ENCRYPTION_PORT);

  async execute(request: LoadGamesRequest): Promise<LoadGamesResponse> {
    const { steamId, page, filter, completedGames, limit = 50 } = request;

    if (steamId.includes('sample')) {
      return this.handleSample(page, filter, completedGames);
    }

    const encryptedId = this.crypto.encrypt(steamId);
    const response = await this.gameApi.getOwnedGames(encryptedId, {
      showAppInfo: true,
      showFreeGames: true,
      limit,
      page,
      filter
    });

    const totalGames = response.game_count ?? 0;
    const rawGames = response.games ?? [];
    const games = this.markCompletedGames(rawGames, completedGames);

    return { games, totalGames };
  }

  private handleSample(
    page: number,
    filter: Filters | string,
    completedGames: string[]
  ): LoadGamesResponse {
    let sourceGames: Game[] = [];

    switch (filter) {
      case Filters.Completed:
        sourceGames = [...SAMPLE_GAMES_COMPLETED];
        break;
      case Filters.NotCompleted:
        sourceGames = SAMPLE_GAMES.slice(50);
        break;
      case Filters.All:
      default:
        sourceGames = page === 0 ? SAMPLE_GAMES.slice(0, 50) : [...SAMPLE_GAMES];
        break;
    }

    const games = this.markCompletedGames(sourceGames, completedGames);
    return {
      games,
      totalGames: 100
    };
  }

  private markCompletedGames(games: Game[], completedGames: string[]): Game[] {
    const completedSet = new Set(completedGames);
    return games.map(game => ({
      ...game,
      completed: completedSet.has(game.appid.toString())
    }));
  }
}
