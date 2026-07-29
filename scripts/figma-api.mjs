import { readFileSync } from "node:fs";

const baseUrl = "https://api.figma.com/v1/";
const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  printHelp();
  process.exit(0);
}

const token = readToken();
const command = args[0];

try {
  const result = await runCommand(command, args.slice(1));
  if (result !== undefined) {
    writeResult(result);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}

function printHelp() {
  console.log(`Usage:
  npm run figma:api -- me
  npm run figma:api -- file <file-key-or-figma-url> [--depth <n>]
  npm run figma:api -- node <file-key-or-figma-url> <node-id>
  npm run figma:api -- image <file-key-or-figma-url> <node-id> [--format png|jpg|svg] [--scale <n>]

Environment:
  FIGMA_OAUTH_TOKEN   Required. Figma personal access token.
  FIGMA_TOKEN_FILE    Optional. Read the token from this file instead of the env var.

Notes:
  - Requests are sent with the Figma REST API header X-Figma-Token.
  - Node IDs from Figma URLs can use either "1-5" or "1:5"; the helper normalizes them.
`);
}

function readToken() {
  const tokenFile = process.env.FIGMA_TOKEN_FILE?.trim();
  if (tokenFile) {
    const fileToken = readFileSync(tokenFile, "utf8").trim();
    if (fileToken) {
      return fileToken;
    }
  }

  const envToken = process.env.FIGMA_OAUTH_TOKEN?.trim();
  if (envToken) {
    return envToken;
  }

  throw new Error("Set FIGMA_TOKEN_FILE or FIGMA_OAUTH_TOKEN before using this helper.");
}

async function runCommand(commandName, commandArgs) {
  switch (commandName) {
    case "me":
      return requestJson("/me");
    case "file":
      return runFileCommand(commandArgs);
    case "node":
      return runNodeCommand(commandArgs);
    case "image":
      return runImageCommand(commandArgs);
    default:
      throw new Error(`Unknown command "${commandName}". Run with --help to see the supported commands.`);
  }
}

async function runFileCommand(commandArgs) {
  const { fileKey, options } = parseFileInput(commandArgs, true);
  return requestJson(`/files/${fileKey}`, options);
}

async function runNodeCommand(commandArgs) {
  const { fileKey, nodeId, remaining } = parseNodeInput(commandArgs);
  if (remaining.length > 0) {
    throw new Error(`Unexpected extra arguments: ${remaining.join(" ")}`);
  }

  return requestJson(`/files/${fileKey}/nodes`, { ids: nodeId });
}

async function runImageCommand(commandArgs) {
  const { fileKey, nodeId, remaining } = parseNodeInput(commandArgs);
  const options = parseKeyValueFlags(remaining);

  const format = options.format || "png";
  const scale = options.scale || "1";
  const useAbsoluteBounds = options.use_absolute_bounds || options.useAbsoluteBounds || undefined;

  return requestJson(`/images/${fileKey}`, {
    ids: nodeId,
    format,
    scale,
    ...(useAbsoluteBounds ? { use_absolute_bounds: "true" } : {}),
  });
}

function parseFileInput(commandArgs, allowDepth) {
  if (commandArgs.length === 0) {
    throw new Error("Missing file key or Figma URL.");
  }

  const [rawInput, ...rest] = commandArgs;
  const { fileKey } = parseFigmaReference(rawInput);
  const options = parseKeyValueFlags(rest);

  if (allowDepth && options.depth === undefined) {
    const depthIndex = rest.findIndex((value) => value === "--depth");
    if (depthIndex >= 0) {
      const depth = rest[depthIndex + 1];
      if (!depth) {
        throw new Error("Missing value after --depth.");
      }
      options.depth = depth;
    }
  }

  return { fileKey, options };
}

function parseNodeInput(commandArgs) {
  if (commandArgs.length === 0) {
    throw new Error("Missing file key or Figma URL.");
  }

  const [rawInput, secondArg, ...rest] = commandArgs;
  const parsed = parseFigmaReference(rawInput);

  if (parsed.nodeId && (secondArg === undefined || secondArg.startsWith("--"))) {
    return { fileKey: parsed.fileKey, nodeId: parsed.nodeId, remaining: rest };
  }

  if (secondArg === undefined) {
    throw new Error("Missing node id.");
  }

  return {
    fileKey: parsed.fileKey,
    nodeId: normalizeNodeId(secondArg),
    remaining: rest,
  };
}

function parseFigmaReference(input) {
  if (!looksLikeUrl(input)) {
    return {
      fileKey: input,
      nodeId: undefined,
    };
  }

  const url = new URL(input);
  const fileMatch = url.pathname.match(/\/(?:file|design)\/([A-Za-z0-9]+)/);
  if (!fileMatch) {
    throw new Error(`Could not read a Figma file key from URL: ${input}`);
  }

  const nodeId = url.searchParams.get("node-id");
  return {
    fileKey: fileMatch[1],
    nodeId: nodeId ? normalizeNodeId(nodeId) : undefined,
  };
}

function looksLikeUrl(value) {
  return /^https?:\/\//i.test(value);
}

function normalizeNodeId(value) {
  return value.replace(/-/g, ":");
}

function parseKeyValueFlags(values) {
  const result = {};

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) {
      continue;
    }

    const key = value.slice(2);
    const next = values[index + 1];
    if (!next || next.startsWith("--")) {
      throw new Error(`Missing value after ${value}.`);
    }

    result[key] = next;
    index += 1;
  }

  return result;
}

async function requestJson(pathname, searchParams = {}) {
  const url = new URL(pathname.replace(/^\/+/, ""), baseUrl);

  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-Figma-Token": token,
    },
  });

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(formatError(response.status, response.statusText, url, bodyText));
  }

  if (!bodyText) {
    return null;
  }

  try {
    return JSON.parse(bodyText);
  } catch {
    return bodyText;
  }
}

function formatError(status, statusText, url, bodyText) {
  const suffix = bodyText ? `\n${bodyText}` : "";
  return `Figma API request failed (${status} ${statusText}) for ${url}${suffix}`;
}

function writeResult(result) {
  if (typeof result === "string") {
    console.log(result);
    return;
  }

  console.log(JSON.stringify(result, null, 2));
}
