use crate::server::AppState;
use axum::{
    extract::{State, WebSocketUpgrade, ws::Message},
    response::IntoResponse,
};
use std::sync::Arc;
use futures_util::{SinkExt, StreamExt};

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_ws(socket, state))
}

async fn handle_ws(socket: axum::extract::ws::WebSocket, state: Arc<AppState>) {
    let (mut sender, mut receiver) = socket.split();

    // Send snapshot of active sessions so late-joining clients get model/cwd info
    let sessions = state.session_manager.all_sessions();
    for (sid, meta) in sessions {
        let mut obj = serde_json::json!({
            "type": "event",
            "data": {
                "id": format!("snapshot-{}", sid),
                "session_id": sid,
                "timestamp": 0,
                "hook_event_name": "SessionStart",
            }
        });
        if let Some(ref m) = meta.model {
            obj["data"]["model"] = serde_json::Value::String(m.clone());
        }
        if let Some(ref c) = meta.cwd {
            obj["data"]["cwd"] = serde_json::Value::String(c.clone());
        }
        if let Some(ref s) = meta.source {
            obj["data"]["source"] = serde_json::Value::String(s.clone());
        }
        let _ = sender.send(Message::Text(obj.to_string().into())).await;
    }

    // Subscribe to broadcaster
    let mut rx = state.broadcaster.subscribe();

    // Spawn task to forward broadcasts + heartbeats to this client
    let send_task = tokio::spawn(async move {
        let mut heartbeat = tokio::time::interval(std::time::Duration::from_secs(15));
        loop {
            tokio::select! {
                msg = rx.recv() => {
                    match msg {
                        Some(msg) => {
                            if sender.send(Message::Text(msg.into())).await.is_err() { break; }
                        }
                        None => break,
                    }
                }
                _ = heartbeat.tick() => {
                    let hb = r#"{"type":"heartbeat"}"#.to_string();
                    if sender.send(Message::Text(hb.into())).await.is_err() { break; }
                }
            }
        }
    });

    // Read from client (just keep alive, drain messages)
    while let Some(Ok(_msg)) = receiver.next().await {
        // Future: handle client commands here
    }

    send_task.abort();
}
