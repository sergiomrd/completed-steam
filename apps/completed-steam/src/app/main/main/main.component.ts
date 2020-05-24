import { SAMPLE_GAMES_COMPLETED } from './../../shared/models/const/sample.const';
import { SAMPLE_GAMES } from '../../shared/models/const/sample.const';
import { Filters } from './../../shared/models/filters.interface';
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
import { DeviceDetectionUtil } from '../../shared/utils/device-detection.util';

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
  completedGames: string[];
  totalGames: number;
  remainingGames: number;
  activeFilter: Filters;
  loading: boolean;
  isMobile: boolean;
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private database: DatabaseService, private spinner: NgxSpinnerService, private encryptService: EncryptService) {
    this.allGames = [];
    this.completedGames = [];
    DeviceDetectionUtil.isMobile.subscribe((value: boolean) => (this.isMobile = value));
  }

  async ngOnInit() {
    const id = localStorage.getItem('id');
    this.canScroll = true;
    this.canLoadGames = true;
    this.activeFilter = Filters.All;
    this.loading = true;
    this.spinner.show('full');


    if(id.includes('sample')) { 
      this.steamid = id;
      this.loadSample();
    } else {
      this.loadUserData();
      this.steamid = this.encryptService.decrypt(localStorage.getItem('id'));
      this.currentLoadedPage = 0;
      this.getOwnedGames(this.steamid, this.currentLoadedPage);
    }
  }

  loadSample() {
    this.getSampleGames(0);
  }

  getOwnedGames(id: string, pageToLoad: number) {
    this.loading = true;
    this.http.get(`${environment.API}api/games/owned/${this.encryptService.encrypt(id)}`, {params: {showAppInfo: 'true', showFreeGames: 'true', limit: '50', page: pageToLoad.toString(), filter: this.activeFilter }}).subscribe((response: OwnedGamesResponse) => {
      this.totalGames = response.game_count;
      this.getRemainingGames();
      if(pageToLoad === 0) {
        this.allGames = this.setCompletedGames(response.games);
      } else {
        if(response.games && response.games.length > 0) {
          this.allGames = this.allGames.concat(this.setCompletedGames(response.games));
          this.canScroll = true;
        } else {
          this.canScroll = false;
          this.canLoadGames = false;
          this.spinner.hide('full');
          this.spinner.hide('pages');
        }
      }
      this.loading = false;
      this.spinner.hide('full');
      this.spinner.hide('pages');
    })
  }

  getSampleGames( pageToLoad: number) {
    this.loading = true;
    this.totalGames = 100;
    this.getRemainingGames();
    if(pageToLoad === 0) {
      this.allGames = SAMPLE_GAMES.slice(0, 50);
    } else {
      this.allGames = SAMPLE_GAMES;
    }

    this.spinner.hide('full');
    this.spinner.hide('pages');
    if(this.allGames.length === SAMPLE_GAMES.length) {
      this.canScroll = false;
      this.canLoadGames = false;
    }
    this.loading = false;
  }

  onScroll() {
    if(this.canScroll && this.canLoadGames) {
      this.spinner.show();
      this.canScroll = false;
      this.currentLoadedPage += 1;
      this.spinner.show('pages');
      if(this.steamid.includes('sample')) {
        this.getSampleGames(this.currentLoadedPage);
      } else {
        this.getOwnedGames(this.steamid, this.currentLoadedPage)
      }
    }
  }

  setCompletedGames(games: Game[]): Game[] {
    const aux: Game[] = games;
    if(this.completedGames && this.completedGames.length > 0) {
      aux.map((game: Game) => {
        game.completed = this.completedGames.indexOf(game.appid.toString()) > -1;
      })
    }
    return aux;
  }

  async updateBooks(event: any) {
    if(event) {
      if(event.completed) {
        this.completedGames.push(event.appid);
      } else {
        const id = this.completedGames.indexOf(event.appid);
        if(id > -1){
          this.completedGames.splice(id, 1);
        }
      }

      if(this.user && !this.steamid.includes('sample')) {
        this.database.updateUser({steamid: this.encryptService.encrypt(this.steamid), completedGames: this.completedGames});
      }
      this.getRemainingGames()
    }
  }

  async loadUserData() {
    await this.database.findUser(this.encryptService.encrypt(this.steamid)).then((response) => {
      this.user = response;
      if(this.user && this.user.completedGames) {
        this.completedGames = this.user.completedGames;
      }
    });
  }

  getRemainingGames() {
    this.remainingGames = this.totalGames - this.completedGames.length;
  }

  setFilters(value: Filters) {
    this.currentLoadedPage = 0;
    this.activeFilter = value;
    this.canScroll = true;
    this.canLoadGames = true;
    this.spinner.show('full');
    if(this.steamid.includes('sample')) {
      this.getFilteredSampleGames();
    } else {
      this.getOwnedGames(this.steamid, this.currentLoadedPage);
    }
  }

  searchGame(text: string) {
    this.activeFilter = Filters.Search;
    this.canScroll = true;
    this.canLoadGames = true;
    this.spinner.show('full');
    if(this.steamid.includes('sample')) {
      this.getFilteredSampleGames(text);
    } else {
      this.http.get(`${environment.API}api/games/owned/search/${this.encryptService.encrypt(this.steamid)}`, {params: {showAppInfo: 'true', showFreeGames: 'true', limit: '50', filter: this.activeFilter, search: text }}).subscribe((response: OwnedGamesResponse) => {
        if(response) {
          this.allGames = this.setCompletedGames(response.games);
          this.spinner.hide('full');
        }
      });
    }
  }

  getFilteredSampleGames(search? :string) {
    switch (this.activeFilter) {
      case Filters.All:
        this.allGames = SAMPLE_GAMES.slice(0, 50);
        this.spinner.hide('full');
        break;

      case Filters.Completed:
        this.allGames = SAMPLE_GAMES_COMPLETED;
        this.spinner.hide('full');
        break;

      case Filters.NotCompleted:
        this.allGames = SAMPLE_GAMES.slice(50, SAMPLE_GAMES.length);
        this.spinner.hide('full');
        break;

      case Filters.Search:
        if (search) {
          this.allGames = SAMPLE_GAMES.filter(game => {
            return game.name.toLowerCase().trim().includes(search.toLowerCase());
          });
        }
        this.spinner.hide('full');
    }
  }
}
