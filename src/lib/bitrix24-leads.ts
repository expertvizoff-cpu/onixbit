import "server-only";

import type { LeadSubmission } from "@/lib/lead-form";

interface BitrixResponse<T> {
  result?: T;
  error?: string;
  error_description?: string;
}

interface BitrixFields {
  [key: string]: string | number | Array<{ VALUE: string; VALUE_TYPE: string }> | undefined;
}

function webhookUrl(method: string): URL {
  const configured = process.env.BITRIX24_WEBHOOK_URL?.trim();
  if (!configured) throw new Error("BITRIX24_WEBHOOK_URL is not configured");

  const base = new URL(configured.endsWith("/") ? configured : `${configured}/`);
  if (base.protocol !== "https:") throw new Error("BITRIX24_WEBHOOK_URL must use HTTPS");
  const customHost = process.env.BITRIX24_ALLOWED_HOST?.trim().toLowerCase();
  if (!base.hostname.endsWith(".bitrix24.ru") && base.hostname.toLowerCase() !== customHost) {
    throw new Error("BITRIX24_WEBHOOK_URL host is not allowed");
  }
  if (!/^\/rest\/\d+\/[^/]+\/?$/.test(base.pathname)) {
    throw new Error("BITRIX24_WEBHOOK_URL must be an incoming webhook base URL");
  }
  base.search = "";
  base.hash = "";
  return new URL(`${method}.json`, base);
}

async function requestBitrix<T>(method: string, params: Record<string, unknown>): Promise<T> {
  const response = await fetch(webhookUrl(method), {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(params),
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(12_000),
  });
  const payload = (await response.json().catch(() => ({}))) as BitrixResponse<T>;
  if (!response.ok || payload.error || payload.result === undefined) {
    throw new Error(`Bitrix24 ${method} rejected the request`);
  }
  return payload.result;
}

async function callBitrix<T>(method: string, fields: BitrixFields): Promise<T> {
  const compactFields = Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined && value !== ""),
  );
  return requestBitrix<T>(method, { fields: compactFields });
}

async function findContact(lead: LeadSubmission): Promise<number | undefined> {
  const checks = [
    lead.phone ? { TYPE: "PHONE", VALUES: lead.phone } : undefined,
    lead.email ? { TYPE: "EMAIL", VALUES: lead.email } : undefined,
  ].filter((value): value is { TYPE: string; VALUES: string } => Boolean(value));

  for (const fields of checks) {
    const result = await requestBitrix<Record<string, number[]>>("crm.duplicate.findbycomm", {
      type: fields.TYPE,
      values: [fields.VALUES],
      entity_type: "CONTACT",
    });
    const contactId = result.CONTACT?.find((value) => Number.isInteger(value) && value > 0);
    if (contactId) return contactId;
  }
  return undefined;
}

async function dealAlreadyExists(requestId: string): Promise<boolean> {
  const result = await requestBitrix<Array<{ ID?: string }>>("crm.deal.list", {
    filter: {
      ORIGINATOR_ID: "ONIXBIT_SITE",
      ORIGIN_ID: requestId,
    },
    select: ["ID"],
    start: 0,
  });
  return result.some((deal) => Boolean(deal.ID));
}

function sourceDescription(lead: LeadSubmission): string {
  const values = [lead.source, lead.pageTitle, lead.pageUrl].filter(Boolean);
  return values.join(" · ").slice(0, 1000);
}

function marketingFields(lead: LeadSubmission): BitrixFields {
  return {
    SOURCE_ID: process.env.BITRIX24_SOURCE_ID?.trim() || "WEBFORM",
    SOURCE_DESCRIPTION: sourceDescription(lead),
    UTM_SOURCE: lead.utm.utm_source,
    UTM_MEDIUM: lead.utm.utm_medium,
    UTM_CAMPAIGN: lead.utm.utm_campaign,
    UTM_CONTENT: lead.utm.utm_content,
    UTM_TERM: lead.utm.utm_term,
  };
}

function optionalNumber(name: string): number | undefined {
  const value = process.env[name]?.trim();
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

export async function sendLeadToBitrix24(lead: LeadSubmission): Promise<void> {
  if (await dealAlreadyExists(lead.requestId)) return;

  const existingContactId = await findContact(lead);
  const contactId = existingContactId || await callBitrix<number>("crm.contact.add", {
      NAME: lead.name || (!lead.lastName ? "Заявка с сайта" : undefined),
      LAST_NAME: lead.lastName,
      PHONE: lead.phone ? [{ VALUE: lead.phone, VALUE_TYPE: "WORK" }] : undefined,
      EMAIL: lead.email ? [{ VALUE: lead.email, VALUE_TYPE: "WORK" }] : undefined,
      ...marketingFields(lead),
    });

  const contactName = [lead.name, lead.lastName].filter(Boolean).join(" ");
  await callBitrix<number>("crm.deal.add", {
    TITLE: `Заявка с onixbit.ru${contactName ? ` — ${contactName}` : ""}`,
    CONTACT_ID: contactId,
    COMMENTS: lead.comments,
    CATEGORY_ID: optionalNumber("BITRIX24_DEAL_CATEGORY_ID"),
    STAGE_ID: process.env.BITRIX24_DEAL_STAGE_ID?.trim(),
    ASSIGNED_BY_ID: optionalNumber("BITRIX24_ASSIGNED_BY_ID"),
    ORIGINATOR_ID: "ONIXBIT_SITE",
    ORIGIN_ID: lead.requestId,
    ...marketingFields(lead),
  });
}
