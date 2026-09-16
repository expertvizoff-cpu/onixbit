import { sendLeadToBitrix24 } from "@/lib/bitrix24-leads";
import { validateLeadSubmission } from "@/lib/lead-form";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16_384;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const recentRequests = new Map<string, number[]>();
const completedRequestIds = new Map<string, number>();

function json(body: object, status: number, headers?: HeadersInit): Response {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      ...headers,
    },
  });
}

function requestOriginIsAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const allowed = new Set([new URL(request.url).origin]);
  process.env.LEAD_ALLOWED_ORIGINS?.split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .forEach((value) => allowed.add(value));

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host")?.trim();
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (host) {
    const protocol = forwardedProtocol || new URL(request.url).protocol.replace(":", "");
    const candidate = new URL(`${protocol}://${host}`);
    if (["localhost", "127.0.0.1", "::1"].includes(candidate.hostname)) {
      allowed.add(candidate.origin);
    }
  }
  return allowed.has(origin);
}

function clientKey(request: Request): string {
  return request.headers.get("x-real-ip")?.trim()
    || request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim()
    || "unknown";
}

function rateLimited(request: Request, now: number): boolean {
  const key = clientKey(request);
  const entries = (recentRequests.get(key) || []).filter((timestamp) => now - timestamp < WINDOW_MS);
  entries.push(now);
  recentRequests.set(key, entries);

  if (recentRequests.size > 500) {
    for (const [storedKey, timestamps] of recentRequests) {
      if (!timestamps.some((timestamp) => now - timestamp < WINDOW_MS)) recentRequests.delete(storedKey);
    }
  }
  return entries.length > MAX_REQUESTS_PER_WINDOW;
}

function rememberRequest(requestId: string, now: number): boolean {
  for (const [storedId, timestamp] of completedRequestIds) {
    if (now - timestamp > WINDOW_MS) completedRequestIds.delete(storedId);
  }
  if (completedRequestIds.has(requestId)) return false;
  completedRequestIds.set(requestId, now);
  return true;
}

export async function POST(request: Request): Promise<Response> {
  if (!requestOriginIsAllowed(request)) {
    return json({ ok: false, message: "Запрос отклонён." }, 403);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, message: "Неверный формат запроса." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return json({ ok: false, message: "Данные формы слишком большие." }, 413);
  }

  const now = Date.now();
  if (rateLimited(request, now)) {
    return json(
      { ok: false, message: "Слишком много попыток. Попробуйте через несколько минут." },
      429,
      { "retry-after": "600" },
    );
  }

  let payload: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return json({ ok: false, message: "Данные формы слишком большие." }, 413);
    }
    payload = JSON.parse(raw) as unknown;
  } catch {
    return json({ ok: false, message: "Не удалось прочитать данные формы." }, 400);
  }

  const validation = validateLeadSubmission(payload);
  if (!validation.data) {
    return json(
      { ok: false, message: "Проверьте заполненные поля.", errors: validation.errors },
      400,
    );
  }

  if (validation.data.website) {
    return json({ ok: true }, 200);
  }
  if (!rememberRequest(validation.data.requestId, now)) {
    return json({ ok: true }, 200);
  }

  try {
    await sendLeadToBitrix24(validation.data);
    return json({ ok: true }, 201);
  } catch {
    completedRequestIds.delete(validation.data.requestId);
    return json(
      { ok: false, message: "Не удалось отправить заявку. Позвоните нам или попробуйте ещё раз." },
      502,
    );
  }
}
