
export enum Filters {
    All = 'all',
    Completed = 'completed',
    NotCompleted = 'notCompleted',
    Search = 'search'
}

export interface CheckFilters {
    all: boolean;
    completed: boolean;
    notCompleted: boolean;
    search: boolean
}

