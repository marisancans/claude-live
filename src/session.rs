use crate::normalize::NormalizedEvent;
use std::collections::HashMap;
use std::sync::Mutex;

/// Per-session metadata captured from events.
#[derive(Clone, Default)]
pub struct SessionMeta {
    pub model: Option<String>,
    pub cwd: Option<String>,
    pub source: Option<String>,
}

/// Session tracker — tracks known sessions and their metadata.
pub struct SessionManager {
    sessions: Mutex<HashMap<String, SessionMeta>>,
}

impl SessionManager {
    pub fn new() -> Self {
        Self {
            sessions: Mutex::new(HashMap::new()),
        }
    }

    /// Track that an event was received for this session. Returns the event unchanged.
    pub fn track(&self, event: NormalizedEvent) -> NormalizedEvent {
        let mut sessions = self.sessions.lock().unwrap();
        let meta = sessions.entry(event.session_id.clone()).or_default();
        if let Some(ref m) = event.model {
            meta.model = Some(m.clone());
        }
        if let Some(ref c) = event.cwd {
            meta.cwd = Some(c.clone());
        }
        if let Some(ref s) = event.source {
            meta.source = Some(s.clone());
        }
        event
    }

    pub fn session_count(&self) -> usize {
        self.sessions.lock().unwrap().len()
    }

    pub fn reset(&self) {
        self.sessions.lock().unwrap().clear();
    }

    pub fn session_ids(&self) -> Vec<String> {
        self.sessions.lock().unwrap().keys().cloned().collect()
    }

    /// Get metadata for all active sessions (for WS snapshot on connect).
    pub fn all_sessions(&self) -> Vec<(String, SessionMeta)> {
        self.sessions.lock().unwrap().iter().map(|(k, v)| (k.clone(), v.clone())).collect()
    }
}
