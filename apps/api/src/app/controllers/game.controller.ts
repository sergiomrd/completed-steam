import { UserService } from './../services/user.service';
import { Filters } from './../models/filters.interface';
import { GameService } from './../services/game.service';
import {
  Controller,
  Get,
  Param,
  Query,
  HttpService,
  Logger
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Game, GameBackground } from '../models/game.interface';
import { DatabaseService } from '../services/database.service';

@Controller('games')
export class GameController {
  imageTypes: string[];
  games: Game[];
  private readonly logger = new Logger(GameController.name);
  constructor(
    private readonly gameService: GameService,
    private readonly http: HttpService,
    private readonly databaseService: DatabaseService
  ) {}

  @Get('owned/:id')
  async getOwnedGamesByUser(
    @Param('id') id,
    @Query('showAppInfo') showAppInfo: boolean,
    @Query('showFreeGames') showFreeGames: boolean,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('filter') filter: string
  ) {
    this.imageTypes = [
      'library_600x900.jpg',
      'library_hero.jpg',
      'header.jpg',
      'logo.png'
    ];
    return await this.gameService
      .getOwnedGames(id, showAppInfo, showFreeGames)
      .pipe(
        map(async response => {
          if (
            response &&
            response.data['response'] &&
            response.data['response'].games
          ) {
            await this.getFilteredGames(
              id,
              filter,
              response.data['response'].games
            ).then(games => (this.games = games));

            if (this.games && this.games.length > 0) {
              if (limit) {
                this.games = this.games.slice(
                  page * limit,
                  (+page + 1) * limit
                );
              }

              await Promise.all(
                this.games.map(async (game: Game) => {
                  game.background = await this.getImage(game.appid, 0);
                })
              );
            }

            return {
              games: this.games,
              game_count: response.data['response'].games.length
            };
          }
        })
      );
  }

  @Get('owned/search/:id')
  async searchGame(
    @Param('id') id,
    @Query('showAppInfo') showAppInfo: boolean,
    @Query('showFreeGames') showFreeGames: boolean,
    @Query('limit') limit: number,
    @Query('filter') filter: string,
    @Query('search') search: string
  ) {
    this.imageTypes = [
      'library_600x900.jpg',
      'library_hero.jpg',
      'header.jpg',
      'logo.png'
    ];
    return await this.gameService
      .getOwnedGames(id, showAppInfo, showFreeGames)
      .pipe(
        map(async response => {
          if (
            response &&
            response.data['response'] &&
            response.data['response'].games
          ) {
            await this.getFilteredGames(
              id,
              filter,
              response.data['response'].games,
              search
            ).then(games => (this.games = games));

            if (limit) {
              this.games = this.games.slice(0, limit);
            }

            await Promise.all(
              this.games.map(async (game: Game) => {
                game.background = await this.getImage(game.appid, 0);
              })
            );

            return {
              games: this.games
            };
          }
        })
      );
  }

  async getFilteredGames(
    id: string,
    filter: string,
    games: Game[],
    search?: string
  ): Promise<Game[]> {
    let completedGames = [];
    if (filter !== Filters.All) {
      const user = await this.databaseService.find(id);
      if (user) {
        completedGames = user.completedGames;
      }
    }

    switch (filter) {
      case Filters.All:
        return games;

      case Filters.Completed:
        return games.filter(
          game => completedGames.indexOf(game.appid.toString()) > -1
        );

      case Filters.NotCompleted:
        return games.filter(
          game => completedGames.indexOf(game.appid.toString()) === -1
        );

      case Filters.Search:
        if (search) {
          return games.filter(game => {
            return game.name.toLowerCase().trim().includes(search.toLowerCase());
          });
        }
    }
  }

  async getImage(appid: number, imagePos: number): Promise<GameBackground> {
    const imageUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/${this.imageTypes[imagePos]}`;
    return new Promise((resolve, reject) => {
      this.http.get(imageUrl, { responseType: 'blob' }).subscribe(
        data => {
          resolve({ type: imagePos, url: imageUrl });
        },
        async error => {
          if (imagePos <= this.imageTypes.length - 1) {
            resolve(this.getImage(appid, imagePos + 1));
          } else {
            resolve({ type: -1, url: undefined });
          }
        }
      );
    });
  }
}
