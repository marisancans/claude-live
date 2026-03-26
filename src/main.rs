use clap::{Parser, Subcommand};
use std::path::PathBuf;

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
        /// Path to static files directory (auto-detected if omitted)
        #[arg(long)]
        static_dir: Option<String>,
        /// Authentication token
        #[arg(long)]
        token: Option<String>,
    },
    /// Stop the running server
    Stop,
    /// Show server status
    Status,
    /// Ingest a hook event from stdin into the SQLite database
    Hook {
        /// Path to the SQLite database file
        #[arg(long)]
        db: Option<String>,
    },
    /// Print database statistics as JSON
    Stats,
    /// Inject events from a JSON file into the database
    Inject {
        /// Path to JSON file containing events
        file: String,
        /// Path to the SQLite database file
        #[arg(long)]
        db: Option<String>,
    },
    /// Record events from the database to a JSON file
    Record {
        /// Output file path
        #[arg(short, long)]
        output: String,
        /// Path to the SQLite database file
        #[arg(long)]
        db: Option<String>,
    },
    /// Replay recorded events into the database
    Replay {
        /// Path to JSON file containing events
        file: String,
        /// Playback speed multiplier
        #[arg(long, default_value = "1.0")]
        speed: f64,
        /// Path to the SQLite database file
        #[arg(long)]
        db: Option<String>,
    },
    /// Self-update from GitHub releases
    Update,
    /// Share via cloudflare tunnel
    Share,
    /// Print version info
    Version,
}

fn resolve_db_path(db_override: Option<String>) -> PathBuf {
    db_override
        .map(PathBuf::from)
        .unwrap_or_else(claude_live::paths::db_path)
}

fn resolve_static_dir(flag: Option<String>) -> Result<PathBuf, String> {
    // 1. Explicit flag
    if let Some(dir) = flag {
        let p = PathBuf::from(&dir);
        if p.join("index.html").exists() {
            return Ok(p);
        }
        return Err(format!("Static dir {dir} does not contain index.html"));
    }

    // 2. CLAUDE_PLUGIN_ROOT env
    if let Ok(root) = std::env::var("CLAUDE_PLUGIN_ROOT") {
        let p = PathBuf::from(root).join("client").join("dist");
        if p.join("index.html").exists() {
            return Ok(p);
        }
    }

    // 3. Next to binary: {binary_dir}/../client/dist/
    if let Ok(exe) = std::env::current_exe() {
        if let Some(bin_dir) = exe.parent() {
            let p = bin_dir.join("..").join("client").join("dist");
            if p.join("index.html").exists() {
                return Ok(p);
            }
        }
    }

    // 4. CWD: ./client/dist/
    let p = std::env::current_dir()
        .unwrap_or_default()
        .join("client")
        .join("dist");
    if p.join("index.html").exists() {
        return Ok(p);
    }

    Err("Could not find static files (client/dist/index.html). Build the frontend first: cd client && npm run build".to_string())
}

fn is_server_running() -> bool {
    let pidfile = claude_live::paths::pidfile_path();
    match claude_live::paths::read_pidfile(&pidfile) {
        Ok(Some(pid)) => is_pid_alive(pid),
        _ => false,
    }
}

fn read_server_pid() -> Option<u32> {
    let pidfile = claude_live::paths::pidfile_path();
    claude_live::paths::read_pidfile(&pidfile).ok().flatten()
}

#[cfg(unix)]
fn is_pid_alive(pid: u32) -> bool {
    unsafe { libc::kill(pid as i32, 0) == 0 }
}

#[cfg(not(unix))]
fn is_pid_alive(pid: u32) -> bool {
    // On Windows, check via tasklist
    std::process::Command::new("tasklist")
        .args(["/FI", &format!("PID eq {pid}"), "/NH"])
        .output()
        .map(|o| String::from_utf8_lossy(&o.stdout).contains(&pid.to_string()))
        .unwrap_or(false)
}

fn setup_ctrlc_handler() {
    let pidfile = claude_live::paths::pidfile_path();
    ctrlc::set_handler(move || {
        claude_live::paths::remove_pidfile(&pidfile);
        std::process::exit(0);
    })
    .expect("Failed to set Ctrl+C handler");
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

        Some(Commands::Start { static_dir, token }) => {
            // Check if already running
            if let Some(pid) = read_server_pid() {
                if is_pid_alive(pid) {
                    println!("Server already running (PID {pid})");
                    let _ = open::that("http://localhost:43451");
                    return;
                }
            }

            let static_path = match resolve_static_dir(static_dir) {
                Ok(p) => p,
                Err(e) => {
                    eprintln!("{e}");
                    std::process::exit(1);
                }
            };

            if let Err(e) = claude_live::paths::ensure_data_dir() {
                eprintln!("Cannot create data directory: {e}");
                std::process::exit(1);
            }

            // Write pidfile
            let pidfile = claude_live::paths::pidfile_path();
            let pid = std::process::id();
            if let Err(e) = claude_live::paths::write_pidfile(&pidfile, pid) {
                eprintln!("Cannot write pidfile: {e}");
                std::process::exit(1);
            }

            setup_ctrlc_handler();

            tracing_subscriber::fmt()
                .with_env_filter(tracing_subscriber::EnvFilter::from_default_env()
                    .add_directive("claude_live=info".parse().unwrap()))
                .init();

            let db_path = claude_live::paths::db_path();
            let port = 43451;

            let (actual_port, handle) = claude_live::server::start_server(
                &static_path, &db_path, port, token
            ).await;

            println!("claude-live running at http://127.0.0.1:{actual_port}");

            if let Err(e) = open::that(format!("http://localhost:{actual_port}")) {
                eprintln!("Could not open browser: {e}");
            }

            handle.await.unwrap();

            // Clean up pidfile on normal exit
            claude_live::paths::remove_pidfile(&claude_live::paths::pidfile_path());
        }

        Some(Commands::Stop) => {
            let pidfile = claude_live::paths::pidfile_path();
            match claude_live::paths::read_pidfile(&pidfile) {
                Ok(Some(pid)) if is_pid_alive(pid) => {
                    #[cfg(unix)]
                    {
                        unsafe { libc::kill(pid as i32, libc::SIGTERM); }
                    }
                    #[cfg(not(unix))]
                    {
                        let _ = std::process::Command::new("taskkill")
                            .args(["/PID", &pid.to_string(), "/F"])
                            .status();
                    }
                    claude_live::paths::remove_pidfile(&pidfile);
                    println!("Server stopped (PID {pid})");
                }
                _ => {
                    eprintln!("Server is not running");
                    std::process::exit(1);
                }
            }
        }

        Some(Commands::Status) => {
            if let Some(pid) = read_server_pid() {
                if is_pid_alive(pid) {
                    println!("claude-live is running (PID {pid})");
                } else {
                    println!("claude-live is stopped (stale pidfile for PID {pid})");
                    claude_live::paths::remove_pidfile(&claude_live::paths::pidfile_path());
                }
            } else {
                println!("claude-live is stopped");
            }

            // Show DB stats if database exists
            let db_path = claude_live::paths::db_path();
            if db_path.exists() {
                if let Ok(store) = claude_live::storage::EventStore::open(&db_path) {
                    if let Ok(stats) = store.stats() {
                        println!("Database: {} events, {} sessions, {:.1} KB",
                            stats.total_events, stats.total_sessions,
                            stats.db_size_bytes as f64 / 1024.0);
                    }
                }
            }
        }

        Some(Commands::Stats) => {
            let db_path = claude_live::paths::db_path();
            if !db_path.exists() {
                println!("{{}}");
                return;
            }
            match claude_live::storage::EventStore::open(&db_path) {
                Ok(store) => match store.stats() {
                    Ok(stats) => {
                        println!("{}", serde_json::to_string_pretty(&stats).unwrap());
                    }
                    Err(e) => {
                        eprintln!("Failed to read stats: {e}");
                        std::process::exit(1);
                    }
                },
                Err(e) => {
                    eprintln!("Failed to open database: {e}");
                    std::process::exit(1);
                }
            }
        }

        Some(Commands::Hook { db }) => {
            let db_path = resolve_db_path(db);

            // Ensure parent directory exists
            if let Some(parent) = db_path.parent() {
                let _ = std::fs::create_dir_all(parent);
            }

            // Read stdin -- silently return on any error
            let mut input = String::new();
            if std::io::Read::read_to_string(&mut std::io::stdin(), &mut input).is_err() {
                return;
            }
            if input.is_empty() {
                return;
            }

            // Parse JSON -- silently return on error (never block Claude Code)
            let raw: serde_json::Value = match serde_json::from_str(&input) {
                Ok(v) => v,
                Err(_) => return,
            };

            // Normalize the event
            let event = claude_live::normalize::normalize_event(&raw, "local");

            // Skip diagnostic events
            if event.hook_event_name.as_deref() == Some("Diagnostic") {
                return;
            }

            // Open EventStore and record -- silently return on error
            let store = match claude_live::storage::EventStore::open(&db_path) {
                Ok(s) => s,
                Err(_) => return,
            };
            let _ = store.record(&event);
        }

        Some(Commands::Inject { file, db }) => {
            let db_path = resolve_db_path(db);

            // Ensure parent directory exists
            if let Some(parent) = db_path.parent() {
                let _ = std::fs::create_dir_all(parent);
            }

            let content = std::fs::read_to_string(&file)
                .unwrap_or_else(|e| { eprintln!("Cannot read {file}: {e}"); std::process::exit(1); });
            let events: Vec<serde_json::Value> = serde_json::from_str(&content)
                .unwrap_or_else(|e| { eprintln!("Invalid JSON: {e}"); std::process::exit(1); });

            let store = claude_live::storage::EventStore::open(&db_path)
                .unwrap_or_else(|e| { eprintln!("Cannot open database: {e}"); std::process::exit(1); });

            let mut count = 0;
            for event_json in &events {
                let event = claude_live::normalize::normalize_event(event_json, "inject");
                if let Err(e) = store.record(&event) {
                    eprintln!("Failed to record event: {e}");
                } else {
                    count += 1;
                }
            }

            println!("Injected {count} events into {}", db_path.display());
        }

        Some(Commands::Replay { file, speed, db }) => {
            let db_path = resolve_db_path(db);

            // Ensure parent directory exists
            if let Some(parent) = db_path.parent() {
                let _ = std::fs::create_dir_all(parent);
            }

            let content = std::fs::read_to_string(&file)
                .unwrap_or_else(|e| { eprintln!("Cannot read {file}: {e}"); std::process::exit(1); });
            let events: Vec<serde_json::Value> = serde_json::from_str(&content)
                .unwrap_or_else(|e| { eprintln!("Invalid JSON: {e}"); std::process::exit(1); });

            let store = claude_live::storage::EventStore::open(&db_path)
                .unwrap_or_else(|e| { eprintln!("Cannot open database: {e}"); std::process::exit(1); });

            println!("Replaying {} events at {speed}x speed...", events.len());
            let mut last_ts: Option<u64> = None;
            for event_json in &events {
                let ts = event_json.get("timestamp").and_then(|v| v.as_u64());
                if let (Some(current), Some(prev)) = (ts, last_ts) {
                    if current > prev {
                        let delay_ms = ((current - prev) as f64 / speed) as u64;
                        std::thread::sleep(std::time::Duration::from_millis(delay_ms.min(5000)));
                    }
                }
                last_ts = ts;

                let event = claude_live::normalize::normalize_event(event_json, "replay");
                if let Err(e) = store.record(&event) {
                    eprintln!("Failed: {e}");
                }
            }
            println!("Replay complete");
        }

        Some(Commands::Record { output, db }) => {
            let db_path = resolve_db_path(db);
            println!("Recording events to {output} (Ctrl+C to stop)...");

            let store = claude_live::storage::EventStore::open(&db_path)
                .unwrap_or_else(|e| { eprintln!("Cannot open database: {e}"); std::process::exit(1); });

            let mut last_id: i64 = 0;
            let mut events: Vec<serde_json::Value> = Vec::new();

            // Get the current max id so we only record new events
            if let Ok((_, max_id)) = store.poll_after(0) {
                last_id = max_id;
            }

            let running = std::sync::Arc::new(std::sync::atomic::AtomicBool::new(true));
            let r = running.clone();
            ctrlc::set_handler(move || {
                r.store(false, std::sync::atomic::Ordering::SeqCst);
            }).expect("Failed to set Ctrl+C handler");

            while running.load(std::sync::atomic::Ordering::SeqCst) {
                match store.poll_after(last_id) {
                    Ok((new_events, max_id)) => {
                        if max_id > last_id {
                            last_id = max_id;
                        }
                        for event in new_events {
                            let json_val = serde_json::to_value(&event).unwrap();
                            events.push(json_val);
                        }
                    }
                    Err(_) => {}
                }
                std::thread::sleep(std::time::Duration::from_millis(100));
            }

            // Write collected events to file
            let json = serde_json::to_string_pretty(&events).unwrap();
            std::fs::write(&output, json)
                .unwrap_or_else(|e| { eprintln!("Cannot write {output}: {e}"); std::process::exit(1); });
            println!("Recorded {} events to {output}", events.len());
        }

        Some(Commands::Update) => {
            match claude_live::update::self_update() {
                Ok(()) => {}
                Err(e) => { eprintln!("Update failed: {e}"); std::process::exit(1); }
            }
        }

        Some(Commands::Share) => {
            if !is_server_running() {
                eprintln!("Server is not running. Start it first with: claude-live start");
                std::process::exit(1);
            }
            if let Err(e) = claude_live::share::start_tunnel(43451) {
                eprintln!("{e}");
                std::process::exit(1);
            }
        }
    }
}
