import {
  Filters,
  GetOwnedGamesRequest,
  GetOwnedGamesResponse
} from '../../domain';
import { ISteamService } from '../../../steam/domain';
import { IUserRepository } from '../../../user/domain';
import { IEncryptionService } from '../../../security/domain';

export class GetOwnedGamesUseCase {
  constructor(
    private readonly steamService: ISteamService,
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: IEncryptionService
  ) {}

  async execute(request: GetOwnedGamesRequest): Promise<GetOwnedGamesResponse> {
    const rawSteamId = this.encryptionService.decrypt(request.encryptedSteamId);
    const steamId = rawSteamId || request.encryptedSteamId;

    const ownedResult = await this.steamService.getOwnedGames(
      steamId,
      request.showAppInfo ?? true,
      request.showFreeGames ?? true
    );

    const allGames = ownedResult.games || [];
    const totalCount = ownedResult.game_count || allGames.length;

    let userCompletedAppIds: string[] = [];
    if (request.filter !== Filters.All) {
      const user = await this.userRepository.find(steamId);
      if (user) {
        userCompletedAppIds = user.completedGames;
      }
    }

    // Filter games
    let filteredGames = allGames;
    if (request.filter === Filters.Completed) {
      filteredGames = allGames.filter(g =>
        userCompletedAppIds.includes(g.appid.toString())
      );
    } else if (request.filter === Filters.NotCompleted) {
      filteredGames = allGames.filter(
        g => !userCompletedAppIds.includes(g.appid.toString())
      );
    }

    // Mark completed status
    filteredGames = filteredGames.map(game => ({
      ...game,
      completed: userCompletedAppIds.includes(game.appid.toString())
    }));

    // Pagination
    let paginatedGames = filteredGames;
    if (request.limit !== undefined && request.page !== undefined) {
      const page = Number(request.page);
      const limit = Number(request.limit);
      paginatedGames = filteredGames.slice(page * limit, (page + 1) * limit);
    }

    return {
      games: paginatedGames,
      game_count: totalCount
    };
  }
}
