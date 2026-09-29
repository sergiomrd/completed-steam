# ADR 0004: Frontend Clean Architecture, Hexagonal & DDD with Angular Signals

## Status
Accepted

## Context
The frontend Angular application previously suffered from architectural coupling:
- Fat components (`MainComponent` had 293 lines) that directly performed raw HTTP calls with `HttpClient`, manipulated mutable global state, handled crypto and route logic, and mingled UI layout with domain concerns.
- Lack of clear separation between infrastructure (HTTP adapters, external APIs, storage), application orchestration (use cases), state management (signals), and presentation (dumb/smart components).
- Difficult to test components without mocking external HTTP backends and global services.

## Decision
We structured the frontend driving adapter (`apps/completed-steam`) according to strict **Clean Architecture**, **Hexagonal (Ports & Adapters)**, and **Domain-Driven Design (DDD)** principles:

```
apps/completed-steam/src/app/
├── presentation/ (components, pipes, guards)
│   ├── main/
│   ├── login/
│   └── shared/components/ (header, filters, game-book, scroll-to-top)
│       └── Pure presentation: Bind to Signal Stores, trigger store actions
│
├── stores/ (State Management)
│   ├── games.store.ts
│   └── user.store.ts
│       └── Reactive state via Angular Signals & Computeds. Only calls Use Cases.
│
├── use-cases/ (Application Orchestration)
│   ├── load-games.use-case.ts
│   ├── search-games.use-case.ts
│   ├── toggle-game-completion.use-case.ts
│   ├── load-user-data.use-case.ts
│   ├── load-user-profile.use-case.ts
│   └── manage-session.use-case.ts
│       └── Pure business logic. Injects Ports via DI. Zero HTTP or UI dependencies.
│
└── infrastructure/ (Hexagonal Adapters & Ports)
    ├── ports/ (Interfaces & InjectionTokens: IGameApiPort, IUserApiPort, etc.)
    └── adapters/ (HttpGameApiAdapter, HttpUserApiAdapter, CryptoJSEncryptionAdapter, LocalStorageAdapter)
        └── Implements Ports using Angular HttpClient, CryptoJS, and Web Storage APIs.
```

### Dependency Flow Rules
1. **Components** only inject **Signal Stores** (and UI-specific utilities like spinners/routers). They NEVER import `HttpClient`, `infrastructure/adapters`, or execute raw network calls.
2. **Signal Stores** manage fine-grained reactive state (`signal`, `computed`) and trigger **Use Cases**. They NEVER import `HttpClient` or concrete adapters.
3. **Use Cases** orchestrate application logic and depend exclusively on **Ports** (`IGameApiPort`, `IUserApiPort`, `IEncryptionService`, `IStoragePort`) and enterprise **Domain** entities (`@completed-steam/domain`).
4. **Adapters** implement the Ports using framework primitives (`HttpClient`, `firstValueFrom`, `CryptoJS`). Concrete adapters are bound to Port tokens in `app.config.ts`.

## Consequences
- **High Testability**: Any layer can be unit-tested in isolation by mocking its immediate inward port or store interface.
- **Maintainability & Clarity**: `MainComponent` reduced from 293 lines of mixed concerns to ~80 lines of declarative presentation.
- **Future Proofing**: Transitioning HTTP protocols, backends, or caching requires zero changes to UI components or use cases.
- **Enforced via Harness**: Automated boundary enforcement scripts in `.harness/scripts/harness-verify.js` block any forbidden cross-layer imports.
