import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { TranscriptParser } from './transcript-parser.js';

function listSessionFiles(projectsDir) {
  const files = [];

  let entries;
  try {
    entries = readdirSync(projectsDir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const dirPath = join(projectsDir, entry.name);
    let sessionFiles;
    try {
      sessionFiles = readdirSync(dirPath).filter(name => name.endsWith('.jsonl'));
    } catch {
      continue;
    }

    for (const file of sessionFiles) {
      const filePath = join(dirPath, file);
      try {
        files.push({ filePath, mtime: statSync(filePath).mtimeMs });
      } catch {
        // ignore unreadable files
      }
    }
  }

  return files.sort((a, b) => a.mtime - b.mtime);
}

export function readProjectHistoryFromDisk(projectsDir, projectId, options = {}) {
  const normalizedProjectId = resolve(projectId);
  const maxSessions = options.maxSessions ?? 40;
  const maxEvents = options.maxEvents ?? 4000;
  const files = listSessionFiles(projectsDir);
  const selectedFiles = files.slice(-maxSessions);
  const events = [];

  for (const { filePath } of selectedFiles) {
    const parser = new TranscriptParser(event => {
      if (typeof event.cwd !== 'string') return;
      if (resolve(event.cwd) !== normalizedProjectId) return;
      events.push(event);
      if (events.length > maxEvents) events.splice(0, events.length - maxEvents);
    });

    let text;
    try {
      text = readFileSync(filePath, 'utf8');
    } catch {
      continue;
    }

    for (const line of text.split('\n')) {
      if (!line.trim()) continue;
      parser.processLine(line);
    }
  }

  return events.sort((a, b) => a.timestamp - b.timestamp);
}
