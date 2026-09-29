# ADR 0003: Modern Angular 22 - Standalone Components, Control Flow, and Signals

## Status
Accepted

## Context
The frontend application was written in Angular 9 with legacy `NgModule` declarations, `ngcc` ivy compiler legacy configuration, and deprecated RxJS patterns (`toPromise()`, deprecated operators). Angular 22 deprecates legacy NgModules in favor of Standalone Components and native control flow syntax (`@if`, `@for`, `@let`).

## Decision
1. **100% Standalone Architecture**:
   - Eliminate `AppModule`.
   - Bootstrap application via `bootstrapApplication(AppComponent, appConfig)`.
   - All components, directives, and pipes declare `standalone: true` (or default in modern Angular).
2. **Modern Control Flow**:
   - Replace `*ngIf` with `@if (...) { ... } @else { ... }`.
   - Replace `*ngFor="let item of list"` with `@for (item of list; track item.id) { ... }`.
3. **Reactive State**:
   - Use Angular Signals (`signal()`, `computed()`) for local component state.
4. **Modern HTTP and Routing**:
   - Use `provideHttpClient(withFetch())` and `provideRouter(routes)`.
   - Replace deprecated `.toPromise()` with `firstValueFrom()`.
5. **Modern Styles**:
   - Upgrade from Bootstrap 4 / legacy tilde imports (`~bootstrap/...`) to Bootstrap 5 standards.
