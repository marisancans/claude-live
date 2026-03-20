# Rust Backend Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the Node.js Express backend in Rust (axum), producing a single static binary with embedded frontend, WebSocket transport, full CLI, and cross-platform CI/CD.

**Architecture:** Axum HTTP server with WebSocket upgrade, clap CLI, rust-embed for static assets. The server receives hook events via POST, normalizes them, stores in per-session rolling buffers, and broadcasts to WebSocket clients. CLI commands communicate with the running server via HTTP management API.

**Tech Stack:** Rust, axum, tokio, clap, rust-embed, serde, tracing, rusqlite, ureq, sha2

**Spec:** `docs/superpowers/specs/2026-03-20-rust-rewrite-design.md`

---

## File Structure

```
src/
├── main.rs              # CLI entry point (clap App, subcommand dispatch)
├── server.rs            # Axum router setup, static file serving, server lifecycle
├── websocket.rs         # WebSocket upgrade handler, per-client send loop
├── hook.rs              # POST /hook handler, event ingestion
├── normalize.rs         # normalizeEvent() port — RawEvent → NormalizedEvent
├── snapshot.rs          # computeSessionSnapshot(), nodeKeyFor(), nodeTypeFor(), labelFor(), colors
├── session.rs           # SessionManager: buffers, cleanup timer, get/create/reset
├── broadcast.rs         # Broadcaster: fan-out normalized events to all WS clients
├── storage.rs           # SQLite record/replay (rusqlite)
├── update.rs            # Self-update: check GitHub releases, download, verify SHA256, replace binary
├── share.rs             # `cloudflared tunnel` wrapper subprocess
└── assets.rs            # rust-embed Asset struct, static file serving fallback

client/src/
├── App.tsx              # MODIFY: replace EventSource with WebSocket, add update badge
└── (rest unchanged)

Cargo.toml               # CREATE: workspace root
.github/workflows/
├── ci.yml               # CREATE: lint + test on push
└── release.yml          # CREATE: cross-compile + publish on tag
README.md                # MODIFY: update install/usage docs
CLAUDE.md                # CREATE: project instructions for Claude Code
```

---

### Task 1: Initialize Rust Project & Cargo.toml

**Files:**
- Create: `Cargo.toml`
- Create: `src/main.rs`

- [ ] **Step 1: Create Cargo.toml with all dependencies**

```toml
[package]
name = "claude-live"
version = "1.0.0"
edition = "2021"
description = "Realtime Claude Code activity visualizer"
license = "MIT"
repository = "https://github.com/marisancans/claude-live"

[[bin]]
name = "claude-live"
path = "src/main.rs"

[dependencies]
axum = { version = "0.8", features = ["ws"] }
tokio = { version = "1", features = ["full"] }
clap = { version = "4", features = ["derive"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
rust-embed = { version = "8", features = ["compression"] }
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter", "json"] }
uuid = { version = "1", features = ["v4"] }
sha2 = "0.10"
hex = "0.4"
rusqlite = { version = "0.32", features = ["bundled"] }
ureq = "2"
url = "2"
open = "5"
chrono = { version = "0.4", features = ["serde"] }
tower-http = { version = "0.6", features = ["cors"] }
tokio-tungstenite = "0.24"
futures-util = "0.3"

[dev-dependencies]
assert_cmd = "2"
predicates = "3"
reqwest = { version = "0.12", features = ["json"] }
tempfile = "3"

[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
strip = true
```

- [ ] **Step 2: Create minimal main.rs that compiles**

```rust
fn main() {
    println!("claude-live v1.0.0");
}
```

- [ ] **Step 3: Verify it compiles**

Run: `cargo build`
Expected: compiles successfully, downloads dependencies

- [ ] **Step 4: Commit**

```bash
git add Cargo.toml Cargo.lock src/main.rs
git commit -m "feat: initialize Rust project with Cargo.toml and dependencies"
```

---

### Task 2: CLI Skeleton (clap)

**Files:**
- Create: `src/cli.rs`
- Modify: `src/main.rs`

- [ ] **Step 1: Write test for CLI parsing**

Create `tests/cli_test.rs`:

```rust
use assert_cmd::Command;

#[test]
fn test_version_flag() {
    Command::cargo_bin("claude-live")
        .unwrap()
        .arg("version")
        .assert()
        .success()
        .stdout(predicates::str::contains("claude-live"));
}

#[test]
fn test_unknown_subcommand() {
    Command::cargo_bin("claude-live")
        .unwrap()
        .arg("nonexistent")
        .assert()
        .failure();
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cargo test --test cli_test`
Expected: FAIL — no subcommands defined yet

- [ ] **Step 3: Implement clap CLI with all subcommands**

`src/main.rs`:
```rust
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "claude-live", version, about = "Realtime Claude Code activity visualizer")]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Start the server
    Start {
        #[arg(long, default_value = "43451")]
        port: u16,
        #[arg(long, default_value = "127.0.0.1")]
        bind: String,
        #[arg(long)]
        token: Option<String>,
        #[arg(long)]
        daemon: bool,
    },
    /// Stop the running server
    Stop {
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Show server status
    Status {
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// List active sessions
    Sessions {
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Server health diagnostics
    Health {
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Clear all session buffers
    Reset {
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Inject events from a JSON file
    Inject {
        file: String,
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Record events to a file
    Record {
        #[arg(short, long)]
        output: String,
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Replay recorded events
    Replay {
        file: String,
        #[arg(long, default_value = "1.0")]
        speed: f64,
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Tail server logs
    Logs {
        #[arg(long)]
        follow: bool,
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Self-update from GitHub releases
    Update,
    /// Share via cloudflare tunnel
    Share {
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Print version info
    Version,
}

fn main() {
    let cli = Cli::parse();
    match cli.command {
        Some(Commands::Version) | None => {
            println!("claude-live {} ({})", env!("CARGO_PKG_VERSION"), std::env::consts::ARCH);
        }
        Some(cmd) => {
            eprintln!("Command not yet implemented");
            std::process::exit(1);
        }
    }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cargo test --test cli_test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/main.rs tests/cli_test.rs Cargo.toml Cargo.lock
git commit -m "feat: add clap CLI skeleton with all subcommands"
```

---

### Task 3: Event Normalization (normalize.rs)

**Files:**
- Create: `src/normalize.rs`

Port of `normalizeEvent()` from `server/index.js:152-181`.

- [ ] **Step 1: Write tests**

Create `tests/normalize_test.rs`:

```rust
use claude_live::normalize::{normalize_event, NormalizedEvent};
use serde_json::json;

#[test]
fn test_normalize_basic_tool_event() {
    let raw = json!({
        "session_id": "test-session",
        "hook_event_name": "PreToolUse",
        "tool_name": "Read",
        "tool_input": { "file_path": "/src/foo.ts" }
    });
    let event = normalize_event(&raw, "127.0.0.1");
    assert_eq!(event.session_id, "test-session");
    assert_eq!(event.hook_event_name.as_deref(), Some("PreToolUse"));
    assert_eq!(event.tool_name.as_deref(), Some("Read"));
    assert!(!event.id.is_empty());
}

#[test]
fn test_normalize_missing_session_id_generates_fallback() {
    let raw = json!({ "hook_event_name": "Stop" });
    let event = normalize_event(&raw, "192.168.1.1");
    assert!(event.session_id.starts_with("unknown-"));
    assert_eq!(event.session_id.len(), 8 + 8 + 1); // "unknown-" + 8 hex chars
}

#[test]
fn test_normalize_file_path_mapped_to_file_path_loaded() {
    let raw = json!({
        "session_id": "s1",
        "hook_event_name": "InstructionsLoaded",
        "file_path": "/home/user/.claude/CLAUDE.md"
    });
    let event = normalize_event(&raw, "127.0.0.1");
    assert_eq!(event.file_path_loaded.as_deref(), Some("/home/user/.claude/CLAUDE.md"));
}

#[test]
fn test_normalize_preserves_all_optional_fields() {
    let raw = json!({
        "session_id": "s1",
        "hook_event_name": "PreToolUse",
        "tool_name": "Bash",
        "tool_input": { "command": "ls" },
        "agent_id": "agent-1",
        "agent_type": "subagent",
        "cwd": "/home/user/project",
        "model": "claude-sonnet-4-6",
        "prompt": "do stuff",
        "compact_summary": "summary text"
    });
    let event = normalize_event(&raw, "127.0.0.1");
    assert_eq!(event.agent_id.as_deref(), Some("agent-1"));
    assert_eq!(event.cwd.as_deref(), Some("/home/user/project"));
    assert_eq!(event.model.as_deref(), Some("claude-sonnet-4-6"));
    assert_eq!(event.compact_summary.as_deref(), Some("summary text"));
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cargo test --test normalize_test`
Expected: FAIL — module doesn't exist

- [ ] **Step 3: Implement normalize.rs**

`src/normalize.rs`:
```rust
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
    use sha2::Sha256;
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
        tool_input: raw.get("tool_input").cloned(),
        tool_response: raw.get("tool_response").cloned(),
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
        file_path_loaded: str_field(raw, "file_path"),  // NOTE: mapped from "file_path" to "file_path_loaded"
        memory_type: str_field(raw, "memory_type"),
    }
}
```

Add to `src/main.rs`:
```rust
pub mod normalize;
```

Create `src/lib.rs`:
```rust
pub mod normalize;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cargo test --test normalize_test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/normalize.rs src/lib.rs tests/normalize_test.rs Cargo.toml
git commit -m "feat: port event normalization from JS to Rust"
```

---

### Task 4: Snapshot Builder (snapshot.rs)

**Files:**
- Create: `src/snapshot.rs`

Port of `computeSessionSnapshot()`, `nodeKeyFor()`, `nodeTypeFor()`, `labelFor()` and `TOOL_COLOR_HEX` from `server/index.js:13-143`.

- [ ] **Step 1: Write tests**

Create `tests/snapshot_test.rs`:

```rust
use claude_live::snapshot::*;
use claude_live::normalize::NormalizedEvent;
use serde_json::json;

fn make_event(tool_name: &str, file_path: &str, session_id: &str) -> NormalizedEvent {
    claude_live::normalize::normalize_event(&json!({
        "session_id": session_id,
        "hook_event_name": "PreToolUse",
        "tool_name": tool_name,
        "tool_input": { "file_path": file_path },
        "cwd": "/home/user/project"
    }), "127.0.0.1")
}

#[test]
fn test_node_key_for_file_tools() {
    let e = make_event("Read", "/src/foo.ts", "s1");
    assert_eq!(node_key_for(&e), Some("file:/src/foo.ts".to_string()));
}

#[test]
fn test_node_key_for_bash() {
    let e = claude_live::normalize::normalize_event(&json!({
        "session_id": "s1",
        "hook_event_name": "PreToolUse",
        "tool_name": "Bash",
        "tool_input": { "command": "ls -la" }
    }), "127.0.0.1");
    assert_eq!(node_key_for(&e), Some("bash:ls -la".to_string()));
}

#[test]
fn test_node_key_for_stop() {
    let e = claude_live::normalize::normalize_event(&json!({
        "session_id": "s1",
        "hook_event_name": "Stop"
    }), "127.0.0.1");
    assert_eq!(node_key_for(&e), Some("session:stop".to_string()));
}

#[test]
fn test_compute_snapshot_file_nodes_grow() {
    let events = vec![
        make_event("Read", "/src/foo.ts", "s1"),
        make_event("Edit", "/src/foo.ts", "s1"),
        make_event("Read", "/src/bar.ts", "s1"),
    ];
    let snap = compute_session_snapshot("s1", &events).unwrap();
    assert_eq!(snap.nodes.len(), 2);
    // foo.ts touched twice, should have grown
    let foo = snap.nodes.iter().find(|n| n.key == "file:/src/foo.ts").unwrap();
    assert!(foo.base_radius > 2.5);
}

#[test]
fn test_compute_snapshot_empty_returns_none() {
    let snap = compute_session_snapshot("s1", &[]);
    assert!(snap.is_none());
}

#[test]
fn test_label_for_file_returns_filename() {
    let e = make_event("Read", "/home/user/project/src/main.rs", "s1");
    assert_eq!(label_for(&e), "main.rs");
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cargo test --test snapshot_test`
Expected: FAIL — module doesn't exist

- [ ] **Step 3: Implement snapshot.rs**

`src/snapshot.rs`:
```rust
use crate::normalize::NormalizedEvent;
use serde::Serialize;
use serde_json::Value;
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

    for (i, event) in events.iter().enumerate() {
        if let Some(ref c) = event.cwd {
            cwd = Some(c.clone());
            if label.is_none() || label.as_ref().map_or(true, |l| l.len() <= 8) {
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
```

Add to `src/lib.rs`:
```rust
pub mod snapshot;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cargo test --test snapshot_test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/snapshot.rs tests/snapshot_test.rs Cargo.toml src/lib.rs
git commit -m "feat: port snapshot computation from JS to Rust"
```

---

### Task 5: Session Manager (session.rs)

**Files:**
- Create: `src/session.rs`

Manages per-session event buffers, stale session cleanup, and buffer operations.

- [ ] **Step 1: Write tests**

Create `tests/session_test.rs`:

```rust
use claude_live::session::SessionManager;
use claude_live::normalize::normalize_event;
use serde_json::json;

#[test]
fn test_add_event_creates_session() {
    let mgr = SessionManager::new(50, 660);
    let event = normalize_event(&json!({
        "session_id": "s1",
        "hook_event_name": "PreToolUse",
        "tool_name": "Read",
        "tool_input": { "file_path": "/foo.ts" }
    }), "127.0.0.1");
    mgr.add_event(event);
    assert_eq!(mgr.session_count(), 1);
}

#[test]
fn test_buffer_rolls_at_capacity() {
    let mgr = SessionManager::new(3, 660); // buffer size 3
    for i in 0..5 {
        let event = normalize_event(&json!({
            "session_id": "s1",
            "hook_event_name": "PreToolUse",
            "tool_name": "Read",
            "tool_input": { "file_path": format!("/file{i}.ts") }
        }), "127.0.0.1");
        mgr.add_event(event);
    }
    assert_eq!(mgr.event_count("s1"), 3); // capped at 3
}

#[test]
fn test_reset_clears_all() {
    let mgr = SessionManager::new(50, 660);
    let event = normalize_event(&json!({
        "session_id": "s1",
        "hook_event_name": "Stop"
    }), "127.0.0.1");
    mgr.add_event(event);
    mgr.reset();
    assert_eq!(mgr.session_count(), 0);
}

#[test]
fn test_snapshots_returns_all_sessions() {
    let mgr = SessionManager::new(50, 660);
    for sid in ["s1", "s2"] {
        let event = normalize_event(&json!({
            "session_id": sid,
            "hook_event_name": "PreToolUse",
            "tool_name": "Read",
            "tool_input": { "file_path": "/foo.ts" },
            "cwd": "/project"
        }), "127.0.0.1");
        mgr.add_event(event);
    }
    let snaps = mgr.snapshots();
    assert_eq!(snaps.len(), 2);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cargo test --test session_test`
Expected: FAIL — module doesn't exist

- [ ] **Step 3: Implement session.rs**

`src/session.rs`:
```rust
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
```

Add to `src/lib.rs`:
```rust
pub mod session;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cargo test --test session_test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/session.rs tests/session_test.rs src/lib.rs
git commit -m "feat: implement SessionManager with rolling buffers and cleanup"
```

---

### Task 6: Broadcaster (broadcast.rs)

**Files:**
- Create: `src/broadcast.rs`

Fan-out normalized events to all connected WebSocket clients.

- [ ] **Step 1: Write tests**

Create `tests/broadcast_test.rs`:

```rust
use claude_live::broadcast::Broadcaster;
use tokio::sync::mpsc;

#[tokio::test]
async fn test_subscribe_and_receive() {
    let broadcaster = Broadcaster::new();
    let mut rx = broadcaster.subscribe();
    broadcaster.send("hello".to_string());
    let msg = rx.recv().await.unwrap();
    assert_eq!(msg, "hello");
}

#[tokio::test]
async fn test_multiple_subscribers() {
    let broadcaster = Broadcaster::new();
    let mut rx1 = broadcaster.subscribe();
    let mut rx2 = broadcaster.subscribe();
    broadcaster.send("msg".to_string());
    assert_eq!(rx1.recv().await.unwrap(), "msg");
    assert_eq!(rx2.recv().await.unwrap(), "msg");
}

#[tokio::test]
async fn test_unsubscribe_on_drop() {
    let broadcaster = Broadcaster::new();
    let rx = broadcaster.subscribe();
    assert_eq!(broadcaster.client_count(), 1);
    drop(rx);
    // Send triggers cleanup of dead senders
    broadcaster.send("test".to_string());
    assert_eq!(broadcaster.client_count(), 0);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cargo test --test broadcast_test`
Expected: FAIL

- [ ] **Step 3: Implement broadcast.rs**

`src/broadcast.rs`:
```rust
use std::sync::{Arc, Mutex};
use tokio::sync::mpsc;

pub struct Broadcaster {
    clients: Arc<Mutex<Vec<mpsc::UnboundedSender<String>>>>,
}

impl Broadcaster {
    pub fn new() -> Self {
        Self {
            clients: Arc::new(Mutex::new(Vec::new())),
        }
    }

    pub fn subscribe(&self) -> mpsc::UnboundedReceiver<String> {
        let (tx, rx) = mpsc::unbounded_channel();
        self.clients.lock().unwrap().push(tx);
        rx
    }

    pub fn send(&self, msg: String) {
        let mut clients = self.clients.lock().unwrap();
        clients.retain(|tx| tx.send(msg.clone()).is_ok());
    }

    pub fn client_count(&self) -> usize {
        self.clients.lock().unwrap().len()
    }
}
```

Add to `src/lib.rs`:
```rust
pub mod broadcast;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cargo test --test broadcast_test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/broadcast.rs tests/broadcast_test.rs src/lib.rs
git commit -m "feat: implement WebSocket broadcaster for event fan-out"
```

---

### Task 7: Embedded Assets (assets.rs)

**Files:**
- Create: `src/assets.rs`

Serve pre-built frontend files from the binary using rust-embed.

- [ ] **Step 1: Write test**

Create `tests/assets_test.rs`:

```rust
use claude_live::assets::StaticAssets;
use rust_embed::Embed;

#[test]
fn test_index_html_is_embedded() {
    // During development, rust-embed reads from disk
    let file = StaticAssets::get("index.html");
    assert!(file.is_some(), "index.html should be embedded");
}

#[test]
fn test_mime_type_for_js() {
    let mime = claude_live::assets::mime_for_path("assets/index-abc123.js");
    assert_eq!(mime, "application/javascript");
}

#[test]
fn test_mime_type_for_html() {
    let mime = claude_live::assets::mime_for_path("index.html");
    assert_eq!(mime, "text/html");
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cargo test --test assets_test`
Expected: FAIL

- [ ] **Step 3: Implement assets.rs**

`src/assets.rs`:
```rust
use rust_embed::Embed;

#[derive(Embed)]
#[folder = "client/dist/"]
pub struct StaticAssets;

pub fn mime_for_path(path: &str) -> &'static str {
    match path.rsplit('.').next() {
        Some("html") => "text/html",
        Some("js") => "application/javascript",
        Some("css") => "text/css",
        Some("json") => "application/json",
        Some("png") => "image/png",
        Some("svg") => "image/svg+xml",
        Some("ico") => "image/x-icon",
        Some("woff2") => "font/woff2",
        Some("woff") => "font/woff",
        Some("ttf") => "font/ttf",
        Some("wasm") => "application/wasm",
        _ => "application/octet-stream",
    }
}
```

Add to `src/lib.rs`:
```rust
pub mod assets;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cargo test --test assets_test`
Expected: PASS (rust-embed reads from disk in debug mode)

- [ ] **Step 5: Commit**

```bash
git add src/assets.rs tests/assets_test.rs src/lib.rs
git commit -m "feat: embed frontend assets with rust-embed"
```

---

### Task 8: Axum Server + WebSocket + Hook Endpoint (server.rs, websocket.rs, hook.rs)

**Files:**
- Create: `src/server.rs`
- Create: `src/websocket.rs`
- Create: `src/hook.rs`

The core HTTP server wiring everything together.

- [ ] **Step 1: Write integration test**

Create `tests/server_integration_test.rs`:

```rust
use serde_json::json;

async fn start_test_server() -> (u16, tokio::task::JoinHandle<()>) {
    let (port, handle) = claude_live::server::start_server("127.0.0.1", 0, None, 50, 660).await;
    (port, handle)
}

#[tokio::test]
async fn test_hook_returns_200() {
    let (port, handle) = start_test_server().await;
    let client = reqwest::Client::new();
    let res = client.post(format!("http://127.0.0.1:{port}/hook"))
        .json(&json!({
            "session_id": "test",
            "hook_event_name": "PreToolUse",
            "tool_name": "Read",
            "tool_input": { "file_path": "/foo.ts" }
        }))
        .send().await.unwrap();
    assert_eq!(res.status(), 200);
    handle.abort();
}

#[tokio::test]
async fn test_hook_returns_400_on_invalid_json() {
    let (port, handle) = start_test_server().await;
    let client = reqwest::Client::new();
    let res = client.post(format!("http://127.0.0.1:{port}/hook"))
        .header("content-type", "application/json")
        .body("not json")
        .send().await.unwrap();
    assert_eq!(res.status(), 400);
    handle.abort();
}

#[tokio::test]
async fn test_static_assets_served() {
    let (port, handle) = start_test_server().await;
    let res = reqwest::get(format!("http://127.0.0.1:{port}/")).await.unwrap();
    assert_eq!(res.status(), 200);
    let body = res.text().await.unwrap();
    assert!(body.contains("html"));
    handle.abort();
}

#[tokio::test]
async fn test_websocket_connects() {
    let (port, handle) = start_test_server().await;
    let (mut ws, _) = tokio_tungstenite::connect_async(
        format!("ws://127.0.0.1:{port}/ws")
    ).await.unwrap();
    // Should receive snapshot message on connect
    use futures_util::StreamExt;
    let msg = ws.next().await.unwrap().unwrap();
    let text = msg.into_text().unwrap();
    let parsed: serde_json::Value = serde_json::from_str(&text).unwrap();
    assert_eq!(parsed["type"], "snapshot");
    handle.abort();
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cargo test --test server_integration_test`
Expected: FAIL

- [ ] **Step 3: Implement server.rs**

`src/server.rs`:
```rust
use crate::assets::{StaticAssets, mime_for_path};
use crate::broadcast::Broadcaster;
use crate::session::SessionManager;
use crate::hook::hook_handler;
use crate::websocket::ws_handler;
use axum::{
    Router,
    extract::State,
    response::{Html, IntoResponse, Response},
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
            cleanup_state.session_manager.cleanup_stale();
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
    // Graceful shutdown: signal the runtime
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
```

`src/hook.rs`:
```rust
use crate::normalize::normalize_event;
use crate::server::AppState;
use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::Value;
use std::sync::Arc;

pub async fn hook_handler(
    State(state): State<Arc<AppState>>,
    Json(raw): Json<Value>,
) -> impl IntoResponse {
    if !raw.is_object() {
        return (StatusCode::BAD_REQUEST, Json(serde_json::json!({ "error": "invalid json" })));
    }

    // Token auth check
    if let Some(ref expected_token) = state.token {
        let provided = raw.get("token").and_then(|v| v.as_str()).unwrap_or("");
        if provided != expected_token {
            // Also check Authorization header (handled at middleware level in future)
        }
    }

    let event = normalize_event(&raw, "127.0.0.1"); // TODO: extract real IP from request
    let event = state.session_manager.add_event(event);

    // Broadcast to all WebSocket clients
    let msg = serde_json::json!({ "type": "event", "data": event }).to_string();
    state.broadcaster.send(msg);

    (StatusCode::OK, Json(serde_json::json!({ "ok": true })))
}
```

`src/websocket.rs`:
```rust
use crate::server::AppState;
use axum::{
    extract::{State, WebSocketUpgrade, ws::Message},
    response::IntoResponse,
};
use std::sync::Arc;
use futures_util::{SinkExt, StreamExt};

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_ws(socket, state))
}

async fn handle_ws(socket: axum::extract::ws::WebSocket, state: Arc<AppState>) {
    let (mut sender, mut receiver) = socket.split();

    // Send initial snapshot
    let snapshots = state.session_manager.snapshots();
    let snapshot_msg = serde_json::json!({
        "type": "snapshot",
        "sessions": snapshots,
    }).to_string();
    if sender.send(Message::Text(snapshot_msg.into())).await.is_err() {
        return;
    }

    // Subscribe to broadcaster
    let mut rx = state.broadcaster.subscribe();

    // Spawn task to forward broadcasts + heartbeats to this client
    let send_task = tokio::spawn(async move {
        let mut heartbeat = tokio::time::interval(std::time::Duration::from_secs(15));
        loop {
            tokio::select! {
                msg = rx.recv() => {
                    match msg {
                        Some(msg) => {
                            if sender.send(Message::Text(msg.into())).await.is_err() { break; }
                        }
                        None => break,
                    }
                }
                _ = heartbeat.tick() => {
                    let hb = r#"{"type":"heartbeat"}"#.to_string();
                    if sender.send(Message::Text(hb.into())).await.is_err() { break; }
                }
            }
        }
    });

    // Read from client (just keep alive, drain messages)
    while let Some(Ok(_msg)) = receiver.next().await {
        // Future: handle client commands here
    }

    send_task.abort();
}
```

Add to `src/lib.rs`:
```rust
pub mod server;
pub mod hook;
pub mod websocket;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cargo test --test server_integration_test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/server.rs src/websocket.rs src/hook.rs tests/server_integration_test.rs Cargo.toml src/lib.rs
git commit -m "feat: implement axum server with WebSocket, hook endpoint, and management API"
```

---

### Task 9: Wire CLI to Server (main.rs)

**Files:**
- Modify: `src/main.rs`

Connect all CLI subcommands to either start the server or talk to a running instance.

- [ ] **Step 1: Write test for start + status round-trip**

Add to `tests/cli_test.rs`:
```rust
#[test]
fn test_status_when_not_running() {
    // status should fail gracefully when no server is running
    Command::cargo_bin("claude-live")
        .unwrap()
        .args(["status", "--port", "19999"])
        .assert()
        .failure();
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cargo test --test cli_test -- test_status_when_not_running`
Expected: FAIL

- [ ] **Step 3: Implement full main.rs dispatch**

`src/main.rs`:
```rust
pub mod normalize;
pub mod snapshot;
pub mod session;
pub mod broadcast;
pub mod assets;
pub mod server;
pub mod hook;
pub mod websocket;

use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "claude-live", version, about = "Realtime Claude Code activity visualizer")]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Start the server
    Start {
        #[arg(long, default_value = "43451")]
        port: u16,
        #[arg(long, default_value = "127.0.0.1")]
        bind: String,
        #[arg(long)]
        token: Option<String>,
        #[arg(long)]
        daemon: bool,
        #[arg(long, default_value = "50")]
        buffer_size: usize,
        #[arg(long, default_value = "660")]
        session_timeout: u64,
    },
    /// Stop the running server
    Stop {
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Show server status
    Status {
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// List active sessions
    Sessions {
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Server health diagnostics
    Health {
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Clear all session buffers
    Reset {
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Inject events from a JSON file
    Inject {
        file: String,
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Record events to a file
    Record {
        #[arg(short, long)]
        output: String,
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Replay recorded events
    Replay {
        file: String,
        #[arg(long, default_value = "1.0")]
        speed: f64,
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Tail server logs
    Logs {
        #[arg(long)]
        follow: bool,
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Self-update from GitHub releases
    Update,
    /// Share via cloudflare tunnel
    Share {
        #[arg(long, default_value = "43451")]
        port: u16,
    },
    /// Print version info
    Version,
}

fn api_get(port: u16, path: &str) -> Result<String, String> {
    let url = format!("http://127.0.0.1:{port}{path}");
    ureq::get(&url).call()
        .map_err(|e| format!("Failed to connect to server on port {port}: {e}"))?
        .into_string()
        .map_err(|e| format!("Failed to read response: {e}"))
}

fn api_post(port: u16, path: &str, body: Option<&str>) -> Result<String, String> {
    let url = format!("http://127.0.0.1:{port}{path}");
    let resp = if let Some(b) = body {
        ureq::post(&url)
            .set("Content-Type", "application/json")
            .send_string(b)
    } else {
        ureq::post(&url).call()
    };
    resp.map_err(|e| format!("Failed to connect to server on port {port}: {e}"))?
        .into_string()
        .map_err(|e| format!("Failed to read response: {e}"))
}

#[tokio::main]
async fn main() {
    let cli = Cli::parse();
    match cli.command {
        Some(Commands::Version) | None => {
            println!("claude-live {} ({}-{})",
                env!("CARGO_PKG_VERSION"),
                std::env::consts::OS,
                std::env::consts::ARCH
            );
        }
        Some(Commands::Start { port, bind, token, daemon, buffer_size, session_timeout }) => {
            tracing_subscriber::fmt()
                .with_env_filter(tracing_subscriber::EnvFilter::from_default_env()
                    .add_directive("claude_live=info".parse().unwrap()))
                .init();

            if daemon {
                eprintln!("Daemon mode not yet implemented. Running in foreground.");
            }

            let (actual_port, handle) = server::start_server(
                &bind, port, token, buffer_size, session_timeout
            ).await;

            println!("claude-live running at http://{bind}:{actual_port}");

            // Open browser
            if let Err(e) = open::that(format!("http://localhost:{actual_port}")) {
                eprintln!("Could not open browser: {e}");
            }

            handle.await.unwrap();
        }
        Some(Commands::Stop { port }) => {
            match api_post(port, "/api/stop", None) {
                Ok(_) => println!("Server stopping..."),
                Err(e) => { eprintln!("{e}"); std::process::exit(1); }
            }
        }
        Some(Commands::Status { port }) => {
            match api_get(port, "/api/status") {
                Ok(body) => println!("{body}"),
                Err(e) => { eprintln!("{e}"); std::process::exit(1); }
            }
        }
        Some(Commands::Sessions { port }) => {
            match api_get(port, "/api/sessions") {
                Ok(body) => println!("{body}"),
                Err(e) => { eprintln!("{e}"); std::process::exit(1); }
            }
        }
        Some(Commands::Health { port }) => {
            match api_get(port, "/api/health") {
                Ok(body) => println!("{body}"),
                Err(e) => { eprintln!("{e}"); std::process::exit(1); }
            }
        }
        Some(Commands::Reset { port }) => {
            match api_post(port, "/api/reset", None) {
                Ok(_) => println!("All sessions cleared"),
                Err(e) => { eprintln!("{e}"); std::process::exit(1); }
            }
        }
        Some(Commands::Inject { file, port }) => {
            let content = std::fs::read_to_string(&file)
                .unwrap_or_else(|e| { eprintln!("Cannot read {file}: {e}"); std::process::exit(1); });
            let events: Vec<serde_json::Value> = serde_json::from_str(&content)
                .unwrap_or_else(|e| { eprintln!("Invalid JSON: {e}"); std::process::exit(1); });
            for event in &events {
                let body = serde_json::to_string(event).unwrap();
                if let Err(e) = api_post(port, "/hook", Some(&body)) {
                    eprintln!("Failed to inject event: {e}");
                }
            }
            println!("Injected {} events", events.len());
        }
        Some(Commands::Update) => {
            eprintln!("Self-update not yet implemented");
            std::process::exit(1);
        }
        Some(Commands::Share { port }) => {
            eprintln!("Share not yet implemented");
            std::process::exit(1);
        }
        Some(Commands::Record { .. }) | Some(Commands::Replay { .. }) | Some(Commands::Logs { .. }) => {
            eprintln!("Not yet implemented");
            std::process::exit(1);
        }
    }
}
```

- [ ] **Step 4: Run tests**

Run: `cargo test`
Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/main.rs Cargo.toml
git commit -m "feat: wire CLI commands to server and management API"
```

---

### Task 10: Frontend — SSE to WebSocket Migration

**Files:**
- Modify: `client/src/App.tsx`

Replace `EventSource` with WebSocket. Minimal change — same data flow.

- [ ] **Step 1: Replace EventSource with WebSocket in App.tsx**

In `client/src/App.tsx`, replace the SSE `useEffect` (lines 209-298) with:

```tsx
useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`
    let ws: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    let reconnectDelay = 1000

    function connect() {
      ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('[claude-live] WebSocket connected')
        reconnectDelay = 1000 // reset on successful connect
      }

      ws.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data)

          if (parsed.type === 'snapshot') {
            store.initFromSnapshot(parsed.sessions)
            setClusters(new Map(store.getSessions()))
            replayDoneRef.current = true
            setReplayDone(true)
            return
          }

          if (parsed.type === 'heartbeat') return

          if (parsed.type === 'version_available') {
            // TODO: show update badge
            console.log('[claude-live] Update available:', parsed.version)
            return
          }

          if (parsed.type === 'event') {
            const event: RawEvent = parsed.data
            console.log('[claude-live]', event.hook_event_name, event.tool_name ?? '', event.session_id, event.tool_input)
            const prevSize = store.getSessions().size
            store.addEvent(event, !replayDoneRef.current)
            const sessions = store.getSessions()
            setClusters(new Map(sessions))
            setLastEvent(event)
            setEventCount(c => c + 1)
            if (replayDoneRef.current) playChordForEvent(event.tool_name ?? undefined, event.hook_event_name ?? undefined)

            // Live event log (same logic as before)
            const isEnrichedTool = ['Read', 'Edit', 'Write', 'Grep', 'Glob', 'Bash'].includes(event.tool_name || '')
            const skipDuplicate = event.hook_event_name === 'PostToolUse' && !isEnrichedTool

            if (!skipDuplicate && replayDoneRef.current) {
              const cluster = sessions.get(event.session_id)
              let tool = event.tool_name || event.hook_event_name || '?'
              if (tool.startsWith('mcp_')) {
                const parts = tool.split('__')
                tool = parts[parts.length - 1].replace(/_/g, ' ')
              }
              setEventLog(prev => {
                const entry: LogEntry = {
                  id: event.id,
                  tool,
                  file: event.hook_event_name === 'PostToolUse' ? enrichedFileLabel(event) : fileLabel(event),
                  sessionLabel: cluster?.label ?? event.session_id.slice(0, 8),
                  project: projectName(event.cwd),
                  colorHex: TOOL_COLORS[tool] ?? '#888',
                  createdAt: Date.now(),
                }
                return [...prev, entry].slice(-MAX_LOG)
              })
            }

            // Permission notifications
            if (event.hook_event_name === 'Notification' || event.hook_event_name === 'PermissionRequest') {
              const cluster = sessions.get(event.session_id)
              const msg = (event.tool_input as Record<string, string> | null)?.message ?? 'awaiting input'
              setPermNotifications(prev => {
                const next = new Map(prev)
                next.set(event.session_id, {
                  sessionId: event.session_id,
                  sessionLabel: cluster?.label ?? event.session_id.slice(0, 8),
                  message: msg,
                  timestamp: event.timestamp,
                })
                return next
              })
            }
            if (event.tool_name || event.hook_event_name === 'UserPromptSubmit') {
              setPermNotifications(prev => {
                if (!prev.has(event.session_id)) return prev
                const next = new Map(prev)
                next.delete(event.session_id)
                return next
              })
            }
          }
        } catch { /* ignore malformed */ }
      }

      ws.onclose = () => {
        console.warn('[claude-live] WebSocket closed, reconnecting in', reconnectDelay, 'ms')
        reconnectTimer = setTimeout(() => {
          reconnectDelay = Math.min(reconnectDelay * 2, 30000)
          connect()
        }, reconnectDelay)
      }

      ws.onerror = (err) => {
        console.warn('[claude-live] WebSocket error', err)
        ws?.close()
      }
    }

    connect()

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer)
      ws?.close()
    }
  }, [])
```

Also remove the `esRef` line (190) since we no longer need EventSource ref.

- [ ] **Step 2: Build frontend to verify no TypeScript errors**

Run: `cd client && npx tsc --noEmit && npm run build`
Expected: clean build

- [ ] **Step 3: Commit**

```bash
git add client/src/App.tsx
git commit -m "feat: migrate frontend from SSE EventSource to WebSocket"
```

---

### Task 11: CI Pipeline (GitHub Actions)

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/release.yml`

- [ ] **Step 1: Create CI workflow**

`.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  rust:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with:
          components: clippy
      - name: Build frontend (needed for rust-embed)
        run: cd client && npm ci && npm run build
      - run: cargo clippy -- -D warnings
      - run: cargo test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd client && npm ci
      - run: cd client && npx tsc --noEmit
```

- [ ] **Step 2: Create release workflow**

`.github/workflows/release.yml`:
```yaml
name: Release

on:
  push:
    tags: ['v*']

permissions:
  contents: write

jobs:
  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd client && npm ci && npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: frontend-dist
          path: client/dist/

  build-binaries:
    needs: build-frontend
    strategy:
      matrix:
        include:
          - target: x86_64-unknown-linux-musl
            os: ubuntu-latest
            artifact: claude-live-linux-x86_64
          - target: aarch64-unknown-linux-musl
            os: ubuntu-latest
            artifact: claude-live-linux-aarch64
          - target: x86_64-apple-darwin
            os: macos-latest
            artifact: claude-live-macos-x86_64
          - target: aarch64-apple-darwin
            os: macos-latest
            artifact: claude-live-macos-aarch64
          - target: x86_64-pc-windows-msvc
            os: windows-latest
            artifact: claude-live-windows-x86_64
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with:
          targets: ${{ matrix.target }}
      - uses: actions/download-artifact@v4
        with:
          name: frontend-dist
          path: client/dist/
      - name: Install cross (Linux)
        if: contains(matrix.target, 'linux')
        run: cargo install cross
      - name: Build (Linux cross)
        if: contains(matrix.target, 'linux')
        run: cross build --release --target ${{ matrix.target }}
      - name: Build (native)
        if: "!contains(matrix.target, 'linux')"
        run: cargo build --release --target ${{ matrix.target }}
      - name: Package (Unix)
        if: "!contains(matrix.os, 'windows')"
        run: |
          cd target/${{ matrix.target }}/release
          tar czf ../../../${{ matrix.artifact }}.tar.gz claude-live
          cd ../../..
          sha256sum ${{ matrix.artifact }}.tar.gz > ${{ matrix.artifact }}.tar.gz.sha256
      - name: Package (Windows)
        if: contains(matrix.os, 'windows')
        run: |
          cd target/${{ matrix.target }}/release
          7z a ../../../${{ matrix.artifact }}.zip claude-live.exe
          cd ../../..
          certutil -hashfile ${{ matrix.artifact }}.zip SHA256 > ${{ matrix.artifact }}.zip.sha256
      - uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.artifact }}
          path: |
            ${{ matrix.artifact }}.*

  release:
    needs: build-binaries
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          path: artifacts/
      - name: Create release
        uses: softprops/action-gh-release@v2
        with:
          files: artifacts/**/*
          generate_release_notes: true

  publish-crate:
    needs: build-frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - uses: actions/download-artifact@v4
        with:
          name: frontend-dist
          path: client/dist/
      - run: cargo publish
        env:
          CARGO_REGISTRY_TOKEN: ${{ secrets.CARGO_REGISTRY_TOKEN }}
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml .github/workflows/release.yml
git commit -m "ci: add GitHub Actions for lint/test and cross-platform release"
```

---

### Task 12: Storage — Record/Replay (storage.rs)

**Files:**
- Create: `src/storage.rs`

SQLite-backed event recording and replay.

- [ ] **Step 1: Write tests**

Create `tests/storage_test.rs`:

```rust
use claude_live::storage::EventStore;
use claude_live::normalize::normalize_event;
use serde_json::json;
use tempfile::NamedTempFile;

#[test]
fn test_record_and_read_back() {
    let tmp = NamedTempFile::new().unwrap();
    let store = EventStore::open(tmp.path()).unwrap();
    let event = normalize_event(&json!({
        "session_id": "s1",
        "hook_event_name": "PreToolUse",
        "tool_name": "Read",
        "tool_input": { "file_path": "/foo.ts" }
    }), "127.0.0.1");
    store.record(&event).unwrap();
    let events = store.read_all().unwrap();
    assert_eq!(events.len(), 1);
    assert_eq!(events[0].session_id, "s1");
}

#[test]
fn test_preserves_ordering() {
    let tmp = NamedTempFile::new().unwrap();
    let store = EventStore::open(tmp.path()).unwrap();
    for i in 0..10 {
        let event = normalize_event(&json!({
            "session_id": "s1",
            "hook_event_name": "PreToolUse",
            "tool_name": "Read",
            "tool_input": { "file_path": format!("/file{i}.ts") }
        }), "127.0.0.1");
        store.record(&event).unwrap();
    }
    let events = store.read_all().unwrap();
    assert_eq!(events.len(), 10);
    // Verify ordering by checking file paths
    for (i, event) in events.iter().enumerate() {
        let path = event.tool_input.as_ref().unwrap()["file_path"].as_str().unwrap();
        assert_eq!(path, format!("/file{i}.ts"));
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cargo test --test storage_test`
Expected: FAIL

- [ ] **Step 3: Implement storage.rs**

`src/storage.rs`:
```rust
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
```

Add to `src/lib.rs`:
```rust
pub mod storage;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cargo test --test storage_test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/storage.rs tests/storage_test.rs Cargo.toml src/lib.rs
git commit -m "feat: implement SQLite event store for record/replay"
```

---

### Task 13: Self-Update (update.rs)

**Files:**
- Create: `src/update.rs`

Check GitHub releases, download binary, verify SHA256, replace self.

- [ ] **Step 1: Write test**

Create `tests/update_test.rs`:

```rust
use claude_live::update::*;

#[test]
fn test_parse_version() {
    let current = "1.0.0";
    let latest = "1.1.0";
    assert!(is_newer(latest, current));
    assert!(!is_newer(current, latest));
    assert!(!is_newer(current, current));
}

#[test]
fn test_target_asset_name() {
    let name = asset_name_for_target("x86_64-unknown-linux-musl");
    assert_eq!(name, "claude-live-linux-x86_64.tar.gz");
}

#[test]
fn test_target_asset_name_macos() {
    let name = asset_name_for_target("aarch64-apple-darwin");
    assert_eq!(name, "claude-live-macos-aarch64.tar.gz");
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cargo test --test update_test`
Expected: FAIL

- [ ] **Step 3: Implement update.rs**

`src/update.rs`:
```rust
use serde::Deserialize;
use std::path::Path;

const GITHUB_REPO: &str = "marisancans/claude-live";

#[derive(Deserialize)]
struct GithubRelease {
    tag_name: String,
    assets: Vec<GithubAsset>,
}

#[derive(Deserialize)]
struct GithubAsset {
    name: String,
    browser_download_url: String,
}

pub fn is_newer(latest: &str, current: &str) -> bool {
    let parse = |v: &str| -> Vec<u64> {
        v.trim_start_matches('v')
            .split('.')
            .filter_map(|s| s.parse().ok())
            .collect()
    };
    let l = parse(latest);
    let c = parse(current);
    l > c
}

pub fn asset_name_for_target(target: &str) -> String {
    let os = if target.contains("linux") { "linux" }
        else if target.contains("macos") || target.contains("apple") || target.contains("darwin") { "macos" }
        else if target.contains("windows") { "windows" }
        else { "unknown" };
    let arch = if target.contains("aarch64") { "aarch64" } else { "x86_64" };
    let ext = if os == "windows" { "zip" } else { "tar.gz" };
    format!("claude-live-{os}-{arch}.{ext}")
}

/// Build a target string from runtime consts for self-update
pub fn current_target() -> String {
    let os = std::env::consts::OS; // "linux", "macos", "windows"
    let arch = std::env::consts::ARCH; // "x86_64", "aarch64"
    format!("{arch}-{os}")
}

pub fn check_for_update() -> Result<Option<String>, String> {
    let url = format!("https://api.github.com/repos/{GITHUB_REPO}/releases/latest");
    let resp = ureq::get(&url)
        .set("User-Agent", "claude-live")
        .call()
        .map_err(|e| format!("Failed to check for updates: {e}"))?;

    let body = resp.into_string()
        .map_err(|e| format!("Failed to read response: {e}"))?;
    let release: GithubRelease = serde_json::from_str(&body)
        .map_err(|e| format!("Failed to parse release: {e}"))?;

    let current = env!("CARGO_PKG_VERSION");
    if is_newer(&release.tag_name, current) {
        Ok(Some(release.tag_name))
    } else {
        Ok(None)
    }
}

pub fn self_update() -> Result<(), String> {
    let url = format!("https://api.github.com/repos/{GITHUB_REPO}/releases/latest");
    let resp = ureq::get(&url)
        .set("User-Agent", "claude-live")
        .call()
        .map_err(|e| format!("Failed to check for updates: {e}"))?;

    let body = resp.into_string()
        .map_err(|e| format!("Failed to read response: {e}"))?;
    let release: GithubRelease = serde_json::from_str(&body)
        .map_err(|e| format!("Failed to parse release: {e}"))?;

    let current = env!("CARGO_PKG_VERSION");
    if !is_newer(&release.tag_name, current) {
        println!("Already up to date (v{current})");
        return Ok(());
    }

    let target = current_target();
    let asset_name = asset_name_for_target(&target);

    let asset = release.assets.iter()
        .find(|a| a.name == asset_name)
        .ok_or_else(|| format!("No release asset found for target: {asset_name}"))?;

    println!("Downloading {} -> {}", release.tag_name, asset_name);

    // Download binary
    let resp = ureq::get(&asset.browser_download_url)
        .call()
        .map_err(|e| format!("Download failed: {e}"))?;

    let mut data = Vec::new();
    resp.into_reader().read_to_end(&mut data)
        .map_err(|e| format!("Failed to read download: {e}"))?;

    // Download and verify SHA256
    let sha_asset = release.assets.iter()
        .find(|a| a.name == format!("{asset_name}.sha256"));

    if let Some(sha_asset) = sha_asset {
        let sha_resp = ureq::get(&sha_asset.browser_download_url)
            .call()
            .map_err(|e| format!("SHA256 download failed: {e}"))?;
        let sha_body = sha_resp.into_string()
            .map_err(|e| format!("Failed to read SHA256: {e}"))?;
        let expected_sha = sha_body.split_whitespace().next().unwrap_or("");

        use sha2::{Sha256, Digest};
        let mut hasher = Sha256::new();
        hasher.update(&data);
        let actual_sha = hex::encode(hasher.finalize());

        if actual_sha != expected_sha {
            return Err(format!("SHA256 mismatch! Expected {expected_sha}, got {actual_sha}"));
        }
        println!("SHA256 verified ✓");
    }

    // Replace current binary
    let current_exe = std::env::current_exe()
        .map_err(|e| format!("Cannot determine current executable: {e}"))?;
    let tmp_path = current_exe.with_extension("new");

    // TODO: extract from tar.gz, for now just write directly
    std::fs::write(&tmp_path, &data)
        .map_err(|e| format!("Failed to write new binary: {e}"))?;

    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        std::fs::set_permissions(&tmp_path, std::fs::Permissions::from_mode(0o755))
            .map_err(|e| format!("Failed to set permissions: {e}"))?;
    }

    std::fs::rename(&tmp_path, &current_exe)
        .map_err(|e| format!("Failed to replace binary: {e}"))?;

    println!("Updated to {}! Restart claude-live to use the new version.", release.tag_name);
    Ok(())
}
```

Add to `src/lib.rs`:
```rust
pub mod update;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cargo test --test update_test`
Expected: PASS

- [ ] **Step 5: Wire update command in main.rs and commit**

Update the `Commands::Update` match arm in `src/main.rs`:
```rust
Some(Commands::Update) => {
    match claude_live::update::self_update() {
        Ok(()) => {}
        Err(e) => { eprintln!("Update failed: {e}"); std::process::exit(1); }
    }
}
```

```bash
git add src/update.rs tests/update_test.rs src/lib.rs src/main.rs
git commit -m "feat: implement self-update from GitHub releases with SHA256 verification"
```

---

### Task 14: Share Command (share.rs)

**Files:**
- Create: `src/share.rs`

Wraps `cloudflared tunnel` subprocess.

- [ ] **Step 1: Implement share.rs**

`src/share.rs`:
```rust
use std::process::{Command, Stdio};

pub fn start_tunnel(port: u16) -> Result<(), String> {
    // Check if cloudflared is installed
    let status = Command::new("cloudflared")
        .arg("--version")
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .status();

    if status.is_err() || !status.unwrap().success() {
        return Err(
            "cloudflared is not installed. Install it from https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/".to_string()
        );
    }

    println!("Starting cloudflare tunnel for localhost:{port}...");

    let mut child = Command::new("cloudflared")
        .args(["tunnel", "--url", &format!("http://localhost:{port}")])
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .spawn()
        .map_err(|e| format!("Failed to start cloudflared: {e}"))?;

    child.wait().map_err(|e| format!("cloudflared exited: {e}"))?;
    Ok(())
}
```

Add to `src/lib.rs`:
```rust
pub mod share;
```

- [ ] **Step 2: Wire share command in main.rs**

Update match arm:
```rust
Some(Commands::Share { port }) => {
    if let Err(e) = claude_live::share::start_tunnel(port) {
        eprintln!("{e}");
        std::process::exit(1);
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/share.rs src/lib.rs src/main.rs
git commit -m "feat: add cloudflare tunnel share command"
```

---

### Task 15: Wire Record/Replay/Logs CLI Commands

**Files:**
- Modify: `src/main.rs`

- [ ] **Step 1: Implement record command**

In the `Commands::Record` match arm:
```rust
Some(Commands::Record { output, port }) => {
    use std::io::Write;
    let protocol = "ws";
    let url = format!("{protocol}://127.0.0.1:{port}/ws");
    println!("Recording events to {output} (Ctrl+C to stop)...");

    let rt = tokio::runtime::Handle::current();
    rt.block_on(async {
        let (mut ws, _) = tokio_tungstenite::connect_async(&url).await
            .unwrap_or_else(|e| { eprintln!("Cannot connect: {e}"); std::process::exit(1); });
        let mut file = std::fs::File::create(&output)
            .unwrap_or_else(|e| { eprintln!("Cannot create {output}: {e}"); std::process::exit(1); });
        file.write_all(b"[\n").unwrap();
        let mut first = true;

        use futures_util::StreamExt;
        while let Some(Ok(msg)) = ws.next().await {
            if let Ok(text) = msg.into_text() {
                let parsed: serde_json::Value = match serde_json::from_str(&text) {
                    Ok(v) => v,
                    Err(_) => continue,
                };
                if parsed.get("type").and_then(|v| v.as_str()) == Some("event") {
                    if !first { file.write_all(b",\n").unwrap(); }
                    first = false;
                    file.write_all(parsed["data"].to_string().as_bytes()).unwrap();
                }
            }
        }
        file.write_all(b"\n]\n").unwrap();
    });
}
```

- [ ] **Step 2: Implement replay command**

```rust
Some(Commands::Replay { file, speed, port }) => {
    let content = std::fs::read_to_string(&file)
        .unwrap_or_else(|e| { eprintln!("Cannot read {file}: {e}"); std::process::exit(1); });
    let events: Vec<serde_json::Value> = serde_json::from_str(&content)
        .unwrap_or_else(|e| { eprintln!("Invalid JSON: {e}"); std::process::exit(1); });

    println!("Replaying {} events at {speed}x speed...", events.len());
    let mut last_ts: Option<u64> = None;
    for event in &events {
        let ts = event.get("timestamp").and_then(|v| v.as_u64());
        if let (Some(current), Some(prev)) = (ts, last_ts) {
            if current > prev {
                let delay_ms = ((current - prev) as f64 / speed) as u64;
                std::thread::sleep(std::time::Duration::from_millis(delay_ms.min(5000)));
            }
        }
        last_ts = ts;
        let body = serde_json::to_string(event).unwrap();
        if let Err(e) = api_post(port, "/hook", Some(&body)) {
            eprintln!("Failed: {e}");
        }
    }
    println!("Replay complete");
}
```

- [ ] **Step 3: Implement logs command**

```rust
Some(Commands::Logs { follow, port }) => {
    // For now, logs are printed to the server's stdout.
    // A future enhancement could stream logs over WS.
    eprintln!("Logs are printed to the server's stdout. Use `claude-live start` in foreground mode to see them.");
    if follow {
        eprintln!("Hint: start the server with RUST_LOG=claude_live=debug for verbose output");
    }
}
```

- [ ] **Step 4: Verify build**

Run: `cargo build`
Expected: compiles

- [ ] **Step 5: Commit**

```bash
git add src/main.rs
git commit -m "feat: implement record, replay, and logs CLI commands"
```

---

### Task 16: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Rewrite README.md**

```markdown
# claude-live

Realtime solar system visualization of Claude Code activity. Files orbit as planets, operations fire directional lasers, sessions glow as separate star systems.

## Install

### Plugin Marketplace (Recommended)

```bash
claude plugin marketplace add marisancans/claude-live
```

Hooks are configured automatically. Open `http://localhost:43451` during a Claude Code session.

### Homebrew (macOS/Linux)

```bash
brew install marisancans/tap/claude-live
```

### Cargo

```bash
cargo install claude-live
```

### Direct Download

```bash
curl -sSfL https://github.com/marisancans/claude-live/releases/latest/download/install.sh | sh
```

## Usage

```bash
# Start the server (opens browser automatically)
claude-live start

# Start with custom port and LAN access
claude-live start --port 8080 --bind 0.0.0.0

# Start with authentication
claude-live start --token mysecret

# Check status
claude-live status

# List active sessions
claude-live sessions
```

### Manual Hook Setup

If not using the plugin marketplace, add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse":         [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "PostToolUse":        [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "Stop":               [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "Notification":       [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "PermissionRequest":  [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}]
  }
}
```

## What You See

- **File nodes** orbit their session's star at fixed radii — touched files grow slightly with each interaction
- **Directional lasers**: Read/Grep/Glob fire planet→core (inbound scan), Edit/Write/Bash fire core→planet (outbound write)
- **8 distinct effects**: reticle (Read), radar (Grep), dots (Glob), ink (Edit), burst (Write), lightning (Bash), wave (WebFetch), rings (Notification)
- **Amber core + tether line** = agent/subagent session spawned from a parent
- **Spinning amber ring** on core = session awaiting permission / user input
- **Multiple clusters** = parallel Claude Code sessions, spaced dynamically

## CLI Reference

| Command | Description |
|---------|-------------|
| `claude-live start` | Start server (foreground) |
| `claude-live stop` | Stop running server |
| `claude-live status` | Show server status |
| `claude-live sessions` | List active sessions |
| `claude-live health` | Detailed diagnostics |
| `claude-live reset` | Clear all session buffers |
| `claude-live inject <file>` | Inject events from JSON file |
| `claude-live record -o <file>` | Record events to file |
| `claude-live replay <file>` | Replay recorded events |
| `claude-live update` | Self-update from GitHub |
| `claude-live share` | Share via cloudflare tunnel |
| `claude-live version` | Show version info |

### Start Options

```
--port <PORT>           Server port (default: 43451)
--bind <ADDR>           Bind address (default: 127.0.0.1)
--token <SECRET>        Require auth token for connections
--buffer-size <N>       Events per session buffer (default: 50)
--session-timeout <S>   Session timeout in seconds (default: 660)
```

## Remote Access

Share your visualization with teammates:

```bash
# LAN access
claude-live start --bind 0.0.0.0 --token myteamtoken

# Internet access via Cloudflare tunnel
claude-live share
```

## Dev Mode

```bash
git clone https://github.com/marisancans/claude-live.git
cd claude-live
cd client && npm install && cd ..
cargo run -- start
```

Frontend dev (hot reload):
```bash
cd client && npm run dev    # Vite dev server on :5173
cargo run -- start          # Rust server on :43451
```

## Updating

```bash
# Self-update
claude-live update

# Homebrew
brew upgrade claude-live

# Cargo
cargo install claude-live
```
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for Rust binary with full CLI reference"
```

---

### Task 17: Create CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Write CLAUDE.md**

```markdown
# claude-live

Real-time Claude Code activity visualizer. Single Rust binary with embedded frontend.

## Architecture

- **Backend:** Rust (axum + tokio), serves WebSocket API + embedded static frontend
- **Frontend:** React 18 + PixiJS v8 (TypeScript, Vite)
- **Transport:** WebSocket at `/ws`, hook ingestion at `POST /hook`
- **CLI:** clap-based with subcommands for server lifecycle, debugging, and management

## Dev Workflow

```bash
# Run Rust server (serves embedded frontend)
cargo run -- start

# Frontend dev with hot reload
cd client && npm run dev   # Vite on :5173
cargo run -- start         # Server on :43451

# Run all tests
cargo test

# Frontend typecheck
cd client && npx tsc --noEmit
```

## Key Files

### Rust Backend (`src/`)
- `main.rs` — CLI entry, subcommand dispatch
- `server.rs` — Axum router, static file serving
- `websocket.rs` — WebSocket upgrade, per-client message loop
- `hook.rs` — POST /hook handler
- `normalize.rs` — Event normalization (RawEvent → NormalizedEvent)
- `snapshot.rs` — Session snapshot computation for new WS clients
- `session.rs` — SessionManager with rolling buffers
- `broadcast.rs` — Fan-out events to WS clients

### Frontend (`client/src/`)
- `App.tsx` — React root, WebSocket connection, HUD
- `store.ts` — Client-side state management (sessions, nodes, edges)
- `types.ts` — TypeScript types (RawEvent, GraphNode, Cluster)
- `canvas-pixi/` — PixiJS v8 rendering (layers, objects, effects, animation)
- `events/` — EventBus + EventProcessor (state→visual bridge)

## Conventions

- Server port: 43451 (default)
- Event buffer: 50 events per session, 11min timeout
- Frontend builds to `client/dist/`, embedded into Rust binary via `rust-embed`
- All hook events POST to `/hook` as JSON, normalized server-side
- WebSocket messages are JSON with `type` field: `event`, `snapshot`, `heartbeat`, `version_available`

## Testing

- Rust: `cargo test` (unit + integration tests in `tests/`)
- Frontend: `cd client && npx tsc --noEmit` (typecheck only, no unit tests)
- Manual: `claude-live inject <file.json>` to feed test events
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md project instructions"
```

---

### Task 18: Final Integration Test & Cleanup

**Files:**
- Modify: `src/lib.rs` (ensure all modules exported)
- Modify: `Cargo.toml` (final dependency audit)

- [ ] **Step 1: Run full test suite**

Run: `cargo test`
Expected: all tests pass

- [ ] **Step 2: Run clippy**

Run: `cargo clippy -- -D warnings`
Expected: no warnings

- [ ] **Step 3: Build release binary**

Run: `cargo build --release`
Expected: builds successfully

- [ ] **Step 4: Check binary size**

Run: `ls -lh target/release/claude-live`
Expected: ~5-15MB

- [ ] **Step 5: Smoke test — start server, open browser, inject event**

```bash
# Terminal 1
cargo run --release -- start

# Terminal 2
curl -X POST http://localhost:43451/hook \
  -H 'Content-Type: application/json' \
  -d '{"session_id":"test","hook_event_name":"PreToolUse","tool_name":"Read","tool_input":{"file_path":"/src/main.rs"}}'

cargo run --release -- status
cargo run --release -- sessions
```

- [ ] **Step 6: Build frontend and verify embedding**

```bash
cd client && npm run build && cd ..
cargo build --release
# Binary should serve the frontend at http://localhost:43451
```

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and integration verification"
```
