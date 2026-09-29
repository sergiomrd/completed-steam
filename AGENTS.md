# Multi-Agent Collaboration Protocol & Architecture Rules

Welcome to the **completed-steam** repository. Multiple AI models and automated agents collaborate on this codebase concurrently. To ensure seamless parallel work and zero merge conflicts, all AI agents MUST adhere strictly to the rules and protocols defined here.

---

## 1. Core Architecture Principles: Clean Architecture & DDD
This monorepo follows **Clean Architecture, Hexagonal, and DDD** principles:

### Shared Monorepo Library (`libs/`)
- **`libs/api-interfaces`** (`@completed-steam/api-interfaces`): Shared HTTP DTO contracts and response payloads exchanged over the network between frontend and backend.
- **Strict Rule:** Frontend and Backend do **NOT** share domain models or business logic. `libs/` MUST NOT contain unshared domains (No `libs/domain`, No `libs/application`). Each application maintains its own autonomous domain.

### Backend Application (`apps/api`)
Organized by **subdomain vertical slices** (`user`, `game`, `steam`, `security`), where each subdomain contains its own Clean Architecture layers:
```
apps/api/src/app/<subdomain>/
       ├── domain/          <- Pure TypeScript models and Ports (interfaces/tokens, ZERO framework imports)
       ├── application/     <- Use Cases orchestrating business logic (depends only on domain)
       ├── infrastructure/  <- Mongoose schemas/repos, Axios adapters, Crypto adapters
       └── presentation/    <- NestJS Controllers, Guards, Strategies
```
- **`user/`**:
  - `domain/`: `user.model.ts`, `player-profile.model.ts`, `user-repository.port.ts`
  - `application/`: `create-or-update-user.use-case.ts`, `find-user.use-case.ts`, `get-user-profile.use-case.ts`
  - `infrastructure/`: `user.schema.ts`, `mongo-user.repository.ts`
  - `presentation/`: `user.controller.ts`
- **`game/`**:
  - `domain/`: `game.model.ts`, `filters.model.ts`
  - `application/`: `get-owned-games.use-case.ts`, `search-games.use-case.ts`
  - `presentation/`: `game.controller.ts`
- **`steam/`**:
  - `domain/`: `owned-games-result.model.ts`, `steam-service.port.ts`
  - `application/`: `handle-steam-callback.use-case.ts`
  - `infrastructure/`: `steam-api.adapter.ts`
  - `presentation/`: `auth.controller.ts`, `steam-auth.guard.ts`, `steam.strategy.ts`
- **`security/`**:
  - `domain/`: `encryption-service.port.ts`
  - `infrastructure/`: `crypto-js-encryption.adapter.ts`
- **Database**: Local MongoDB service running on `127.0.0.1:27017` (database `completed-steam`), configured via `.env` with `dotenv`.
- **Strict Rule**: Controllers must NEVER inject Ports or repositories directly; only Use Cases (`application/`).

### Frontend Driving Adapter (`apps/completed-steam`)
Organized by **bounded context vertical slices** (`game`, `user`, `security`), where each bounded context contains its own 4 Clean Architecture layers:
```
apps/completed-steam/src/app/<bounded-context>/
       ├── domain/          <- Models (pure TypeScript interfaces/enums) & Ports (interfaces / InjectionTokens)
       ├── application/     <- Use Cases orchestrating client business logic (depends only on domain/ports)
       ├── infrastructure/  <- Concrete Ports & Adapters (HttpClient, CryptoJS, LocalStorage)
       └── presentation/    <- Signal Stores, Components, UI
```
- **`game/`**:
  - `domain/`: `models/` (`game.model.ts`, `filters.model.ts`, request/response models)
  - `application/`: `load-games.use-case.ts`, `search-games.use-case.ts`, `toggle-game-completion.use-case.ts`
  - `infrastructure/`: `game-api.port.ts`, `http-game-api.adapter.ts`
  - `presentation/`: `games.store.ts`, `filters.store.ts`
- **`user/`**:
  - `domain/`: `models/` (`user.model.ts`, `player-profile.model.ts`, `session-info.model.ts`)
  - `application/`: `load-user-data.use-case.ts`, `load-user-profile.use-case.ts`, `manage-session.use-case.ts`
  - `infrastructure/`: `user-api.port.ts`, `storage.port.ts`, `http-user-api.adapter.ts`, `local-storage.adapter.ts`
  - `presentation/`: `user.store.ts`
- **`security/`**:
  - `domain/`: `encryption.port.ts`
  - `infrastructure/`: `crypto-js-encryption.adapter.ts`
- **Strict Rule 1**: Presentation components NEVER import `HttpClient`, `adapters/`, or raw API URLs. They only interact with **Signal Stores**.
- **Strict Rule 2**: Signal Stores NEVER import `HttpClient` or concrete adapters. They only trigger **Use Cases**.
- **Strict Rule 3**: Use Cases NEVER import `HttpClient` or concrete adapters. They depend exclusively on **Ports** (`IGameApiPort`, `IUserApiPort`, `IEncryptionService`, `IStoragePort`) and frontend **Domain models**.
- **Strict Rule 4**: The Frontend MUST NOT import backend domain files. It maintains its own domain models decoupled from the backend schema.
- **Strict Rule 5**: All domain layers use pure TypeScript **models** (interfaces/enums). Do NOT use OOP class entities with embedded business methods.
- **Strict Rule 6 (SRP for Models & Use Cases)**: Use case files must contain ONLY the use case class itself. Under no circumstances should request, response, or command interfaces be defined within a use case file. All such models MUST be extracted to their own dedicated files inside `domain/models/` within their respective subdomain.
- **Strict Rule 7 (Bounded Context over Global Layers)**: Do NOT group all domains inside global layers (`domain/`, `application/`, `infrastructure/`). Each domain/bounded context MUST encapsulate its own 4 layers internally.

---

## 2. Multi-AI Working Protocol

Before writing or modifying any code:
1. **Check Task Registry**: Consult [`.harness/tasks/registry.json`](file:///.harness/tasks/registry.json) to see which tasks are available (`READY`), in progress (`IN_PROGRESS`), or completed (`DONE`).
2. **Acquire a Task Lock**: Run:
   ```bash
   node .harness/scripts/harness-lock.js acquire <TASK-ID> <AGENT-NAME> <AFFECTED-DIRECTORIES...>
   ```
   If another agent holds a lock on the target module, you **MUST NOT** edit files in that scope. Choose another ready task or wait.
3. **Preserve Public Contracts**: If your task defines or modifies interfaces in `api-interfaces`, ensure backwards compatibility or update all implementations and contract tests atomically.
4. **Run Verification Before Completion**: Before releasing your lock and submitting your work, execute:
   ```bash
   npm run harness:verify
   ```
   All checks (TypeScript, architecture boundaries, tests) must pass with zero errors.
5. **Release Lock & Mark Done**:
   ```bash
   node .harness/scripts/harness-lock.js release <TASK-ID>
   ```

---

## 3. Technology Stack Standards
- **Node.js**: `v22.23.3 LTS`
- **TypeScript**: `~6.0.2`
- **Nx**: `^23.2.1`
- **Angular**: `^22.2.0` (Zoneless `provideZonelessChangeDetection()`, Standalone components, `inject()`, Signals)
- **NestJS**: `^12.1.1` (`@nestjs/axios`, `@nestjs/mongoose`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`), FontAwesome 6

---

## 4. Documentation & ADRs
All major design decisions and contracts are documented under [`.harness/adr/`](file:///.harness/adr/). Consult existing ADRs before introducing architectural alterations.
