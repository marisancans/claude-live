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
        Some(Commands::Start { port, bind, token, daemon }) => {
            tracing_subscriber::fmt()
                .with_env_filter(tracing_subscriber::EnvFilter::from_default_env()
                    .add_directive("claude_live=info".parse().unwrap()))
                .init();

            if daemon {
                eprintln!("Daemon mode not yet implemented. Running in foreground.");
            }

            let (actual_port, handle) = claude_live::server::start_server(
                &bind, port, token
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
            match claude_live::update::self_update() {
                Ok(()) => {}
                Err(e) => { eprintln!("Update failed: {e}"); std::process::exit(1); }
            }
        }
        Some(Commands::Share { port }) => {
            if let Err(e) = claude_live::share::start_tunnel(port) {
                eprintln!("{e}");
                std::process::exit(1);
            }
        }
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
        Some(Commands::Logs { follow, port: _ }) => {
            eprintln!("Logs are printed to the server's stdout. Use `claude-live start` in foreground mode to see them.");
            if follow {
                eprintln!("Hint: start the server with RUST_LOG=claude_live=debug for verbose output");
            }
        }
    }
}
