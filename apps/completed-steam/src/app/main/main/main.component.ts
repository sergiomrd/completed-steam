import { EncryptService } from './../../shared/services/encrypt/encrypt.service';
import { DatabaseService } from './../../shared/services/database/database.service';
import { UserService } from './../../shared/services/user/user.service';
import { VanityUserResponse, OwnedGamesResponse } from './../../../../../api/src/app/models/user.interface';
import { Game } from './../../../../../api/src/app/models/game.interface';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from '@completed-steam/api-interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../../shared/models/user.interface';

@Component({
  selector: 'completed-steam-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  loginWindow: any;
  allGames: Game[];
  canScroll: boolean;
  canLoadGames: boolean;
  currentLoadedPage: number;
  steamid: string;
  user: User;
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private database: DatabaseService, private spinner: NgxSpinnerService, private encryptService: EncryptService) {

  }

  async ngOnInit() {
    this.steamid = this.encryptService.decrypt(localStorage.getItem('id'));
    this.canScroll = true;
    this.canLoadGames = true;
    this.currentLoadedPage = 0;
    this.user = await this.database.findUser(this.encryptService.encrypt(this.steamid));
    //this.database.createUser({steamid: this.encryptService.encrypt(this.steamid), completedGames: ['111']});

    this.getOwnedGames(this.steamid, this.currentLoadedPage);
  }

  getOwnedGames(id: string, pageToLoad: number) {
    this.http.get(`${environment.API}api/games/owned/${id}`, {params: {showAppInfo: 'true', showFreeGames: 'false', limit: '50', page: pageToLoad.toString()}}).subscribe((response: OwnedGamesResponse) => {
      if(pageToLoad === 0) {
        this.allGames = response.games;
      } else {
        if(response.games.length > 0) {
          this.allGames = this.allGames.concat(response.games);
          this.canScroll = true;
        } else {
          this.canLoadGames = false;
        }
      }
    })
  }

  onScroll() {
    if(this.canScroll && this.canLoadGames) {
      this.spinner.show();
      this.canScroll = false;
      this.currentLoadedPage += 1;
      this.getOwnedGames(this.steamid, this.currentLoadedPage)
    }
  }

  setCompletedGames(games: Game[]): Game[] {
    return [];
  }
}
