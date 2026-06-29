"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { directions } from "@/data/site";
import { ButtonLink, LeadButton } from "./Buttons";
import { ProductScene } from "./ProductScene";

const rotateMs = 7400;

const heroTrustSignals = [
  {
    icon: ShieldCheck,
    value: "Партнёрские статусы",
    label: "Битрикс24 и 1С-Битрикс",
  },
  {
    icon: Workflow,
    value: "Одна ответственность",
    label: "CRM, сайт, 1С и обмены",
  },
  {
    icon: RefreshCw,
    value: "Поддержка после запуска",
    label: "чтобы система не развалилась",
  },
] as const;

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
          <span className="ob-kicker">Ониксбит для продаж, сайта и учёта</span>
          <h1 className="ob-hero__title">
            <span>CRM, сайт и 1С</span>{" "}
            <span>в одной рабочей</span>{" "}
            <span>системе</span>
          </h1>
          <p className="ob-hero__lead">
            Внедряем Битрикс24, развиваем сайты на 1С-Битрикс и связываем их с 1С, чтобы заявки,
            заказы и отчёты не распадались между отделами.
          </p>
          <div className="ob-hero__trust-line" aria-label="Почему Ониксбит можно рассматривать для проекта">
            {heroTrustSignals.map((item) => {
              const Icon = item.icon;

              return (
                <span key={item.value}>
                  <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                  <b>{item.value}</b>
                  <small>{item.label}</small>
                </span>
              );
            })}
          </div>
          <div className="ob-hero__cta-cluster">
            <div className="ob-actions">
              <LeadButton>Обсудить задачу</LeadButton>
              <ButtonLink href="#solution" variant="secondary">
                Как это работает
              </ButtonLink>
            </div>
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
