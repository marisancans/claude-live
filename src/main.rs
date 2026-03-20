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

            let (actual_port, handle) = claude_live::server::start_server(
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
        Some(Commands::Share { port: _ }) => {
            eprintln!("Share not yet implemented");
            std::process::exit(1);
        }
        Some(Commands::Record { .. }) | Some(Commands::Replay { .. }) | Some(Commands::Logs { .. }) => {
            eprintln!("Not yet implemented");
            std::process::exit(1);
        }
    }
}
