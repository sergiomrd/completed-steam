import { Filters } from './filters.model';

export interface SearchGamesRequest {
  steamId: string;
  query: string;
  completedGames: string[];
  filter?: Filters | string;
  limit?: number;
}
