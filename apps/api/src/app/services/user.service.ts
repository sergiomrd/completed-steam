import { OwnedGamesResponse } from './../models/user.interface';
import { VanityUserResponse } from '../models/user.interface';
import { environment } from './../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { Injectable, HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  getUserSteamId(name: string): Observable<AxiosResponse<VanityUserResponse>> {
    return this.httpService.get<VanityUserResponse>(
      'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/', {params: {
        key: environment.WEB_API,
        vanityurl: name
      }}
    );
  }
}
