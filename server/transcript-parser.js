let idCounter = 0;

export class TranscriptParser {
  constructor(onEvent) {
    this.onEvent = onEvent;
    this.pendingToolCalls = new Map();
    this.seenToolUseIds = new Set();
    this.sessionsSeen = new Set();
  }

  processLine(line) {
    if (!line || !line.trim()) return;

    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch {
      return;
    }

    if (!parsed.message || !parsed.sessionId) return;

    const { sessionId, message } = parsed;
    const { role, model, content } = message;
    const cwd = typeof parsed.cwd === 'string' && parsed.cwd ? parsed.cwd : null;
    const timestamp = this._parseTimestamp(parsed.timestamp);

    if (role === 'assistant') {
      if (!this.sessionsSeen.has(sessionId) && model) {
        this.sessionsSeen.add(sessionId);
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'SessionStart',
          model,
          cwd,
        }));
      }
    }

    if (!content) return;

    if (role === 'user' && typeof content === 'string') {
      if (!this._isSystemContent(content)) {
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'UserPromptSubmit',
          prompt: content,
          cwd,
        }));
      }
      return;
    }

    if (!Array.isArray(content)) return;

    for (const block of content) {
      if (block.type === 'tool_use') {
        this._handleToolUse(sessionId, block, cwd, timestamp);
      } else if (block.type === 'tool_result') {
        this._handleToolResult(sessionId, block, cwd, timestamp);
      }
    }
  }

  _handleToolUse(sessionId, block, cwd, timestamp) {
    const { name, id, input } = block;
    if (this.seenToolUseIds.has(id)) return;
    this.seenToolUseIds.add(id);

    this.pendingToolCalls.set(id, { name, input });

    this.onEvent(this._makeEvent(sessionId, {
      timestamp,
      hook_event_name: 'PreToolUse',
      tool_name: name,
      tool_use_id: id,
      tool_input: input || null,
      cwd,
    }));

    if (name === 'Agent' || name === 'Task') {
      this.onEvent(this._makeEvent(sessionId, {
        timestamp,
        hook_event_name: 'SubagentStart',
        tool_name: name,
        tool_use_id: id,
        tool_input: input || null,
        agent_type: (input && (input.subagent_type || input.description)) || null,
        cwd,
      }));
    }

    if (name === 'Workflow') {
      this.onEvent(this._makeEvent(sessionId, {
        timestamp,
        hook_event_name: 'SubagentStart',
        tool_name: name,
        tool_use_id: id,
        tool_input: input || null,
        agent_type: 'workflow',
        cwd,
      }));
    }
  }

  _handleToolResult(sessionId, block, cwd, timestamp) {
    const { tool_use_id, content } = block;
    const pending = this.pendingToolCalls.get(tool_use_id);
    if (!pending) return;

    this.pendingToolCalls.delete(tool_use_id);

    let raw;
    if (Array.isArray(content)) {
      raw = content.filter(c => c.text).map(c => c.text).join('\n');
    } else {
      raw = content;
    }

    // Try to parse as JSON so structured responses (exitCode, count, etc.) pass through
    let toolResponse;
    if (typeof raw === 'string') {
      try { toolResponse = JSON.parse(raw); } catch { toolResponse = { content: raw }; }
    } else {
      toolResponse = raw != null ? raw : {};
    }

    this.onEvent(this._makeEvent(sessionId, {
      timestamp,
      hook_event_name: 'PostToolUse',
      tool_name: pending.name,
      tool_use_id,
      tool_response: toolResponse,
      cwd,
    }));

    if (pending.name === 'Workflow' && typeof raw === 'string') {
      const match = raw.match(/Transcript dir:\s*(.+)/);
      if (match) {
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'WorkflowLaunched',
          tool_use_id,
          workflow_dir: match[1].trim(),
          cwd,
        }));
      }
    }
  }

  _isSystemContent(text) {
    const t = text.trimStart();
    return t.startsWith('<system-reminder') ||
      t.startsWith('<local-command-caveat') ||
      t.startsWith('<command-name') ||
      t.startsWith('<available-deferred-tools') ||
      t.startsWith('<ide_') ||
      t.startsWith('This session is being continued') ||
      t.startsWith('<local-command-stdout');
  }

  _parseTimestamp(value) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = Date.parse(value);
      if (!Number.isNaN(parsed)) return parsed;
    }
    return Date.now();
  }

  _makeEvent(sessionId, overrides) {
    idCounter++;
    return {
      id: `jsonl-${Date.now()}-${idCounter}`,
      session_id: sessionId,
      timestamp: Date.now(),
      hook_event_name: null,
      tool_name: null,
      tool_input: null,
      tool_response: null,
      agent_id: null,
      agent_type: null,
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
      workflow_dir: null,
      ...overrides,
    };
  }
}
