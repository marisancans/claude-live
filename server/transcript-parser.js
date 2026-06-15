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

    if (!parsed.sessionId) return;

    const { sessionId } = parsed;
    const agentId = typeof parsed.agentId === 'string' ? parsed.agentId : null;
    const cwd = typeof parsed.cwd === 'string' && parsed.cwd ? parsed.cwd : null;
    const timestamp = this._parseTimestamp(parsed.timestamp);

    // Handle top-level non-message JSONL entries first
    const topType = parsed.type;
    if (topType && topType !== 'user' && topType !== 'assistant') {
      this._handleTopLevelType(sessionId, parsed, topType, agentId, timestamp, cwd);
    }

    if (!parsed.message) return;

    const { message } = parsed;
    const { role, model, content } = message;

    if (role === 'assistant') {
      if (!this.sessionsSeen.has(sessionId) && model) {
        this.sessionsSeen.add(sessionId);
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'SessionStart',
          model,
          agent_id: agentId,
          cwd,
        }));
      }
      // Stop event from JSONL: assistant message with stop_reason end_turn
      const stopReason = message.stop_reason;
      if (stopReason === 'end_turn') {
        // Extract last text block as last_assistant_message
        let lastMsg = null;
        if (Array.isArray(message.content)) {
          for (let i = message.content.length - 1; i >= 0; i--) {
            if (message.content[i].type === 'text' && message.content[i].text) {
              lastMsg = message.content[i].text;
              break;
            }
          }
        }
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'Stop',
          model,
          reason: 'end_turn',
          last_assistant_message: lastMsg,
          agent_id: agentId,
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
          agent_id: agentId,
          cwd,
        }));
      }
      return;
    }

    if (!Array.isArray(content)) return;

    for (const block of content) {
      if (block.type === 'tool_use') {
        this._handleToolUse(sessionId, block, cwd, timestamp, agentId);
      } else if (block.type === 'tool_result') {
        this._handleToolResult(sessionId, block, cwd, timestamp, agentId);
      }
    }
  }

  _handleToolUse(sessionId, block, cwd, timestamp, agentId) {
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
      agent_id: agentId,
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
        agent_id: agentId,
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
        agent_id: agentId,
        cwd,
      }));
    }
  }

  _handleToolResult(sessionId, block, cwd, timestamp, agentId) {
    const { tool_use_id, content, is_error } = block;
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

    const hookName = is_error ? 'PostToolUseFailure' : 'PostToolUse';
    this.onEvent(this._makeEvent(sessionId, {
      timestamp,
      hook_event_name: hookName,
      tool_name: pending.name,
      tool_use_id,
      tool_response: toolResponse,
      error: is_error ? (typeof raw === 'string' ? raw : null) : null,
      agent_id: agentId,
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
          agent_id: agentId,
          cwd,
        }));
      }
    }
  }

  _handleTopLevelType(sessionId, parsed, topType, agentId, timestamp, cwd) {
    if (topType === 'ai-title' || topType === 'custom-title') {
      const title = parsed.aiTitle || parsed.customTitle || parsed.title || null;
      if (title) {
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'AiTitle',
          title,
          agent_id: agentId,
          cwd,
        }));
      }
    } else if (topType === 'pr-link') {
      const url = parsed.prUrl || parsed.url || null;
      this.onEvent(this._makeEvent(sessionId, {
        timestamp,
        hook_event_name: 'PrLink',
        title: url,
        agent_id: agentId,
        cwd,
      }));
    } else if (topType === 'permission-mode') {
      const mode = parsed.permissionMode || null;
      if (mode) {
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'PermissionMode',
          permission_mode: mode,
          agent_id: agentId,
          cwd,
        }));
      }
    } else if (topType === 'mode') {
      const mode = parsed.mode || null;
      if (mode) {
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'ModeChange',
          trigger: mode,
          agent_id: agentId,
          cwd,
        }));
      }
    } else if (topType === 'queue-operation') {
      this.onEvent(this._makeEvent(sessionId, {
        timestamp,
        hook_event_name: 'QueueOperation',
        trigger: typeof parsed.operation === 'string' ? parsed.operation : null,
        prompt: typeof parsed.content === 'string' ? parsed.content : null,
        agent_id: agentId,
        cwd,
      }));
    } else if (topType === 'system') {
      const subtype = parsed.subtype;
      if (subtype === 'turn_duration') {
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'TurnDuration',
          tool_response: { durationMs: parsed.durationMs || null },
          agent_id: agentId,
          cwd,
        }));
      } else if (subtype === 'compact_boundary') {
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'CompactBoundary',
          compact_summary: parsed.content || null,
          agent_id: agentId,
          cwd,
        }));
      } else if (subtype === 'api_error') {
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'ApiError',
          error: typeof parsed.error === 'string' ? parsed.error : JSON.stringify(parsed.error || ''),
          agent_id: agentId,
          cwd,
        }));
      } else if (subtype === 'local_command') {
        // Slash commands like /usage, /compact — pull the command name out of the
        // <command-name>…</command-name> envelope when present.
        let label = null;
        if (typeof parsed.content === 'string') {
          const m = parsed.content.match(/<command-name>([^<]+)<\/command-name>/);
          label = m ? m[1].trim() : parsed.content.slice(0, 120);
        }
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'LocalCommand',
          title: label,
          agent_id: agentId,
          cwd,
        }));
      } else if (subtype === 'away_summary') {
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'AwaySummary',
          title: typeof parsed.content === 'string' ? parsed.content.slice(0, 200) : null,
          agent_id: agentId,
          cwd,
        }));
      } else if (subtype === 'scheduled_task_fire') {
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'ScheduledTask',
          title: typeof parsed.content === 'string' ? parsed.content.slice(0, 200) : null,
          agent_id: agentId,
          cwd,
        }));
      } else if (subtype === 'informational') {
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'Informational',
          title: typeof parsed.content === 'string' ? parsed.content.slice(0, 120) : null,
          agent_id: agentId,
          cwd,
        }));
      } else if (subtype && subtype !== 'stop_hook_summary') {
        // Catch-all so no system subtype is silently dropped (stop_hook_summary
        // is pure hook bookkeeping — intentionally skipped).
        this.onEvent(this._makeEvent(sessionId, {
          timestamp,
          hook_event_name: 'Informational',
          trigger: subtype,
          title: typeof parsed.content === 'string' ? parsed.content.slice(0, 120) : null,
          agent_id: agentId,
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
