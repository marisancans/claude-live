use claude_live::session::SessionManager;
use claude_live::normalize::normalize_event;
use serde_json::json;

#[test]
fn test_track_creates_session() {
    let mgr = SessionManager::new();
    let event = normalize_event(&json!({
        "session_id": "s1",
        "hook_event_name": "PreToolUse",
        "tool_name": "Read",
        "tool_input": { "file_path": "/foo.ts" }
    }), "127.0.0.1");
    mgr.track(event);
    assert_eq!(mgr.session_count(), 1);
}

#[test]
fn test_reset_clears_all() {
    let mgr = SessionManager::new();
    let event = normalize_event(&json!({
        "session_id": "s1",
        "hook_event_name": "Stop"
    }), "127.0.0.1");
    mgr.track(event);
    mgr.reset();
    assert_eq!(mgr.session_count(), 0);
}

#[test]
fn test_tracks_multiple_sessions() {
    let mgr = SessionManager::new();
    for sid in ["s1", "s2"] {
        let event = normalize_event(&json!({
            "session_id": sid,
            "hook_event_name": "PreToolUse",
            "tool_name": "Read",
            "tool_input": { "file_path": "/foo.ts" }
        }), "127.0.0.1");
        mgr.track(event);
    }
    assert_eq!(mgr.session_count(), 2);
}
