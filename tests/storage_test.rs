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
    // Verify ordering by checking file paths
    for (i, event) in events.iter().enumerate() {
        let path = event.tool_input.as_ref().unwrap()["file_path"].as_str().unwrap();
        assert_eq!(path, format!("/file{i}.ts"));
    }
}
