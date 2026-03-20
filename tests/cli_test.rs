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
