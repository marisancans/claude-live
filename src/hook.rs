use crate::normalize::normalize_event;
use crate::server::AppState;
use crate::storage::EventStore;
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

    if let Some(ref expected_token) = state.token {
        let provided = raw.get("token").and_then(|v| v.as_str()).unwrap_or("");
        if provided != expected_token {
            // Future: reject unauthorized
        }
    }

    let event = normalize_event(&raw, "127.0.0.1");

    if event.hook_event_name.as_deref() == Some("Diagnostic") {
        if let Some(msg) = raw.get("message").and_then(|v| v.as_str()) {
            info!("[diag] {}", msg);
        }
        return (StatusCode::OK, Json(serde_json::json!({ "ok": true })));
    }

    // Write to SQLite
    let db_path = state.db_path.clone();
    let event_clone = event.clone();
    let _ = tokio::task::spawn_blocking(move || {
        if let Ok(store) = EventStore::open(&db_path) {
            let _ = store.record(&event_clone);
        }
    }).await;

    // Also broadcast directly to connected WS clients
    let msg = serde_json::json!({ "type": "event", "data": event }).to_string();
    state.broadcaster.send(msg);

    (StatusCode::OK, Json(serde_json::json!({ "ok": true })))
}
