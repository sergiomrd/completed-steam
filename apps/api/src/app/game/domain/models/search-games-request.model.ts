import { Filters } from './filters.model';

export interface SearchGamesRequest {
  encryptedSteamId: string;
  showAppInfo?: boolean;
  showFreeGames?: boolean;
  limit?: number;
  filter?: Filters | string;
  search?: string;
}
