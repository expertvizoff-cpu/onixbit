"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Award, ExternalLink, ShieldCheck, X } from "lucide-react";

type BitrixCrmProofProps = {
  variant?: "hero" | "compact";
  className?: string;
};

export function BitrixCrmProof({ variant = "hero", className = "" }: BitrixCrmProofProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.classList.add("ob-modal-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("ob-modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        className={`ob-crm-proof ob-crm-proof--${variant} ${className}`}
        onClick={() => setOpen(true)}
        type="button"
      >
        <span className="ob-crm-proof__icon">
          <Award size={20} aria-hidden="true" />
        </span>
        <span className="ob-crm-proof__text">
          <strong>Битрикс24 CRM №1</strong>
          <em>{variant === "hero" ? "официальное исследование 2026" : "почему это важно"}</em>
        </span>
        <ArrowRight size={18} aria-hidden="true" />
      </button>

      {open && (
        <div
          className="ob-crm-modal"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
          role="presentation"
        >
          <div
            aria-labelledby="ob-crm-modal-title"
            aria-modal="true"
            className="ob-crm-modal__panel"
            role="dialog"
          >
            <button className="ob-crm-modal__close" onClick={() => setOpen(false)} type="button">
              <X size={20} aria-hidden="true" />
              <span>Закрыть</span>
            </button>

            <div className="ob-crm-modal__header">
              <span className="ob-kicker">Официально о продукте</span>
              <h2 id="ob-crm-modal-title">Битрикс24 — CRM №1 в России</h2>
              <p>
                По результатам исследования J&apos;Son & Partners среди российских компаний
                в 2026 году Битрикс24 указан как лидер по количеству реальных внедрений.
              </p>
            </div>

            <div className="ob-crm-modal__grid">
              <article>
                <ShieldCheck size={22} aria-hidden="true" />
                <strong>Что даёт сама CRM</strong>
                <span>
                  Официальная страница Битрикс24 описывает CRM как рабочее окно для лидов,
                  сделок, задач, чатов, воронок, автоматизации и аналитики.
                </span>
              </article>
              <article>
                <ShieldCheck size={22} aria-hidden="true" />
                <strong>Что добавляет Ониксбит</strong>
                <span>
                  Мы превращаем коробку инструментов в управляемую систему: роли, воронки,
                  регламенты, интеграции с сайтом, 1С, телефонией и отчётностью.
                </span>
              </article>
            </div>

            <div className="ob-crm-modal__actions">
              <a className="ob-btn ob-btn--primary" data-obx-lead-open href="#lead" onClick={() => setOpen(false)}>
                <span>Обсудить внедрение</span>
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a
                className="ob-btn ob-btn--secondary"
                href="https://www.bitrix24.ru/features/crm/"
                rel="noreferrer"
                target="_blank"
              >
                <span>Источник Битрикс24</span>
                <ExternalLink size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
