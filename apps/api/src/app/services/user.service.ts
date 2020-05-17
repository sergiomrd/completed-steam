import { EncryptService } from './encrypt.service';
import { PlayerSummaries} from './../models/user.interface';
import { VanityUserResponse } from '../models/user.interface';
import { environment } from './../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { Injectable, HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService, private encryptService: EncryptService) {}

  getUserSteamId(name: string): Observable<AxiosResponse<VanityUserResponse>> {
    return this.httpService.get<VanityUserResponse>(
      'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/', {params: {
        key: environment.WEB_API,
        vanityurl: name
      }}
    );
  }

  getUserInfo(id: string): Observable<AxiosResponse<PlayerSummaries>> {
    return this.httpService.get<PlayerSummaries>(
      'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/', {params: {
        key: environment.WEB_API,
        steamids: this.encryptService.decrypt(id)
      }}
    );
  }
}
