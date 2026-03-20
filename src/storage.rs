use crate::normalize::NormalizedEvent;
use rusqlite::{Connection, params};
use std::path::Path;

pub struct EventStore {
    conn: Connection,
}

impl EventStore {
    pub fn open(path: &Path) -> Result<Self, rusqlite::Error> {
        let conn = Connection::open(path)?;
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp_ms INTEGER NOT NULL,
                json TEXT NOT NULL
            );"
        )?;
        Ok(Self { conn })
    }

    pub fn record(&self, event: &NormalizedEvent) -> Result<(), rusqlite::Error> {
        let json = serde_json::to_string(event).unwrap();
        self.conn.execute(
            "INSERT INTO events (timestamp_ms, json) VALUES (?1, ?2)",
            params![event.timestamp as i64, json],
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
}
