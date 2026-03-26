#!/bin/sh
# claude-live hook wrapper — detects platform and execs the right binary.
# Stdin is passed through automatically via exec.
# This script must NEVER block or fail Claude Code — all errors are silent.

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"

OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "$OS" in
    mingw*|msys*|cygwin*) OS="windows" ;;
    darwin) OS="macos" ;;
    linux) OS="linux" ;;
esac

case "$ARCH" in
    x86_64|amd64) ARCH="x86_64" ;;
    aarch64|arm64) ARCH="aarch64" ;;
esac

EXT=""
[ "$OS" = "windows" ] && EXT=".exe"

BIN="${PLUGIN_ROOT}/bin/claude-live-${OS}-${ARCH}${EXT}"

if [ ! -x "$BIN" ]; then
    if [ ! -f "$BIN" ]; then
        exit 0
    fi
fi

exec "$BIN" hook 2>/dev/null || true
