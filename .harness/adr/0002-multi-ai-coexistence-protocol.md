# ADR 0002: Multi-AI Coexistence and Concurrency Protocol

## Status
Accepted

## Context
Multiple artificial intelligence agents (e.g., Gemini, Claude, GPT, Cursor, local LLMs) may be dispatched concurrently on different features or fixes across the monorepo. Without coordination, parallel agents risk:
1. Overwriting shared files or introducing conflicting git changes.
2. Breaking interfaces relied upon by other agents.
3. Violating architectural boundaries.

## Decision
We institute an automated AI collaboration harness consisting of:
1. **Task Registry (`.harness/tasks/registry.json`)**:
   - Every unit of work is registered as a task with clear status, target package/layer, dependencies, and expected deliverables.
2. **Locking & Leasing (`.harness/tasks/locks.json` & `harness-lock.js`)**:
   - An AI agent must acquire a lease for the directories/packages it intends to modify.
   - If a directory is leased by another agent, the current agent must yield, select an unblocked task, or wait for release.
3. **Automated Verification Guardrails (`harness-verify.js`)**:
   - Enforces TypeScript correctness (`tsc --noEmit`).
   - Validates that architecture boundary rules are not violated (e.g. Domain layer having no external dependencies).
   - Validates locks and task states.

## Consequences
Parallel AI execution is safe, traceable, and deterministic. Any agent can verify repository integrity before releasing work.
