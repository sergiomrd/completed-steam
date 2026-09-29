#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const LOCKS_FILE = path.join(__dirname, '..', 'tasks', 'locks.json');
const REGISTRY_FILE = path.join(__dirname, '..', 'tasks', 'registry.json');

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return null;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

const [,, cmd, taskId, agent, ...paths] = process.argv;

if (!cmd || cmd === 'status') {
  const locks = readJson(LOCKS_FILE) || { locks: [] };
  const registry = readJson(REGISTRY_FILE) || { tasks: [] };
  console.log('=== MULTI-AI HARNESS STATUS ===');
  console.log(`Active Locks: ${locks.locks.length}`);
  locks.locks.forEach(l => {
    console.log(`- [LOCKED] ${l.taskId} held by "${l.agent}" on paths: ${l.paths.join(', ')}`);
  });
  console.log('\nTasks:');
  registry.tasks.forEach(t => {
    console.log(`- [${t.status}] ${t.id}: ${t.title} (Assigned: ${t.assignedTo || 'None'})`);
  });
  process.exit(0);
}

if (cmd === 'acquire') {
  if (!taskId || !agent) {
    console.error('Usage: harness-lock acquire <taskId> <agent> [paths...]');
    process.exit(1);
  }
  const locks = readJson(LOCKS_FILE) || { locks: [] };
  const registry = readJson(REGISTRY_FILE) || { tasks: [] };

  const existingLock = locks.locks.find(l => l.taskId === taskId);
  if (existingLock && existingLock.agent !== agent) {
    console.error(`ERROR: Task ${taskId} is already locked by "${existingLock.agent}"`);
    process.exit(1);
  }

  // Check path collision
  const targetPaths = paths.length > 0 ? paths : (registry.tasks.find(t => t.id === taskId)?.paths || []);
  for (const l of locks.locks) {
    if (l.taskId !== taskId) {
      for (const p of l.paths) {
        if (targetPaths.some(tp => tp.startsWith(p) || p.startsWith(tp))) {
          console.error(`CONFLICT: Path "${p}" overlaps with existing lock held by "${l.agent}" (${l.taskId})`);
          process.exit(1);
        }
      }
    }
  }

  if (!existingLock) {
    locks.locks.push({
      taskId,
      agent,
      acquiredAt: new Date().toISOString(),
      paths: targetPaths
    });
  }
  writeJson(LOCKS_FILE, locks);

  // Update registry status
  const task = registry.tasks.find(t => t.id === taskId);
  if (task) {
    task.status = 'IN_PROGRESS';
    task.assignedTo = agent;
    writeJson(REGISTRY_FILE, registry);
  }

  console.log(`SUCCESS: Task ${taskId} locked by "${agent}" on paths: ${targetPaths.join(', ')}`);
  process.exit(0);
}

if (cmd === 'release') {
  if (!taskId) {
    console.error('Usage: harness-lock release <taskId>');
    process.exit(1);
  }
  const locks = readJson(LOCKS_FILE) || { locks: [] };
  const registry = readJson(REGISTRY_FILE) || { tasks: [] };

  locks.locks = locks.locks.filter(l => l.taskId !== taskId);
  writeJson(LOCKS_FILE, locks);

  const task = registry.tasks.find(t => t.id === taskId);
  if (task) {
    task.status = 'DONE';
    writeJson(REGISTRY_FILE, registry);
  }

  console.log(`SUCCESS: Released lock for task ${taskId}`);
  process.exit(0);
}

console.error(`Unknown command "${cmd}". Available: status, acquire, release`);
process.exit(1);
