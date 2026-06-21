"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Award, BarChart3, CheckCircle2, ExternalLink, ShieldCheck, X } from "lucide-react";

type BitrixCrmProofProps = {
  variant?: "hero" | "compact";
  className?: string;
};

const CRM_RESEARCH_URL = "https://crm1.bitrix24.ru/research-2026/?p=10553488";

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
          <em>{variant === "hero" ? "исследование J’son & Partners 2026" : "официальное исследование"}</em>
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
              <span className="ob-kicker">Проверяемый рыночный факт</span>
              <h2 id="ob-crm-modal-title">Битрикс24 — CRM №1 в России</h2>
              <p>
                На официальной странице Битрикс24 опубликованы данные исследования рынка CRM России от J’son & Partners Consulting за 2026 год. Для клиента это не просто красивый бейдж, а понятный сигнал: систему выбирают массово, развивают активно и под неё проще найти специалистов, интеграции и готовые сценарии.
              </p>
            </div>

            <div className="ob-crm-modal__summary" aria-label="Ключевые выводы исследования">
              <article>
                <strong>CRM №1</strong>
                <span>рыночное подтверждение популярности Битрикс24</span>
              </article>
              <article>
                <strong>2026</strong>
                <span>актуальная волна исследования CRM-рынка России</span>
              </article>
              <article>
                <strong>B2B</strong>
                <span>важно для продаж, сервиса, коммуникаций и контроля</span>
              </article>
            </div>

            <div className="ob-crm-modal__grid">
              <article>
                <ShieldCheck size={22} aria-hidden="true" />
                <strong>Почему это важно для тарифа</strong>
                <span>
                  Вы выбираете не одиночный модуль, а платформу с CRM, задачами, чатами,
                  воронками, автоматизацией, BI и экосистемой приложений.
                </span>
              </article>
              <article>
                <BarChart3 size={22} aria-hidden="true" />
                <strong>Где обычно теряются деньги</strong>
                <span>
                  Ошибка не только в цене тарифа. Чаще переплачивают из-за лишних пользователей,
                  слабых прав, хаотичных воронок, ручных обменов и неподготовленной структуры CRM.
                </span>
              </article>
              <article>
                <CheckCircle2 size={22} aria-hidden="true" />
                <strong>Что добавляет Ониксбит</strong>
                <span>
                  Подбираем тариф под реальные отделы, права, нагрузку, диски,
                  интеграции с 1С, сайтами на 1С-Битрикс, телефонией и отчётностью.
                </span>
              </article>
            </div>

            <div className="ob-crm-modal__actions">
              <a className="ob-btn ob-btn--primary" data-obx-lead-open href="#lead" onClick={() => setOpen(false)}>
                <span>Обсудить внедрение</span>
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>

            <div className="ob-crm-modal__source">
              <span>Источник: официальное исследование Битрикс24 CRM №1, 2026.</span>
              <a href={CRM_RESEARCH_URL} rel="noreferrer" target="_blank">
                Открыть источник
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
