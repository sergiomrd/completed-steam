import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { environment } from '../../../environments/environment';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor() {
    super({
      returnURL: 'http://localhost:4200/api/auth/steam/callback',
      realm: 'http://localhost:4200/',
      apiKey: environment.WEB_API,
      profile: true
    });
  }

  async validate(identifier, profile, done: Function) {
    console.log(identifier);
    console.log(profile);
    return done(null, profile);
  }
}
