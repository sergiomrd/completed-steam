import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _userInfo: any;

  constructor() {

  }

  set userInfo(value: any){ 
    this._userInfo = value;
  }

  get userInfo() {
    return this._userInfo;
  }
}
