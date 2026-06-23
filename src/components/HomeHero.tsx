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
    title: ["Внедрение CRM", "на Битрикс24", "для продаж"],
    text: [
      "Настраиваем воронки, роботов и задачи",
      "так, чтобы заявки не терялись в работе.",
      "Подключаем 1С, сайты, телефонию и отчёты",
      "и передаём команде понятные правила.",
    ],
    facts: ["10-50 дней", "CRM, телефония, 1С", "Поддержка 30 дней"],
  },
  {
    title: ["Разработка сайтов", "на 1С-Битрикс", "для заявок и CRM"],
    text: [
      "Проектируем структуру, каталог и формы",
      "так, чтобы путь клиента был понятным.",
      "Связываем сайт с CRM, 1С и аналитикой",
      "и оставляем удобное управление контентом.",
    ],
    facts: ["Каталог и формы", "SEO, скорость, адаптив", "CRM-интеграции"],
  },
  {
    title: ["Работы по 1С", "и обменам", "для учёта"],
    text: [
      "Наводим порядок в правах и документах,",
      "справочниках, обменах и отчётах.",
      "Убираем ручные ошибки и дубли данных",
      "и собираем управляемую систему учёта.",
    ],
    facts: ["Роли и документы", "Обмены с CRM", "Контроль и отчёты"],
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
          <span className="ob-kicker">{direction.badge}</span>
          <h1 className="ob-hero__title">
            {slide.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="ob-hero__lead">
            {slide.text.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <div className="ob-actions">
            <LeadButton>{direction.cta}</LeadButton>
            <ButtonLink href={direction.href} variant="secondary">
              {direction.secondaryCta}
            </ButtonLink>
          </div>
          <BitrixCrmProof variant="compact" className={direction.id === "bitrix24" ? "" : "is-hidden"} />
          <div className="ob-hero__facts">
            {slide.facts.map((fact, index) => {
              const Icon = heroFactIcons[active][index];
              return (
                <span key={fact}>
                  <Icon size={22} strokeWidth={2.2} aria-hidden="true" />
                  <b>{fact}</b>
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
                <span>{item.menuTitle}</span>
                <i />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
