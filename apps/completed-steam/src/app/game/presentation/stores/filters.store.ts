import { Injectable, signal, computed } from '@angular/core';
import { Filters, CheckFilters } from '../../domain';

@Injectable({
  providedIn: 'root'
})
export class FiltersStore {
  readonly activeFilter = signal<Filters>(Filters.NotCompleted);
  readonly searchText = signal<string>('');

  readonly checkFilters = computed<CheckFilters>(() => {
    const current = this.activeFilter();
    return {
      all: current === Filters.All,
      completed: current === Filters.Completed,
      notCompleted: current === Filters.NotCompleted,
      search: current === Filters.Search
    };
  });

  setFilter(filter: Filters): void {
    this.activeFilter.set(filter);
    if (filter !== Filters.Search) {
      this.searchText.set('');
    }
  }

  setSearch(text: string): void {
    this.searchText.set(text);
    this.activeFilter.set(Filters.Search);
  }

  reset(): void {
    this.activeFilter.set(Filters.NotCompleted);
    this.searchText.set('');
  }
}
