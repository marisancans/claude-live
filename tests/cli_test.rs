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
    Command::cargo_bin("claude-live")
        .unwrap()
        .arg("status")
        .assert()
        .success()
        .stdout(predicates::str::contains("stopped"));
}

#[test]
fn test_stop_when_not_running() {
    Command::cargo_bin("claude-live")
        .unwrap()
        .arg("stop")
        .assert()
        .failure()
        .stderr(predicates::str::contains("not running"));
}

#[test]
fn test_stats_with_no_db() {
    Command::cargo_bin("claude-live")
        .unwrap()
        .arg("stats")
        .assert()
        .success();
}
