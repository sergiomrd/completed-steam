
export enum Filters {
    All = 'all',
    Completed = 'completed',
    NotCompleted = 'notCompleted'
}

export interface CheckFilters {
    all: boolean;
    completed: boolean;
    notCompleted: boolean;
}

