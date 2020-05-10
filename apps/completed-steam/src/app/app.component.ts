import { VanityUserResponse, OwnedGamesResponse } from './../../../api/src/app/models/user.interface';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from '@completed-steam/api-interfaces';
import { Game } from '../../../api/src/app/models/game.interface';

@Component({
  selector: 'completed-steam-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  games: Game[];
  constructor(private http: HttpClient) {

  }

  async ngOnInit() {
    let steamid;
    await this.http.get('api/user/marod').toPromise().then((response: VanityUserResponse) => {
      steamid = response.steamid;
    });


    this.http.get(`api/games/owned/${steamid}`, {params: {showAppInfo: 'true', showFreeGames: 'false', limit: '10'}}).subscribe((response: OwnedGamesResponse) => {
      this.games = response.games;
    })

  }
}
