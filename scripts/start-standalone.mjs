import { existsSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const optionValue = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
};

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const standaloneRoot = resolve(projectRoot, ".next/standalone");
const serverFile = resolve(standaloneRoot, "server.js");

if (!existsSync(serverFile)) {
  console.error("Standalone build not found. Run `npm run build` first.");
  process.exit(1);
}

const links = [
  [resolve(projectRoot, "public"), resolve(standaloneRoot, "public")],
  [resolve(projectRoot, ".next/static"), resolve(standaloneRoot, ".next/static")],
];

for (const [source, target] of links) {
  if (!existsSync(source)) continue;
  mkdirSync(dirname(target), { recursive: true });
  rmSync(target, { recursive: true, force: true });
  symlinkSync(source, target, "dir");
}

process.env.HOSTNAME = optionValue("hostname", process.env.HOSTNAME || "127.0.0.1");
process.env.PORT = optionValue("port", process.env.PORT || "3000");

await import(pathToFileURL(serverFile).href);
