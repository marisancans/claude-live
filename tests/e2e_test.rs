use serde_json::json;
use tempfile::TempDir;
use assert_cmd::Command;
use futures_util::StreamExt;

#[tokio::test]
async fn test_hook_to_server_to_websocket() {
    let tmp = TempDir::new().unwrap();
    let db_path = tmp.path().join("events.db");
    let static_dir = tmp.path().join("static");
    std::fs::create_dir_all(&static_dir).unwrap();
    std::fs::write(static_dir.join("index.html"), "<html>test</html>").unwrap();

    let (port, handle) = claude_live::server::start_server(
        &static_dir, &db_path, 0, None
    ).await;

    let (mut ws, _) = tokio_tungstenite::connect_async(
        format!("ws://127.0.0.1:{port}/ws")
    ).await.unwrap();

    tokio::time::sleep(std::time::Duration::from_millis(50)).await;

    let input = json!({
        "session_id": "e2e-test",
        "hook_event_name": "PostToolUse",
        "tool_name": "Edit",
        "tool_input": { "file_path": "/test.rs" }
    }).to_string();

    Command::cargo_bin("claude-live")
        .unwrap()
        .arg("hook")
        .arg("--db")
        .arg(db_path.to_str().unwrap())
        .write_stdin(input)
        .assert()
        .success();

    tokio::time::sleep(std::time::Duration::from_millis(300)).await;

    let msg = tokio::time::timeout(
        std::time::Duration::from_secs(2),
        ws.next()
    ).await;

    assert!(msg.is_ok(), "Should receive a WebSocket message");
    let msg = msg.unwrap().unwrap().unwrap();
    let text = msg.into_text().unwrap();
    let parsed: serde_json::Value = serde_json::from_str(&text).unwrap();
    assert!(parsed.get("type").is_some(), "Message should have a type field");

    handle.abort();
}

#[tokio::test]
async fn test_stats_endpoint_reflects_hook_writes() {
    let tmp = TempDir::new().unwrap();
    let db_path = tmp.path().join("events.db");
    let static_dir = tmp.path().join("static");
    std::fs::create_dir_all(&static_dir).unwrap();
    std::fs::write(static_dir.join("index.html"), "<html>test</html>").unwrap();

    for i in 0..5 {
        let input = json!({
            "session_id": format!("s{}", i % 2),
            "hook_event_name": "PreToolUse",
            "tool_name": "Read",
            "tool_input": { "file_path": format!("/file{i}.ts") }
        }).to_string();

        Command::cargo_bin("claude-live")
            .unwrap()
            .arg("hook")
            .arg("--db")
            .arg(db_path.to_str().unwrap())
            .write_stdin(input)
            .assert()
            .success();
    }

    let (port, handle) = claude_live::server::start_server(
        &static_dir, &db_path, 0, None
    ).await;

    let res = reqwest::get(format!("http://127.0.0.1:{port}/api/stats"))
        .await.unwrap();
    let stats: serde_json::Value = res.json().await.unwrap();

    assert_eq!(stats["total_events"], 5);
    assert_eq!(stats["total_sessions"], 2);
    assert!(stats["db_size_bytes"].as_u64().unwrap() > 0);

    handle.abort();
}
