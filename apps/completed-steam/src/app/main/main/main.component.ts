import { DatabaseService } from './../../shared/services/database/database.service';
import { UserService } from './../../shared/services/user/user.service';
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
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private database: DatabaseService) {

  }

  async ngOnInit() {
    const id = localStorage.getItem('id');
    this.database.createUser({name: "test", steamid: id, completedGames: ['111']});
    this.database.findUser(id);
    this.getOwnedGames(id);
  }

  getOwnedGames(id: string) {
    this.http.get(`${environment.API}api/games/owned/${id}`, {params: {showAppInfo: 'true', showFreeGames: 'false', limit: '100'}}).subscribe((response: OwnedGamesResponse) => {
      this.games = response.games;
    })
  }
}
