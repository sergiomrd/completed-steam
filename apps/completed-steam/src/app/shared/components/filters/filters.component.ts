import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Filters, CheckFilters } from '../../../domain';
import { FiltersStore } from '../../../stores';
import { DeviceDetectionUtil } from '../../utils/device-detection.util';

@Component({
  selector: 'completed-steam-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  readonly filtersStore = inject(FiltersStore);

  filters: typeof Filters = Filters;
  isMobile: boolean = false;

  get checkFilters(): CheckFilters {
    return this.filtersStore.checkFilters();
  }

  get searchText(): string {
    return this.filtersStore.searchText();
  }

  set searchText(value: string) {
    this.filtersStore.searchText.set(value);
  }

  @Output() filtered = new EventEmitter<Filters>();
  @Output() search = new EventEmitter<string>();

  constructor() {
    DeviceDetectionUtil.isMobile.subscribe((value: boolean) => (this.isMobile = value));
  }

  setFilters(value: Filters): void {
    this.filtersStore.setFilter(value);
    this.filtered.emit(value);
  }

  onSearch(): void {
    const text = this.filtersStore.searchText();
    if (text && text.length > 2) {
      this.filtersStore.setSearch(text);
      this.search.emit(text);
    }
  }

  onKey(event: KeyboardEvent): void {
    this.filtersStore.searchText.set((event.target as HTMLInputElement).value);
  }
}
