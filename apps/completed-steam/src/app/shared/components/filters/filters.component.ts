import { Filters, CheckFilters } from './../../models/filters.interface';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DeviceDetectionUtil } from '../../utils/device-detection.util';

@Component({
  selector: 'completed-steam-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  filters: typeof Filters;
  checkFilters: CheckFilters;
  searchText: string;
  isMobile: boolean;

  @Output() filtered = new EventEmitter();
  @Output() search = new EventEmitter();

  constructor() {
    DeviceDetectionUtil.isMobile.subscribe((value: boolean) => (this.isMobile = value));
  }

  ngOnInit(): void {
    this.searchText = '';
    this.filters = Filters;
    this.checkFilters = {
      all: true,
      completed: false,
      notCompleted: false,
      search: false
    };
  }

  setFilters(value: Filters) {
    this.changeCheckBoxes(value);
    this.filtered.emit(value);
  }

  changeCheckBoxes(value: Filters) {
    for (const check in this.checkFilters) {
      if (Object.prototype.hasOwnProperty.call(this.checkFilters, check)) {
        if (check === value) {
          this.checkFilters[check] = true;
        } else {
          this.checkFilters[check] = false;
        }
      }
    }
  }

  onSearch() {
    if (this.searchText && this.searchText.length > 2) {
      this.changeCheckBoxes(Filters.Search);
      this.search.emit(this.searchText);
    }
  }

  onKey(value: KeyboardEvent) {
    this.searchText = (value.target as HTMLInputElement).value;
  }
}
