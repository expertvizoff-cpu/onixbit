import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const projectRoot = resolve(dirname(new URL(import.meta.url).pathname), "..");
const certificateRoot = resolve(projectRoot, "public/media/certificates");
const generatedRoot = resolve(certificateRoot, "_generated");
const manifestPath = resolve(generatedRoot, "manifest.json");
const popplerRoot = resolve(projectRoot, ".cache/poppler/root");
const bundledPdftoppm = resolve(popplerRoot, "usr/bin/pdftoppm");
const pdftoppm = process.env.PDFTOPPM_PATH || (existsSync(bundledPdftoppm) ? bundledPdftoppm : "pdftoppm");
const popplerLibPath = [
  resolve(popplerRoot, "usr/lib/x86_64-linux-gnu"),
  resolve(projectRoot, ".cache/playwright-deps/root/usr/lib/x86_64-linux-gnu"),
  resolve(projectRoot, ".cache/playwright-deps/root/usr/lib"),
  process.env.LD_LIBRARY_PATH,
].filter(Boolean).join(":");

const certificateFolders = [
  "Битрикс24 сертификаты",
  "Битрикс24 компетенции",
  "1С-Битрикс сертификаты",
  "1С-Битрикс компетенции",
  "Дополнительно для Битрикс24",
  "Дополнительно для 1С-Битрикс",
  "1С",
  "Обучение основателя",
];

const renderDpi = 160;
const maxPreviewWidth = 1280;

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env: {
      ...process.env,
      LD_LIBRARY_PATH: popplerLibPath,
    },
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(`${command} failed for ${args.join(" ")}\n${result.stderr || result.stdout}`);
  }

  return result.stdout;
}

function walk(dir) {
  const files = [];

  for (const name of readdirSync(dir)) {
    if (name === "_generated") continue;

    const fullPath = join(dir, name);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (/\.pdf$/i.test(name)) {
      files.push(fullPath);
    }
  }

  return files.sort((a, b) => a.localeCompare(b, "ru"));
}

function safeName(file) {
  const hash = createHash("sha256")
    .update(readFileSync(file))
    .update("original-v1-160dpi-1280")
    .digest("hex")
    .slice(0, 16);

  return `original-${hash}`;
}

function sourceUrl(file) {
  return `/media/certificates/${relative(certificateRoot, file).split(/[\\/]/).map(encodeURIComponent).join("/")}`;
}

async function createPreview(file) {
  const name = safeName(file);
  const tmpPrefix = resolve(generatedRoot, `${name}-source`);
  const tmpPng = `${tmpPrefix}.png`;
  const outputName = `${name}.webp`;
  const outputPath = resolve(generatedRoot, outputName);
  const publicPath = `/media/certificates/_generated/${outputName}`;

  run(pdftoppm, ["-f", "1", "-singlefile", "-png", "-r", String(renderDpi), file, tmpPrefix]);

  // Render the original first page as-is: no masking, overlays or date removal.
  const pipeline = sharp(tmpPng)
    .resize({ width: maxPreviewWidth, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 });

  await pipeline.toFile(outputPath);

  const outMeta = await sharp(outputPath).metadata();

  unlinkSync(tmpPng);

  return {
    source: sourceUrl(file),
    preview: publicPath,
    width: outMeta.width ?? 900,
    height: outMeta.height ?? 1200,
    redactedValidity: false,
  };
}

async function main() {
  if (pdftoppm !== "pdftoppm" && !existsSync(pdftoppm)) {
    throw new Error("PDF renderer is missing. Set PDFTOPPM_PATH or install pdftoppm.");
  }

  mkdirSync(generatedRoot, { recursive: true });

  const restoreOnly = process.argv.includes("--restore-validity");
  const manifest = restoreOnly && existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf8"))
    : {};
  const sourceFiles = certificateFolders.flatMap((folder) => {
    const dir = resolve(certificateRoot, folder);

    return existsSync(dir) ? walk(dir) : [];
  }).filter((file) => !restoreOnly || manifest[sourceUrl(file)]?.redactedValidity);

  if (!restoreOnly) {
    for (const name of readdirSync(generatedRoot)) {
      if (name.endsWith(".webp")) {
        unlinkSync(resolve(generatedRoot, name));
      }
    }
  }

  for (const file of sourceFiles) {
    const item = await createPreview(file);
    manifest[item.source] = item;
    console.log(`original ${item.source}`);
  }

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
