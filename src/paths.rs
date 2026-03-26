use std::path::PathBuf;

/// Returns the data directory for claude-live.
/// Linux/macOS: ~/.local/share/claude-live
/// Windows: %LOCALAPPDATA%/claude-live
pub fn data_dir() -> PathBuf {
    #[cfg(target_os = "windows")]
    {
        let base = std::env::var("LOCALAPPDATA")
            .map(PathBuf::from)
            .unwrap_or_else(|_| {
                let home = std::env::var("USERPROFILE").unwrap_or_else(|_| ".".to_string());
                PathBuf::from(home).join("AppData").join("Local")
            });
        base.join("claude-live")
    }
    #[cfg(not(target_os = "windows"))]
    {
        let home = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
        PathBuf::from(home).join(".local").join("share").join("claude-live")
    }
}

pub fn db_path() -> PathBuf {
    data_dir().join("events.db")
}

pub fn pidfile_path() -> PathBuf {
    data_dir().join("server.pid")
}

pub fn ensure_data_dir() -> std::io::Result<()> {
    std::fs::create_dir_all(data_dir())
}

pub fn write_pidfile(path: &std::path::Path, pid: u32) -> std::io::Result<()> {
    std::fs::write(path, pid.to_string())
}

pub fn read_pidfile(path: &std::path::Path) -> std::io::Result<Option<u32>> {
    match std::fs::read_to_string(path) {
        Ok(content) => Ok(content.trim().parse().ok()),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(None),
        Err(e) => Err(e),
    }
}

pub fn remove_pidfile(path: &std::path::Path) {
    let _ = std::fs::remove_file(path);
}
