import { existsSync } from "node:fs";
import { delimiter, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const localLibDir = resolve(projectRoot, ".cache/playwright-deps/root/usr/lib/x86_64-linux-gnu");
const localUsrLibDir = resolve(projectRoot, ".cache/playwright-deps/root/usr/lib");
const npmBinDir = resolve(projectRoot, "node_modules/.bin");
const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error("Usage: node scripts/run-with-local-browser-deps.mjs <command> [...args]");
  process.exit(1);
}

const env = { ...process.env };
env.PATH = [npmBinDir, env.PATH].filter(Boolean).join(delimiter);

if (process.platform === "linux" && existsSync(localLibDir)) {
  env.LD_LIBRARY_PATH = [localLibDir, localUsrLibDir, env.LD_LIBRARY_PATH]
    .filter(Boolean)
    .join(delimiter);
}

const child = spawn(command, args, {
  cwd: projectRoot,
  env,
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
