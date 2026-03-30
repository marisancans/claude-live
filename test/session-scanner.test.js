import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { SessionScanner } from '../server/session-scanner.js';

function makeTmpDir() {
  const dir = join(tmpdir(), `claude-live-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function jsonlLine(sessionId, content) {
  return JSON.stringify({ sessionId, message: { role: 'user', content } }) + '\n';
}

describe('SessionScanner', () => {
  let tmpDir;
  let scanner;
  let events;

  beforeEach(() => {
    tmpDir = makeTmpDir();
    events = [];
  });

  afterEach(() => {
    if (scanner) scanner.stop();
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('discovers existing JSONL files', () => {
    const projDir = join(tmpDir, 'project1');
    mkdirSync(projDir);
    writeFileSync(join(projDir, 'session1.jsonl'), jsonlLine('s1', 'hello'));

    scanner = new SessionScanner(tmpDir, e => events.push(e));
    scanner.scan();

    expect(events.length).toBe(1);
    expect(events[0].hook_event_name).toBe('UserPromptSubmit');
    expect(events[0].prompt).toBe('hello');
    expect(events[0].session_id).toBe('s1');
  });

  it('ignores non-jsonl files', () => {
    const projDir = join(tmpDir, 'project1');
    mkdirSync(projDir);
    writeFileSync(join(projDir, 'notes.txt'), jsonlLine('s1', 'hello'));

    scanner = new SessionScanner(tmpDir, e => events.push(e));
    scanner.scan();

    expect(events.length).toBe(0);
  });

  it('processes multiple project directories', () => {
    const proj1 = join(tmpDir, 'project1');
    const proj2 = join(tmpDir, 'project2');
    mkdirSync(proj1);
    mkdirSync(proj2);
    writeFileSync(join(proj1, 'a.jsonl'), jsonlLine('s1', 'from proj1'));
    writeFileSync(join(proj2, 'b.jsonl'), jsonlLine('s2', 'from proj2'));

    scanner = new SessionScanner(tmpDir, e => events.push(e));
    scanner.scan();

    expect(events.length).toBe(2);
    const prompts = events.map(e => e.prompt).sort();
    expect(prompts).toEqual(['from proj1', 'from proj2']);
  });

  it('tailing picks up new appended lines', () => {
    const projDir = join(tmpDir, 'project1');
    mkdirSync(projDir);
    const file = join(projDir, 'session1.jsonl');
    writeFileSync(file, jsonlLine('s1', 'first'));

    scanner = new SessionScanner(tmpDir, e => events.push(e));
    scanner.scan();
    expect(events.length).toBe(1);

    appendFileSync(file, jsonlLine('s1', 'second'));
    scanner.pollAll();

    expect(events.length).toBe(2);
    expect(events[1].prompt).toBe('second');
  });

  it('does not re-emit already-read content', () => {
    const projDir = join(tmpDir, 'project1');
    mkdirSync(projDir);
    writeFileSync(join(projDir, 'session1.jsonl'), jsonlLine('s1', 'once'));

    scanner = new SessionScanner(tmpDir, e => events.push(e));
    scanner.scan();
    expect(events.length).toBe(1);

    scanner.pollAll();
    expect(events.length).toBe(1);
  });

  it('detects new JSONL files on re-scan', () => {
    const projDir = join(tmpDir, 'project1');
    mkdirSync(projDir);

    scanner = new SessionScanner(tmpDir, e => events.push(e));
    scanner.scan();
    expect(events.length).toBe(0);

    writeFileSync(join(projDir, 'new-session.jsonl'), jsonlLine('s2', 'late'));
    scanner.scan();

    expect(events.length).toBe(1);
    expect(events[0].prompt).toBe('late');
  });

  it('handles file truncation', () => {
    const projDir = join(tmpDir, 'project1');
    mkdirSync(projDir);
    const file = join(projDir, 'session1.jsonl');
    writeFileSync(file, jsonlLine('s1', 'long content here that is quite verbose'));

    scanner = new SessionScanner(tmpDir, e => events.push(e));
    scanner.scan();
    expect(events.length).toBe(1);

    // Overwrite with shorter content
    writeFileSync(file, jsonlLine('s1', 'short'));
    scanner.pollAll();

    expect(events.length).toBe(2);
    expect(events[1].prompt).toBe('short');
  });
});
