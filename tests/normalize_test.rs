use claude_live::normalize::{normalize_event, NormalizedEvent};
use serde_json::json;

#[test]
fn test_normalize_basic_tool_event() {
    let raw = json!({
        "session_id": "test-session",
        "hook_event_name": "PreToolUse",
        "tool_name": "Read",
        "tool_input": { "file_path": "/src/foo.ts" }
    });
    let event = normalize_event(&raw, "127.0.0.1");
    assert_eq!(event.session_id, "test-session");
    assert_eq!(event.hook_event_name.as_deref(), Some("PreToolUse"));
    assert_eq!(event.tool_name.as_deref(), Some("Read"));
    assert!(!event.id.is_empty());
}

#[test]
fn test_normalize_missing_session_id_generates_fallback() {
    let raw = json!({ "hook_event_name": "Stop" });
    let event = normalize_event(&raw, "192.168.1.1");
    assert!(event.session_id.starts_with("unknown-"));
    // "unknown-" (8 chars) + 8 hex chars = 16 total
    assert_eq!(event.session_id.len(), 16);
}

#[test]
fn test_normalize_file_path_mapped_to_file_path_loaded() {
    let raw = json!({
        "session_id": "s1",
        "hook_event_name": "InstructionsLoaded",
        "file_path": "/home/user/.claude/CLAUDE.md"
    });
    let event = normalize_event(&raw, "127.0.0.1");
    assert_eq!(event.file_path_loaded.as_deref(), Some("/home/user/.claude/CLAUDE.md"));
}

#[test]
fn test_normalize_preserves_all_optional_fields() {
    let raw = json!({
        "session_id": "s1",
        "hook_event_name": "PreToolUse",
        "tool_name": "Bash",
        "tool_input": { "command": "ls" },
        "agent_id": "agent-1",
        "agent_type": "subagent",
        "cwd": "/home/user/project",
        "model": "claude-sonnet-4-6",
        "prompt": "do stuff",
        "compact_summary": "summary text"
    });
    let event = normalize_event(&raw, "127.0.0.1");
    assert_eq!(event.agent_id.as_deref(), Some("agent-1"));
    assert_eq!(event.cwd.as_deref(), Some("/home/user/project"));
    assert_eq!(event.model.as_deref(), Some("claude-sonnet-4-6"));
    assert_eq!(event.compact_summary.as_deref(), Some("summary text"));
}
