import { EncryptService } from './encrypt.service';
import { OwnedGamesResponse } from '../models/user.interface';
import { VanityUserResponse } from '../models/user.interface';
import { environment } from '../../environments/environment';
import { Injectable, HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

@Injectable()
export class GameService {
  constructor(private readonly httpService: HttpService, private encrypService: EncryptService) {}
  getOwnedGames(steamId: string, showAppInfo: boolean, showFreeGames: boolean): Observable<AxiosResponse<OwnedGamesResponse>> {
    return this.httpService.get<OwnedGamesResponse>(
      'http://api.steampowered.com/IPlayerService/GetOwnedGames/v1', {params: {
        key: environment.WEB_API,
        steamid: this.encrypService.decrypt(steamId),
        include_appinfo: showAppInfo,
        include_played_free_games: showFreeGames
      }}
    );
  }
}
