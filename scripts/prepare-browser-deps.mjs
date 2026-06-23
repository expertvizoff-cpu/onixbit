import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { chromium } from "playwright";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cacheRoot = resolve(projectRoot, ".cache/playwright-deps");
const aptLists = resolve(cacheRoot, "apt-lists");
const aptCache = resolve(cacheRoot, "apt-cache");
const aptArchives = resolve(aptCache, "archives");
const statusFile = resolve(cacheRoot, "status");
const rootDir = resolve(cacheRoot, "root");

const fallbackPackages = [
  "at-spi2-common",
  "fontconfig",
  "fonts-freefont-ttf",
  "fonts-ipafont-gothic",
  "fonts-liberation",
  "fonts-noto-color-emoji",
  "fonts-tlwg-loma-otf",
  "fonts-unifont",
  "fonts-wqy-zenhei",
  "gir1.2-glib-2.0",
  "libasound2-data",
  "libasound2t64",
  "libatk-bridge2.0-0t64",
  "libatk1.0-0t64",
  "libatspi2.0-0t64",
  "libavahi-client3",
  "libavahi-common-data",
  "libavahi-common3",
  "libcairo2",
  "libcups2t64",
  "libdatrie1",
  "libdrm-amdgpu1",
  "libdrm-common",
  "libdrm-intel1",
  "libdrm2",
  "libfontenc1",
  "libfreetype6",
  "libgbm1",
  "libgl1",
  "libgl1-mesa-dri",
  "libglib2.0-0t64",
  "libglib2.0-bin",
  "libglib2.0-data",
  "libglvnd0",
  "libglx-mesa0",
  "libglx0",
  "libgraphite2-3",
  "libharfbuzz0b",
  "libice6",
  "libllvm20",
  "libnss3",
  "libpango-1.0-0",
  "libpciaccess0",
  "libpixman-1-0",
  "libsm6",
  "libthai-data",
  "libthai0",
  "libvulkan1",
  "libwayland-server0",
  "libx11-xcb1",
  "libxaw7",
  "libxcb-dri3-0",
  "libxcb-glx0",
  "libxcb-present0",
  "libxcb-randr0",
  "libxcb-render0",
  "libxcb-shm0",
  "libxcb-sync1",
  "libxcb-xfixes0",
  "libxcomposite1",
  "libxdamage1",
  "libxfixes3",
  "libxfont2",
  "libxi6",
  "libxkbfile1",
  "libxmu6",
  "libxrandr2",
  "libxshmfence1",
  "libxt6t64",
  "libxxf86vm1",
  "mesa-libgallium",
  "x11-xkb-utils",
  "xfonts-cyrillic",
  "xfonts-encodings",
  "xfonts-scalable",
  "xfonts-utils",
  "xserver-common",
  "xvfb",
];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || projectRoot,
    env: { ...process.env, ...(options.env || {}) },
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}


function detectMissingPackages() {
  const result = spawnSync("npx", ["playwright", "install-deps", "chromium", "--dry-run"], {
    cwd: projectRoot,
    env: process.env,
    encoding: "utf8",
  });

  const output = `${result.stdout || ""}\n${result.stderr || ""}`;
  const packages = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[a-z0-9][a-z0-9.+-]+$/i.test(line));

  return [...new Set(packages)];
}

function aptOptions() {
  return [
    `-o`, `Dir::State::lists=${aptLists}`,
    `-o`, `Dir::Cache=${aptCache}`,
    `-o`, `Dir::Cache::archives=${aptArchives}`,
    `-o`, `Dir::State::status=${statusFile}`,
    `-o`, `APT::Get::List-Cleanup=0`,
  ];
}

function ensureDirs() {
  for (const dir of [cacheRoot, aptLists, resolve(aptLists, "partial"), aptCache, aptArchives, resolve(aptArchives, "partial"), rootDir]) {
    mkdirSync(dir, { recursive: true });
  }
}

function ensureBrowser() {
  if (existsSync(chromium.executablePath())) {
    return;
  }

  run("npx", ["playwright", "install", "chromium"]);
}

function debFiles() {
  return readdirSync(cacheRoot)
    .filter((file) => file.endsWith(".deb"))
    .map((file) => resolve(cacheRoot, file));
}

if (process.platform !== "linux") {
  console.log("Local browser dependency preparation is only needed on Linux.");
  process.exit(0);
}

ensureDirs();
ensureBrowser();

const detectedPackages = detectMissingPackages();
const packages = detectedPackages.length > 0 ? detectedPackages : fallbackPackages;

if (detectedPackages.length === 0) {
  console.log("Playwright did not report missing packages; using fallback package list for local Chromium libs.");
}

run("apt-get", ["update", ...aptOptions()], { cwd: cacheRoot });
run("apt-get", [...aptOptions(), "download", ...packages], { cwd: cacheRoot });

for (const file of debFiles()) {
  run("dpkg-deb", ["-x", file, rootDir], { cwd: cacheRoot });
}

console.log(`Local browser dependencies are ready in ${rootDir}`);
console.log("Use npm run test:e2e or npm run lhci normally; scripts will load these libraries automatically.");
