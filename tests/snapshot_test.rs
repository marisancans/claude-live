use claude_live::snapshot::*;
use claude_live::normalize::NormalizedEvent;
use serde_json::json;

fn make_event(tool_name: &str, file_path: &str, session_id: &str) -> NormalizedEvent {
    claude_live::normalize::normalize_event(&json!({
        "session_id": session_id,
        "hook_event_name": "PreToolUse",
        "tool_name": tool_name,
        "tool_input": { "file_path": file_path },
        "cwd": "/home/user/project"
    }), "127.0.0.1")
}

#[test]
fn test_node_key_for_file_tools() {
    let e = make_event("Read", "/src/foo.ts", "s1");
    assert_eq!(node_key_for(&e), Some("file:/src/foo.ts".to_string()));
}

#[test]
fn test_node_key_for_bash() {
    let e = claude_live::normalize::normalize_event(&json!({
        "session_id": "s1",
        "hook_event_name": "PreToolUse",
        "tool_name": "Bash",
        "tool_input": { "command": "ls -la" }
    }), "127.0.0.1");
    assert_eq!(node_key_for(&e), Some("bash:ls -la".to_string()));
}

#[test]
fn test_node_key_for_stop() {
    let e = claude_live::normalize::normalize_event(&json!({
        "session_id": "s1",
        "hook_event_name": "Stop"
    }), "127.0.0.1");
    assert_eq!(node_key_for(&e), Some("session:stop".to_string()));
}

#[test]
fn test_compute_snapshot_file_nodes_grow() {
    let events = vec![
        make_event("Read", "/src/foo.ts", "s1"),
        make_event("Edit", "/src/foo.ts", "s1"),
        make_event("Read", "/src/bar.ts", "s1"),
    ];
    let snap = compute_session_snapshot("s1", &events).unwrap();
    assert_eq!(snap.nodes.len(), 2);
    // foo.ts touched twice, should have grown
    let foo = snap.nodes.iter().find(|n| n.key == "file:/src/foo.ts").unwrap();
    assert!(foo.base_radius > 2.5);
}

#[test]
fn test_compute_snapshot_empty_returns_none() {
    let snap = compute_session_snapshot("s1", &[]);
    assert!(snap.is_none());
}

#[test]
fn test_label_for_file_returns_filename() {
    let e = make_event("Read", "/home/user/project/src/main.rs", "s1");
    assert_eq!(label_for(&e), "main.rs");
}
