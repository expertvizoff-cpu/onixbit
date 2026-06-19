"use client";

import { useMemo, useState } from "react";
import type { DirectionId } from "@/data/site";

const crmStages = [
  { title: "Лид", value: "12", color: "#47b6ff" },
  { title: "Квалификация", value: "8", color: "#31c48d" },
  { title: "КП", value: "5", color: "#ffba49" },
  { title: "Согласование", value: "3", color: "#ff6b6b" },
];

const siteStates = [
  { title: "Каталог", note: "фильтры, карточки, остатки" },
  { title: "Корзина", note: "состав заказа и скидки" },
  { title: "Заявка", note: "передача в CRM" },
];

const onecStates = [
  { title: "Заказы", value: "48" },
  { title: "Остатки", value: "12 840" },
  { title: "Обмен", value: "06:40" },
];

export function ProductScene({ type }: { type: DirectionId }) {
  const [active, setActive] = useState(0);

  const content = useMemo(() => {
    if (type === "bitrix24") {
      return {
        logo: "Bitrix24",
        title: "CRM-воронка",
        tabs: crmStages.map((stage) => stage.title),
      };
    }
    if (type === "sites") {
      return {
        logo: "1C-Битрикс",
        title: "Сайт и магазин",
        tabs: siteStates.map((state) => state.title),
      };
    }
    return {
      logo: "1C",
      title: "1С:Предприятие",
      tabs: onecStates.map((state) => state.title),
    };
  }, [type]);

  return (
    <div className={`ob-scene ob-scene--${type}`}>
      <div className="ob-scene__top">
        <div className="ob-scene__logo">{content.logo}</div>
        <div>
          <span>Интерактив</span>
          <strong>{content.title}</strong>
        </div>
      </div>

      {type === "bitrix24" && (
        <div className="ob-crm" aria-label="CRM-воронка Битрикс24">
          {crmStages.map((stage, index) => (
            <button
              className={`ob-crm__stage ${index === active ? "is-active" : ""}`}
              key={stage.title}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              type="button"
              style={{ "--stage": stage.color } as import("react").CSSProperties}
            >
              <span>{stage.title}</span>
              <strong>{stage.value}</strong>
              <em>сделок</em>
            </button>
          ))}
          <div className="ob-crm__drawer">
            <span>Автоматизация стадии</span>
            <strong>{crmStages[active].title}</strong>
            <p>
              Роботы, задачи менеджеру, уведомления и контроль следующего
              действия.
            </p>
          </div>
        </div>
      )}

      {type === "sites" && (
        <div className="ob-site-ui" aria-label="Интерфейс сайта на 1С-Битрикс">
          <div className="ob-browser">
            <div className="ob-browser__bar">
              <i />
              <i />
              <i />
              <span>catalog.onixbit.demo</span>
            </div>
            <div className="ob-browser__body">
              <aside>
                <b>Разделы</b>
                <span />
                <span />
                <span />
              </aside>
              <main>
                <div className="ob-shop-card is-wide" />
                <div className="ob-shop-card" />
                <div className="ob-shop-card" />
                <div className="ob-shop-card" />
              </main>
              <section className={`ob-cart-preview state-${active}`}>
                <strong>{siteStates[active].title}</strong>
                <p>{siteStates[active].note}</p>
                <button type="button" onMouseEnter={() => setActive(2)}>
                  Оформить
                </button>
              </section>
            </div>
          </div>
        </div>
      )}

      {type === "onec" && (
        <div className="ob-onec-ui" aria-label="Интерфейс 1С:Предприятие">
          <div className="ob-onec-window">
            <div className="ob-onec-window__toolbar">
              <span>Продажи</span>
              <span>Склад</span>
              <span>Обмен</span>
            </div>
            <div className="ob-onec-window__body">
              <aside>
                <b>Навигация</b>
                <span>Документы</span>
                <span>Справочники</span>
                <span>Синхронизация</span>
              </aside>
              <main>
                {onecStates.map((state, index) => (
                  <button
                    className={index === active ? "is-active" : ""}
                    key={state.title}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    type="button"
                  >
                    <span>{state.title}</span>
                    <strong>{state.value}</strong>
                  </button>
                ))}
                <div className="ob-onec-table">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </main>
            </div>
          </div>
        </div>
      )}

      <div className="ob-scene__tabs" aria-label="Состояния интерактива">
        {content.tabs.map((tab, index) => (
          <button
            className={active === index ? "is-active" : ""}
            key={tab}
            onClick={() => setActive(index)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
