use claude_live::broadcast::Broadcaster;
use tokio::sync::mpsc;

#[tokio::test]
async fn test_subscribe_and_receive() {
    let broadcaster = Broadcaster::new();
    let mut rx = broadcaster.subscribe();
    broadcaster.send("hello".to_string());
    let msg = rx.recv().await.unwrap();
    assert_eq!(msg, "hello");
}

#[tokio::test]
async fn test_multiple_subscribers() {
    let broadcaster = Broadcaster::new();
    let mut rx1 = broadcaster.subscribe();
    let mut rx2 = broadcaster.subscribe();
    broadcaster.send("msg".to_string());
    assert_eq!(rx1.recv().await.unwrap(), "msg");
    assert_eq!(rx2.recv().await.unwrap(), "msg");
}

#[tokio::test]
async fn test_unsubscribe_on_drop() {
    let broadcaster = Broadcaster::new();
    let rx = broadcaster.subscribe();
    assert_eq!(broadcaster.client_count(), 1);
    drop(rx);
    // Send triggers cleanup of dead senders
    broadcaster.send("test".to_string());
    assert_eq!(broadcaster.client_count(), 0);
}
