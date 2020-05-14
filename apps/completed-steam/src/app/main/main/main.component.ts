import { VanityUserResponse, OwnedGamesResponse } from './../../../../../api/src/app/models/user.interface';
import { Game } from './../../../../../api/src/app/models/game.interface';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from '@completed-steam/api-interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'completed-steam-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  loginWindow: any;
  games: Game[];
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {

  }

  async ngOnInit() {
    let id = localStorage.getItem('id')
    if(!id) {
      this.http.get(`${environment.API}api/auth/profile`).subscribe((response) => {
        if(response) {
          localStorage.setItem('id', response['id']);
          this.getOwnedGames( response['id']);
        }
      })
    } else {
      this.getOwnedGames(id);
    }


  }

  login() {
    window.location.href = `${environment.API}api/auth/steam`;
    // test
  }

  getOwnedGames(id: string) {
    this.http.get(`${environment.API}api/games/owned/${id}`, {params: {showAppInfo: 'true', showFreeGames: 'false', limit: '20'}}).subscribe((response: OwnedGamesResponse) => {
      this.games = response.games;
    })
  }
}
