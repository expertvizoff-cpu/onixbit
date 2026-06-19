"use client";

import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";

const popupLoader =
  "https://cdn-ru.bitrix24.ru/b28559462/crm/form/loader_28.js";
const inlineLoader =
  "https://cdn-ru.bitrix24.ru/b28559462/crm/form/loader_24.js";

function appendBitrixScript(
  container: HTMLElement,
  form: string,
  loader: string,
) {
  if (container.querySelector("script[data-b24-form]")) return;

  const script = document.createElement("script");
  script.dataset.b24Form = form;
  script.dataset.skipMoving = "true";
  script.text = `(function(w,d,u){var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);})(window,document,'${loader}');`;
  container.appendChild(script);
}

export function LeadPopupBridge() {
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    appendBitrixScript(trigger, "click/28/bslxb8", popupLoader);

    const openLeadForm = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const opener = target?.closest("[data-obx-lead-open]");
      if (!opener) return;

      event.preventDefault();
      trigger.click();
    };

    document.addEventListener("click", openLeadForm);
    return () => document.removeEventListener("click", openLeadForm);
  }, []);

  return (
    <button
      ref={triggerRef}
      className="ob-hidden-popup"
      type="button"
      data-obx-b24-popup-trigger
      aria-hidden="true"
      tabIndex={-1}
    >
      Открыть форму
    </button>
  );
}

export function InlineBitrixForm({ className = "" }: { className?: string }) {
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = formRef.current;
    if (!container) return;
    appendBitrixScript(container, "inline/24/73tsgu", inlineLoader);
  }, []);

  return <div ref={formRef} className={`ob-form-slot ${className}`} />;
}

export function LeadFormPanel({ className = "" }: { className?: string }) {
  return (
    <aside className={`ob-lead-panel ${className}`} aria-label="Форма заявки Битрикс24">
      <div className="ob-lead-panel__top">
        <span className="ob-lead-panel__label">Форма Битрикс24</span>
        <h3>Заявка на консультацию</h3>
        <p>
          Опишите задачу коротко: направление, текущая система, что нужно
          связать или улучшить. Этого достаточно для первого разбора.
        </p>
      </div>

      <div className="ob-lead-panel__steps" aria-label="Что будет после отправки заявки">
        <span><CheckCircle2 size={16} /> уточним контекст</span>
        <span><CheckCircle2 size={16} /> предложим ближайший шаг</span>
        <span><CheckCircle2 size={16} /> обозначим границы проекта</span>
      </div>

      <div className="ob-lead-panel__frame">
        <InlineBitrixForm />
      </div>

      <p className="ob-lead-panel__policy">
        <ShieldCheck size={16} aria-hidden="true" />
        Нажимая кнопку отправки в форме, вы соглашаетесь на обработку данных и
        подтверждаете ознакомление с <Link href="/privacy">политикой конфиденциальности</Link>.
      </p>
    </aside>
  );
}
