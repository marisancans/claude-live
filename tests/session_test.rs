use claude_live::session::SessionManager;
use claude_live::normalize::normalize_event;
use serde_json::json;

#[test]
fn test_add_event_creates_session() {
    let mgr = SessionManager::new(50, 660);
    let event = normalize_event(&json!({
        "session_id": "s1",
        "hook_event_name": "PreToolUse",
        "tool_name": "Read",
        "tool_input": { "file_path": "/foo.ts" }
    }), "127.0.0.1");
    mgr.add_event(event);
    assert_eq!(mgr.session_count(), 1);
}

#[test]
fn test_buffer_rolls_at_capacity() {
    let mgr = SessionManager::new(3, 660); // buffer size 3
    for i in 0..5 {
        let event = normalize_event(&json!({
            "session_id": "s1",
            "hook_event_name": "PreToolUse",
            "tool_name": "Read",
            "tool_input": { "file_path": format!("/file{i}.ts") }
        }), "127.0.0.1");
        mgr.add_event(event);
    }
    assert_eq!(mgr.event_count("s1"), 3); // capped at 3
}

#[test]
fn test_reset_clears_all() {
    let mgr = SessionManager::new(50, 660);
    let event = normalize_event(&json!({
        "session_id": "s1",
        "hook_event_name": "Stop"
    }), "127.0.0.1");
    mgr.add_event(event);
    mgr.reset();
    assert_eq!(mgr.session_count(), 0);
}

#[test]
fn test_snapshots_returns_all_sessions() {
    let mgr = SessionManager::new(50, 660);
    for sid in ["s1", "s2"] {
        let event = normalize_event(&json!({
            "session_id": sid,
            "hook_event_name": "PreToolUse",
            "tool_name": "Read",
            "tool_input": { "file_path": "/foo.ts" },
            "cwd": "/project"
        }), "127.0.0.1");
        mgr.add_event(event);
    }
    let snaps = mgr.snapshots();
    assert_eq!(snaps.len(), 2);
}
