use claude_live::paths;
use tempfile::TempDir;

#[test]
fn test_data_dir_returns_path() {
    let dir = paths::data_dir();
    assert!(dir.ends_with("claude-live"), "data_dir should end with claude-live: {:?}", dir);
}

#[test]
fn test_db_path_is_inside_data_dir() {
    let db = paths::db_path();
    let dir = paths::data_dir();
    assert!(db.starts_with(&dir));
    assert!(db.to_str().unwrap().ends_with("events.db"));
}

#[test]
fn test_pidfile_write_read_clean() {
    let tmp = TempDir::new().unwrap();
    let pidfile = tmp.path().join("test.pid");
    paths::write_pidfile(&pidfile, 12345).unwrap();
    let pid = paths::read_pidfile(&pidfile).unwrap();
    assert_eq!(pid, Some(12345));
    paths::remove_pidfile(&pidfile);
    let pid = paths::read_pidfile(&pidfile).unwrap();
    assert_eq!(pid, None);
}

#[test]
fn test_read_pidfile_missing_returns_none() {
    let tmp = TempDir::new().unwrap();
    let pidfile = tmp.path().join("nonexistent.pid");
    let pid = paths::read_pidfile(&pidfile).unwrap();
    assert_eq!(pid, None);
}

#[test]
fn test_pidfile_path_is_inside_data_dir() {
    let p = paths::pidfile_path();
    let dir = paths::data_dir();
    assert!(p.starts_with(&dir));
    assert!(p.to_str().unwrap().ends_with("server.pid"));
}
