# AI Orchestration Harness Guide

This directory contains the operational harness designed for concurrent, multi-AI development across this monorepo.

## Structure
```
.harness/
├── HARNESS.md              # Operational guide (this document)
├── adr/                    # Architecture Decision Records (ADRs)
│   ├── 0001-clean-architecture.md
│   ├── 0002-multi-ai-coexistence-protocol.md
│   └── 0003-angular-standalone-signals.md
├── tasks/                  # Task board and concurrency locks
│   ├── registry.json       # Master state of tasks (PENDING, IN_PROGRESS, DONE)
│   ├── locks.json          # Active file/directory leases held by agents
│   └── TASK-*.md           # Granular task specifications
└── scripts/
    ├── harness-lock.js     # Lock acquisition and release CLI
    └── harness-verify.js   # Automated guardrails and verification script
```

## Commands
- **Check active locks and tasks**:
  ```bash
  node .harness/scripts/harness-lock.js status
  ```
- **Acquire lock on a task**:
  ```bash
  node .harness/scripts/harness-lock.js acquire TASK-001 "Agent-Antigravity" libs/domain
  ```
- **Release lock on a task**:
  ```bash
  node .harness/scripts/harness-lock.js release TASK-001
  ```
- **Run comprehensive repository verification**:
  ```bash
  node .harness/scripts/harness-verify.js
  # Or via npm:
  npm run harness:verify
  ```

## Working Rules for AI Agents
1. **Never edit files outside your leased scope** when working in parallel.
2. **Never commit without running `npm run harness:verify`**.
3. **If boundary violations are detected by the harness**, fix them immediately by refactoring imports to respect layer dependency direction:
   `Domain` <- `Application` <- `Infrastructure` / `Presentation`
