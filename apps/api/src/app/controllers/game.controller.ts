import { GameService } from './../services/game.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { CLIENT_RENEG_LIMIT } from 'tls';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('owned/:id')
  getOwnedGamesByUser(@Param('id') id, @Query('showAppInfo') showAppInfo: boolean, @Query('showFreeGames') showFreeGames: boolean, @Query('limit') limit: number) {
    return this.gameService.getOwnedGames(id, showAppInfo, showFreeGames).pipe(map((response) => {
      if(limit) {
        console.log(response.data);
        response.data['response'].games = response.data['response'].games.slice(0, limit);
        return response.data['response'];
      } else {
        return response.data['response'];
      }
    }) )
  }
}
