import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const projectRoot = resolve(dirname(new URL(import.meta.url).pathname), "..");
const certificateRoot = resolve(projectRoot, "public/media/certificates");
const generatedRoot = resolve(certificateRoot, "_generated");
const popplerRoot = resolve(projectRoot, ".cache/poppler/root");
const pdftoppm = resolve(popplerRoot, "usr/bin/pdftoppm");
const pdftotext = resolve(popplerRoot, "usr/bin/pdftotext");
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
  const relativePath = relative(certificateRoot, file);
  const base = relativePath
    .replace(/\.pdf$/i, "")
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  const hash = createHash("sha1").update(relativePath).digest("hex").slice(0, 8);

  return `${base || "certificate"}-${hash}`;
}

function parseBBox(xml) {
  const pageMatch = xml.match(/<page[^>]*width="([0-9.]+)"[^>]*height="([0-9.]+)"/);
  const page = pageMatch
    ? { width: Number(pageMatch[1]), height: Number(pageMatch[2]) }
    : { width: 0, height: 0 };
  const words = [];
  const wordPattern = /<word[^>]*xMin="([0-9.]+)"[^>]*yMin="([0-9.]+)"[^>]*xMax="([0-9.]+)"[^>]*yMax="([0-9.]+)"[^>]*>(.*?)<\/word>/g;

  for (const match of xml.matchAll(wordPattern)) {
    words.push({
      xMin: Number(match[1]),
      yMin: Number(match[2]),
      xMax: Number(match[3]),
      yMax: Number(match[4]),
      text: match[5]
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\""),
    });
  }

  return { page, words };
}

function groupLines(words) {
  const sorted = [...words].sort((a, b) => a.yMin - b.yMin || a.xMin - b.xMin);
  const lines = [];

  for (const word of sorted) {
    const line = lines.find((item) => Math.abs(item.y - word.yMin) < 5);

    if (line) {
      line.words.push(word);
      line.y = (line.y + word.yMin) / 2;
    } else {
      lines.push({ y: word.yMin, words: [word] });
    }
  }

  return lines
    .map((line) => ({
      words: line.words.sort((a, b) => a.xMin - b.xMin),
      text: line.words.sort((a, b) => a.xMin - b.xMin).map((word) => word.text).join(" "),
    }))
    .sort((a, b) => a.words[0].yMin - b.words[0].yMin);
}

function unionBoxes(lines) {
  const words = lines.flatMap((line) => line.words);

  return {
    xMin: Math.min(...words.map((word) => word.xMin)),
    yMin: Math.min(...words.map((word) => word.yMin)),
    xMax: Math.max(...words.map((word) => word.xMax)),
    yMax: Math.max(...words.map((word) => word.yMax)),
  };
}

function validityBox(file) {
  const xml = run(pdftotext, ["-bbox", file, "-"]);
  const { page, words } = parseBBox(xml);
  const lines = groupLines(words);
  const selected = [];

  lines.forEach((line, index) => {
    const lineText = line.text;
    const hasValidityLabel = /действителен|valid/i.test(lineText);
    const hasDateRange = /\bс\s+\d{2}\.\d{2}\.\d{4}.*\bпо\s+\d{2}\.\d{2}\.\d{4}/i.test(lineText);

    if (hasValidityLabel || hasDateRange) {
      selected.push(line);

      const nextLine = lines[index + 1];
      if (nextLine && /\d{2}\.\d{2}\.\d{4}|^\s*с\b/i.test(nextLine.text)) {
        selected.push(nextLine);
      }
    }
  });

  if (!selected.length || !page.width || !page.height) {
    return null;
  }

  const box = unionBoxes(selected);
  const padding = 8;

  return {
    xMin: Math.max(0, box.xMin - padding),
    yMin: Math.max(0, box.yMin - padding),
    xMax: Math.min(page.width, box.xMax + padding),
    yMax: Math.min(page.height, box.yMax + padding),
    page,
  };
}

async function createPreview(file) {
  const name = safeName(file);
  const tmpPrefix = resolve(generatedRoot, `${name}-source`);
  const tmpPng = `${tmpPrefix}.png`;
  const outputName = `${name}.webp`;
  const outputPath = resolve(generatedRoot, outputName);
  const publicPath = `/media/certificates/_generated/${outputName}`;

  run(pdftoppm, ["-f", "1", "-singlefile", "-png", "-r", String(renderDpi), file, tmpPrefix]);

  const image = sharp(tmpPng);
  const metadata = await image.metadata();
  const redaction = validityBox(file);
  const composites = [];

  if (redaction && metadata.width && metadata.height) {
    const scaleX = metadata.width / redaction.page.width;
    const scaleY = metadata.height / redaction.page.height;
    const left = Math.max(0, Math.floor(redaction.xMin * scaleX));
    const top = Math.max(0, Math.floor(redaction.yMin * scaleY));
    const width = Math.min(metadata.width - left, Math.ceil((redaction.xMax - redaction.xMin) * scaleX));
    const height = Math.min(metadata.height - top, Math.ceil((redaction.yMax - redaction.yMin) * scaleY));

    composites.push({
      input: Buffer.from(
        `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" rx="10" fill="#fff"/></svg>`,
      ),
      left,
      top,
    });
  }

  const pipeline = sharp(tmpPng)
    .composite(composites)
    .resize({ width: maxPreviewWidth, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 });

  await pipeline.toFile(outputPath);

  const outMeta = await sharp(outputPath).metadata();

  unlinkSync(tmpPng);

  return {
    source: `/media/certificates/${relative(certificateRoot, file).split(/[\\/]/).map(encodeURIComponent).join("/")}`,
    preview: publicPath,
    width: outMeta.width ?? 900,
    height: outMeta.height ?? 1200,
    redactedValidity: Boolean(redaction),
  };
}

async function main() {
  if (!existsSync(pdftoppm) || !existsSync(pdftotext)) {
    throw new Error("Local Poppler binaries are missing. Prepare .cache/poppler before running this script.");
  }

  mkdirSync(generatedRoot, { recursive: true });

  const manifest = {};
  const sourceFiles = certificateFolders.flatMap((folder) => {
    const dir = resolve(certificateRoot, folder);

    return existsSync(dir) ? walk(dir) : [];
  });

  for (const name of readdirSync(generatedRoot)) {
    if (name.endsWith(".webp")) {
      unlinkSync(resolve(generatedRoot, name));
    }
  }

  for (const file of sourceFiles) {
    const item = await createPreview(file);
    manifest[item.source] = item;
    console.log(`${item.redactedValidity ? "masked" : "rendered"} ${item.source}`);
  }

  writeFileSync(resolve(generatedRoot, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
