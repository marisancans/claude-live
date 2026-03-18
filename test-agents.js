import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get all files in current directory
function getAllFiles(dir = ".") {
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => fs.statSync(path.join(dir, f)).isFile())
      .map((f) => path.join(dir, f));
  } catch {
    return [];
  }
}

// Pick random items from array
function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

// Agent function
async function agent(id, interval = 2000) {
  console.log(`[Agent ${id}] Started`);

  const tick = () => {
    const allFiles = getAllFiles();
    const randomCount = Math.floor(Math.random() * 3) + 1; // 1-3 files
    const randomFiles = pickRandom(allFiles, randomCount);

    console.log(
      `[Agent ${id}] Processing ${randomFiles.length} files:`,
      randomFiles.join(", ")
    );

    // Simulate work
    randomFiles.forEach((file) => {
      try {
        const stats = fs.statSync(file);
        console.log(`  ├─ ${file}: ${stats.size} bytes`);
      } catch {
        console.log(`  ├─ ${file}: (error reading)`);
      }
    });
  };

  // Run immediately and then every interval
  tick();
  setInterval(tick, interval);
}

// Start 3 agents
console.log("Starting 3 test agents...\n");
agent(1);
agent(2);
agent(3);

console.log("\nPress Ctrl+C to stop\n");
