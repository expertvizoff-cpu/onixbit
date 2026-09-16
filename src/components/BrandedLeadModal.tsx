"use client";

import Image from "next/image";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Phone,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { company } from "@/data/site";
import { leadUtmKeys, type LeadSubmission } from "@/lib/lead-form";

type SubmissionState = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<keyof LeadSubmission | "contact", string>>;

interface ApiResponse {
  ok?: boolean;
  message?: string;
  errors?: FieldErrors;
}

function requestId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function leadContext(opener: Element): string {
  if (opener instanceof HTMLElement && opener.dataset.obxLeadTitle) {
    return opener.dataset.obxLeadTitle;
  }
  const text = opener.textContent?.trim();
  return text ? `CTA: ${text.slice(0, 140)}` : "Форма сайта Ониксбит";
}

export function LeadPopupBridge() {
  const titleId = useId();
  const descriptionId = useId();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState("Форма сайта Ониксбит");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submissionId, setSubmissionId] = useState(requestId);

  useEffect(() => {
    const openLeadForm = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const opener = target?.closest("[data-obx-lead-open]");
      if (!(opener instanceof HTMLElement)) return;

      event.preventDefault();
      openerRef.current = opener;
      setSource(leadContext(opener));
      setSubmissionState("idle");
      setMessage("");
      setErrors({});
      setSubmissionId(requestId());
      setIsOpen(true);
    };

    document.addEventListener("click", openLeadForm);
    return () => document.removeEventListener("click", openLeadForm);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => firstInputRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && submissionState !== "submitting") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !modalRef.current) return;

      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("aria-hidden"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, submissionState]);

  useEffect(() => {
    if (isOpen) return;
    const opener = openerRef.current;
    if (opener?.closest(".ob-header__mobile")) {
      document.querySelector<HTMLElement>(".ob-header__burger")?.focus();
      return;
    }
    if (opener?.getClientRects().length) {
      opener.focus();
      return;
    }
    const visibleFallback = Array.from(document.querySelectorAll<HTMLElement>("[data-obx-lead-open]"))
      .find((element) => element.getClientRects().length > 0);
    visibleFallback?.focus();
  }, [isOpen]);

  const close = () => {
    if (submissionState !== "submitting") setIsOpen(false);
  };

  const clearError = (field: keyof LeadSubmission | "contact") => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      if (field === "phone" || field === "email") delete next.contact;
      return next;
    });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const consent = formData.get("consent") === "on";
    const nextErrors: FieldErrors = {};
    if (!phone && !email) nextErrors.contact = "Укажите телефон или e-mail, чтобы мы могли ответить.";
    if (phone && !/^[+\d\s().-]{6,40}$/.test(phone)) nextErrors.phone = "Проверьте номер телефона.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Проверьте адрес e-mail.";
    if (!consent) nextErrors.consent = "Подтвердите согласие на обработку персональных данных.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      const firstInvalid = nextErrors.contact || nextErrors.phone
        ? form.querySelector<HTMLInputElement>('[name="phone"]')
        : nextErrors.email
          ? form.querySelector<HTMLInputElement>('[name="email"]')
          : form.querySelector<HTMLInputElement>('[name="consent"]');
      firstInvalid?.focus();
      return;
    }

    const search = new URLSearchParams(window.location.search);
    const utm = Object.fromEntries(leadUtmKeys.map((key) => [key, search.get(key) || ""]));
    const payload = {
      name: String(formData.get("name") || ""),
      lastName: String(formData.get("lastName") || ""),
      phone,
      email,
      comments: String(formData.get("comments") || ""),
      consent,
      website: String(formData.get("website") || ""),
      pageUrl: window.location.href,
      pageTitle: document.title,
      source,
      requestId: submissionId,
      utm,
    };

    setSubmissionState("submitting");
    setMessage("");
    setErrors({});
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as ApiResponse;
      if (!response.ok || !result.ok) {
        setErrors(result.errors || {});
        setMessage(result.message || "Не удалось отправить заявку. Попробуйте ещё раз.");
        setSubmissionState("error");
        return;
      }

      setSubmissionState("success");
      setMessage("Заявка принята. Свяжемся с вами, чтобы уточнить задачу и следующий шаг.");
      form.reset();
    } catch {
      setSubmissionState("error");
      setMessage("Не удалось отправить заявку. Проверьте соединение или позвоните нам.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="ob-lead-modal__backdrop"
      data-obx-lead-modal
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={modalRef}
        className="ob-lead-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={submissionState === "submitting"}
      >
        <button
          className="ob-lead-modal__close"
          type="button"
          aria-label="Закрыть форму"
          onClick={close}
          disabled={submissionState === "submitting"}
        >
          <X size={22} aria-hidden="true" />
        </button>

        <section className="ob-lead-modal__intro">
          <Image
            className="ob-lead-modal__logo"
            src="/brand/onixbit-lockup-inverse-red-v2.png"
            alt="Ониксбит"
            width={162}
            height={40}
          />
          <span className="ob-lead-modal__eyebrow">Можно без готового ТЗ</span>
          <h2 id={titleId}>
            <span>Опишите ситуацию.</span>{" "}
            <span>Предложим первый этап.</span>
          </h2>
          <p id={descriptionId}>
            Напишите своими словами, что нужно запустить, связать или исправить:
            Битрикс24, сайт, 1С или интеграцию.
          </p>

          <span className="ob-lead-modal__steps-label">После заявки</span>
          <ul className="ob-lead-modal__steps">
            <li><CheckCircle2 size={17} aria-hidden="true" /> Уточним цель и текущую схему</li>
            <li><CheckCircle2 size={17} aria-hidden="true" /> Выделим риски и зависимости</li>
            <li><CheckCircle2 size={17} aria-hidden="true" /> Обозначим состав первого этапа</li>
          </ul>
        </section>

        <section className="ob-lead-modal__form-panel">
          {submissionState === "success" ? (
            <div className="ob-lead-modal__success" role="status" aria-live="polite">
              <span><Check size={30} aria-hidden="true" /></span>
              <h3>Заявка принята</h3>
              <p>{message}</p>
              <button className="ob-btn ob-btn--primary" type="button" onClick={close}>Закрыть</button>
              <a href={company.phoneHref}><Phone size={17} aria-hidden="true" /> {company.phone}</a>
            </div>
          ) : (
            <form className="ob-lead-modal__form" onSubmit={submit} noValidate>
              <div className="ob-lead-modal__form-head">
                <h3>Расскажите о задаче</h3>
                <p>Все поля, кроме согласия, можно заполнять по ситуации. Нужен телефон или e-mail для ответа.</p>
              </div>

              <div className="ob-lead-modal__grid">
                <label>
                  <span>Имя</span>
                  <input ref={firstInputRef} name="name" type="text" autoComplete="given-name" maxLength={80} />
                </label>
                <label>
                  <span>Фамилия</span>
                  <input name="lastName" type="text" autoComplete="family-name" maxLength={80} />
                </label>
                <label>
                  <span>Телефон</span>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={40}
                    aria-invalid={Boolean(errors.phone || errors.contact)}
                    aria-describedby={errors.phone ? "lead-phone-error" : errors.contact ? "lead-contact-error" : undefined}
                    onChange={() => clearError("phone")}
                    placeholder="+7"
                  />
                  {errors.phone && <small id="lead-phone-error" role="alert">{errors.phone}</small>}
                </label>
                <label>
                  <span>E-mail</span>
                  <input
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={254}
                    aria-invalid={Boolean(errors.email || errors.contact)}
                    aria-describedby={errors.email ? "lead-email-error" : errors.contact ? "lead-contact-error" : undefined}
                    onChange={() => clearError("email")}
                    placeholder="name@company.ru"
                  />
                  {errors.email && <small id="lead-email-error" role="alert">{errors.email}</small>}
                </label>
                {errors.contact && <p className="ob-lead-modal__field-error ob-lead-modal__field-error--wide" id="lead-contact-error" role="alert">{errors.contact}</p>}
                <label className="ob-lead-modal__field--wide">
                  <span>Короткое описание задачи</span>
                  <textarea name="comments" rows={4} maxLength={2000} placeholder="Что нужно настроить, связать или исправить?" />
                </label>
              </div>

              <label className="ob-lead-modal__honeypot" aria-hidden="true">
                <span>Сайт</span>
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>

              <label className="ob-lead-modal__consent">
                <input
                  name="consent"
                  type="checkbox"
                  required
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? "lead-consent-error" : undefined}
                  onChange={() => clearError("consent")}
                />
                <span>
                  Я согласен на обработку персональных данных в соответствии с <a href="/privacy">политикой конфиденциальности</a>.
                </span>
              </label>
              {errors.consent && <p className="ob-lead-modal__field-error" id="lead-consent-error" role="alert">{errors.consent}</p>}

              {message && submissionState === "error" && (
                <p className="ob-lead-modal__submit-error" role="alert">{message}</p>
              )}

              <div className="ob-lead-modal__actions">
                <button className="ob-btn ob-btn--primary" type="submit" disabled={submissionState === "submitting"}>
                  {submissionState === "submitting" ? "Отправляем…" : "Отправить заявку"}
                  {submissionState !== "submitting" && <ArrowRight size={18} aria-hidden="true" />}
                </button>
                <a href={company.phoneHref}><Phone size={17} aria-hidden="true" /> {company.phone}</a>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
