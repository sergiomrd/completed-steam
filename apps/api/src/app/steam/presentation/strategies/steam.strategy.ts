import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { environment } from '../../../../environments/environment';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor() {
    super({
      returnURL: `${environment.API}api/auth/steam/callback`,
      realm: `${environment.API}`,
      apiKey: environment.WEB_API
    });
  }

  async validate(identifier: string, profile: any, done: (err: any, user: any) => void) {
    return done(null, profile);
  }
}
