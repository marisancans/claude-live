#!/bin/sh
exec node "${CLAUDE_PLUGIN_ROOT}/bin/hook.js" 2>/dev/null || true
