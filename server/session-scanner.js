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
    this._externalOnEvent = onEvent;
    this._workflowCleanups = new Map(); // tool_use_id → cleanup fn
    this.onEvent = (event) => {
      if (event.hook_event_name === 'WorkflowLaunched') {
        const cleanup = this.watchWorkflow(event.session_id, event.workflow_dir);
        this._workflowCleanups.set(event.tool_use_id, cleanup);
        return; // don't forward WorkflowLaunched to SSE clients
      }
      if (event.hook_event_name === 'PostToolUse' && event.tool_name === 'Workflow') {
        const cleanup = this._workflowCleanups.get(event.tool_use_id);
        if (cleanup) {
          cleanup();
          this._workflowCleanups.delete(event.tool_use_id);
        }
      }
      this._externalOnEvent(event);
    };
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
    for (const cleanup of this._workflowCleanups.values()) cleanup();
    this._workflowCleanups.clear();
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

  watchWorkflow(sessionId, workflowDir) {
    const innerParsers = new Map(); // agentId → { parser, offset, filePath }
    const knownAgents = new Set();

    const makeStubEvent = (hookName, agentId) => ({
      id: `wf-${hookName}-${Date.now()}-${agentId}`,
      session_id: sessionId,
      timestamp: Date.now(),
      hook_event_name: hookName,
      tool_name: 'Workflow',
      tool_input: null,
      tool_response: null,
      agent_id: agentId,
      agent_type: 'workflow-subagent',
      cwd: null,
      error: null,
      tool_use_id: null,
      prompt: null,
      model: null,
      source: 'jsonl',
      reason: null,
      permission_mode: null,
      is_interrupt: null,
      trigger: null,
      compact_summary: null,
      last_assistant_message: null,
      notification_type: null,
      title: null,
      agent_transcript_path: null,
      memory_type: null,
      workflow_dir: workflowDir,
    });

    const processJournalLine = (line) => {
      if (!line || !line.trim()) return;
      let parsed;
      try { parsed = JSON.parse(line); } catch { return; }

      const { type, agentId } = parsed;
      if (!agentId) return;

      if (type === 'started' && !knownAgents.has(agentId)) {
        knownAgents.add(agentId);
        this._externalOnEvent(makeStubEvent('SubagentStart', agentId));
        const agentFile = join(workflowDir, `agent-${agentId}.jsonl`);
        const agentParser = new TranscriptParser(this._externalOnEvent);
        innerParsers.set(agentId, { parser: agentParser, offset: 0, filePath: agentFile });
        this._readInnerAgentFile(innerParsers.get(agentId));
      }

      if (type === 'result' && knownAgents.has(agentId)) {
        const entry = innerParsers.get(agentId);
        if (entry) this._readInnerAgentFile(entry);
        innerParsers.delete(agentId);
        this._externalOnEvent(makeStubEvent('SubagentStop', agentId));
      }
    };

    const journalPath = join(workflowDir, 'journal.jsonl');
    const journalEntry = { filePath: journalPath, offset: 0, processLine: processJournalLine };
    this._readJournalFile(journalEntry);

    const pollInterval = setInterval(() => {
      this._readJournalFile(journalEntry);
      for (const entry of innerParsers.values()) {
        this._readInnerAgentFile(entry);
      }
    }, POLL_INTERVAL);

    return () => {
      clearInterval(pollInterval);
      for (const agentId of innerParsers.keys()) {
        this._externalOnEvent(makeStubEvent('SubagentStop', agentId));
      }
      innerParsers.clear();
    };
  }

  _readJournalFile(entry) {
    let size;
    try { size = statSync(entry.filePath).size; } catch { return; }
    if (size === entry.offset) return;
    if (size < entry.offset) { entry.offset = 0; }

    const bytesToRead = size - entry.offset;
    const buf = Buffer.alloc(bytesToRead);
    let fd;
    try {
      fd = openSync(entry.filePath, 'r');
      readSync(fd, buf, 0, bytesToRead, entry.offset);
    } finally {
      if (fd !== undefined) closeSync(fd);
    }

    const text = buf.toString('utf8');
    for (const line of text.split('\n')) {
      if (line.trim()) entry.processLine(line);
    }
    entry.offset = size;
  }

  _readInnerAgentFile(entry) {
    if (!entry) return;
    let size;
    try { size = statSync(entry.filePath).size; } catch { return; }
    if (size === entry.offset) return;
    if (size < entry.offset) {
      entry.offset = 0;
      entry.parser = new TranscriptParser(this._externalOnEvent);
    }

    const bytesToRead = size - entry.offset;
    const buf = Buffer.alloc(bytesToRead);
    let fd;
    try {
      fd = openSync(entry.filePath, 'r');
      readSync(fd, buf, 0, bytesToRead, entry.offset);
    } finally {
      if (fd !== undefined) closeSync(fd);
    }

    const text = buf.toString('utf8');
    for (const line of text.split('\n')) {
      if (line.trim()) entry.parser.processLine(line);
    }
    entry.offset = size;
  }
}
