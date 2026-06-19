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
      "Настраиваем CRM, воронки, роботов и отчёты под реальные процессы.",
      "Подключаем коммуникации, сайт, телефонию и нужные интеграции.",
      "Помогаем руководителю видеть движение сделок без ручного контроля.",
      "После запуска развиваем систему вместе с командой клиента.",
    ],
    facts: ["Gold-партнёр Битрикс24", "Wazzup и ChatApp", "CRM, BI, API"],
  },
  {
    title: ["Разработка сайтов", "на 1С-Битрикс", "под заявки и продажи"],
    text: [
      "Проектируем корпоративные сайты, каталоги и интернет-магазины.",
      "Собираем структуру, формы, корзину и личные кабинеты без хаоса.",
      "Связываем сайт с Битрикс24, 1С, платежами и внутренними сервисами.",
      "Делаем основу для SEO, аналитики и дальнейшего развития продукта.",
    ],
    facts: ["Gold-партнёр 1С-Битрикс", "ASPRO-решения", "Каталог и e-commerce"],
  },
  {
    title: ["Интеграции с 1С", "для учёта и обменов", "под контроль бизнеса"],
    text: [
      "Помогаем связать 1С:Предприятие с CRM и интернет-магазином.",
      "Настраиваем обмен товарами, заказами, остатками, ценами и статусами.",
      "Честно отделяем нашу зону интеграций от глубокой 1С-разработки.",
      "Для сложных задач усиливаем проект партнёрской экспертизой Scloud.",
    ],
    facts: ["Партнёр Scloud", "Обмены с CRM", "Заказы и остатки"],
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
