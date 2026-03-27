#!/usr/bin/env node
import { execFileSync } from "child_process";
import { createRequire } from "module";
import { join } from "path";

const PLATFORMS = {
  "linux-x64": "@claude-live/linux-x64",
  "linux-arm64": "@claude-live/linux-arm64",
  "darwin-x64": "@claude-live/darwin-x64",
  "darwin-arm64": "@claude-live/darwin-arm64",
  "win32-x64": "@claude-live/win32-x64",
};

const key = `${process.platform}-${process.arch}`;
const pkg = PLATFORMS[key];

if (!pkg) {
  console.error(`Unsupported platform: ${key}`);
  console.error(`Supported: ${Object.keys(PLATFORMS).join(", ")}`);
  process.exit(1);
}

const require = createRequire(import.meta.url);
let binPath;
try {
  const pkgDir = join(require.resolve(`${pkg}/package.json`), "..");
  const ext = process.platform === "win32" ? ".exe" : "";
  binPath = join(pkgDir, `bin/claude-live${ext}`);
} catch {
  console.error(`Platform package ${pkg} not installed.`);
  console.error(`Try: npm install ${pkg}`);
  process.exit(1);
}

try {
  const result = execFileSync(binPath, process.argv.slice(2), {
    stdio: "inherit",
    env: { ...process.env, CLAUDE_LIVE_STATIC_DIR: join(binPath, "../../client/dist") },
  });
} catch (e) {
  process.exit(e.status ?? 1);
}
