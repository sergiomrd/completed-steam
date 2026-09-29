import { Filters } from './filters.model';

export interface LoadGamesRequest {
  steamId: string;
  page: number;
  filter: Filters | string;
  completedGames: string[];
  limit?: number;
}
