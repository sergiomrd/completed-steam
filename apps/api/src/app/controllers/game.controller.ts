import { GameService } from './../services/game.service';
import { Controller, Get, Param, Query, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Game, GameBackground } from '../models/game.interface';

@Controller('games')
export class GameController {
  imageTypes: string[];
  games: Game[];

  constructor(
    private readonly gameService: GameService,
    private readonly http: HttpService
  ) {}

  @Get('owned/:id')
  async getOwnedGamesByUser(
    @Param('id') id,
    @Query('showAppInfo') showAppInfo: boolean,
    @Query('showFreeGames') showFreeGames: boolean,
    @Query('limit') limit: number,
    @Query('page') page: number
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
            this.games = response.data['response'].games;
            if (limit) {
              this.games = response.data['response'].games.slice(
                page * limit,
                (+page + 1) * limit
              );
            }

            await Promise.all(
              this.games.map(async (game: Game) => {
                game.background = await this.getImage(game.appid, 0);
              })
            );

            return {
              games: this.games.filter((game: Game) => game.background),
              game_count: response.data['response'].games.length
            };
          }
        })
      );
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
            resolve(undefined);
          }
        }
      );
    });
  }
}
