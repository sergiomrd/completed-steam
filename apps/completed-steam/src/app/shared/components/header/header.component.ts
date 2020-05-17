import { PlayerSummaries } from './../../../../../../api/src/app/models/user.interface';
import { HttpClient } from '@angular/common/http';
import { UserService } from './../../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { EncryptService } from '../../services/encrypt/encrypt.service';

@Component({
  selector: 'completed-steam-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userInfo: PlayerSummaries;
  constructor(private userService: UserService, private readonly http: HttpClient, private router: Router, private encryptService: EncryptService) { }

  ngOnInit(): void {
    const id = this.encryptService.decrypt(localStorage.getItem('id'));
    this.getUserInfo(id);
  }

  getUserInfo(id: string) {
    this.http.get(`${environment.API}api/user`, {params: {id: this.encryptService.encrypt(id)}}).subscribe(response => {
      const player: PlayerSummaries = response['players'][0];
      this.userInfo = player;
    })
  }

  goToProfile(){
    window.open(this.userInfo.profileurl, '_blank');
  }

  logout(){
    localStorage.removeItem('id');
    this.router.navigate(['/login']);
  }
}
