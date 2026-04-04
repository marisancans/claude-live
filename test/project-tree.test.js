import { describe, it, expect } from 'vitest';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildProjectTree, listActiveProjects } from '../server/project-tree.js';

function makeTmpDir() {
  const dir = join(tmpdir(), `claude-live-tree-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

describe('project-tree helpers', () => {
  it('lists unique active projects by cwd', () => {
    const projects = listActiveProjects([
      { cwd: '/tmp/beta', timestamp: 20, session_id: 's2' },
      { cwd: '/tmp/alpha', timestamp: 10, session_id: 's1' },
      { cwd: '/tmp/beta', timestamp: 30, session_id: 's3' },
      { cwd: null, timestamp: 40, session_id: 's4' },
    ]);

    expect(projects).toHaveLength(2);
    expect(projects[0]).toMatchObject({ id: '/tmp/beta', label: 'beta', eventCount: 2, sessionCount: 2 });
    expect(projects[1]).toMatchObject({ id: '/tmp/alpha', label: 'alpha', eventCount: 1, sessionCount: 1 });
  });

  it('builds a folder/file tree with ignores and stats', () => {
    const root = makeTmpDir();
    mkdirSync(join(root, 'src', 'nested'), { recursive: true });
    mkdirSync(join(root, 'node_modules'), { recursive: true });
    writeFileSync(join(root, 'src', 'index.ts'), 'export const x = 1;');
    writeFileSync(join(root, 'src', 'nested', 'leaf.ts'), 'export const leaf = 1;');
    writeFileSync(join(root, 'README.md'), '# hello');
    writeFileSync(join(root, 'node_modules', 'skip.js'), 'ignored');

    try {
      const tree = buildProjectTree(root, { maxDepth: 5, maxChildren: 10, maxNodes: 50 });
      expect(tree.projectId).toBe(root);
      expect(tree.tree.type).toBe('folder');
      expect(tree.tree.children.map(child => child.name)).toEqual(['src', 'README.md']);

      const src = tree.tree.children.find(child => child.name === 'src');
      expect(src.children.map(child => child.name)).toEqual(['nested', 'index.ts']);
      expect(tree.stats.files).toBe(3);
      expect(tree.stats.directories).toBe(3);
      expect(tree.stats.truncated).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('marks the tree as truncated when limits are hit', () => {
    const root = makeTmpDir();
    mkdirSync(join(root, 'src'), { recursive: true });
    writeFileSync(join(root, 'src', 'one.ts'), '1');
    writeFileSync(join(root, 'src', 'two.ts'), '2');

    try {
      const tree = buildProjectTree(root, { maxDepth: 5, maxChildren: 1, maxNodes: 10 });
      const src = tree.tree.children[0];
      expect(src.children).toHaveLength(1);
      expect(tree.stats.truncated).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
