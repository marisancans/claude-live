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

    // Send initial snapshot
    let snapshots = state.session_manager.snapshots();
    let snapshot_msg = serde_json::json!({
        "type": "snapshot",
        "sessions": snapshots,
    }).to_string();
    if sender.send(Message::Text(snapshot_msg.into())).await.is_err() {
        return;
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
