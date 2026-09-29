import { Game } from './game.model';

export interface GetOwnedGamesResponse {
  games: Game[];
  game_count: number;
}
