"use client";

import Image from "next/image";
import { BadgePercent, Check, ChevronDown, Cloud, ServerCog, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

type Mode = "cloud" | "box";
type Period = "month" | "year";

type CloudPlan = {
  id: "basic" | "standard" | "professional" | "enterprise";
  title: string;
  subtitle: string;
  users: string;
  storage: string;
  monthly: number | Record<number, number>;
  yearly: number | Record<number, number>;
  features: string[];
  highlighted?: boolean;
  userOptions?: number[];
};

type BoxPlan = {
  id: "store" | "portal" | "enterprise";
  title: string;
  subtitle: string;
  users: string;
  price: number | Record<number, number>;
  features: string[];
  highlighted?: boolean;
  userOptions?: number[];
};

const enterpriseUsers = [250, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
const boxEnterpriseUsers = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];

const cloudPlans: CloudPlan[] = [
  {
    id: "basic",
    title: "Базовый",
    subtitle: "CRM для небольшого отдела продаж",
    users: "5 пользователей",
    storage: "24 ГБ",
    monthly: 2490,
    yearly: 1743,
    features: ["CRM", "Задачи и проекты", "Контакт-центр", "Сайты", "Интернет-магазин"],
  },
  {
    id: "standard",
    title: "Стандартный",
    subtitle: "Совместная работа всей команды",
    users: "50 пользователей",
    storage: "100 ГБ",
    monthly: 6990,
    yearly: 4893,
    features: ["CRM", "Маркетинг", "Документы онлайн", "КЭДО + Госключ", "BI Конструктор"],
  },
  {
    id: "professional",
    title: "Профессиональный",
    subtitle: "Автоматизация, отчёты и сквозные процессы",
    users: "100 пользователей",
    storage: "1 ТБ",
    monthly: 13990,
    yearly: 9793,
    highlighted: true,
    features: ["Автоматизация", "Сквозная аналитика", "HR: Компания", "Онлайн-подпись", "Поддержка"],
  },
  {
    id: "enterprise",
    title: "Энтерпрайз",
    subtitle: "Крупная компания, филиалы и высокий лимит",
    users: "250 пользователей",
    storage: "от 3 ТБ",
    userOptions: enterpriseUsers,
    monthly: {
      250: 33990,
      500: 59990,
      1000: 99990,
      2000: 199990,
      3000: 299990,
      4000: 399990,
      5000: 499990,
      6000: 599990,
      7000: 699990,
      8000: 799990,
      9000: 899990,
      10000: 999990,
    },
    yearly: {
      250: 23793,
      500: 41993,
      1000: 69993,
      2000: 139993,
      3000: 209993,
      4000: 279993,
      5000: 349993,
      6000: 419993,
      7000: 489993,
      8000: 559993,
      9000: 629993,
      10000: 699993,
    },
    features: ["Филиалы", "КЭДО + Госключ", "Энтерпрайз-кластер", "Энтерпрайз-пакет", "Администрирование"],
  },
];

const boxPlans: BoxPlan[] = [
  {
    id: "store",
    title: "Интернет-магазин + CRM",
    subtitle: "Коробочный контур CRM и eCommerce",
    users: "12 пользователей",
    price: 109000,
    features: ["CRM и eCommerce", "ИИ-ассистент BitrixGPT", "Собственная инфраструктура", "Интеграции внутри контура"],
  },
  {
    id: "portal",
    title: "Корпоративный портал",
    subtitle: "Коммуникации, задачи и бизнес-процессы",
    users: "50 пользователей",
    highlighted: true,
    userOptions: [50, 100, 250, 500],
    price: {
      50: 159000,
      100: 229000,
      250: 349000,
      500: 599000,
    },
    features: ["Корпоративный мессенджер", "Задачи и проекты", "Бизнес-процессы", "КЭДО", "BI-аналитика"],
  },
  {
    id: "enterprise",
    title: "Энтерпрайз",
    subtitle: "Холдинг, нагрузка и расширенная архитектура",
    users: "1000 пользователей",
    userOptions: boxEnterpriseUsers,
    price: {
      1000: 1299000,
      2000: 2198000,
      3000: 3097000,
      4000: 3996000,
      5000: 4895000,
      6000: 5794000,
      7000: 6693000,
      8000: 7592000,
      9000: 8491000,
      10000: 9390000,
    },
    features: ["Холдинговая структура", "Многодепартаментность", "Веб-кластер", "VIP-поддержка 24/7", "Персональный менеджер"],
  },
];

function formatPrice(value: number) {
  return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
}

function resolvePrice(value: number | Record<number, number>, users?: number) {
  if (typeof value === "number") return value;
  const selected = users ?? Number(Object.keys(value)[0]);
  return value[selected] ?? value[Number(Object.keys(value)[0])];
}

export function BitrixPricingBlock() {
  const [mode, setMode] = useState<Mode>("cloud");
  const [period, setPeriod] = useState<Period>("year");
  const [enterpriseUser, setEnterpriseUser] = useState(250);
  const [portalUser, setPortalUser] = useState(50);
  const [boxEnterpriseUser, setBoxEnterpriseUser] = useState(1000);
  const [activeCloud, setActiveCloud] = useState<CloudPlan["id"]>("professional");
  const [activeBox, setActiveBox] = useState<BoxPlan["id"]>("portal");

  const activeTitle = useMemo(() => {
    if (mode === "cloud") {
      return cloudPlans.find((plan) => plan.id === activeCloud)?.title ?? "Профессиональный";
    }

    return boxPlans.find((plan) => plan.id === activeBox)?.title ?? "Корпоративный портал";
  }, [activeBox, activeCloud, mode]);

  return (
    <section className="ob-section ob-section--licenses ob-bitrix-pricing" id="tariffs">
      <div className="ob-container">
        <div className="ob-bitrix-pricing__head">
          <div>
            <span className="ob-kicker">Тарифы Битрикс24</span>
            <h2>Облако и коробочная версия в одном блоке</h2>
            <p>
              Показываем линейку лицензий так, чтобы её можно было быстро примерить к компании: пользователи,
              инфраструктура, автоматизация, отчёты и будущий рост.
            </p>
          </div>
          <div className="ob-bitrix-pricing__brand" aria-label="Битрикс24">
            <Image src="/media/logos/bitrix24-logo.svg" alt="" width={178} height={32} />
            <span>Цены за всю компанию, не за каждого сотрудника</span>
          </div>
        </div>

        <div className="ob-bitrix-pricing__controls" aria-label="Настройки тарифов">
          <div className="ob-bitrix-pricing__switch" role="tablist" aria-label="Тип лицензии">
            <button
              className={mode === "cloud" ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={mode === "cloud"}
              onClick={() => setMode("cloud")}
            >
              <Cloud size={18} />
              Облако
            </button>
            <button
              className={mode === "box" ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={mode === "box"}
              onClick={() => setMode("box")}
            >
              <ServerCog size={18} />
              Коробка
            </button>
          </div>

          {mode === "cloud" ? (
            <div className="ob-bitrix-pricing__period" role="tablist" aria-label="Срок облачной лицензии">
              <button
                className={period === "month" ? "is-active" : ""}
                type="button"
                role="tab"
                aria-selected={period === "month"}
                onClick={() => setPeriod("month")}
              >
                1 месяц
              </button>
              <button
                className={period === "year" ? "is-active" : ""}
                type="button"
                role="tab"
                aria-selected={period === "year"}
                onClick={() => setPeriod("year")}
              >
                12 месяцев <span>-30%</span>
              </button>
            </div>
          ) : (
            <div className="ob-bitrix-pricing__box-note">
              <BadgePercent size={18} />
              Коробочные цены показаны за лицензию на год
            </div>
          )}
        </div>

        {mode === "cloud" ? (
          <div className="ob-bitrix-pricing__grid ob-bitrix-pricing__grid--cloud">
            {cloudPlans.map((plan) => {
              const users = plan.id === "enterprise" ? enterpriseUser : undefined;
              const current = resolvePrice(period === "year" ? plan.yearly : plan.monthly, users);
              const old = resolvePrice(plan.monthly, users);
              const isActive = activeCloud === plan.id;

              return (
                <article
                  className={`ob-bitrix-plan ${plan.highlighted ? "is-featured" : ""} ${isActive ? "is-active" : ""}`}
                  key={plan.id}
                  onMouseEnter={() => setActiveCloud(plan.id)}
                >
                  {plan.highlighted && <span className="ob-bitrix-plan__badge">Популярный</span>}
                  <div className="ob-bitrix-plan__top">
                    <h3>{plan.title}</h3>
                    <p>{plan.subtitle}</p>
                  </div>

                  <div className="ob-bitrix-plan__meta">
                    {plan.userOptions ? (
                      <label className="ob-bitrix-plan__select">
                        <span>Пользователи</span>
                        <select
                          value={enterpriseUser}
                          onChange={(event) => {
                            setEnterpriseUser(Number(event.target.value));
                            setActiveCloud(plan.id);
                          }}
                        >
                          {plan.userOptions.map((option) => (
                            <option value={option} key={option}>
                              {option} пользователей
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={17} aria-hidden="true" />
                      </label>
                    ) : (
                      <strong>{plan.users}</strong>
                    )}
                    <span>{plan.storage}</span>
                  </div>

                  <div className="ob-bitrix-plan__price">
                    {period === "year" && <small>{formatPrice(old)}</small>}
                    <strong>{formatPrice(current)}</strong>
                    <span>{period === "year" ? "за месяц при оплате за год" : "за месяц"}</span>
                  </div>

                  <a
                    className="ob-btn ob-btn--primary ob-bitrix-plan__button"
                    href="#lead"
                    data-obx-lead-open
                    onMouseEnter={() => setActiveCloud(plan.id)}
                  >
                    <span>Запросить счёт</span>
                  </a>

                  <ul className="ob-bitrix-plan__features">
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <Check size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="ob-bitrix-pricing__grid ob-bitrix-pricing__grid--box">
            {boxPlans.map((plan) => {
              const selectedUsers =
                plan.id === "portal" ? portalUser : plan.id === "enterprise" ? boxEnterpriseUser : undefined;
              const current = resolvePrice(plan.price, selectedUsers);
              const isActive = activeBox === plan.id;

              return (
                <article
                  className={`ob-bitrix-plan ob-bitrix-plan--box ${plan.highlighted ? "is-featured" : ""} ${
                    isActive ? "is-active" : ""
                  }`}
                  key={plan.id}
                  onMouseEnter={() => setActiveBox(plan.id)}
                >
                  {plan.highlighted && <span className="ob-bitrix-plan__badge">Частый выбор</span>}
                  <div className="ob-bitrix-plan__top">
                    <h3>{plan.title}</h3>
                    <p>{plan.subtitle}</p>
                  </div>

                  <div className="ob-bitrix-plan__meta">
                    {plan.userOptions ? (
                      <label className="ob-bitrix-plan__select">
                        <span>Пользователи</span>
                        <select
                          value={selectedUsers}
                          onChange={(event) => {
                            const value = Number(event.target.value);
                            if (plan.id === "portal") setPortalUser(value);
                            if (plan.id === "enterprise") setBoxEnterpriseUser(value);
                            setActiveBox(plan.id);
                          }}
                        >
                          {plan.userOptions.map((option) => (
                            <option value={option} key={option}>
                              {option} пользователей
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={17} aria-hidden="true" />
                      </label>
                    ) : (
                      <strong>{plan.users}</strong>
                    )}
                    <span>лицензия на год</span>
                  </div>

                  <div className="ob-bitrix-plan__price">
                    <strong>{formatPrice(current)}</strong>
                    <span>стоимость лицензии</span>
                  </div>

                  <a
                    className="ob-btn ob-btn--primary ob-bitrix-plan__button"
                    href="#lead"
                    data-obx-lead-open
                    onMouseEnter={() => setActiveBox(plan.id)}
                  >
                    <span>Запросить счёт</span>
                  </a>

                  <ul className="ob-bitrix-plan__features">
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <Check size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        )}

        <div className="ob-bitrix-pricing__summary">
          <div>
            <span>{mode === "cloud" ? "Сейчас выбран облачный тариф" : "Сейчас выбрана коробочная лицензия"}</span>
            <strong>{activeTitle}</strong>
          </div>
          <p>
            Финальный подбор делаем после короткого разбора: сколько отделов работает в портале, какие права нужны,
            будет ли 1С, телефония, сайт, отчётность и собственная инфраструктура.
          </p>
          <a className="ob-btn ob-btn--secondary" href="#lead" data-obx-lead-open>
            <span>Подобрать тариф</span>
          </a>
        </div>

        <article className="ob-bitrix-free">
          <div className="ob-bitrix-free__icon">
            <Sparkles size={24} />
          </div>
          <div>
            <span>Бесплатный старт</span>
            <h3>Бесплатный Битрикс24 оставляем ниже основной линейки</h3>
            <p>
              Он подходит для знакомства с CRM, задачами и интерфейсом. Для внедрения с отделами, правами,
              автоматизацией, отчётами и интеграциями обычно нужен платный тариф или коробочная версия.
            </p>
          </div>
          <div className="ob-bitrix-free__facts">
            <strong>0 ₽</strong>
            <span>5 ГБ диск</span>
            <span>неограниченно пользователей</span>
          </div>
        </article>
      </div>
    </section>
  );
}
