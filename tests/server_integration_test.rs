use serde_json::json;
use tempfile::TempDir;

async fn start_test_server() -> (u16, tokio::task::JoinHandle<()>, TempDir) {
    let tmp = TempDir::new().unwrap();
    let db_path = tmp.path().join("events.db");
    let static_dir = tmp.path().join("static");
    std::fs::create_dir_all(&static_dir).unwrap();
    std::fs::write(static_dir.join("index.html"), "<html>test</html>").unwrap();

    let (port, handle) = claude_live::server::start_server(
        &static_dir, &db_path, 0, None
    ).await;
    (port, handle, tmp)
}

#[tokio::test]
async fn test_hook_returns_200() {
    let (port, handle, _tmp) = start_test_server().await;
    let client = reqwest::Client::new();
    let res = client.post(format!("http://127.0.0.1:{port}/hook"))
        .json(&json!({
            "session_id": "test",
            "hook_event_name": "PreToolUse",
            "tool_name": "Read",
            "tool_input": { "file_path": "/foo.ts" }
        }))
        .send().await.unwrap();
    assert_eq!(res.status(), 200);
    handle.abort();
}

#[tokio::test]
async fn test_hook_returns_400_on_invalid_json() {
    let (port, handle, _tmp) = start_test_server().await;
    let client = reqwest::Client::new();
    let res = client.post(format!("http://127.0.0.1:{port}/hook"))
        .header("content-type", "application/json")
        .body("not json")
        .send().await.unwrap();
    assert_eq!(res.status(), 400);
    handle.abort();
}

#[tokio::test]
async fn test_static_assets_served() {
    let (port, handle, _tmp) = start_test_server().await;
    let res = reqwest::get(format!("http://127.0.0.1:{port}/")).await.unwrap();
    assert_eq!(res.status(), 200);
    let body = res.text().await.unwrap();
    assert!(body.contains("html"));
    handle.abort();
}

#[tokio::test]
async fn test_websocket_connects() {
    let (port, handle, _tmp) = start_test_server().await;
    let (_ws, _) = tokio_tungstenite::connect_async(
        format!("ws://127.0.0.1:{port}/ws")
    ).await.unwrap();
    handle.abort();
}

#[tokio::test]
async fn test_stats_endpoint() {
    let (port, handle, _tmp) = start_test_server().await;
    let res = reqwest::get(format!("http://127.0.0.1:{port}/api/stats")).await.unwrap();
    assert_eq!(res.status(), 200);
    let body: serde_json::Value = res.json().await.unwrap();
    assert_eq!(body["total_events"], 0);
    assert_eq!(body["total_sessions"], 0);
    handle.abort();
}
