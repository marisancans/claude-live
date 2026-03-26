use crate::broadcast::Broadcaster;
use crate::storage::EventStore;
use crate::websocket::ws_handler;
use crate::hook::hook_handler;
use axum::{
    Router,
    extract::State,
    response::IntoResponse,
    routing::{get, post},
};
use std::path::{Path, PathBuf};
use std::sync::Arc;
use tokio::net::TcpListener;
use tracing::info;
use tower_http::services::{ServeDir, ServeFile};

pub struct AppState {
    pub broadcaster: Broadcaster,
    pub token: Option<String>,
    pub start_time: std::time::Instant,
    pub db_path: PathBuf,
}

pub async fn start_server(
    static_dir: &Path,
    db_path: &Path,
    port: u16,
    token: Option<String>,
) -> (u16, tokio::task::JoinHandle<()>) {
    let state = Arc::new(AppState {
        broadcaster: Broadcaster::new(),
        token,
        start_time: std::time::Instant::now(),
        db_path: db_path.to_path_buf(),
    });

    // SPA fallback: serve index.html for non-file paths
    let index_path = static_dir.join("index.html");
    let serve_dir = ServeDir::new(static_dir)
        .not_found_service(ServeFile::new(&index_path));

    let app = Router::new()
        .route("/hook", post(hook_handler))
        .route("/ws", get(ws_handler))
        .route("/api/stats", get(api_stats))
        .fallback_service(serve_dir)
        .with_state(state.clone());

    // Port 0 = dynamic (for tests); production always passes 43451
    let listener = TcpListener::bind(format!("127.0.0.1:{port}")).await.unwrap();
    let actual_port = listener.local_addr().unwrap().port();
    info!("claude-live server listening on http://127.0.0.1:{actual_port}");

    // Spawn DB polling task
    let poll_state = state.clone();
    tokio::spawn(async move {
        let mut last_id: i64 = 0;

        // Send snapshot on startup
        if let Ok(store) = EventStore::open(&poll_state.db_path) {
            if let Ok((snapshot, max_id)) = store.snapshot(50) {
                last_id = max_id;
                for event in &snapshot {
                    let msg = serde_json::json!({ "type": "event", "data": event }).to_string();
                    poll_state.broadcaster.send(msg);
                }
            }
        }

        // Poll loop
        let mut interval = tokio::time::interval(std::time::Duration::from_millis(100));
        loop {
            interval.tick().await;
            let store = match EventStore::open(&poll_state.db_path) {
                Ok(s) => s,
                Err(_) => continue,
            };
            let (events, max_id) = match store.poll_after(last_id) {
                Ok(r) => r,
                Err(_) => continue,
            };
            if max_id > last_id {
                last_id = max_id;
            }
            for event in &events {
                let msg = serde_json::json!({ "type": "event", "data": event }).to_string();
                poll_state.broadcaster.send(msg);
            }
        }
    });

    let handle = tokio::spawn(async move {
        axum::serve(listener, app).await.unwrap();
    });

    (actual_port, handle)
}

async fn api_stats(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let db_path = state.db_path.clone();
    let stats = tokio::task::spawn_blocking(move || {
        EventStore::open(&db_path).ok().and_then(|s| s.stats().ok())
    }).await.unwrap();

    match stats {
        Some(s) => axum::Json(serde_json::json!(s)).into_response(),
        None => axum::Json(serde_json::json!({ "error": "database not available" })).into_response(),
    }
}
