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
