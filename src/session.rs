use crate::normalize::NormalizedEvent;
use std::collections::HashSet;
use std::sync::Mutex;

/// Minimal session tracker — no event storage, just tracks known session IDs.
pub struct SessionManager {
    sessions: Mutex<HashSet<String>>,
}

impl SessionManager {
    pub fn new() -> Self {
        Self {
            sessions: Mutex::new(HashSet::new()),
        }
    }

    /// Track that an event was received for this session. Returns the event unchanged.
    pub fn track(&self, event: NormalizedEvent) -> NormalizedEvent {
        self.sessions.lock().unwrap().insert(event.session_id.clone());
        event
    }

    pub fn session_count(&self) -> usize {
        self.sessions.lock().unwrap().len()
    }

    pub fn reset(&self) {
        self.sessions.lock().unwrap().clear();
    }

    pub fn session_ids(&self) -> Vec<String> {
        self.sessions.lock().unwrap().iter().cloned().collect()
    }
}
