# ADR 0005: Decoupled Frontend/Backend Domains (Models Only) and Local Database Configuration

## Status
Accepted

## Context
1. **Coupling between Frontend and Backend Models**:
   Previously, both frontend and backend shared `@completed-steam/domain` directly. This prevented the frontend models and DTOs from evolving independently from the backend schema and DTOs.
2. **Heavy Entity Classes**:
   The use of OOP entity classes (`class User { isGameCompleted(), toggleGameCompletion(), toJSON() }`) introduced unnecessary boilerplate, mapping complexity, and serialisation overhead for what is fundamentally structured data.
3. **Database Configuration**:
   The API was previously hardcoded to a remote MongoDB Atlas cluster on Azure, making local offline development and private personal use dependent on remote credentials.

## Decision
1. **Autonomous Frontend Domain (`apps/completed-steam/src/app/domain`)**:
   - The Angular frontend has its own dedicated domain folder with pure TypeScript models (`User`, `Game`, `Filters`, `PlayerProfile`).
   - The frontend is strictly prohibited from importing `@completed-steam/domain` or `libs/domain`.
2. **Pure TypeScript Models (Zero Class Entities)**:
   - All classes with behavioral methods in both frontend and backend have been eliminated in favor of pure interfaces/models (`user.model.ts`, `game.model.ts`, etc.).
   - Repositories and use cases receive and return pure objects.
3. **Local MongoDB Database**:
   - The API is configured to connect to the local MongoDB service running on `127.0.0.1:27017` with database `completed-steam`.
   - Managed via root `.env` and `.env.example`, loaded via `dotenv`.

## Consequences
- **Independence**: Frontend and backend models/DTOs can diverge or transform independently without breaking contract boundaries.
- **Simplicity**: No class instantiation (`new User(...)`) or `.toJSON()` conversions.
- **Local Control**: Offline local development with the active Windows MongoDB instance on port 27017.
- **Enforced via Harness**: `harness-verify.js` guarantees that `apps/completed-steam` cannot re-introduce imports of `@completed-steam/domain`.
