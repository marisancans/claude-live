use crate::normalize::NormalizedEvent;
use rusqlite::{Connection, params};
use serde::Serialize;
use std::path::Path;

#[derive(Debug, Serialize)]
pub struct DbStats {
    pub total_events: u64,
    pub total_sessions: u64,
    pub db_size_bytes: u64,
    pub oldest_event_ms: u64,
    pub newest_event_ms: u64,
}

pub struct EventStore {
    conn: Connection,
}

impl EventStore {
    pub fn open(path: &Path) -> Result<Self, rusqlite::Error> {
        let conn = Connection::open(path)?;
        conn.execute_batch(
            "PRAGMA journal_mode=WAL;
             PRAGMA busy_timeout=5000;
             PRAGMA synchronous=NORMAL;"
        )?;
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                timestamp_ms INTEGER NOT NULL,
                json TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);"
        )?;
        Ok(Self { conn })
    }

    pub fn record(&self, event: &NormalizedEvent) -> Result<(), rusqlite::Error> {
        let json = serde_json::to_string(event).unwrap();
        self.conn.execute(
            "INSERT INTO events (session_id, timestamp_ms, json) VALUES (?1, ?2, ?3)",
            params![event.session_id, event.timestamp as i64, json],
        )?;
        Ok(())
    }

    pub fn read_all(&self) -> Result<Vec<NormalizedEvent>, rusqlite::Error> {
        let mut stmt = self.conn.prepare("SELECT json FROM events ORDER BY id ASC")?;
        let events = stmt.query_map([], |row| {
            let json: String = row.get(0)?;
            Ok(serde_json::from_str(&json).unwrap())
        })?.collect::<Result<Vec<_>, _>>()?;
        Ok(events)
    }

    /// Poll for events with id > last_seen_id. Returns (events, max_id).
    pub fn poll_after(&self, last_seen_id: i64) -> Result<(Vec<NormalizedEvent>, i64), rusqlite::Error> {
        let mut stmt = self.conn.prepare(
            "SELECT id, json FROM events WHERE id > ?1 ORDER BY id ASC"
        )?;
        let mut max_id = last_seen_id;
        let events: Vec<NormalizedEvent> = stmt.query_map(params![last_seen_id], |row| {
            let id: i64 = row.get(0)?;
            let json: String = row.get(1)?;
            Ok((id, json))
        })?.filter_map(|r| {
            let (id, json) = r.ok()?;
            if id > max_id { max_id = id; }
            serde_json::from_str(&json).ok()
        }).collect();
        Ok((events, max_id))
    }

    /// Load last `limit` events per session for snapshot on WS connect.
    /// Returns (events_sorted_by_id, max_id).
    pub fn snapshot(&self, limit_per_session: u32) -> Result<(Vec<NormalizedEvent>, i64), rusqlite::Error> {
        let mut stmt = self.conn.prepare("SELECT DISTINCT session_id FROM events")?;
        let session_ids: Vec<String> = stmt.query_map([], |row| {
            row.get(0)
        })?.filter_map(|r| r.ok()).collect();

        let mut all_events: Vec<(i64, NormalizedEvent)> = Vec::new();
        let mut max_id: i64 = 0;

        for sid in &session_ids {
            let mut stmt = self.conn.prepare(
                "SELECT id, json FROM events WHERE session_id = ?1 ORDER BY id DESC LIMIT ?2"
            )?;
            let rows: Vec<(i64, NormalizedEvent)> = stmt.query_map(
                params![sid, limit_per_session],
                |row| {
                    let id: i64 = row.get(0)?;
                    let json: String = row.get(1)?;
                    Ok((id, json))
                }
            )?.filter_map(|r| {
                let (id, json) = r.ok()?;
                let event: NormalizedEvent = serde_json::from_str(&json).ok()?;
                Some((id, event))
            }).collect();

            for (id, event) in rows {
                if id > max_id { max_id = id; }
                all_events.push((id, event));
            }
        }

        all_events.sort_by_key(|(id, _)| *id);
        let events = all_events.into_iter().map(|(_, e)| e).collect();
        Ok((events, max_id))
    }

    /// Get database statistics.
    pub fn stats(&self) -> Result<DbStats, rusqlite::Error> {
        let total_events: u64 = self.conn.query_row(
            "SELECT COUNT(*) FROM events", [], |row| row.get(0)
        )?;
        let total_sessions: u64 = self.conn.query_row(
            "SELECT COUNT(DISTINCT session_id) FROM events", [], |row| row.get(0)
        )?;
        let db_size_bytes: u64 = self.conn.query_row(
            "SELECT page_count * page_size FROM pragma_page_count(), pragma_page_size()", [],
            |row| row.get(0)
        )?;
        let oldest_event_ms: u64 = self.conn.query_row(
            "SELECT COALESCE(MIN(timestamp_ms), 0) FROM events", [], |row| row.get(0)
        )?;
        let newest_event_ms: u64 = self.conn.query_row(
            "SELECT COALESCE(MAX(timestamp_ms), 0) FROM events", [], |row| row.get(0)
        )?;
        Ok(DbStats { total_events, total_sessions, db_size_bytes, oldest_event_ms, newest_event_ms })
    }

    /// Return the current journal mode (for testing WAL is enabled).
    pub fn journal_mode(&self) -> Result<String, rusqlite::Error> {
        self.conn.query_row("PRAGMA journal_mode", [], |row| row.get(0))
    }
}
