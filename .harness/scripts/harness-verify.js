#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..', '..');

console.log('====================================================');
console.log('       MULTI-AI HARNESS: REPOSITORY VERIFICATION    ');
console.log('====================================================');

let errors = 0;

function checkFileImports(filePath, prohibitedPatterns, layerName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.trim().startsWith('import ') || line.includes('require(')) {
      for (const pattern of prohibitedPatterns) {
        if (pattern.test(line)) {
          console.error(`[BOUNDARY ERROR] ${path.relative(ROOT_DIR, filePath)}:${idx + 1}`);
          console.error(`  Layer "${layerName}" violates Clean Architecture dependency rule!`);
          console.error(`  Prohibited import match: ${line.trim()}`);
          errors++;
        }
      }
    }
  });
}

function scanDir(dir, prohibitedPatterns, layerName) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        scanDir(fullPath, prohibitedPatterns, layerName);
      }
    } else if (/\.(ts|js|tsx|jsx)$/.test(entry.name) && !entry.name.endsWith('.spec.ts')) {
      checkFileImports(fullPath, prohibitedPatterns, layerName);
    }
  }
}

// 1. Boundary Checks
console.log('\n[1/3] Checking Clean Architecture Boundary Rules...');

// Libs check: only api-interfaces allowed in libs/
const libsDir = path.join(ROOT_DIR, 'libs');
if (fs.existsSync(libsDir)) {
  const libEntries = fs.readdirSync(libsDir).filter(f => f !== '.gitkeep');
  for (const entry of libEntries) {
    if (entry !== 'api-interfaces') {
      console.error(`[LIBS RULE ERROR] Unauthorized library in libs/: "${entry}". Only shared "api-interfaces" is permitted.`);
      errors++;
    }
  }
}

// Backend Domain layers: pure TypeScript interfaces/models and ports. Zero framework dependencies.
const apiAppDir = path.join(ROOT_DIR, 'apps', 'api', 'src', 'app');
if (fs.existsSync(apiAppDir)) {
  const subdomains = ['user', 'game', 'steam', 'security'];
  for (const sub of subdomains) {
    const domainDir = path.join(apiAppDir, sub, 'domain');
    if (fs.existsSync(domainDir)) {
      scanDir(
        domainDir,
        [
          /@angular\//,
          /@nestjs\//,
          /mongoose/,
          /axios/,
          /express/,
          /infrastructure/,
          /presentation/,
          /apps\/completed-steam/
        ],
        `Backend ${sub}/domain`
      );
    }

    const applicationDir = path.join(apiAppDir, sub, 'application');
    if (fs.existsSync(applicationDir)) {
      scanDir(
        applicationDir,
        [
          /@angular\//,
          /@nestjs\//,
          /mongoose/,
          /infrastructure/,
          /presentation/,
          /apps\/completed-steam/
        ],
        `Backend ${sub}/application`
      );
    }

    const presentationDir = path.join(apiAppDir, sub, 'presentation');
    if (fs.existsSync(presentationDir)) {
      scanDir(
        presentationDir,
        [
          /infrastructure/,
          /apps\/completed-steam/
        ],
        `Backend ${sub}/presentation`
      );
    }
  }
}

// Presentation Frontend: Cannot import API app files directly or backend domain library
scanDir(
  path.join(ROOT_DIR, 'apps', 'completed-steam'),
  [
    /\/apps\/api\//,
    /\.\.\/api\//,
    /@completed-steam\/domain/,
    /@completed-steam\/application/,
    /libs\/domain/,
    /libs\/application/
  ],
  'Frontend (completed-steam)'
);

// Frontend Use Cases: Cannot import HttpClient or concrete infrastructure adapters
scanDir(
  path.join(ROOT_DIR, 'apps', 'completed-steam', 'src', 'app', 'use-cases'),
  [
    /@angular\/common\/http/,
    /adapters\//
  ],
  'Frontend Use Cases'
);

// Frontend Stores: Cannot import HttpClient or concrete infrastructure adapters
scanDir(
  path.join(ROOT_DIR, 'apps', 'completed-steam', 'src', 'app', 'stores'),
  [
    /@angular\/common\/http/,
    /adapters\//,
    /infrastructure\//
  ],
  'Frontend Stores'
);

// Frontend Presentation Components: Cannot import HttpClient or concrete adapters
scanDir(
  path.join(ROOT_DIR, 'apps', 'completed-steam', 'src', 'app', 'main'),
  [
    /@angular\/common\/http/,
    /adapters\//,
    /infrastructure\//
  ],
  'Frontend Main Component'
);

// Presentation API: Cannot import Frontend app files directly
scanDir(
  path.join(ROOT_DIR, 'apps', 'api'),
  [
    /\/apps\/completed-steam\//,
    /\.\.\/completed-steam\//,
    /@completed-steam\/domain/,
    /@completed-steam\/application/
  ],
  'Backend API'
);

if (errors === 0) {
  console.log('✓ All Clean Architecture layer boundaries are cleanly preserved!');
} else {
  console.error(`✗ Found ${errors} boundary rule violations.`);
}

// 2. Concurrency Lock Consistency
console.log('\n[2/3] Checking Multi-AI Task Locks...');
try {
  const locksFile = path.join(ROOT_DIR, '.harness', 'tasks', 'locks.json');
  if (fs.existsSync(locksFile)) {
    const locks = JSON.parse(fs.readFileSync(locksFile, 'utf8'));
    console.log(`✓ Active locks count: ${locks.locks.length}`);
  }
} catch (e) {
  console.error('✗ Failed reading locks.json:', e.message);
  errors++;
}

// 3. TypeScript Typecheck
console.log('\n[3/3] Checking TypeScript compilation...');
try {
  const nodeBin = path.join(ROOT_DIR, 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');
  if (fs.existsSync(nodeBin)) {
    execSync(`"${nodeBin}" --noEmit --project "${path.join(ROOT_DIR, 'tsconfig.json')}"`, { stdio: 'inherit' });
    console.log('✓ TypeScript typecheck passed successfully!');
  } else {
    console.log('ℹ TypeScript binary not yet installed in node_modules, skipping tsc.');
  }
} catch (e) {
  console.error('✗ TypeScript typecheck reported errors.');
  errors++;
}

console.log('\n====================================================');
if (errors === 0) {
  console.log('✓ HARNESS VERIFICATION SUCCEEDED - ALL CHECKS PASSED');
  console.log('====================================================\n');
  process.exit(0);
} else {
  console.error(`✗ HARNESS VERIFICATION FAILED WITH ${errors} ERRORS`);
  console.log('====================================================\n');
  process.exit(1);
}
