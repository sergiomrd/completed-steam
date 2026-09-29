import { Injectable, computed, inject, signal } from '@angular/core';
import { Game, Filters } from '../../domain';
import {
  LoadGamesUseCase,
  SearchGamesUseCase,
  ToggleGameCompletionUseCase
} from '../../application';
import { LoadUserDataUseCase } from '../../../user/application';
import { FiltersStore } from './filters.store';

@Injectable({
  providedIn: 'root'
})
export class GamesStore {
  private readonly loadGamesUseCase = inject(LoadGamesUseCase);
  private readonly searchGamesUseCase = inject(SearchGamesUseCase);
  private readonly toggleCompletionUseCase = inject(ToggleGameCompletionUseCase);
  private readonly loadUserDataUseCase = inject(LoadUserDataUseCase);
  readonly filtersStore = inject(FiltersStore);

  // State Signals
  readonly games = signal<Game[]>([]);
  readonly totalGames = signal<number>(0);
  readonly completedGames = signal<string[]>([]);
  readonly loading = signal<boolean>(false);
  readonly currentPage = signal<number>(0);
  readonly canScroll = signal<boolean>(true);
  readonly canLoadGames = signal<boolean>(true);

  // Computed Signals
  readonly activeFilter = computed(() => this.filtersStore.activeFilter());
  readonly searchQuery = computed(() => this.filtersStore.searchText());
  readonly completedCount = computed(() => this.completedGames().length);
  readonly remainingGames = computed(() =>
    Math.max(0, this.totalGames() - this.completedGames().length)
  );
  readonly isSearchActive = computed(() => this.filtersStore.activeFilter() === Filters.Search);

  async init(steamId: string): Promise<void> {
    this.currentPage.set(0);
    this.canScroll.set(true);
    this.canLoadGames.set(true);
    this.filtersStore.reset();

    const user = await this.loadUserDataUseCase.execute(steamId);
    if (user && user.completedGames) {
      this.completedGames.set(user.completedGames);
    } else {
      this.completedGames.set([]);
    }

    await this.loadGames(steamId, 0);
  }

  async loadGames(steamId: string, page = 0): Promise<void> {
    this.loading.set(true);
    try {
      const response = await this.loadGamesUseCase.execute({
        steamId,
        page,
        filter: this.filtersStore.activeFilter(),
        completedGames: this.completedGames()
      });

      if (page === 0) {
        this.games.set(response.games);
        this.totalGames.set(response.totalGames);
        this.canScroll.set(true);
        this.canLoadGames.set(true);
      } else {
        if (response.games.length > 0) {
          this.games.update(current => [...current, ...response.games]);
          this.canScroll.set(true);
        } else {
          this.canScroll.set(false);
          this.canLoadGames.set(false);
        }
      }

      if (steamId.includes('sample') && response.games.length === 100) {
        this.canScroll.set(false);
        this.canLoadGames.set(false);
      }

      this.currentPage.set(page);
    } finally {
      this.loading.set(false);
    }
  }

  async loadNextPage(steamId: string): Promise<void> {
    if (!this.canScroll() || !this.canLoadGames() || this.loading()) {
      return;
    }
    this.canScroll.set(false);
    const nextPage = this.currentPage() + 1;
    await this.loadGames(steamId, nextPage);
  }

  async setFilter(steamId: string, filter: Filters): Promise<void> {
    this.filtersStore.setFilter(filter);
    this.currentPage.set(0);
    this.canScroll.set(true);
    this.canLoadGames.set(true);
    await this.loadGames(steamId, 0);
  }

  async search(steamId: string, query: string): Promise<void> {
    this.filtersStore.setSearch(query);
    this.loading.set(true);
    try {
      const response = await this.searchGamesUseCase.execute({
        steamId,
        query,
        completedGames: this.completedGames(),
        filter: Filters.Search
      });
      this.games.set(response.games);
      this.canScroll.set(false);
      this.canLoadGames.set(false);
    } finally {
      this.loading.set(false);
    }
  }

  async toggleCompletion(
    steamId: string,
    appid: string,
    completed: boolean
  ): Promise<void> {
    const response = await this.toggleCompletionUseCase.execute({
      steamId,
      appid,
      completed,
      currentCompleted: this.completedGames()
    });

    this.completedGames.set(response.completedGames);

    // Update the game in current list reactive state
    this.games.update(current =>
      current.map(game =>
        game.appid.toString() === appid.toString()
          ? { ...game, completed }
          : game
      )
    );
  }
}
