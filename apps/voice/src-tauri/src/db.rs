use rusqlite::{params, Connection, Result};
use std::path::PathBuf;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct HistoryItem {
    pub id: i32,
    pub text: String,
    pub duration_ms: i64,
    pub speaking_ms: i64,
    pub silence_ms: i64,
    pub effective_duration_ms: i64,
    pub raw_word_count: i32,
    pub clean_word_count: i32,
    pub avg_wpm: f64,
    pub time_saved_ms: i64,
    pub sentiment_label: String,
    pub sentiment_compound: f64,
    pub sentiment_confidence: f64,
    pub timestamp: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct DictionaryItem {
    pub id: i32,
    pub original: String,
    pub replacement: String,
    pub category: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PermissionEvent {
    pub id: i32,
    pub permission_key: String,
    pub event_type: String,
    pub message: String,
    pub source: String,
    pub timestamp: String,
}

fn migrate_history_schema(conn: &Connection) -> Result<()> {
    let migrations = [
        "ALTER TABLE history ADD COLUMN speaking_ms INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE history ADD COLUMN silence_ms INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE history ADD COLUMN effective_duration_ms INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE history ADD COLUMN raw_word_count INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE history ADD COLUMN clean_word_count INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE history ADD COLUMN avg_wpm REAL NOT NULL DEFAULT 0",
        "ALTER TABLE history ADD COLUMN time_saved_ms INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE history ADD COLUMN sentiment_label TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE history ADD COLUMN sentiment_compound REAL NOT NULL DEFAULT 0",
        "ALTER TABLE history ADD COLUMN sentiment_confidence REAL NOT NULL DEFAULT 0",
    ];

    for migration in migrations {
        let _ = conn.execute(migration, []);
    }

    Ok(())
}

pub fn init_db(db_path: PathBuf) -> Result<Connection> {
    let conn = Connection::open(db_path)?;
    
    conn.execute(
        "CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY,
            text TEXT NOT NULL,
            duration_ms INTEGER NOT NULL,
            speaking_ms INTEGER NOT NULL DEFAULT 0,
            silence_ms INTEGER NOT NULL DEFAULT 0,
            effective_duration_ms INTEGER NOT NULL DEFAULT 0,
            raw_word_count INTEGER NOT NULL DEFAULT 0,
            clean_word_count INTEGER NOT NULL DEFAULT 0,
            avg_wpm REAL NOT NULL DEFAULT 0,
            time_saved_ms INTEGER NOT NULL DEFAULT 0,
            sentiment_label TEXT NOT NULL DEFAULT '',
            sentiment_compound REAL NOT NULL DEFAULT 0,
            sentiment_confidence REAL NOT NULL DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )?;

    migrate_history_schema(&conn)?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS dictionary (
            id INTEGER PRIMARY KEY,
            original TEXT NOT NULL UNIQUE,
            replacement TEXT NOT NULL,
            category TEXT
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS permission_events (
            id INTEGER PRIMARY KEY,
            permission_key TEXT NOT NULL,
            event_type TEXT NOT NULL,
            message TEXT NOT NULL,
            source TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )?;

    // Production indexes for frequent query patterns
    conn.execute("CREATE INDEX IF NOT EXISTS idx_history_timestamp ON history(timestamp DESC)", [])?;
    conn.execute("CREATE INDEX IF NOT EXISTS idx_dictionary_original ON dictionary(original ASC)", [])?;
    conn.execute("CREATE INDEX IF NOT EXISTS idx_permission_events_timestamp ON permission_events(timestamp DESC)", [])?;
    conn.execute("CREATE INDEX IF NOT EXISTS idx_permission_events_key ON permission_events(permission_key)", [])?;

    Ok(conn)
}

pub fn add_history(
    conn: &Connection,
    text: &str,
    duration_ms: u64,
    speaking_ms: u64,
    silence_ms: u64,
    effective_duration_ms: u64,
    raw_word_count: usize,
    clean_word_count: usize,
    avg_wpm: f64,
    time_saved_ms: u64,
    sentiment_label: &str,
    sentiment_compound: f64,
    sentiment_confidence: f64,
) -> Result<()> {
    conn.execute(
        "INSERT INTO history (
            text,
            duration_ms,
            speaking_ms,
            silence_ms,
            effective_duration_ms,
            raw_word_count,
            clean_word_count,
            avg_wpm,
            time_saved_ms,
            sentiment_label,
            sentiment_compound,
            sentiment_confidence
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
        params![
            text,
            duration_ms as i64,
            speaking_ms as i64,
            silence_ms as i64,
            effective_duration_ms as i64,
            raw_word_count as i32,
            clean_word_count as i32,
            avg_wpm,
            time_saved_ms as i64,
            sentiment_label,
            sentiment_compound,
            sentiment_confidence,
        ],
    )?;
    Ok(())
}

pub fn get_history(conn: &Connection) -> Result<Vec<HistoryItem>> {
    let mut stmt = conn.prepare(
        "SELECT
            id,
            text,
            duration_ms,
            speaking_ms,
            silence_ms,
            effective_duration_ms,
            raw_word_count,
            clean_word_count,
            avg_wpm,
            time_saved_ms,
            sentiment_label,
            sentiment_compound,
            sentiment_confidence,
            datetime(timestamp, 'localtime')
         FROM history
         ORDER BY timestamp DESC"
    )?;
    let items = stmt.query_map([], |row| {
        Ok(HistoryItem {
            id: row.get(0)?,
            text: row.get(1)?,
            duration_ms: row.get(2)?,
            speaking_ms: row.get(3)?,
            silence_ms: row.get(4)?,
            effective_duration_ms: row.get(5)?,
            raw_word_count: row.get(6)?,
            clean_word_count: row.get(7)?,
            avg_wpm: row.get(8)?,
            time_saved_ms: row.get(9)?,
            sentiment_label: row.get(10)?,
            sentiment_compound: row.get(11)?,
            sentiment_confidence: row.get(12)?,
            timestamp: row.get(13)?,
        })
    })?;

    let mut history = Vec::new();
    for item in items {
        history.push(item?);
    }
    
    Ok(history)
}

pub fn add_permission_event(conn: &Connection, permission_key: &str, event_type: &str, message: &str, source: &str) -> Result<()> {
    conn.execute(
        "INSERT INTO permission_events (permission_key, event_type, message, source) VALUES (?1, ?2, ?3, ?4)",
        params![permission_key, event_type, message, source],
    )?;
    Ok(())
}

pub fn get_permission_events(conn: &Connection) -> Result<Vec<PermissionEvent>> {
    let mut stmt = conn.prepare(
        "SELECT id, permission_key, event_type, message, source, datetime(timestamp, 'localtime')
         FROM permission_events
         ORDER BY timestamp DESC"
    )?;
    let items = stmt.query_map([], |row| {
        Ok(PermissionEvent {
            id: row.get(0)?,
            permission_key: row.get(1)?,
            event_type: row.get(2)?,
            message: row.get(3)?,
            source: row.get(4)?,
            timestamp: row.get(5)?,
        })
    })?;

    let mut events = Vec::new();
    for item in items {
        events.push(item?);
    }

    Ok(events)
}

pub fn add_dictionary_item(conn: &Connection, original: &str, replacement: &str, category: Option<&str>) -> Result<()> {
    conn.execute(
        "INSERT OR REPLACE INTO dictionary (original, replacement, category) VALUES (?1, ?2, ?3)",
        params![original, replacement, category],
    )?;
    Ok(())
}

pub fn get_dictionary(conn: &Connection) -> Result<Vec<DictionaryItem>> {
    let mut stmt = conn.prepare("SELECT id, original, replacement, category FROM dictionary ORDER BY original ASC")?;
    let items = stmt.query_map([], |row| {
        Ok(DictionaryItem {
            id: row.get(0)?,
            original: row.get(1)?,
            replacement: row.get(2)?,
            category: row.get(3)?,
        })
    })?;

    let mut dict = Vec::new();
    for item in items {
        dict.push(item?);
    }
    
    Ok(dict)
}
