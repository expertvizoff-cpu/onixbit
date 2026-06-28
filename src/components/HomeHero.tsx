"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Clock3,
  Database,
  Gauge,
  LayoutTemplate,
  Link2,
  RefreshCw,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { directions } from "@/data/site";
import { ButtonLink, LeadButton } from "./Buttons";
import { BitrixCrmProof } from "./BitrixCrmProof";
import { ProductScene } from "./ProductScene";

const rotateMs = 7400;

const heroFactIcons = [
  [Clock3, Workflow, ShieldCheck],
  [LayoutTemplate, Gauge, Link2],
  [Database, RefreshCw, BarChart3],
] as const;

const heroSlides = [
  {
    focusLabel: "CRM и продажи",
    title: ["Внедрение CRM", "на Битрикс24", "для продаж"],
    text: [
      "Настраиваем воронки, роботов и задачи",
      "так, чтобы заявки не терялись в работе.",
      "Подключаем 1С, сайты, телефонию и отчёты",
      "и передаём команде понятные правила.",
    ],
    facts: [
      { value: "10-50 дней", label: "до первого управляемого контура" },
      { value: "CRM + 1С", label: "заявки, обмены и контроль в одной логике" },
      { value: "30 дней", label: "поддержки после запуска без провала" },
    ],
  },
  {
    focusLabel: "Сайт и заявки",
    title: ["Разработка сайтов", "на 1С-Битрикс", "для заявок и CRM"],
    text: [
      "Проектируем структуру, каталог и формы",
      "так, чтобы путь клиента был понятным.",
      "Связываем сайт с CRM, 1С и аналитикой",
      "и оставляем удобное управление контентом.",
    ],
    facts: [
      { value: "Каталог", label: "структура и формы сразу ведут в CRM" },
      { value: "SEO + скорость", label: "техническая база без лишней тяжести" },
      { value: "Интеграции", label: "сайт передаёт данные без ручных копий" },
    ],
  },
  {
    focusLabel: "Учёт и обмены",
    title: ["Работы по 1С", "и обменам", "для учёта"],
    text: [
      "Наводим порядок в правах и документах,",
      "справочниках, обменах и отчётах.",
      "Убираем ручные ошибки и дубли данных",
      "и собираем управляемую систему учёта.",
    ],
    facts: [
      { value: "Роли", label: "права, документы и зоны ответственности" },
      { value: "Обмены", label: "CRM, сайт и учёт синхронизированы" },
      { value: "Контроль", label: "ошибки видны до ручной сверки" },
    ],
  },
];

export function HomeHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const direction = directions[active];
  const slide = heroSlides[active];

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % directions.length);
    }, rotateMs);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section className="ob-hero ob-section">
      <div className="ob-container ob-hero__grid">
        <div className="ob-hero__copy">
          <span className="ob-kicker">Ониксбит для продаж, сайта и учёта</span>
          <h1 className="ob-hero__title">
            <span>CRM, сайт и 1С</span>{" "}
            <span>работают как</span>{" "}
            <span>одна система</span>
          </h1>
          <p className="ob-hero__lead">
            Ониксбит внедряет Битрикс24, разрабатывает сайты на 1С-Битрикс и связывает заявки, учёт,
            коммуникации и отчёты в понятный рабочий контур.
          </p>
          <div className="ob-hero__focus">
            <span>{slide.focusLabel}</span>
            <strong>{slide.title.join(" ")}</strong>
            <p>
              {slide.text.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>
          <div className="ob-actions">
            <LeadButton>{direction.cta}</LeadButton>
            <ButtonLink href={direction.href} variant="secondary">
              Смотреть направление
            </ButtonLink>
          </div>
          <BitrixCrmProof variant="compact" className={direction.id === "bitrix24" ? "" : "is-hidden"} />
          <div className="ob-hero__facts">
            {slide.facts.map((fact, index) => {
              const Icon = heroFactIcons[active][index];
              return (
                <span key={fact.value}>
                  <Icon size={22} strokeWidth={2.2} aria-hidden="true" />
                  <b>{fact.value}</b>
                  <small>{fact.label}</small>
                </span>
              );
            })}
          </div>
        </div>

        <div
          className={`ob-hero__showcase ${paused ? "is-paused" : ""}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <ProductScene key={direction.id} type={direction.scene} />
          <div className="ob-main-tabs" aria-label="Главные направления">
            {directions.map((item, index) => (
              <button
                className={active === index ? "is-active" : ""}
                key={item.id}
                onClick={() => setActive(index)}
                type="button"
              >
                <span>{item.shortTitle}</span>
                <i />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
