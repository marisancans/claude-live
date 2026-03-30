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

    if (role === 'assistant') {
      if (!this.sessionsSeen.has(sessionId) && model) {
        this.sessionsSeen.add(sessionId);
        this.onEvent(this._makeEvent(sessionId, {
          hook_event_name: 'SessionStart',
          model,
        }));
      }
    }

    if (!content) return;

    if (role === 'user' && typeof content === 'string') {
      this.onEvent(this._makeEvent(sessionId, {
        hook_event_name: 'UserPromptSubmit',
        prompt: content,
      }));
      return;
    }

    if (!Array.isArray(content)) return;

    for (const block of content) {
      if (block.type === 'tool_use') {
        this._handleToolUse(sessionId, block);
      } else if (block.type === 'tool_result') {
        this._handleToolResult(sessionId, block);
      }
    }
  }

  _handleToolUse(sessionId, block) {
    const { name, id, input } = block;
    if (this.seenToolUseIds.has(id)) return;
    this.seenToolUseIds.add(id);

    this.pendingToolCalls.set(id, { name, input });

    this.onEvent(this._makeEvent(sessionId, {
      hook_event_name: 'PreToolUse',
      tool_name: name,
      tool_use_id: id,
      tool_input: input || null,
    }));

    if (name === 'Agent' || name === 'Task') {
      this.onEvent(this._makeEvent(sessionId, {
        hook_event_name: 'SubagentStart',
        tool_name: name,
        tool_use_id: id,
        tool_input: input || null,
        agent_type: (input && (input.subagent_type || input.description)) || null,
      }));
    }
  }

  _handleToolResult(sessionId, block) {
    const { tool_use_id, content } = block;
    const pending = this.pendingToolCalls.get(tool_use_id);
    if (!pending) return;

    this.pendingToolCalls.delete(tool_use_id);

    let responseContent;
    if (Array.isArray(content)) {
      responseContent = content
        .filter(c => c.text)
        .map(c => c.text)
        .join('\n');
    } else {
      responseContent = content;
    }

    this.onEvent(this._makeEvent(sessionId, {
      hook_event_name: 'PostToolUse',
      tool_name: pending.name,
      tool_use_id,
      tool_response: { content: responseContent },
    }));
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
      ...overrides,
    };
  }
}
