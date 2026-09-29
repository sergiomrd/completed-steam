import { Game } from '../../../game/domain';

export interface OwnedGamesResult {
  game_count: number;
  games: Game[];
}
