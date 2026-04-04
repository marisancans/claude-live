import { readdirSync, statSync, openSync, readSync, closeSync, watch } from 'node:fs';
import { join } from 'node:path';
import { TranscriptParser } from './transcript-parser.js';

const MAX_SESSIONS = 50;
const SCAN_INTERVAL = 5000;
const POLL_INTERVAL = 3000;
const ACTIVE_AGE_MS = 10 * 60 * 1000; // Only watch sessions modified in last 10 minutes

export class SessionScanner {
  constructor(projectsDir, onEvent) {
    this.projectsDir = projectsDir;
    this.onEvent = onEvent;
    this.sessions = new Map();
    this._scanTimer = null;
    this._pollTimer = null;
    this._dirWatcher = null;
  }

  start() {
    this.scan();
    this._scanTimer = setInterval(() => this.scan(), SCAN_INTERVAL);
    this._pollTimer = setInterval(() => this.pollAll(), POLL_INTERVAL);
    try {
      this._dirWatcher = watch(this.projectsDir, { recursive: false }, () => {
        this.scan();
      });
    } catch {
      // fs.watch may not be supported
    }
  }

  stop() {
    if (this._scanTimer) { clearInterval(this._scanTimer); this._scanTimer = null; }
    if (this._pollTimer) { clearInterval(this._pollTimer); this._pollTimer = null; }
    if (this._dirWatcher) { this._dirWatcher.close(); this._dirWatcher = null; }
    for (const session of this.sessions.values()) {
      if (session.watcher) { session.watcher.close(); }
    }
    this.sessions.clear();
  }

  scan() {
    let subdirs;
    try {
      subdirs = readdirSync(this.projectsDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
    } catch {
      return;
    }

    // Prune stale sessions (no longer recently modified)
    const now = Date.now();
    for (const [path, session] of this.sessions) {
      try {
        const mtime = statSync(path).mtimeMs;
        if (now - mtime >= ACTIVE_AGE_MS) {
          if (session.watcher) session.watcher.close();
          this.sessions.delete(path);
        }
      } catch {
        if (session.watcher) session.watcher.close();
        this.sessions.delete(path);
      }
    }

    // Collect all JSONL files with their mtimes
    const candidates = [];
    for (const subdir of subdirs) {
      const dirPath = join(this.projectsDir, subdir);
      let files;
      try {
        files = readdirSync(dirPath).filter(f => f.endsWith('.jsonl'));
      } catch {
        continue;
      }
      for (const file of files) {
        const filePath = join(dirPath, file);
        if (this.sessions.has(filePath)) continue;
        try {
          const mtime = statSync(filePath).mtimeMs;
          // Only consider recently active sessions
          if (now - mtime < ACTIVE_AGE_MS) {
            candidates.push({ filePath, mtime });
          }
        } catch { continue; }
      }
    }

    // Sort by most recent first so active sessions get priority
    candidates.sort((a, b) => b.mtime - a.mtime);

    for (const { filePath } of candidates) {
      if (this.sessions.size >= MAX_SESSIONS) break;

      const parser = new TranscriptParser(this.onEvent);
      let watcher = null;
      try {
        watcher = watch(filePath, () => this._readNewLines(this.sessions.get(filePath)));
      } catch { /* ignore */ }

      const session = { filePath, offset: 0, parser, watcher };
      this.sessions.set(filePath, session);
      this._readNewLines(session);
    }
  }

  pollAll() {
    for (const session of this.sessions.values()) {
      this._readNewLines(session);
    }
  }

  _readNewLines(session) {
    if (!session) return;
    let size;
    try {
      size = statSync(session.filePath).size;
    } catch {
      return;
    }

    if (size === session.offset) return;

    if (size < session.offset) {
      session.offset = 0;
      session.parser = new TranscriptParser(this.onEvent);
    }

    const bytesToRead = size - session.offset;
    const buf = Buffer.alloc(bytesToRead);
    let fd;
    try {
      fd = openSync(session.filePath, 'r');
      readSync(fd, buf, 0, bytesToRead, session.offset);
    } finally {
      if (fd !== undefined) closeSync(fd);
    }

    const text = buf.toString('utf8');
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        session.parser.processLine(line);
      }
    }
    session.offset = size;
  }
}
