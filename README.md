# claude-live

Real-time visualization of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) activity as an orbital solar system.

![claude-live demo](claude-live-demo.gif)

**[Try the demo](https://marisancans.github.io/claude-live/)** (no install needed)

## Install

```bash
claude plugin marketplace add marisancans/claude-live
```

## Use

```bash
# Work normally -- events are recorded in the background
claude "refactor the auth module"

# View the visualization whenever you want
claude-live start
```

## Development

```bash
git clone https://github.com/marisancans/claude-live.git
cd claude-live
cd client && npm install && cd ..

cargo run -- start              # Rust server on :43451
cd client && npm run dev        # Vite hot-reload on :5173
cargo test                      # Run tests
```

## License

MIT
