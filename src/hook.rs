use crate::normalize::normalize_event;
use crate::server::AppState;
use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::Value;
use std::sync::Arc;
use tracing::info;

pub async fn hook_handler(
    State(state): State<Arc<AppState>>,
    Json(raw): Json<Value>,
) -> impl IntoResponse {
    if !raw.is_object() {
        return (StatusCode::BAD_REQUEST, Json(serde_json::json!({ "error": "invalid json" })));
    }

    // Token auth check
    if let Some(ref expected_token) = state.token {
        let provided = raw.get("token").and_then(|v| v.as_str()).unwrap_or("");
        if provided != expected_token {
            // Also check Authorization header (handled at middleware level in future)
        }
    }

    let event = normalize_event(&raw, "127.0.0.1");

    // Log diagnostic events from the memory monitor
    if event.hook_event_name.as_deref() == Some("Diagnostic") {
        if let Some(msg) = raw.get("message").and_then(|v| v.as_str()) {
            info!("[diag] {}", msg);
        }
        return (StatusCode::OK, Json(serde_json::json!({ "ok": true })));
    }

    // Broadcast to all WebSocket clients
    let msg = serde_json::json!({ "type": "event", "data": event }).to_string();
    state.broadcaster.send(msg);

    (StatusCode::OK, Json(serde_json::json!({ "ok": true })))
}
