use claude_live::storage::EventStore;
use claude_live::normalize::normalize_event;
use serde_json::json;
use tempfile::NamedTempFile;

#[test]
fn test_record_and_read_back() {
    let tmp = NamedTempFile::new().unwrap();
    let store = EventStore::open(tmp.path()).unwrap();
    let event = normalize_event(&json!({
        "session_id": "s1",
        "hook_event_name": "PreToolUse",
        "tool_name": "Read",
        "tool_input": { "file_path": "/foo.ts" }
    }), "127.0.0.1");
    store.record(&event).unwrap();
    let events = store.read_all().unwrap();
    assert_eq!(events.len(), 1);
    assert_eq!(events[0].session_id, "s1");
}

#[test]
fn test_preserves_ordering() {
    let tmp = NamedTempFile::new().unwrap();
    let store = EventStore::open(tmp.path()).unwrap();
    for i in 0..10 {
        let event = normalize_event(&json!({
            "session_id": "s1",
            "hook_event_name": "PreToolUse",
            "tool_name": "Read",
            "tool_input": { "file_path": format!("/file{i}.ts") }
        }), "127.0.0.1");
        store.record(&event).unwrap();
    }
    let events = store.read_all().unwrap();
    assert_eq!(events.len(), 10);
    for (i, event) in events.iter().enumerate() {
        let path = event.tool_input.as_ref().unwrap()["file_path"].as_str().unwrap();
        assert_eq!(path, format!("/file{i}.ts"));
    }
}

#[test]
fn test_poll_events_after_id() {
    let tmp = NamedTempFile::new().unwrap();
    let store = EventStore::open(tmp.path()).unwrap();
    for i in 0..5 {
        let event = normalize_event(&json!({
            "session_id": "s1",
            "hook_event_name": "PreToolUse",
            "tool_name": "Read",
            "tool_input": { "file_path": format!("/file{i}.ts") }
        }), "127.0.0.1");
        store.record(&event).unwrap();
    }
    let (events, max_id) = store.poll_after(3).unwrap();
    assert_eq!(events.len(), 2);
    assert_eq!(max_id, 5);
}

#[test]
fn test_poll_empty_returns_zero() {
    let tmp = NamedTempFile::new().unwrap();
    let store = EventStore::open(tmp.path()).unwrap();
    let (events, max_id) = store.poll_after(0).unwrap();
    assert_eq!(events.len(), 0);
    assert_eq!(max_id, 0);
}

#[test]
fn test_snapshot_latest_per_session() {
    let tmp = NamedTempFile::new().unwrap();
    let store = EventStore::open(tmp.path()).unwrap();
    for i in 0..60 {
        let event = normalize_event(&json!({
            "session_id": "s1",
            "hook_event_name": "PreToolUse",
            "tool_name": "Read",
            "tool_input": { "file_path": format!("/file{i}.ts") }
        }), "127.0.0.1");
        store.record(&event).unwrap();
    }
    for i in 0..10 {
        let event = normalize_event(&json!({
            "session_id": "s2",
            "hook_event_name": "PreToolUse",
            "tool_name": "Edit",
            "tool_input": { "file_path": format!("/edit{i}.ts") }
        }), "127.0.0.1");
        store.record(&event).unwrap();
    }
    let (snapshot, max_id) = store.snapshot(50).unwrap();
    let s1_count = snapshot.iter().filter(|e| e.session_id == "s1").count();
    let s2_count = snapshot.iter().filter(|e| e.session_id == "s2").count();
    assert_eq!(s1_count, 50);
    assert_eq!(s2_count, 10);
    assert!(max_id > 0);
}

#[test]
fn test_stats() {
    let tmp = NamedTempFile::new().unwrap();
    let store = EventStore::open(tmp.path()).unwrap();
    for sid in ["s1", "s2", "s1"] {
        let event = normalize_event(&json!({
            "session_id": sid,
            "hook_event_name": "PreToolUse",
            "tool_name": "Read",
            "tool_input": { "file_path": "/foo.ts" }
        }), "127.0.0.1");
        store.record(&event).unwrap();
    }
    let stats = store.stats().unwrap();
    assert_eq!(stats.total_events, 3);
    assert_eq!(stats.total_sessions, 2);
    assert!(stats.db_size_bytes > 0);
    assert!(stats.oldest_event_ms > 0);
    assert!(stats.newest_event_ms >= stats.oldest_event_ms);
}

#[test]
fn test_wal_mode_enabled() {
    let tmp = NamedTempFile::new().unwrap();
    let store = EventStore::open(tmp.path()).unwrap();
    let mode = store.journal_mode().unwrap();
    assert_eq!(mode.to_lowercase(), "wal");
}
