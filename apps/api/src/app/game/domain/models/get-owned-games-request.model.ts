import { Filters } from './filters.model';

export interface GetOwnedGamesRequest {
  encryptedSteamId: string;
  showAppInfo?: boolean;
  showFreeGames?: boolean;
  limit?: number;
  page?: number;
  filter?: Filters | string;
}
