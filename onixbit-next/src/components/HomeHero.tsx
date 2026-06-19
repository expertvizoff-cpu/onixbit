"use client";

import { useEffect, useState } from "react";
import { directions } from "@/data/site";
import { ButtonLink, LeadButton } from "./Buttons";
import { ProductScene } from "./ProductScene";

const rotateMs = 7400;

const heroSlides = [
  {
    title: ["Внедрение CRM", "на Битрикс24", "под продажи и сервис"],
    text: [
      "Настраиваем воронки, роботов и задачи",
      "так, чтобы заявки не терялись в работе.",
      "Подключаем 1С, сайты, телефонию и отчёты",
      "и передаём команде понятные правила.",
    ],
    facts: ["10-50 дней запуска", "CRM, телефония, 1С", "30 дней поддержки"],
  },
  {
    title: ["Разработка сайтов", "на 1С-Битрикс", "под заявки и CRM"],
    text: [
      "Проектируем структуру, каталог и формы",
      "так, чтобы путь клиента был понятным.",
      "Связываем сайт с CRM, 1С и аналитикой",
      "и оставляем удобное управление контентом.",
    ],
    facts: ["BX: каталог и формы", "SEO, скорость, адаптив", "CRM-интеграции"],
  },
  {
    title: ["Настройка 1С", "для учёта и обменов", "под контроль бизнеса"],
    text: [
      "Наводим порядок в правах и документах,",
      "справочниках, обменах и отчётах.",
      "Убираем ручные ошибки и дубли данных",
      "и собираем управляемую систему учёта.",
    ],
    facts: ["1C: роли и документы", "Обмены с сайтом и CRM", "Контроль и отчёты"],
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
          <div className="ob-hero__facts">
            {slide.facts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
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
