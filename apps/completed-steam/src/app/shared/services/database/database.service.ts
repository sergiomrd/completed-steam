import { UserDto } from './../../../../../../api/src/app/models/dto/user.dto';
import { User } from './../../../../../../api/src/app/models/user.interface';
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
      return await this.http.post(`${environment.API}api/user/create`, {body: user}).subscribe(response => {
      });
  }

  
  async findUser(id: string) {
    return await this.http.get(`${environment.API}api/user/${id}` ).subscribe(response => {
    });
}
}
