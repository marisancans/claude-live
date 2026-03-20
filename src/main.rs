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
        Some(_cmd) => {
            eprintln!("Command not yet implemented");
            std::process::exit(1);
        }
    }
}
