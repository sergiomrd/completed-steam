import { Injectable, inject } from '@angular/core';
import { Filters, SearchGamesRequest, SearchGamesResponse } from '../../domain';
import { GAME_API_PORT } from '../../infrastructure';
import { ENCRYPTION_PORT } from '../../../security/domain';
import { SAMPLE_GAMES } from '../../../shared/models/const/sample.const';

@Injectable({
  providedIn: 'root'
})
export class SearchGamesUseCase {
  private readonly gameApi = inject(GAME_API_PORT);
  private readonly crypto = inject(ENCRYPTION_PORT);

  async execute(request: SearchGamesRequest): Promise<SearchGamesResponse> {
    const { steamId, query, completedGames, filter = Filters.Search, limit = 50 } = request;

    if (steamId.includes('sample')) {
      const normalizedQuery = query.toLowerCase().trim();
      const filtered = SAMPLE_GAMES.filter(game =>
        game.name.toLowerCase().trim().includes(normalizedQuery)
      );
      return {
        games: this.markCompletedGames(filtered, completedGames)
      };
    }

    const encryptedId = this.crypto.encrypt(steamId);
    const response = await this.gameApi.searchGames(encryptedId, {
      showAppInfo: true,
      showFreeGames: true,
      limit,
      filter,
      search: query
    });

    const rawGames = response.games ?? [];
    return {
      games: this.markCompletedGames(rawGames, completedGames)
    };
  }

  private markCompletedGames(games: any[], completedGames: string[]) {
    const completedSet = new Set(completedGames);
    return games.map(game => ({
      ...game,
      completed: completedSet.has(game.appid.toString())
    }));
  }
}
