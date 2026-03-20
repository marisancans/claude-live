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

#[test]
fn test_status_when_not_running() {
    // status should fail gracefully when no server is running
    Command::cargo_bin("claude-live")
        .unwrap()
        .args(["status", "--port", "19999"])
        .assert()
        .failure();
}
