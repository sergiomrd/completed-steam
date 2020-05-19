import { Filters, CheckFilters } from './../../models/filters.interface';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'completed-steam-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  filters: typeof Filters;
  checkFilters: CheckFilters;

  @Output() filtered = new EventEmitter()

  constructor() {}

  ngOnInit(): void {
    this.filters = Filters;
    this.checkFilters = {
      all: true,
      completed: false,
      notCompleted: false
    }
  }

  setFilters(value: Filters) {
    this.changeCheckBoxes(value);
    this.filtered.emit(value);
  }

  changeCheckBoxes(value: Filters) {

    for(const check in this.checkFilters) {
      if(Object.prototype.hasOwnProperty.call(this.checkFilters, check)){
        if(check === value) {
          this.checkFilters[check] = true;
        } else {
          this.checkFilters[check] = false;
        }
      }
    }

  }


}
