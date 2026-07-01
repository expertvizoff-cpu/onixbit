"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { directions } from "@/data/site";
import { ButtonLink, LeadButton } from "./Buttons";
import { ProductScene } from "./ProductScene";

const rotateMs = 7400;

const statIcons = [ShieldCheck, Workflow, RefreshCw] as const;

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
          <span className="ob-kicker">Ониксбит · {direction.eyebrow}</span>
          <h1 className="ob-hero__title">
            <span>CRM, сайт и 1С</span>{" "}
            <span>в одной рабочей</span>{" "}
            <span>системе</span>
          </h1>

          <div className="ob-hero__direction" key={direction.id}>
            <span className="ob-hero__direction-label">Сейчас в фокусе</span>
            <strong>{direction.headline}</strong>
            <p>{direction.description}</p>

            <div className="ob-hero__route" aria-label={"Что входит в направление: " + direction.title}>
              {direction.scope.slice(0, 3).map((item) => (
                <span key={item}>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="ob-hero__trust-line" aria-label={"Почему можно рассматривать направление: " + direction.title}>
            {direction.stats.map((item, index) => {
              const Icon = statIcons[index] ?? ShieldCheck;

              return (
                <span key={direction.id + "-" + item.value}>
                  <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                  <b>{item.value}</b>
                  <small>{item.label}</small>
                </span>
              );
            })}
          </div>

          <div className="ob-hero__cta-cluster">
            <div className="ob-actions">
              <LeadButton>{direction.cta}</LeadButton>
              <ButtonLink href={direction.href} variant="secondary">
                {direction.secondaryCta}
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
                aria-pressed={active === index}
                className={active === index ? "is-active" : ""}
                key={item.id}
                onClick={() => setActive(index)}
                type="button"
              >
                <span>{item.shortTitle}</span>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <i />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
