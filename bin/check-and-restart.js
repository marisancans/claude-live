#!/usr/bin/env node

/**
 * Check if plugin version has changed and restart server if needed
 * Called on SessionStart to ensure server version matches plugin version
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { execSync } from 'child_process';
import { homedir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = dirname(__dirname);
const versionFile = join(homedir(), '.claude', 'claude-live-version.txt');

try {
  // Read current plugin version
  const packageJsonPath = join(pluginRoot, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const currentVersion = packageJson.version;

  // Read last known version
  let lastVersion = '';
  try {
    lastVersion = readFileSync(versionFile, 'utf8').trim();
  } catch {
    // File doesn't exist yet, that's ok
  }

  // If versions differ, restart server
  if (lastVersion && lastVersion !== currentVersion) {
    console.log(`[claude-live] Plugin updated: ${lastVersion} → ${currentVersion}`);
    console.log('[claude-live] Restarting server...');

    // Kill any existing claude-live processes
    try {
      execSync('pkill -f "node.*claude-live" || true', { stdio: 'ignore' });
      // Give it a moment to die
      await new Promise(r => setTimeout(r, 500));
    } catch {
      // Process might not exist
    }
  }

  // Save current version
  mkdirSync(dirname(versionFile), { recursive: true });
  writeFileSync(versionFile, currentVersion);

  // Start server if not running
  const serverUrl = process.env.CLAUDE_LIVE_URL || 'http://localhost:43451';
  try {
    execSync(`curl -sf ${serverUrl}/buffer >/dev/null 2>&1`, { stdio: 'ignore' });
    console.log('[claude-live] Server already running');
  } catch {
    console.log('[claude-live] Starting server...');
    execSync(`npx claude-live@${currentVersion} >/tmp/claude-live.log 2>&1 &`, { stdio: 'ignore' });
  }
} catch (error) {
  console.error('[claude-live] Error:', error.message);
  process.exit(1);
}
