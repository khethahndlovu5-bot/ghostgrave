#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const commandsDir = path.join(root, 'commands');
const files = fs.readdirSync(commandsDir).filter((file) => file.endsWith('.js')).sort();
const failures = [];

for (const file of files) {
  try {
    const exported = require(path.join(commandsDir, file));
    if (typeof exported === 'undefined') throw new Error('module exports undefined');
  } catch (error) {
    failures.push(`${file}: ${error.message}`);
  }
}

try {
  const mainSource = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
  if (mainSource.includes('tictactoeMove(')) {
    failures.push('main.js: stale undefined tictactoeMove call remains');
  }
  if (!mainSource.includes('handleTicTacToeMove(sock, chatId, senderId, String(position))')) {
    failures.push('main.js: .move is not wired to handleTicTacToeMove');
  }
} catch (error) {
  failures.push(`main.js: ${error.message}`);
}

if (failures.length) {
  console.error(`Command smoke test failed (${failures.length} issue(s)):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Command smoke test passed: ${files.length} command modules loaded.`);
}

// Imported commands may register maintenance timers; do not keep the test alive.
setImmediate(() => process.exit(process.exitCode || 0));
