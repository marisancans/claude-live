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
