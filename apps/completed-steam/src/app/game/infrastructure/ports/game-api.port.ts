import { InjectionToken } from '@angular/core';
import { OwnedGamesResponse } from '@completed-steam/api-interfaces';
import { Filters } from '../../domain';

export interface GameQueryParams {
  showAppInfo?: boolean;
  showFreeGames?: boolean;
  limit?: number;
  page?: number;
  filter?: Filters | string;
}

export interface SearchQueryParams {
  showAppInfo?: boolean;
  showFreeGames?: boolean;
  limit?: number;
  filter?: Filters | string;
  search?: string;
}

export interface IGameApiPort {
  getOwnedGames(encryptedId: string, params: GameQueryParams): Promise<OwnedGamesResponse>;
  searchGames(encryptedId: string, params: SearchQueryParams): Promise<OwnedGamesResponse>;
}

export const GAME_API_PORT = new InjectionToken<IGameApiPort>('GAME_API_PORT');
