"use client";

import Image from "next/image";
import { CheckCircle2, Phone, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { company } from "@/data/site";

const popupLoader = "https://cdn-ru.bitrix24.ru/b28559462/crm/form/loader_28.js";

type FormStatus = "loading" | "ready" | "error";

function NativeBitrixPopupForm() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<FormStatus>("loading");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let active = true;

    const marker = document.createElement("script");
    marker.dataset.b24Form = "inline/28/bslxb8";
    marker.dataset.skipMoving = "true";
    mount.appendChild(marker);

    const hasForm = () => Boolean(mount.querySelector("form input, form textarea, form select"));
    const ready = () => {
      if (!active || !hasForm()) return;
      window.clearTimeout(timeout);
      setStatus("ready");
    };
    const fail = () => {
      if (!active) return;
      if (hasForm()) {
        ready();
        return;
      }
      setStatus("error");
    };

    const observer = new MutationObserver(ready);
    observer.observe(mount, { childList: true, subtree: true });

    const resource = document.createElement("script");
    resource.async = true;
    resource.src = `${popupLoader}?${Math.floor(Date.now() / 180000)}`;
    resource.onerror = fail;
    const timeout = window.setTimeout(fail, 15000);
    document.head.appendChild(resource);

    return () => {
      active = false;
      window.clearTimeout(timeout);
      observer.disconnect();
      resource.onerror = null;
      resource.remove();
      marker.remove();
    };
  }, []);

  return (
    <div
      className="ob-form-slot ob-lead-modal__b24-form"
      data-form-status={status}
      data-obx-b24-loaded={status === "ready" ? "true" : "false"}
    >
      <div ref={mountRef} className="ob-form-slot__mount" />
      {status === "loading" && (
        <span className="ob-form-slot__placeholder" role="status">Загружаем форму заявки…</span>
      )}
      {status === "error" && (
        <div className="ob-form-slot__error" role="alert">
          <strong>Не удалось загрузить форму</strong>
          <p>Обновите страницу или свяжитесь с нами напрямую.</p>
          <a href={company.phoneHref}><Phone size={17} aria-hidden="true" /> {company.phone}</a>
          <a href={company.emailHref}>{company.email}</a>
        </div>
      )}
    </div>
  );
}

export function LeadPopupBridge() {
  const titleId = useId();
  const descriptionId = useId();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const openLeadForm = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const opener = target?.closest("[data-obx-lead-open]");
      if (!(opener instanceof HTMLElement)) return;

      event.preventDefault();
      openerRef.current = opener;
      setIsOpen(true);
    };

    document.addEventListener("click", openLeadForm);
    return () => document.removeEventListener("click", openLeadForm);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
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
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div
      className="ob-lead-modal__backdrop"
      data-obx-lead-modal
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
      }}
    >
      <div
        ref={modalRef}
        className="ob-lead-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <button
          ref={closeRef}
          className="ob-lead-modal__close"
          type="button"
          aria-label="Закрыть форму"
          onClick={() => setIsOpen(false)}
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
          <div className="ob-lead-modal__form">
            <div className="ob-lead-modal__form-head">
              <h3>Расскажите о задаче</h3>
              <p>Заявка попадёт в настроенную CRM-форму Ониксбит.</p>
            </div>
            <NativeBitrixPopupForm />
          </div>
        </section>
      </div>
    </div>
  );
}
