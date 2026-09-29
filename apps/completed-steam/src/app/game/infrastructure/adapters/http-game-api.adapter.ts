import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { OwnedGamesResponse } from '@completed-steam/api-interfaces';
import { environment } from '../../../../environments/environment';
import type { GameQueryParams, IGameApiPort, SearchQueryParams } from '../ports/game-api.port';

@Injectable({
  providedIn: 'root'
})
export class HttpGameApiAdapter implements IGameApiPort {
  private readonly http = inject(HttpClient);

  async getOwnedGames(encryptedId: string, params: GameQueryParams): Promise<OwnedGamesResponse> {
    const queryParams: Record<string, string> = {
      showAppInfo: params.showAppInfo !== false ? 'true' : 'false',
      showFreeGames: params.showFreeGames !== false ? 'true' : 'false'
    };

    if (params.limit !== undefined) {
      queryParams['limit'] = params.limit.toString();
    }
    if (params.page !== undefined) {
      queryParams['page'] = params.page.toString();
    }
    if (params.filter !== undefined) {
      queryParams['filter'] = params.filter.toString();
    }

    return firstValueFrom(
      this.http.get<OwnedGamesResponse>(`${environment.API}api/games/owned/${encryptedId}`, {
        params: queryParams
      })
    );
  }

  async searchGames(encryptedId: string, params: SearchQueryParams): Promise<OwnedGamesResponse> {
    const queryParams: Record<string, string> = {
      showAppInfo: params.showAppInfo !== false ? 'true' : 'false',
      showFreeGames: params.showFreeGames !== false ? 'true' : 'false'
    };

    if (params.limit !== undefined) {
      queryParams['limit'] = params.limit.toString();
    }
    if (params.filter !== undefined) {
      queryParams['filter'] = params.filter.toString();
    }
    if (params.search !== undefined) {
      queryParams['search'] = params.search;
    }

    return firstValueFrom(
      this.http.get<OwnedGamesResponse>(`${environment.API}api/games/owned/search/${encryptedId}`, {
        params: queryParams
      })
    );
  }
}
