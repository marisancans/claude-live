#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');

const packagePath = resolve(__dirname, '../package.json');
const pluginJsonPath = resolve(__dirname, '../.claude-plugin/plugin.json');
const marketplaceJsonPath = resolve(__dirname, '../.claude-plugin/marketplace.json');

// Read package.json to get the version
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const version = packageJson.version;

console.log(`Syncing plugin versions to ${version}...`);

// Update plugin.json
const pluginJson = JSON.parse(readFileSync(pluginJsonPath, 'utf8'));
pluginJson.version = version;
writeFileSync(pluginJsonPath, JSON.stringify(pluginJson, null, 2) + '\n');
console.log(`✓ Updated .claude-plugin/plugin.json`);

// Update marketplace.json
const marketplaceJson = JSON.parse(readFileSync(marketplaceJsonPath, 'utf8'));
marketplaceJson.metadata.version = version;
marketplaceJson.plugins[0].version = version;
writeFileSync(marketplaceJsonPath, JSON.stringify(marketplaceJson, null, 2) + '\n');
console.log(`✓ Updated .claude-plugin/marketplace.json`);

console.log(`Done! Plugin versions are now ${version}`);
