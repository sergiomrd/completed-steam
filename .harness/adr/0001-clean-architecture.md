# ADR 0001: Clean Architecture Layering in Nx Monorepo

## Status
Accepted

## Context
The previous codebase had tightly coupled layers:
- The Angular app imported TypeScript models directly from inside the NestJS API application directory (`../../../../../../api/src/app/models/...`).
- Database models (Mongoose schemas) were tightly coupled with HTTP controller payloads.
- Business rules (filtering, game completion logic) were scattered between Angular components and NestJS services.

## Decision
We enforce Uncle Bob's Clean Architecture using modular boundaries:
1. **`libs/domain`**:
   - Contains pure domain entities (`User`, `Game`, `SteamId`).
   - Defines interfaces/ports for data persistence (`IUserRepository`), third-party services (`ISteamService`), and encryption (`IEncryptionService`).
   - Has zero dependencies on any framework or runtime environment.
2. **`libs/application`**:
   - Encapsulates application use cases (e.g. `GetOwnedGamesUseCase`, `ToggleGameCompletionUseCase`).
   - Defines application DTOs and contracts.
   - Depends solely on `libs/domain` and `libs/api-interfaces`.
3. **`libs/infrastructure`**:
   - Contains concrete adapter implementations:
     - `MongoUserRepository` implementing `IUserRepository`.
     - `SteamApiClient` implementing `ISteamService`.
     - `CryptoJsEncryptionService` implementing `IEncryptionService`.
4. **`apps/api`**:
   - Driving adapter (Presentation) exposing REST endpoints using NestJS 12.
   - Registers adapters as providers for domain ports via NestJS dependency injection.
5. **`apps/completed-steam`**:
   - Frontend presentation driving adapter built with Angular 22 Standalone.

## Consequences
- Clean separation of concerns allows different AI agents to work on independent layers simultaneously without code collision.
- Business logic is 100% unit-testable in isolation without mocking HTTP servers or databases.
