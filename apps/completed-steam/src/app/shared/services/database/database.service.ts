import { User } from './../../models/user.interface';
import { UserDto } from './../../../../../../api/src/app/models/dto/user.dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private _userInfo: any;

  constructor(private http: HttpClient) {}

  set userInfo(value: any){ 
    this._userInfo = value;
  }

  get userInfo() {
    return this._userInfo;
  }

  async createUser(user: UserDto) {
    await this.http.post(`${environment.API}api/user/create`, {body: user});
  }

  
  async findUser(id: string): Promise<User> {
    let user;
    await this.http.get(`${environment.API}api/user/${id}` ).toPromise().then((response) => {
      user = response;
    });
    return user;
  }
}
