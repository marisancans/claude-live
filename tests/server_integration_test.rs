use serde_json::json;

async fn start_test_server() -> (u16, tokio::task::JoinHandle<()>) {
    let (port, handle) = claude_live::server::start_server("127.0.0.1", 0, None, 50, 660).await;
    (port, handle)
}

#[tokio::test]
async fn test_hook_returns_200() {
    let (port, handle) = start_test_server().await;
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
    let (port, handle) = start_test_server().await;
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
    let (port, handle) = start_test_server().await;
    let res = reqwest::get(format!("http://127.0.0.1:{port}/")).await.unwrap();
    assert_eq!(res.status(), 200);
    let body = res.text().await.unwrap();
    assert!(body.contains("html"));
    handle.abort();
}

#[tokio::test]
async fn test_websocket_connects() {
    let (port, handle) = start_test_server().await;
    let (mut ws, _) = tokio_tungstenite::connect_async(
        format!("ws://127.0.0.1:{port}/ws")
    ).await.unwrap();
    // Should receive snapshot message on connect
    use futures_util::StreamExt;
    let msg = ws.next().await.unwrap().unwrap();
    let text = msg.into_text().unwrap();
    let parsed: serde_json::Value = serde_json::from_str(&text).unwrap();
    assert_eq!(parsed["type"], "snapshot");
    handle.abort();
}
