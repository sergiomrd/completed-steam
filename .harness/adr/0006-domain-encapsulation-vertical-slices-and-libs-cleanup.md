# ADR 0006: Subdomain Encapsulation in Vertical Slices & Removal of Unshared Domains in Libs

## Status
Accepted

## Context
Initially, the monorepo placed backend domain interfaces in `libs/domain` and backend use cases in `libs/application`. However:
1. Frontend and backend domains are completely decoupled (`apps/completed-steam/src/app/domain` vs backend domain models). There is zero domain code sharing between frontend and backend.
2. Placing backend-specific domain models and use cases in monorepo-level `libs/` created false expectations that domains were shared across apps.
3. The user requested: *“Libs no debería tener ningún dominio que no sea compartido, y entre frontend y backend no hay dominios compartidos. Front tiene su user y Back tiene su User, por tanto no deben haber este tipo de dominios en libs”*.

## Decisions
1. **Remove `libs/domain` and `libs/application`**:
   - `libs/` now strictly contains only `libs/api-interfaces`, which holds network DTOs and API contract interfaces exchanged between frontend and backend.
   - All backend domain models, ports, and use cases were moved into `apps/api`.
2. **Backend Domain-Centric Vertical Slices (`apps/api/src/app/<subdomain>/`)**:
   - The backend is organized into 4 autonomous subdomain contexts: `user`, `game`, `steam`, and `security`.
   - Each subdomain encapsulates its own internal Clean Architecture layers:
     - `domain/`: Pure TypeScript interfaces/types and port tokens (zero framework imports).
     - `application/`: Use Cases implementing application logic.
     - `infrastructure/`: Schemas, repositories, HTTP clients, and adapters.
     - `presentation/`: NestJS controllers, guards, and strategies.
3. **Decoupled Contracts**:
   - Frontend and Backend communicate solely via shared HTTP interfaces from `@completed-steam/api-interfaces` and their respective ports and adapters.
   - Neither application depends on `@completed-steam/domain` or `@completed-steam/application`.

## Consequences
- **Positive**: Clean encapsulation, eliminates false dependencies in `libs/`, simplifies dependency graph, allows each application's domain to evolve independently.
- **Verification**: Enforced by `.harness/scripts/harness-verify.js` which verifies zero unauthorized libs in `libs/` and verifies strict Clean Architecture boundaries within each backend subdomain.
