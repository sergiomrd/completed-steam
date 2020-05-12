import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  userInfo: any;

  constructor() {

  }

  setUserInfo(value: any) {
    this.userInfo = value;
  }

  login() {
    return this.userInfo;
  }

}
