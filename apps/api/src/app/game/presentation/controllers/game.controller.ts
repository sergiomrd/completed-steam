import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import {
  GetOwnedGamesUseCase,
  SearchGamesUseCase
} from '../../application';
import { Filters } from '../../domain';

@Controller('games')
export class GameController {
  private readonly logger = new Logger(GameController.name);

  constructor(
    private readonly getOwnedGamesUseCase: GetOwnedGamesUseCase,
    private readonly searchGamesUseCase: SearchGamesUseCase
  ) {}

  @Get('owned/:id')
  async getOwnedGamesByUser(
    @Param('id') id: string,
    @Query('showAppInfo') showAppInfo?: string,
    @Query('showFreeGames') showFreeGames?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('filter') filter?: Filters | string
  ) {
    this.logger.log(`Fetching owned games for user: ${id}`);
    return this.getOwnedGamesUseCase.execute({
      encryptedSteamId: id,
      showAppInfo: showAppInfo !== 'false',
      showFreeGames: showFreeGames !== 'false',
      limit: limit ? parseInt(limit, 10) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      filter: filter || Filters.All
    });
  }

  @Get('owned/search/:id')
  async searchGame(
    @Param('id') id: string,
    @Query('showAppInfo') showAppInfo?: string,
    @Query('showFreeGames') showFreeGames?: string,
    @Query('limit') limit?: string,
    @Query('filter') filter?: Filters | string,
    @Query('search') search?: string
  ) {
    this.logger.log(`Searching games for user: ${id} query: "${search}"`);
    const games = await this.searchGamesUseCase.execute({
      encryptedSteamId: id,
      showAppInfo: showAppInfo !== 'false',
      showFreeGames: showFreeGames !== 'false',
      limit: limit ? parseInt(limit, 10) : undefined,
      filter: filter || Filters.Search,
      search: search || ''
    });

    return { games };
  }
}
