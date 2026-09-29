import { Game, SearchGamesRequest } from '../../domain';
import { ISteamService } from '../../../steam/domain';
import { IUserRepository } from '../../../user/domain';
import { IEncryptionService } from '../../../security/domain';

export class SearchGamesUseCase {
  constructor(
    private readonly steamService: ISteamService,
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: IEncryptionService
  ) {}

  async execute(request: SearchGamesRequest): Promise<Game[]> {
    const rawSteamId = this.encryptionService.decrypt(request.encryptedSteamId);
    const steamId = rawSteamId || request.encryptedSteamId;

    const ownedResult = await this.steamService.getOwnedGames(
      steamId,
      request.showAppInfo ?? true,
      request.showFreeGames ?? true
    );

    const allGames = ownedResult.games || [];

    let userCompletedAppIds: string[] = [];
    if (request.filter !== 'all') {
      const user = await this.userRepository.find(steamId);
      if (user) {
        userCompletedAppIds = user.completedGames;
      }
    }

    let games = allGames.map(game => ({
      ...game,
      completed: userCompletedAppIds.includes(game.appid.toString())
    }));

    if (request.search) {
      const term = request.search.toLowerCase().trim();
      games = games.filter(g => g.name.toLowerCase().includes(term));
    }

    if (request.limit !== undefined && request.limit > 0) {
      games = games.slice(0, Number(request.limit));
    }

    return games;
  }
}
