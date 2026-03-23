use crate::assets::{StaticAssets, mime_for_path};
use crate::broadcast::Broadcaster;
use crate::session::SessionManager;
use crate::hook::hook_handler;
use crate::websocket::ws_handler;
use axum::{
    Router,
    extract::State,
    response::{IntoResponse, Response},
    routing::{get, post},
    http::{StatusCode, header},
};
use std::sync::Arc;
use tokio::net::TcpListener;
use tracing::info;

pub struct AppState {
    pub session_manager: SessionManager,
    pub broadcaster: Broadcaster,
    pub token: Option<String>,
    pub start_time: std::time::Instant,
}

pub async fn start_server(
    bind: &str,
    port: u16,
    token: Option<String>,
    buffer_size: usize,
    session_timeout_secs: u64,
) -> (u16, tokio::task::JoinHandle<()>) {
    let state = Arc::new(AppState {
        session_manager: SessionManager::new(buffer_size, session_timeout_secs),
        broadcaster: Broadcaster::new(),
        token,
        start_time: std::time::Instant::now(),
    });

    // Spawn cleanup task
    let cleanup_state = state.clone();
    tokio::spawn(async move {
        loop {
            tokio::time::sleep(std::time::Duration::from_secs(60)).await;
            let removed = cleanup_state.session_manager.cleanup_stale();
            for sid in removed {
                let msg = serde_json::json!({
                    "type": "session_expired",
                    "session_id": sid,
                }).to_string();
                cleanup_state.broadcaster.send(msg);
            }
        }
    });

    let app = Router::new()
        .route("/hook", post(hook_handler))
        .route("/ws", get(ws_handler))
        .route("/api/status", get(api_status))
        .route("/api/sessions", get(api_sessions))
        .route("/api/health", get(api_health))
        .route("/api/stop", post(api_stop))
        .route("/api/reset", post(api_reset))
        .fallback(static_handler)
        .with_state(state);

    let listener = TcpListener::bind(format!("{bind}:{port}")).await.unwrap();
    let actual_port = listener.local_addr().unwrap().port();
    info!("claude-live server listening on http://{bind}:{actual_port}");

    let handle = tokio::spawn(async move {
        axum::serve(listener, app).await.unwrap();
    });

    (actual_port, handle)
}

async fn static_handler(uri: axum::http::Uri) -> Response {
    let path = uri.path().trim_start_matches('/');
    let path = if path.is_empty() { "index.html" } else { path };

    match StaticAssets::get(path) {
        Some(content) => {
            let mime = mime_for_path(path);
            (StatusCode::OK, [(header::CONTENT_TYPE, mime)], content.data.to_vec()).into_response()
        }
        None => {
            // SPA fallback: serve index.html for non-asset paths
            match StaticAssets::get("index.html") {
                Some(content) => {
                    (StatusCode::OK, [(header::CONTENT_TYPE, "text/html")], content.data.to_vec()).into_response()
                }
                None => StatusCode::NOT_FOUND.into_response(),
            }
        }
    }
}

async fn api_status(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let uptime = state.start_time.elapsed().as_secs();
    axum::Json(serde_json::json!({
        "running": true,
        "uptime_secs": uptime,
        "sessions": state.session_manager.session_count(),
        "ws_clients": state.broadcaster.client_count(),
    }))
}

async fn api_sessions(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    axum::Json(state.session_manager.session_info())
}

async fn api_health(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    axum::Json(serde_json::json!({
        "uptime_secs": state.start_time.elapsed().as_secs(),
        "sessions": state.session_manager.session_count(),
        "ws_clients": state.broadcaster.client_count(),
    }))
}

async fn api_stop() -> impl IntoResponse {
    tokio::spawn(async {
        tokio::time::sleep(std::time::Duration::from_millis(100)).await;
        std::process::exit(0);
    });
    axum::Json(serde_json::json!({ "ok": true }))
}

async fn api_reset(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    state.session_manager.reset();
    axum::Json(serde_json::json!({ "ok": true }))
}
