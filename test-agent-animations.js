#!/usr/bin/env node
// Test script to trigger agent animation routing by sending hooks to claude-live server

import http from 'http';
import { URL } from 'url';

const SERVER = 'http://localhost:43453';
const SESSION_ID = 'test-session-' + Date.now();

function sendHook(eventName, data = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      hook_event_name: eventName,
      session_id: SESSION_ID,
      timestamp: Date.now(),
      ...data
    });

    const url = new URL('/hook', SERVER);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res) => {
      resolve(`${eventName}: ${res.statusCode}`);
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function testAgentAnimations() {
  console.log('🚀 Testing Agent Animation Routing...\n');

  try {
    // Agent 1: Spawn and read
    console.log('📍 Agent 1: Spawning...');
    await sendHook('SubagentStart', {
      agent_id: 'agent-1',
      agent_type: 'claude-opus-4-6'
    });
    await new Promise(r => setTimeout(r, 500));

    console.log('📖 Agent 1: Reading file...');
    await sendHook('PreToolUse', {
      tool_name: 'Read',
      tool_input: { file_path: 'client/src/store.ts' },
      agent_id: 'agent-1'
    });
    await new Promise(r => setTimeout(r, 300));

    await sendHook('PostToolUse', {
      tool_name: 'Read',
      tool_input: { file_path: 'client/src/store.ts' },
      agent_id: 'agent-1'
    });
    await new Promise(r => setTimeout(r, 500));

    // Agent 2: Spawn and read
    console.log('📍 Agent 2: Spawning...');
    await sendHook('SubagentStart', {
      agent_id: 'agent-2',
      agent_type: 'claude-opus-4-6'
    });
    await new Promise(r => setTimeout(r, 500));

    console.log('📖 Agent 2: Reading file...');
    await sendHook('PreToolUse', {
      tool_name: 'Read',
      tool_input: { file_path: 'README.md' },
      agent_id: 'agent-2'
    });
    await new Promise(r => setTimeout(r, 300));

    await sendHook('PostToolUse', {
      tool_name: 'Read',
      tool_input: { file_path: 'README.md' },
      agent_id: 'agent-2'
    });
    await new Promise(r => setTimeout(r, 500));

    // Agent 1: Glob operation
    console.log('🔍 Agent 1: Globbing...');
    await sendHook('PreToolUse', {
      tool_name: 'Glob',
      tool_input: { pattern: 'client/src/**/*.tsx' },
      agent_id: 'agent-1'
    });
    await new Promise(r => setTimeout(r, 300));

    await sendHook('PostToolUse', {
      tool_name: 'Glob',
      tool_input: { pattern: 'client/src/**/*.tsx' },
      agent_id: 'agent-1'
    });
    await new Promise(r => setTimeout(r, 500));

    // Terminate agents
    console.log('🛑 Agent 1: Terminating...');
    await sendHook('SubagentStop', {
      agent_id: 'agent-1'
    });
    await new Promise(r => setTimeout(r, 300));

    console.log('🛑 Agent 2: Terminating...');
    await sendHook('SubagentStop', {
      agent_id: 'agent-2'
    });

    console.log('\n✅ Test complete! Check http://localhost:43451 for animations.\n');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

testAgentAnimations();
