import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { chromium } from "playwright";

const env = {
  ...process.env,
  CHROME_PATH: process.env.CHROME_PATH || chromium.executablePath(),
};

const lhciBin = process.platform === "win32"
  ? resolve("node_modules/.bin/lhci.cmd")
  : resolve("node_modules/.bin/lhci");

const child = spawn(lhciBin, ["autorun", "--config=./lighthouserc.cjs"], {
  env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
