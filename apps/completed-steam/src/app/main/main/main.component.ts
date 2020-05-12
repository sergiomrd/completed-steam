import { Game } from './../../../../../api/src/app/models/game.interface';
import { Component, OnInit } from '@angular/core';
import { VanityUserResponse, OwnedGamesResponse } from './../../../api/src/app/models/user.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from '@completed-steam/api-interfaces';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'completed-steam-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  loginWindow: any;
  games: Game[];
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {

  }

  async ngOnInit() {
    let steamid;
    await this.http.get('api/user/marod').toPromise().then((response: VanityUserResponse) => {
      steamid = response.steamid;
    });


    this.http.get(`api/games/owned/${steamid}`, {params: {showAppInfo: 'true', showFreeGames: 'false', limit: '10'}}).subscribe((response: OwnedGamesResponse) => {
      this.games = response.games;
    })

    this.http.get(`api/auth/profile`).subscribe((response) => {
      debugger;
    })

  }

  login() {
    window.location.href = 'http://localhost:4200/api/auth/steam';
  }
}
