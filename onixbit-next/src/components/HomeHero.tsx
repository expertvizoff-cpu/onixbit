"use client";

import { useEffect, useState } from "react";
import { directions } from "@/data/site";
import { ButtonLink, LeadButton } from "./Buttons";
import { ProductScene } from "./ProductScene";

const rotateMs = 7400;

export function HomeHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const direction = directions[active];

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
          <span className="ob-kicker">Ониксбит для B2B-команд</span>
          <h1>
            Разработка и интеграции, которые связывают CRM, сайт и учёт
          </h1>
          <p>
            Внедряем Битрикс24, разрабатываем сайты на 1С-Битрикс и помогаем
            выстроить обмены с 1С:Предприятие. Без лишней магии, зато с
            понятной архитектурой и ответственностью за результат.
          </p>
          <div className="ob-actions">
            <LeadButton>Обсудить проект</LeadButton>
            <ButtonLink href={direction.href} variant="secondary">
              {direction.shortTitle}
            </ButtonLink>
          </div>
          <div className="ob-hero__facts">
            <span>14 лет опыта</span>
            <span>Gold-партнёрства</span>
            <span>CRM, сайты, 1С</span>
          </div>
        </div>

        <div
          className="ob-hero__showcase"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <ProductScene type={direction.scene} />
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
