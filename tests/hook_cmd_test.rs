use assert_cmd::Command;
use tempfile::TempDir;

#[test]
fn test_hook_reads_stdin_and_writes_db() {
    let tmp = TempDir::new().unwrap();
    let db_path = tmp.path().join("events.db");
    let input = r#"{"session_id":"s1","hook_event_name":"PreToolUse","tool_name":"Read","tool_input":{"file_path":"/foo.ts"}}"#;

    Command::cargo_bin("claude-live")
        .unwrap()
        .arg("hook")
        .arg("--db")
        .arg(db_path.to_str().unwrap())
        .write_stdin(input)
        .assert()
        .success();

    let store = claude_live::storage::EventStore::open(&db_path).unwrap();
    let events = store.read_all().unwrap();
    assert_eq!(events.len(), 1);
    assert_eq!(events[0].session_id, "s1");
    assert_eq!(events[0].tool_name.as_deref(), Some("Read"));
}

#[test]
fn test_hook_handles_invalid_json_gracefully() {
    let tmp = TempDir::new().unwrap();
    let db_path = tmp.path().join("events.db");

    Command::cargo_bin("claude-live")
        .unwrap()
        .arg("hook")
        .arg("--db")
        .arg(db_path.to_str().unwrap())
        .write_stdin("not json at all")
        .assert()
        .success();
}

#[test]
fn test_hook_handles_empty_stdin() {
    let tmp = TempDir::new().unwrap();
    let db_path = tmp.path().join("events.db");

    Command::cargo_bin("claude-live")
        .unwrap()
        .arg("hook")
        .arg("--db")
        .arg(db_path.to_str().unwrap())
        .write_stdin("")
        .assert()
        .success();
}
