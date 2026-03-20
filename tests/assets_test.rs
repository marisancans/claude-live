use claude_live::assets::StaticAssets;
use rust_embed::Embed;

#[test]
fn test_index_html_is_embedded() {
    // During development, rust-embed reads from disk
    let file = StaticAssets::get("index.html");
    assert!(file.is_some(), "index.html should be embedded");
}

#[test]
fn test_mime_type_for_js() {
    let mime = claude_live::assets::mime_for_path("assets/index-abc123.js");
    assert_eq!(mime, "application/javascript");
}

#[test]
fn test_mime_type_for_html() {
    let mime = claude_live::assets::mime_for_path("index.html");
    assert_eq!(mime, "text/html");
}
