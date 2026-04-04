import { readdirSync, statSync } from 'node:fs';
import { basename, join, resolve, sep } from 'node:path';

const DEFAULT_IGNORES = new Set([
  '.git',
  '.cache',
  '.next',
  '.nuxt',
  '.output',
  '.parcel-cache',
  '.pnpm-store',
  '.superpowers',
  '.svelte-kit',
  '.turbo',
  '.worktrees',
  '.yarn',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'out',
  'target',
  'tmp',
  'temp',
]);

const DEFAULT_LIMITS = {
  maxDepth: 7,
  maxChildren: 48,
  maxNodes: 1200,
};

function toPosixPath(value) {
  return value.split(sep).join('/');
}

function makeProjectLabel(rootPath) {
  return basename(rootPath) || rootPath;
}

function shouldIgnore(entry) {
  if (DEFAULT_IGNORES.has(entry.name)) return true;
  if (entry.isSymbolicLink()) return true;
  return false;
}

function compareEntries(a, b) {
  if (a.isDirectory() && !b.isDirectory()) return -1;
  if (!a.isDirectory() && b.isDirectory()) return 1;
  return a.name.localeCompare(b.name);
}

export function listActiveProjects(events) {
  const projects = new Map();

  for (const event of events) {
    if (!event || typeof event.cwd !== 'string' || !event.cwd) continue;
    const projectId = resolve(event.cwd);
    let project = projects.get(projectId);
    if (!project) {
      project = {
        id: projectId,
        root: projectId,
        label: makeProjectLabel(projectId),
        eventCount: 0,
        lastEventTime: 0,
        sessionIds: new Set(),
      };
      projects.set(projectId, project);
    }

    project.eventCount += 1;
    project.lastEventTime = Math.max(project.lastEventTime, Number(event.timestamp) || 0);
    if (event.session_id) project.sessionIds.add(event.session_id);
  }

  return [...projects.values()]
    .map(project => ({
      id: project.id,
      root: project.root,
      label: project.label,
      eventCount: project.eventCount,
      lastEventTime: project.lastEventTime,
      sessionCount: project.sessionIds.size,
    }))
    .sort((a, b) => b.lastEventTime - a.lastEventTime || a.label.localeCompare(b.label));
}

export function buildProjectTree(rootPath, options = {}) {
  const root = resolve(rootPath);
  const limits = { ...DEFAULT_LIMITS, ...options };
  const stats = {
    directories: 0,
    files: 0,
    totalNodes: 0,
    maxDepthReached: 0,
    truncated: false,
  };

  function visit(absPath, relPath, depth) {
    if (stats.totalNodes >= limits.maxNodes) {
      stats.truncated = true;
      return null;
    }

    let st;
    try {
      st = statSync(absPath);
    } catch {
      return null;
    }

    const pathId = relPath || '.';
    const name = relPath ? basename(absPath) : makeProjectLabel(root);
    stats.totalNodes += 1;
    stats.maxDepthReached = Math.max(stats.maxDepthReached, depth);

    if (!st.isDirectory()) {
      stats.files += 1;
      return {
        id: pathId,
        name,
        path: pathId,
        type: 'file',
        depth,
      };
    }

    stats.directories += 1;
    const node = {
      id: pathId,
      name,
      path: pathId,
      type: 'folder',
      depth,
      children: [],
    };

    if (depth >= limits.maxDepth) {
      try {
        if (readdirSync(absPath).length > 0) stats.truncated = true;
      } catch {
        // ignore unreadable directories
      }
      return node;
    }

    let entries;
    try {
      entries = readdirSync(absPath, { withFileTypes: true })
        .filter(entry => !shouldIgnore(entry))
        .sort(compareEntries);
    } catch {
      return node;
    }

    if (entries.length > limits.maxChildren) {
      entries = entries.slice(0, limits.maxChildren);
      stats.truncated = true;
    }

    for (const entry of entries) {
      const childRelPath = relPath ? toPosixPath(join(relPath, entry.name)) : entry.name;
      const childNode = visit(join(absPath, entry.name), childRelPath, depth + 1);
      if (childNode) node.children.push(childNode);
    }

    return node;
  }

  return {
    projectId: root,
    rootPath: root,
    label: makeProjectLabel(root),
    tree: visit(root, '', 0),
    stats,
  };
}
