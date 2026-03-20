use std::sync::{Arc, Mutex};
use tokio::sync::mpsc;

pub struct Broadcaster {
    clients: Arc<Mutex<Vec<mpsc::UnboundedSender<String>>>>,
}

impl Default for Broadcaster {
    fn default() -> Self {
        Self::new()
    }
}

impl Broadcaster {
    pub fn new() -> Self {
        Self {
            clients: Arc::new(Mutex::new(Vec::new())),
        }
    }

    pub fn subscribe(&self) -> mpsc::UnboundedReceiver<String> {
        let (tx, rx) = mpsc::unbounded_channel();
        self.clients.lock().unwrap().push(tx);
        rx
    }

    pub fn send(&self, msg: String) {
        let mut clients = self.clients.lock().unwrap();
        clients.retain(|tx| tx.send(msg.clone()).is_ok());
    }

    pub fn client_count(&self) -> usize {
        self.clients.lock().unwrap().len()
    }
}
