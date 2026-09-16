export const leadUtmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type LeadUtmKey = (typeof leadUtmKeys)[number];

export interface LeadSubmission {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  comments: string;
  consent: boolean;
  website: string;
  pageUrl: string;
  pageTitle: string;
  source: string;
  requestId: string;
  utm: Record<LeadUtmKey, string>;
}

export interface LeadValidationResult {
  data?: LeadSubmission;
  errors: Partial<Record<keyof LeadSubmission | "contact", string>>;
}

const limits = {
  name: 80,
  lastName: 80,
  phone: 40,
  email: 254,
  comments: 2000,
  pageUrl: 1000,
  pageTitle: 180,
  source: 180,
  requestId: 100,
  utm: 180,
} as const;

function text(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateLeadSubmission(value: unknown): LeadValidationResult {
  if (!isRecord(value)) {
    return { errors: { contact: "Проверьте данные формы и попробуйте ещё раз." } };
  }

  const rawUtm = isRecord(value.utm) ? value.utm : {};
  const utm = Object.fromEntries(
    leadUtmKeys.map((key) => [key, text(rawUtm[key], limits.utm)]),
  ) as Record<LeadUtmKey, string>;

  const data: LeadSubmission = {
    name: text(value.name, limits.name),
    lastName: text(value.lastName, limits.lastName),
    phone: text(value.phone, limits.phone),
    email: text(value.email, limits.email).toLowerCase(),
    comments: text(value.comments, limits.comments),
    consent: value.consent === true,
    website: text(value.website, 200),
    pageUrl: text(value.pageUrl, limits.pageUrl),
    pageTitle: text(value.pageTitle, limits.pageTitle),
    source: text(value.source, limits.source) || "Форма сайта Ониксбит",
    requestId: text(value.requestId, limits.requestId),
    utm,
  };

  const errors: LeadValidationResult["errors"] = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+\d\s().-]{6,40}$/;

  if (!data.phone && !data.email) {
    errors.contact = "Укажите телефон или e-mail, чтобы мы могли ответить.";
  }
  if (data.phone && !phonePattern.test(data.phone)) {
    errors.phone = "Проверьте номер телефона.";
  }
  if (data.email && !emailPattern.test(data.email)) {
    errors.email = "Проверьте адрес e-mail.";
  }
  if (!data.consent) {
    errors.consent = "Подтвердите согласие на обработку персональных данных.";
  }
  if (!data.requestId) {
    errors.requestId = "Обновите страницу и попробуйте ещё раз.";
  }

  return Object.keys(errors).length ? { errors } : { data, errors };
}
