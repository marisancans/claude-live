#!/usr/bin/env node
// Extended test with more agents and longer animation sequence

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

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function agentAction(agentId, tool, filePath, delay = 800) {
  await sendHook('PreToolUse', {
    tool_name: tool,
    tool_input: { file_path: filePath, pattern: filePath },
    agent_id: agentId
  });
  await wait(delay);
  await sendHook('PostToolUse', {
    tool_name: tool,
    tool_input: { file_path: filePath, pattern: filePath },
    agent_id: agentId
  });
}

async function testAgentAnimationsLong() {
  console.log('🚀 Extended Agent Animation Test (4 agents, many actions)\n');

  try {
    // Spawn 4 agents
    console.log('📍 Spawning 4 agents...');
    for (let i = 1; i <= 4; i++) {
      await sendHook('SubagentStart', {
        agent_id: `agent-${i}`,
        agent_type: 'claude-opus-4-6'
      });
      console.log(`   Agent ${i} spawned`);
      await wait(300);
    }

    await wait(1000);

    // Agent 1: Multiple reads
    console.log('\n📖 Agent 1: Multiple read operations...');
    await agentAction('agent-1', 'Read', 'client/src/store.ts', 1000);
    await wait(500);
    await agentAction('agent-1', 'Read', 'client/src/types.ts', 1000);
    await wait(500);
    await agentAction('agent-1', 'Read', 'README.md', 1000);

    // Agent 2: Grep operations
    console.log('\n🔎 Agent 2: Search operations...');
    await agentAction('agent-2', 'Grep', 'agentPositionMap', 1000);
    await wait(500);
    await agentAction('agent-2', 'Grep', 'getAnimationOrigin', 1000);

    // Agent 3: Glob operations
    console.log('\n📂 Agent 3: File matching operations...');
    await agentAction('agent-3', 'Glob', 'client/src/**/*.tsx', 1200);
    await wait(600);
    await agentAction('agent-3', 'Glob', '**/*.ts', 1200);

    // Agent 4: Mixed operations
    console.log('\n🔄 Agent 4: Mixed operations...');
    await agentAction('agent-4', 'Read', 'package.json', 1000);
    await wait(500);
    await agentAction('agent-4', 'Grep', 'vite', 1000);

    await wait(1000);

    // More concurrent-looking operations
    console.log('\n⚡ Agents 1 & 2: Concurrent operations...');
    await Promise.all([
      agentAction('agent-1', 'Read', 'client/src/canvas/renderer.ts', 1200),
      agentAction('agent-2', 'Grep', 'projectile', 1200)
    ]);

    await wait(800);

    // Agent 3 continues
    console.log('\n📂 Agent 3: More operations...');
    await agentAction('agent-3', 'Glob', 'docs/**/*.md', 1200);

    await wait(1000);

    // Final operations before termination
    console.log('\n🎬 Final actions before termination...');
    await agentAction('agent-1', 'Read', 'client/src/canvas/graph.ts', 1000);
    await wait(400);
    await agentAction('agent-4', 'Grep', 'animation', 1000);
    await wait(400);
    await agentAction('agent-2', 'Read', '.gitignore', 1000);

    await wait(1500);

    // Terminate agents one by one
    console.log('\n🛑 Terminating agents...');
    for (let i = 1; i <= 4; i++) {
      await sendHook('SubagentStop', { agent_id: `agent-${i}` });
      console.log(`   Agent ${i} terminated (star fading out)`);
      await wait(600);
    }

    console.log('\n✅ Extended test complete! All agents have terminated.\n');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

testAgentAnimationsLong();
