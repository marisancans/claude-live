import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { TranscriptParser } from '../server/transcript-parser.js';

describe('TranscriptParser', () => {
  let events;
  let parser;

  beforeEach(() => {
    events = [];
    parser = new TranscriptParser((e) => events.push(e));
  });

  it('emits PreToolUse for tool_use blocks', () => {
    parser.processLine(JSON.stringify({
      cwd: '/tmp/project',
      sessionId: 's1', type: 'assistant', uuid: 'a1',
      message: { role: 'assistant', model: 'm', content: [
        { type: 'tool_use', name: 'Read', id: 'tu1', input: { file_path: '/tmp/x' } }
      ]}
    }));
    const pre = events.find(e => e.hook_event_name === 'PreToolUse');
    expect(pre).toBeDefined();
    expect(pre.tool_name).toBe('Read');
    expect(pre.tool_use_id).toBe('tu1');
    expect(pre.tool_input).toEqual({ file_path: '/tmp/x' });
    expect(pre.source).toBe('jsonl');
    expect(pre.session_id).toBe('s1');
    expect(pre.cwd).toBe('/tmp/project');
  });

  it('emits multiple PreToolUse for parallel tool calls', () => {
    parser.processLine(JSON.stringify({
      sessionId: 's1', type: 'assistant', uuid: 'a1',
      message: { role: 'assistant', content: [
        { type: 'tool_use', name: 'Edit', id: 'tu1', input: {} },
        { type: 'tool_use', name: 'Bash', id: 'tu2', input: {} },
      ]}
    }));
    const pres = events.filter(e => e.hook_event_name === 'PreToolUse');
    expect(pres).toHaveLength(2);
    expect(pres[0].tool_name).toBe('Edit');
    expect(pres[1].tool_name).toBe('Bash');
  });

  it('emits PostToolUse matching tool_result to pending call', () => {
    parser.processLine(JSON.stringify({
      sessionId: 's1', type: 'assistant', uuid: 'a1',
      message: { role: 'assistant', content: [
        { type: 'tool_use', name: 'Read', id: 'tu1', input: {} }
      ]}
    }));
    parser.processLine(JSON.stringify({
      sessionId: 's1', type: 'user', uuid: 'u1',
      message: { role: 'user', content: [
        { type: 'tool_result', tool_use_id: 'tu1', content: 'hello' }
      ]}
    }));
    const post = events.find(e => e.hook_event_name === 'PostToolUse');
    expect(post).toBeDefined();
    expect(post.tool_name).toBe('Read');
    expect(post.tool_response).toEqual({ content: 'hello' });
  });

  it('skips orphaned tool_result silently', () => {
    parser.processLine(JSON.stringify({
      sessionId: 's1', type: 'user', uuid: 'u1',
      message: { role: 'user', content: [
        { type: 'tool_result', tool_use_id: 'nonexistent', content: 'x' }
      ]}
    }));
    expect(events).toHaveLength(0);
  });

  it('joins array content in tool_result with newlines', () => {
    parser.processLine(JSON.stringify({
      sessionId: 's1', type: 'assistant', uuid: 'a1',
      message: { role: 'assistant', content: [
        { type: 'tool_use', name: 'Bash', id: 'tu1', input: {} }
      ]}
    }));
    parser.processLine(JSON.stringify({
      sessionId: 's1', type: 'user', uuid: 'u1',
      message: { role: 'user', content: [
        { type: 'tool_result', tool_use_id: 'tu1', content: [
          { text: 'line1' }, { text: 'line2' }
        ]}
      ]}
    }));
    const post = events.find(e => e.hook_event_name === 'PostToolUse');
    expect(post.tool_response.content).toBe('line1\nline2');
  });

  it('emits UserPromptSubmit for string user content', () => {
    parser.processLine(JSON.stringify({
      sessionId: 's1', type: 'user', uuid: 'u1',
      message: { role: 'user', content: 'Hello Claude' }
    }));
    expect(events).toHaveLength(1);
    expect(events[0].hook_event_name).toBe('UserPromptSubmit');
    expect(events[0].prompt).toBe('Hello Claude');
  });

  it('filters out system-injected content from UserPromptSubmit', () => {
    const systemMessages = [
      '<system-reminder>\nSome reminder\n</system-reminder>',
      '<local-command-caveat>Caveat: blah</local-command-caveat>',
      '<command-name>/model</command-name>',
      '<available-deferred-tools>stuff</available-deferred-tools>',
      '<ide_context>vscode stuff</ide_context>',
      'This session is being continued from a previous conversation.',
      '<local-command-stdout>output here</local-command-stdout>',
    ];
    for (const content of systemMessages) {
      parser.processLine(JSON.stringify({
        sessionId: 's1', type: 'user', uuid: `u-${Math.random()}`,
        message: { role: 'user', content }
      }));
    }
    const prompts = events.filter(e => e.hook_event_name === 'UserPromptSubmit');
    expect(prompts).toHaveLength(0);
  });

  it('does not emit UserPromptSubmit for user messages with only tool_results', () => {
    parser.processLine(JSON.stringify({
      sessionId: 's1', type: 'user', uuid: 'u1',
      message: { role: 'user', content: [
        { type: 'tool_result', tool_use_id: 'tu1', content: 'x' }
      ]}
    }));
    const prompts = events.filter(e => e.hook_event_name === 'UserPromptSubmit');
    expect(prompts).toHaveLength(0);
  });

  it('emits SubagentStart for Agent tool_use', () => {
    parser.processLine(JSON.stringify({
      sessionId: 's1', type: 'assistant', uuid: 'a1',
      message: { role: 'assistant', content: [
        { type: 'tool_use', name: 'Agent', id: 'tu1', input: { subagent_type: 'Explore', description: 'search' } }
      ]}
    }));
    const sub = events.find(e => e.hook_event_name === 'SubagentStart');
    expect(sub).toBeDefined();
    expect(sub.agent_type).toBe('Explore');
    const pre = events.find(e => e.hook_event_name === 'PreToolUse');
    expect(pre).toBeDefined();
  });

  it('emits SubagentStart for Workflow tool_use with agent_type workflow', () => {
    parser.processLine(JSON.stringify({
      sessionId: 's1', type: 'assistant', uuid: 'a1',
      message: { role: 'assistant', content: [
        { type: 'tool_use', name: 'Workflow', id: 'wf1', input: { script: 'export const meta = {}' } }
      ]}
    }));
    const sub = events.find(e => e.hook_event_name === 'SubagentStart');
    expect(sub).toBeDefined();
    expect(sub.agent_type).toBe('workflow');
    expect(sub.tool_use_id).toBe('wf1');
    const pre = events.find(e => e.hook_event_name === 'PreToolUse');
    expect(pre).toBeDefined();
    expect(pre.tool_name).toBe('Workflow');
  });

  it('passes through structured JSON tool_response as-is', () => {
    parser.processLine(JSON.stringify({
      sessionId: 's1', type: 'assistant', uuid: 'a1',
      message: { role: 'assistant', content: [
        { type: 'tool_use', name: 'Bash', id: 'tu1', input: { command: 'ls' } }
      ]}
    }));
    parser.processLine(JSON.stringify({
      sessionId: 's1', type: 'user', uuid: 'u1',
      message: { role: 'user', content: [
        { type: 'tool_result', tool_use_id: 'tu1', content: '{"exitCode":0,"stdout":"file.txt"}' }
      ]}
    }));
    const post = events.find(e => e.hook_event_name === 'PostToolUse');
    expect(post.tool_response).toEqual({ exitCode: 0, stdout: 'file.txt' });
  });

  it('deduplicates tool_use by id', () => {
    const line = JSON.stringify({
      sessionId: 's1', type: 'assistant', uuid: 'a1',
      message: { role: 'assistant', content: [
        { type: 'tool_use', name: 'Read', id: 'tu1', input: {} }
      ]}
    });
    parser.processLine(line);
    parser.processLine(line);
    const pres = events.filter(e => e.hook_event_name === 'PreToolUse');
    expect(pres).toHaveLength(1);
  });

  it('emits SessionStart with model on first assistant message', () => {
    parser.processLine(JSON.stringify({
      cwd: '/tmp/demo',
      sessionId: 's1', type: 'assistant', uuid: 'a1',
      message: { role: 'assistant', model: 'claude-sonnet-4-20250514', content: [
        { type: 'text', text: 'hi' }
      ]}
    }));
    const ss = events.find(e => e.hook_event_name === 'SessionStart');
    expect(ss).toBeDefined();
    expect(ss.model).toBe('claude-sonnet-4-20250514');
    expect(ss.cwd).toBe('/tmp/demo');
  });

  it('does not emit duplicate SessionStart', () => {
    const line = (uuid) => JSON.stringify({
      sessionId: 's1', type: 'assistant', uuid,
      message: { role: 'assistant', model: 'claude-sonnet-4-20250514', content: [{ type: 'text', text: 'hi' }] }
    });
    parser.processLine(line('a1'));
    parser.processLine(line('a2'));
    const starts = events.filter(e => e.hook_event_name === 'SessionStart');
    expect(starts).toHaveLength(1);
  });

  it('skips malformed JSON silently', () => {
    parser.processLine('not json at all {{{');
    expect(events).toHaveLength(0);
  });

  it('skips lines with missing message field', () => {
    parser.processLine(JSON.stringify({ sessionId: 's1', type: 'user', uuid: 'u1' }));
    expect(events).toHaveLength(0);
  });

  it('skips empty lines', () => {
    parser.processLine('');
    parser.processLine('  ');
    expect(events).toHaveLength(0);
  });

  it('processes full fixture and produces correct event sequence', () => {
    const fixture = readFileSync(join(import.meta.dirname, 'fixtures/simple-session.jsonl'), 'utf-8');
    const lines = fixture.split('\n').filter(l => l.trim());
    for (const line of lines) {
      parser.processLine(line);
    }

    const types = events.map(e => e.hook_event_name);
    // Line 1: user string content → UserPromptSubmit
    // Line 2: assistant (first) → SessionStart, then tool_use Read → PreToolUse
    // Line 3: user with tool_result for toolu_001 → PostToolUse
    // Line 4: assistant with Edit + Bash → PreToolUse x2
    // Line 5: user with tool_results for toolu_002, toolu_003 → PostToolUse x2
    // Line 6: assistant with Agent → PreToolUse + SubagentStart
    expect(types).toEqual([
      'UserPromptSubmit',
      'SessionStart',
      'PreToolUse',    // Read
      'PostToolUse',   // Read result
      'PreToolUse',    // Edit
      'PreToolUse',    // Bash
      'PostToolUse',   // Edit result
      'PostToolUse',   // Bash result
      'PreToolUse',    // Agent
      'SubagentStart', // Agent subagent
    ]);

    // Verify all events have required fields
    for (const e of events) {
      expect(e.id).toMatch(/^jsonl-/);
      expect(e.session_id).toBe('sess-001');
      expect(e.source).toBe('jsonl');
      expect(e.timestamp).toBeTypeOf('number');
    }
  });
});
