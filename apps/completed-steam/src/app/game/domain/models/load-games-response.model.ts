import { Game } from './game.model';

export interface LoadGamesResponse {
  games: Game[];
  totalGames: number;
}
