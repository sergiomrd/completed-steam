import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Game, Filters } from '../../domain';
import { GamesStore, UserStore } from '../../stores';
import { DeviceDetectionUtil } from '../../shared/utils/device-detection.util';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FiltersComponent } from '../../shared/components/filters/filters.component';
import { GameBookComponent } from '../../shared/components/game-book/game-book.component';
import { ScrollTopComponent } from '../../shared/components/scroll-to-top/scroll-to-top.component';

@Component({
  selector: 'completed-steam-main',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FiltersComponent,
    GameBookComponent,
    ScrollTopComponent,
    NgxSpinnerModule,
    InfiniteScrollModule
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  readonly gamesStore = inject(GamesStore);
  readonly userStore = inject(UserStore);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly route = inject(ActivatedRoute);

  filters: typeof Filters = Filters;
  isMobile = false;

  get allGames(): Game[] {
    return this.gamesStore.games();
  }

  get remainingGames(): number {
    return this.gamesStore.remainingGames();
  }

  get totalGames(): number {
    return this.gamesStore.totalGames();
  }

  get loading(): boolean {
    return this.gamesStore.loading();
  }

  get activeFilter(): Filters {
    return this.gamesStore.activeFilter();
  }

  get steamid(): string {
    return this.userStore.steamId();
  }

  constructor() {
    DeviceDetectionUtil.isMobile.subscribe(
      (value: boolean) => (this.isMobile = value)
    );
  }

  async ngOnInit(): Promise<void> {
    this.spinner.show('full');
    try {
      const routeId = this.route.snapshot.params['id'];
      const storedId = localStorage.getItem('id');
      const targetId = routeId || storedId || '';

      const session = this.userStore.initSession(targetId);
      if (session) {
        await this.gamesStore.init(session.steamId);
      }
    } finally {
      this.spinner.hide('full');
    }
  }

  async onScroll(): Promise<void> {
    if (this.gamesStore.canScroll() && this.gamesStore.canLoadGames() && !this.gamesStore.loading()) {
      this.spinner.show('pages');
      try {
        await this.gamesStore.loadNextPage(this.userStore.steamId());
      } finally {
        this.spinner.hide('pages');
      }
    }
  }

  async updateBooks(event: { appid: string; completed: boolean }): Promise<void> {
    if (event) {
      await this.gamesStore.toggleCompletion(
        this.userStore.steamId(),
        event.appid,
        event.completed
      );
    }
  }

  async setFilters(value: Filters): Promise<void> {
    this.spinner.show('full');
    try {
      await this.gamesStore.setFilter(this.userStore.steamId(), value);
    } finally {
      this.spinner.hide('full');
    }
  }

  async searchGame(text: string): Promise<void> {
    this.spinner.show('full');
    try {
      await this.gamesStore.search(this.userStore.steamId(), text);
    } finally {
      this.spinner.hide('full');
    }
  }
}
