import { Injectable, signal } from '@angular/core';
import { PlayerSummaries } from '@completed-steam/api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly _userInfo = signal<PlayerSummaries | null>(null);

  get userInfo(): PlayerSummaries | null {
    return this._userInfo();
  }

  set userInfo(value: PlayerSummaries | null) {
    this._userInfo.set(value);
  }

  userInfoSignal() {
    return this._userInfo.asReadonly();
  }
}
