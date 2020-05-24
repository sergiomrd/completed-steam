import { USER_SAMPLE } from './../../models/const/sample.const';
import { PlayerSummaries } from './../../../../../../api/src/app/models/user.interface';
import { HttpClient } from '@angular/common/http';
import { UserService } from './../../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { EncryptService } from '../../services/encrypt/encrypt.service';
import { DeviceDetectionUtil } from '../../utils/device-detection.util';

@Component({
  selector: 'completed-steam-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userInfo: PlayerSummaries;
  isMobile: boolean;
  constructor(private userService: UserService, private readonly http: HttpClient, private router: Router, private encryptService: EncryptService) {
    DeviceDetectionUtil.isMobile.subscribe((value: boolean) => (this.isMobile = value));
   }

  ngOnInit(): void {
    let id = localStorage.getItem('id');

    if(!id.includes('sample')) {
      id = this.encryptService.decrypt(localStorage.getItem('id'));
      this.getUserInfo(id);
    } else {
      this.loadSampleUser();
    }
  }

  getUserInfo(id: string) {
    this.http.get(`${environment.API}api/user`, {params: {id: this.encryptService.encrypt(id)}}).subscribe(response => {
      if(response && response['players']) {
        const player: PlayerSummaries = response['players'][0];
        this.userInfo = player;
      } else {
        this.router.navigate(['/login']);
      }
    })
  }

  loadSampleUser() { this.userInfo = USER_SAMPLE}

  goToProfile(){
    window.open(this.userInfo.profileurl, '_blank');
  }

  logout(){
    localStorage.removeItem('id');
    this.router.navigate(['/login']);
  }
}
