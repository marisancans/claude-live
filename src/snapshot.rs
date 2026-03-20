use crate::normalize::NormalizedEvent;
use serde::Serialize;
use std::collections::{HashMap, HashSet};

const RECENT_N: usize = 15;

const DEFAULT_HEX: &str = "#555555";

pub fn tool_color_hex(name: &str) -> &'static str {
    match name {
        "Read" => "#4ade80",
        "Edit" | "Write" => "#60a5fa",
        "Bash" => "#f59e0b",
        "Grep" | "Glob" => "#a78bfa",
        "WebFetch" => "#f472b6",
        "Stop" => "#888888",
        "Notification" => "#34d399",
        "SubagentStart" => "#c084fc",
        "SubagentStop" => "#7c3aed",
        "PostToolUseFailure" => "#f87171",
        "SessionEnd" => "#ef4444",
        "UserPromptSubmit" => "#38bdf8",
        "PreCompact" | "PostCompact" => "#94a3b8",
        "SessionStart" => "#22d3ee",
        "InstructionsLoaded" => "#a3a3a3",
        "WorktreeCreate" => "#86efac",
        "WorktreeRemove" => "#fca5a5",
        _ => DEFAULT_HEX,
    }
}

static FILE_TOOLS: &[&str] = &["Read", "Edit", "Write", "Glob", "Grep"];

fn is_file_tool(name: &str) -> bool {
    FILE_TOOLS.contains(&name)
}

fn input_str<'a>(event: &'a NormalizedEvent, key: &str) -> Option<&'a str> {
    event.tool_input.as_ref()?
        .as_object()?
        .get(key)?
        .as_str()
}

pub fn node_key_for(event: &NormalizedEvent) -> Option<String> {
    if let Some(ref tool) = event.tool_name {
        if is_file_tool(tool) {
            let fp = input_str(event, "file_path")
                .or_else(|| input_str(event, "path"))?;
            return Some(format!("file:{fp}"));
        }
        if tool == "Bash" {
            let cmd = input_str(event, "command").unwrap_or("");
            return Some(format!("bash:{cmd}"));
        }
        if tool == "WebFetch" {
            let url_str = input_str(event, "url").unwrap_or("");
            return match url::Url::parse(url_str) {
                Ok(u) => Some(format!("web:{}", u.host_str().unwrap_or("unknown"))),
                Err(_) => Some("web:unknown".to_string()),
            };
        }
        return Some(format!("tool:{tool}"));
    }
    let hook = event.hook_event_name.as_deref()?;
    match hook {
        "Stop" => Some("session:stop".to_string()),
        "Notification" => {
            let msg = input_str(event, "message").unwrap_or("");
            let truncated: String = msg.chars().take(20).collect();
            Some(format!("notification:{truncated}"))
        }
        _ => None,
    }
}

pub fn node_type_for(event: &NormalizedEvent) -> &'static str {
    if let Some(ref tool) = event.tool_name {
        if is_file_tool(tool) { return "file"; }
        if tool == "Bash" { return "bash"; }
        if tool == "WebFetch" { return "web"; }
        return "tool";
    }
    match event.hook_event_name.as_deref() {
        Some("Stop") => "stop",
        Some("Notification") => "notification",
        _ => "tool",
    }
}

pub fn label_for(event: &NormalizedEvent) -> String {
    if let Some(ref tool) = event.tool_name {
        if is_file_tool(tool) {
            let fp = input_str(event, "file_path")
                .or_else(|| input_str(event, "path"))
                .unwrap_or("");
            return fp.rsplit('/').next().unwrap_or(fp).to_string();
        }
        if tool == "Bash" {
            let cmd = input_str(event, "command").unwrap_or("");
            return format!("$ {}", &cmd[..cmd.len().min(22)]);
        }
        if tool == "WebFetch" {
            let url_str = input_str(event, "url").unwrap_or("");
            return match url::Url::parse(url_str) {
                Ok(u) => format!("↗ {}", u.host_str().unwrap_or("web")),
                Err(_) => "↗ web".to_string(),
            };
        }
        match event.hook_event_name.as_deref() {
            Some("Stop") => return "✓ done".to_string(),
            Some("Notification") => {
                let msg = input_str(event, "message").unwrap_or("notification");
                return msg.chars().take(24).collect();
            }
            _ => {}
        }
        return tool.clone();
    }
    match event.hook_event_name.as_deref() {
        Some("Stop") => "✓ done".to_string(),
        Some("Notification") => {
            let msg = input_str(event, "message").unwrap_or("notification");
            msg.chars().take(24).collect()
        }
        Some(name) => name.to_string(),
        None => "?".to_string(),
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct SnapshotNode {
    pub key: String,
    pub node_type: String,
    pub label: String,
    pub color_hex: String,
    pub base_radius: f64,
}

#[derive(Debug, Clone, Serialize)]
pub struct SessionSnapshot {
    pub session_id: String,
    pub label: String,
    pub cwd: Option<String>,
    pub stopping: bool,
    pub event_count: usize,
    pub nodes: Vec<SnapshotNode>,
}

pub fn compute_session_snapshot(session_id: &str, events: &[NormalizedEvent]) -> Option<SessionSnapshot> {
    if events.is_empty() { return None; }

    let mut label: Option<String> = None;
    let mut cwd: Option<String> = None;
    let mut stopping = false;

    let mut file_nodes: HashMap<String, SnapshotNode> = HashMap::new();

    for event in events.iter() {
        if let Some(ref c) = event.cwd {
            cwd = Some(c.clone());
            if label.is_none() || label.as_ref().is_none_or(|l| l.len() <= 8) {
                if let Some(last) = c.split('/').filter(|p| !p.is_empty()).last() {
                    label = Some(last.to_string());
                }
            }
        }

        match event.hook_event_name.as_deref() {
            Some("Stop") => stopping = true,
            Some("SessionEnd") => {}
            _ => stopping = false,
        }

        let Some(key) = node_key_for(event) else { continue };
        let ntype = node_type_for(event);
        let color_key = event.tool_name.as_deref()
            .or(event.hook_event_name.as_deref())
            .unwrap_or("");
        let color_hex = tool_color_hex(color_key).to_string();

        if ntype == "file" {
            if let Some(existing) = file_nodes.get_mut(&key) {
                existing.base_radius = (existing.base_radius + 0.3).min(8.0);
            } else {
                file_nodes.insert(key.clone(), SnapshotNode {
                    key,
                    node_type: ntype.to_string(),
                    label: label_for(event),
                    color_hex,
                    base_radius: 2.5,
                });
            }
        }
    }

    let mut nodes: Vec<SnapshotNode> = file_nodes.values().cloned().collect();

    // Add recent ephemerals
    let file_keys: HashSet<&String> = file_nodes.keys().collect();
    let mut seen_ephemeral: HashSet<String> = HashSet::new();
    let start = events.len().saturating_sub(RECENT_N);
    for event in &events[start..] {
        let Some(key) = node_key_for(event) else { continue };
        if file_keys.contains(&key) || seen_ephemeral.contains(&key) { continue; }
        let ntype = node_type_for(event);
        let color_key = event.tool_name.as_deref()
            .or(event.hook_event_name.as_deref())
            .unwrap_or("");
        nodes.push(SnapshotNode {
            key: key.clone(),
            node_type: ntype.to_string(),
            label: label_for(event),
            color_hex: tool_color_hex(color_key).to_string(),
            base_radius: 4.0,
        });
        seen_ephemeral.insert(key);
    }

    Some(SessionSnapshot {
        session_id: session_id.to_string(),
        label: label.unwrap_or_else(|| session_id[..8.min(session_id.len())].to_string()),
        cwd,
        stopping,
        event_count: events.len(),
        nodes,
    })
}
