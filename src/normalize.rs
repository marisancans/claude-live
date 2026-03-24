use serde::{Deserialize, Serialize};
use serde_json::Value;
use sha2::{Sha256, Digest};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NormalizedEvent {
    pub id: String,
    pub session_id: String,
    pub timestamp: u64,
    pub hook_event_name: Option<String>,
    pub tool_name: Option<String>,
    pub tool_input: Option<Value>,
    pub tool_response: Option<Value>,
    pub agent_id: Option<String>,
    pub agent_type: Option<String>,
    pub cwd: Option<String>,
    pub error: Option<Value>,
    pub tool_use_id: Option<String>,
    pub prompt: Option<String>,
    pub model: Option<String>,
    pub source: Option<String>,
    pub reason: Option<String>,
    pub permission_mode: Option<String>,
    pub is_interrupt: Option<bool>,
    pub trigger: Option<String>,
    pub compact_summary: Option<String>,
    pub last_assistant_message: Option<String>,
    pub notification_type: Option<String>,
    pub title: Option<String>,
    pub agent_transcript_path: Option<String>,
    pub file_path_loaded: Option<String>,
    pub memory_type: Option<String>,
}

fn make_session_id(ip: &str, ts: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(ip.as_bytes());
    hasher.update(ts.as_bytes());
    let result = hasher.finalize();
    format!("unknown-{}", hex::encode(&result[..4]))
}

fn str_field(raw: &Value, key: &str) -> Option<String> {
    raw.get(key).and_then(|v| v.as_str()).map(|s| s.to_string())
}

fn bool_field(raw: &Value, key: &str) -> Option<bool> {
    raw.get(key).and_then(|v| v.as_bool())
}

/// Keep only metadata fields from tool_input — strip large content/code strings.
fn strip_tool_input(v: Option<&Value>) -> Option<Value> {
    let obj = v?.as_object()?;
    let mut out = serde_json::Map::new();
    for key in &["file_path", "path", "pattern", "url", "glob", "command", "description"] {
        if let Some(val) = obj.get(*key) {
            // Truncate string values to 256 chars to avoid passing large commands/paths
            let truncated = val.as_str()
                .map(|s| Value::String(s.chars().take(256).collect()))
                .unwrap_or_else(|| val.clone());
            out.insert(key.to_string(), truncated);
        }
    }
    Some(Value::Object(out))
}

/// Truncate tool_response to a small prefix — the client only needs the first
/// few hundred chars to extract words for the response snake animation.
fn strip_tool_response(v: Option<&Value>) -> Option<Value> {
    let val = v?;
    // If it's an object, truncate any large string fields
    if let Some(obj) = val.as_object() {
        let mut out = serde_json::Map::new();
        for (k, v) in obj {
            let truncated = v.as_str()
                .map(|s| Value::String(s.chars().take(512).collect()))
                .unwrap_or_else(|| v.clone());
            out.insert(k.clone(), truncated);
        }
        return Some(Value::Object(out));
    }
    // If it's a plain string, truncate it
    if let Some(s) = val.as_str() {
        return Some(Value::String(s.chars().take(512).collect()));
    }
    Some(val.clone())
}

pub fn normalize_event(raw: &Value, remote_ip: &str) -> NormalizedEvent {
    let session_id = raw.get("session_id")
        .and_then(|v| v.as_str())
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
        .unwrap_or_else(|| {
            let ts = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_millis()
                .to_string();
            make_session_id(remote_ip, &ts)
        });

    NormalizedEvent {
        id: Uuid::new_v4().to_string(),
        session_id,
        timestamp: std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64,
        hook_event_name: str_field(raw, "hook_event_name"),
        tool_name: str_field(raw, "tool_name"),
        tool_input: strip_tool_input(raw.get("tool_input")),
        tool_response: strip_tool_response(raw.get("tool_response")),
        agent_id: str_field(raw, "agent_id"),
        agent_type: str_field(raw, "agent_type"),
        cwd: str_field(raw, "cwd"),
        error: raw.get("error").cloned(),
        tool_use_id: str_field(raw, "tool_use_id"),
        prompt: str_field(raw, "prompt"),
        model: str_field(raw, "model"),
        source: str_field(raw, "source"),
        reason: str_field(raw, "reason"),
        permission_mode: str_field(raw, "permission_mode"),
        is_interrupt: bool_field(raw, "is_interrupt"),
        trigger: str_field(raw, "trigger"),
        compact_summary: str_field(raw, "compact_summary"),
        last_assistant_message: str_field(raw, "last_assistant_message"),
        notification_type: str_field(raw, "notification_type"),
        title: str_field(raw, "title"),
        agent_transcript_path: str_field(raw, "agent_transcript_path"),
        file_path_loaded: str_field(raw, "file_path"),
        memory_type: str_field(raw, "memory_type"),
    }
}
