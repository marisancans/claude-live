use crate::normalize::NormalizedEvent;
use crate::snapshot::{compute_session_snapshot, SessionSnapshot};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

struct SessionBuffer {
    events: Vec<NormalizedEvent>,
    last_event_time: Instant,
}

pub struct SessionManager {
    buffers: Arc<Mutex<HashMap<String, SessionBuffer>>>,
    buffer_size: usize,
    session_timeout: Duration,
}

impl SessionManager {
    pub fn new(buffer_size: usize, session_timeout_secs: u64) -> Self {
        Self {
            buffers: Arc::new(Mutex::new(HashMap::new())),
            buffer_size,
            session_timeout: Duration::from_secs(session_timeout_secs),
        }
    }

    pub fn add_event(&self, event: NormalizedEvent) -> NormalizedEvent {
        let mut buffers = self.buffers.lock().unwrap();
        let session = buffers.entry(event.session_id.clone()).or_insert_with(|| SessionBuffer {
            events: Vec::new(),
            last_event_time: Instant::now(),
        });
        session.events.push(event.clone());
        session.last_event_time = Instant::now();
        if session.events.len() > self.buffer_size {
            session.events.remove(0);
        }
        event
    }

    pub fn session_count(&self) -> usize {
        self.buffers.lock().unwrap().len()
    }

    pub fn event_count(&self, session_id: &str) -> usize {
        self.buffers.lock().unwrap()
            .get(session_id)
            .map_or(0, |s| s.events.len())
    }

    pub fn reset(&self) {
        self.buffers.lock().unwrap().clear();
    }

    pub fn cleanup_stale(&self) {
        let mut buffers = self.buffers.lock().unwrap();
        buffers.retain(|_, session| session.last_event_time.elapsed() < self.session_timeout);
    }

    pub fn snapshots(&self) -> Vec<SessionSnapshot> {
        let buffers = self.buffers.lock().unwrap();
        buffers.iter()
            .filter_map(|(sid, session)| compute_session_snapshot(sid, &session.events))
            .collect()
    }

    pub fn session_ids(&self) -> Vec<String> {
        self.buffers.lock().unwrap().keys().cloned().collect()
    }

    pub fn session_info(&self) -> Vec<SessionInfo> {
        let buffers = self.buffers.lock().unwrap();
        buffers.iter().map(|(sid, session)| SessionInfo {
            session_id: sid.clone(),
            event_count: session.events.len(),
            last_activity_secs_ago: session.last_event_time.elapsed().as_secs(),
        }).collect()
    }
}

#[derive(Debug, serde::Serialize)]
pub struct SessionInfo {
    pub session_id: String,
    pub event_count: usize,
    pub last_activity_secs_ago: u64,
}
