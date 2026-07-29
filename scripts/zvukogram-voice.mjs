import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { userInfo } from "node:os";
import { basename, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const API_BASE_URL = "https://zvukogram.com/index.php?r=api";
const ALLOWED_PROJECT_NAMES = new Set(["onixbit", "onixbit-b24"]);
const ALLOWED_SYSTEM_USERS = new Set(["aleksander"]);
const SHORT_TEXT_LIMIT = 1000;
const DEFAULT_POLL_DELAY_MS = 2000;
const DEFAULT_POLL_ATTEMPTS = 600;
const DEFAULT_OUTPUT_DIR = "voice/zvukogram/output";
const DEFAULT_STANDARD_FORMAT = "mp3";
const DEFAULT_STANDARD_SAMPLE_RATE = "48000";
const DEFAULT_STANDARD_BITRATE = "128";
const DEFAULT_STANDARD_CHANNELS = "2";
const DEFAULT_SPEED = "0.92";
const DEFAULT_PITCH = "-1";
const DEFAULT_PAUSE_SENTENCE = "350";
const DEFAULT_PAUSE_PARAGRAPH = "650";
const DEFAULT_VOLUME = "100";
const PHONE_FORMAT = "wav";
const PHONE_SAMPLE_RATE = "8000";
const PHONE_CHANNELS = "1";

const args = process.argv.slice(2);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

assertAllowedUsage();
loadEnvFiles();

if (args.includes("--help") || args.includes("-h")) {
  printHelp();
  process.exit(0);
}

try {
  const options = parseOptions(args);

  if (options.balance) {
    const balance = await requestJson("/balance", readAuth());
    console.log(JSON.stringify(balance, null, 2));
    process.exit(0);
  }

  const text = readInputText(options);
  const fallbackName = options.textPath ? basename(options.textPath, extname(options.textPath)) : "zvukogram";
  const baseName = options.name || slugify(fallbackName);

  if (options.dryRun) {
    printDryRun(text, baseName, options);
    process.exit(0);
  }

  const auth = readAuth();
  const outDir = resolve(projectRoot, options.outDir || DEFAULT_OUTPUT_DIR);
  mkdirSync(outDir, { recursive: true });

  const standardResult = await generateAndSave({
    auth,
    text,
    baseName,
    outDir,
    variant: "standard",
    params: buildVoiceParams(options, {
      format: options.format || DEFAULT_STANDARD_FORMAT,
      sampleRate: options.sampleRate || DEFAULT_STANDARD_SAMPLE_RATE,
      bitrate: options.bitrate || DEFAULT_STANDARD_BITRATE,
      channels: options.channels || DEFAULT_STANDARD_CHANNELS,
    }),
  });

  const results = [standardResult];

  if (options.phone) {
    const phoneResult = await generateAndSave({
      auth,
      text,
      baseName,
      outDir,
      variant: "phone",
      params: buildVoiceParams(options, {
        format: PHONE_FORMAT,
        sampleRate: PHONE_SAMPLE_RATE,
        bitrate: "",
        channels: PHONE_CHANNELS,
      }),
    });
    results.push(phoneResult);
  }

  writeManifest(outDir, baseName, text, options, results);
  printResult(results);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}

function assertAllowedUsage() {
  const projectName = basename(projectRoot);
  const parentProjectName = basename(dirname(projectRoot));
  const allowedProjectName =
    projectName === "site" && parentProjectName === "onixbit"
      ? parentProjectName
      : projectName;
  const currentUser = userInfo().username;

  if (!ALLOWED_PROJECT_NAMES.has(allowedProjectName)) {
    throw new Error(
      "Zvukogram generation is allowed only inside onixbit/onixbit-b24 projects. Current project: " +
        allowedProjectName,
    );
  }

  if (!ALLOWED_SYSTEM_USERS.has(currentUser)) {
    throw new Error("Zvukogram generation is allowed only for the local owner account.");
  }
}

function printHelp() {
  console.log([
    "Usage:",
    "  npm run voice:zvukogram -- --text voice/zvukogram/texts/after-hours.txt --name after-hours",
    "  npm run voice:zvukogram -- --text voice/zvukogram/texts/after-hours.txt --name after-hours --phone",
    "  npm run voice:zvukogram -- --inline \"Здравствуйте. Компания Ониксбит.\" --name test --dry-run",
    "  npm run voice:zvukogram -- --balance",
    "",
    "Required environment:",
    "  ZVUKOGRAM_EMAIL       Account email.",
    "  ZVUKOGRAM_TOKEN       Secret API token from the Zvukogram profile.",
    "  ZVUKOGRAM_VOICE       Voice name, for example the selected female voice.",
    "",
    "Useful options:",
    "  --text <path>         Text file to voice.",
    "  --inline <text>       Inline text instead of a file.",
    "  --name <slug>         Output file base name.",
    "  --out <dir>           Output directory. Default: " + DEFAULT_OUTPUT_DIR,
    "  --phone               Also generate WAV 8000 Hz mono for telephony.",
    "  --voice <name>        Override ZVUKOGRAM_VOICE.",
    "  --speed <number>      Speech speed, for example 0.92.",
    "  --pitch <number>      Voice pitch, for example -1.",
    "  --pause-sentence <ms> Pause between sentences.",
    "  --pause-paragraph <ms> Pause between paragraphs.",
    "  --volume <number>     Output volume, 10..200.",
    "  --format <format>     Standard output format. Default: mp3.",
    "  --sample-rate <hz>    Standard output sample rate. Default: 48000.",
    "  --bitrate <kbps>      Standard lossy bitrate. Default: 128.",
    "  --channels <1|2>      Standard output channels. Default: 2.",
    "  --dry-run             Print safe request parameters without calling the API.",
    "",
    "Safety rules:",
    "  - This helper runs only in onixbit/onixbit-b24 projects.",
    "  - This helper runs only for the local owner account.",
    "",
    "Notes:",
    "  - Text up to " + SHORT_TEXT_LIMIT + " characters uses /text.",
    "  - Longer text uses /longtext and polls /result.",
    "  - --phone costs a second generation request in Zvukogram.",
  ].join("\n"));
}

function loadEnvFiles() {
  const customFile = process.env.ZVUKOGRAM_ENV_FILE ? resolve(projectRoot, process.env.ZVUKOGRAM_ENV_FILE) : undefined;
  const envFiles = [
    { path: resolve(projectRoot, ".env"), override: false },
    { path: resolve(projectRoot, ".env.local"), override: true },
    customFile ? { path: customFile, override: true } : undefined,
  ].filter(Boolean);

  for (const envFile of envFiles) {
    if (!existsSync(envFile.path)) {
      continue;
    }

    const content = readFileSync(envFile.path, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const equalsIndex = trimmed.indexOf("=");
      if (equalsIndex <= 0) {
        continue;
      }

      const key = trimmed.slice(0, equalsIndex).trim();
      const value = unquoteEnvValue(trimmed.slice(equalsIndex + 1).trim());
      if (envFile.override || process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

function unquoteEnvValue(value) {
  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  return value;
}

function parseOptions(values) {
  const options = {
    balance: false,
    dryRun: false,
    phone: false,
  };

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];

    switch (value) {
      case "--balance":
        options.balance = true;
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--phone":
        options.phone = true;
        break;
      case "--text":
        options.textPath = readFlagValue(values, index);
        index += 1;
        break;
      case "--inline":
        options.inlineText = readFlagValue(values, index);
        index += 1;
        break;
      case "--name":
        options.name = slugify(readFlagValue(values, index));
        index += 1;
        break;
      case "--out":
        options.outDir = readFlagValue(values, index);
        index += 1;
        break;
      case "--voice":
        options.voice = readFlagValue(values, index);
        index += 1;
        break;
      case "--speed":
        options.speed = readFlagValue(values, index);
        index += 1;
        break;
      case "--pitch":
        options.pitch = readFlagValue(values, index);
        index += 1;
        break;
      case "--style":
        options.style = readFlagValue(values, index);
        index += 1;
        break;
      case "--styledegree":
        options.styledegree = readFlagValue(values, index);
        index += 1;
        break;
      case "--pause-sentence":
        options.pauseSentence = readFlagValue(values, index);
        index += 1;
        break;
      case "--pause-paragraph":
        options.pauseParagraph = readFlagValue(values, index);
        index += 1;
        break;
      case "--volume":
        options.volume = readFlagValue(values, index);
        index += 1;
        break;
      case "--format":
        options.format = readFlagValue(values, index);
        index += 1;
        break;
      case "--sample-rate":
        options.sampleRate = readFlagValue(values, index);
        index += 1;
        break;
      case "--bitrate":
        options.bitrate = readFlagValue(values, index);
        index += 1;
        break;
      case "--channels":
        options.channels = readFlagValue(values, index);
        index += 1;
        break;
      default:
        throw new Error("Unknown option \"" + value + "\". Run with --help to see supported options.");
    }
  }

  if (!options.balance && !options.textPath && !options.inlineText) {
    throw new Error("Pass --text <path>, --inline <text>, or --balance.");
  }

  if (options.textPath && options.inlineText) {
    throw new Error("Use either --text or --inline, not both.");
  }

  return options;
}

function readFlagValue(values, index) {
  const next = values[index + 1];
  if (!next || next.startsWith("--")) {
    throw new Error("Missing value after " + values[index] + ".");
  }

  return next;
}

function readInputText(options) {
  if (options.inlineText) {
    return normalizeText(options.inlineText);
  }

  const textPath = resolve(projectRoot, options.textPath);
  if (!existsSync(textPath)) {
    throw new Error("Text file not found: " + textPath);
  }

  const text = readFileSync(textPath, "utf8");
  return normalizeText(text);
}

function normalizeText(text) {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    throw new Error("Text is empty.");
  }

  return normalized;
}

function readAuth() {
  const token = process.env.ZVUKOGRAM_TOKEN?.trim();
  const email = process.env.ZVUKOGRAM_EMAIL?.trim();

  if (!token) {
    throw new Error("Set ZVUKOGRAM_TOKEN in .env or .env.local.");
  }

  if (!email) {
    throw new Error("Set ZVUKOGRAM_EMAIL in .env or .env.local.");
  }

  return { token, email };
}

function buildVoiceParams(options, audio) {
  const voice = options.voice || process.env.ZVUKOGRAM_VOICE;
  if (!voice) {
    throw new Error("Set ZVUKOGRAM_VOICE in .env/.env.local or pass --voice.");
  }

  return removeEmptyValues({
    voice,
    speed: options.speed || process.env.ZVUKOGRAM_SPEED || DEFAULT_SPEED,
    pitch: options.pitch || process.env.ZVUKOGRAM_PITCH || DEFAULT_PITCH,
    style: options.style || process.env.ZVUKOGRAM_STYLE,
    styledegree: options.styledegree || process.env.ZVUKOGRAM_STYLEDEGREE,
    pause_sentence: options.pauseSentence || process.env.ZVUKOGRAM_PAUSE_SENTENCE || DEFAULT_PAUSE_SENTENCE,
    pause_paragraph: options.pauseParagraph || process.env.ZVUKOGRAM_PAUSE_PARAGRAPH || DEFAULT_PAUSE_PARAGRAPH,
    volume: options.volume || process.env.ZVUKOGRAM_VOLUME || DEFAULT_VOLUME,
    format: audio.format,
    sample_rate: audio.sampleRate,
    bitrate: audio.bitrate,
    channels: audio.channels,
  });
}

function removeEmptyValues(input) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== ""),
  );
}

function printDryRun(text, baseName, options) {
  const standardParams = buildVoiceParams(options, {
    format: options.format || DEFAULT_STANDARD_FORMAT,
    sampleRate: options.sampleRate || DEFAULT_STANDARD_SAMPLE_RATE,
    bitrate: options.bitrate || DEFAULT_STANDARD_BITRATE,
    channels: options.channels || DEFAULT_STANDARD_CHANNELS,
  });

  const payload = {
    mode: text.length <= SHORT_TEXT_LIMIT ? "text" : "longtext",
    baseName,
    characters: text.length,
    standard: standardParams,
  };

  if (options.phone) {
    payload.phone = buildVoiceParams(options, {
      format: PHONE_FORMAT,
      sampleRate: PHONE_SAMPLE_RATE,
      bitrate: "",
      channels: PHONE_CHANNELS,
    });
  }

  console.log(JSON.stringify(payload, null, 2));
}

async function generateAndSave({ auth, text, baseName, outDir, variant, params }) {
  const response = await synthesizeText(auth, text, params);
  const audioUrl = response.file || response.file_cors;
  if (!audioUrl) {
    throw new Error("Zvukogram did not return an audio file for " + variant + ".");
  }

  const extension = response.format || params.format;
  const filename = variant === "standard" ? baseName + "." + extension : baseName + "-" + variant + "." + extension;
  const outputPath = resolve(outDir, filename);
  const audio = await downloadAudio(audioUrl);
  writeFileSync(outputPath, audio);

  return {
    variant,
    outputPath,
    id: response.id,
    duration: response.duration,
    cost: response.cost,
    format: extension,
    balans: response.balans,
  };
}

async function synthesizeText(auth, text, params) {
  if (text.length <= SHORT_TEXT_LIMIT) {
    return requestJson("/text", {
      ...auth,
      ...params,
      text,
    });
  }

  const created = await requestJson("/longtext", {
    ...auth,
    ...params,
    text,
  });

  if (!created.id) {
    throw new Error("Zvukogram did not return a task id: " + JSON.stringify(created));
  }

  return waitForResult(auth, created.id);
}

async function waitForResult(auth, id) {
  for (let attempt = 0; attempt < DEFAULT_POLL_ATTEMPTS; attempt += 1) {
    const result = await requestJson("/result", {
      ...auth,
      id,
    });

    if (Number(result.status) === 1) {
      return result;
    }

    if (Number(result.status) === -1) {
      throw new Error(result.error || "Zvukogram task " + id + " failed.");
    }

    await delay(DEFAULT_POLL_DELAY_MS);
  }

  throw new Error("Zvukogram task " + id + " did not finish in time.");
}

async function requestJson(pathname, data) {
  const response = await fetch(API_BASE_URL + pathname, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data).toString(),
  });

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error("Zvukogram API error " + response.status + ": " + bodyText);
  }

  let json;
  try {
    json = JSON.parse(bodyText);
  } catch {
    throw new Error("Zvukogram returned non-JSON response: " + bodyText.slice(0, 300));
  }

  if (Number(json.status) === -1) {
    throw new Error(json.error || "Zvukogram returned an error.");
  }

  return json;
}

async function downloadAudio(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not download audio " + response.status + ": " + url);
  }

  return Buffer.from(await response.arrayBuffer());
}

function writeManifest(outDir, baseName, text, options, results) {
  const manifestPath = resolve(outDir, baseName + ".json");
  const manifest = {
    createdAt: new Date().toISOString(),
    characters: text.length,
    textPreview: text.slice(0, 160),
    source: options.textPath || "inline",
    results: results.map((result) => ({
      ...result,
      outputPath: makeRelative(result.outputPath),
    })),
  };

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

function printResult(results) {
  console.log("Generated:");
  for (const result of results) {
    const relativePath = makeRelative(result.outputPath);
    const cost = result.cost === undefined || result.cost === "" ? "" : ", cost " + result.cost;
    const duration = result.duration === undefined || result.duration === "" ? "" : ", " + result.duration + "s";
    console.log("- " + relativePath + duration + cost);
  }
}

function makeRelative(path) {
  const prefix = projectRoot + "/";
  return path.startsWith(prefix) ? path.slice(prefix.length) : path;
}

function slugify(value) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё_-]+/giu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "voice";
}

function delay(ms) {
  return new Promise((resolveDelay) => {
    setTimeout(resolveDelay, ms);
  });
}
