use serde::Deserialize;
use std::io::Read;

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
