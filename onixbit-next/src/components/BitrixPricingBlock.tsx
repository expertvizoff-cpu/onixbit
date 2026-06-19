"use client";

import { useMemo, useState } from "react";

type Mode = "cloud" | "box";
type Period = "month" | "year";
type NavigatorPlan =
  | "basic"
  | "standard"
  | "professional"
  | "enterprise"
  | "box-store"
  | "box-portal"
  | "box-enterprise";

type CloudPlan = {
  id: "basic" | "standard" | "professional" | "enterprise";
  title: string;
  description: string;
  usersLabel: string;
  storage: string;
  monthly: number | Record<number, number>;
  yearly: number | Record<number, number>;
  features: Array<{ title: string; level: 1 | 2 | 3 }>;
  bottomFeatures: Array<{ title: string; level: 1 | 2 | 3 }>;
  popular?: boolean;
  featured?: boolean;
  enterprise?: boolean;
};

type BoxPlan = {
  id: "store" | "cp" | "ent";
  title: string;
  description: string;
  usersLabel: string;
  meta: string;
  price: number | Record<number, number>;
  features: string[];
  featured?: boolean;
  enterprise?: boolean;
};

const enterpriseUsers = [250, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
const portalUsers = [50, 100, 250, 500];
const boxEnterpriseUsers = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];

const cloudPlans: CloudPlan[] = [
  {
    id: "basic",
    title: "Базовый",
    description: "CRM для небольших отделов продаж",
    usersLabel: "5 пользователей",
    storage: "24 ГБ диск",
    monthly: 2490,
    yearly: 1743,
    features: [
      { title: "Совместная работа", level: 2 },
      { title: "Мессенджер", level: 2 },
      { title: "Коллабы", level: 1 },
      { title: "Задачи и Проекты", level: 1 },
      { title: "CRM", level: 2 },
      { title: "BitrixGPT", level: 3 },
      { title: "Онлайн-подпись", level: 2 },
      { title: "Диск", level: 1 },
      { title: "Доски", level: 3 },
      { title: "Контакт-центр", level: 2 },
      { title: "Сайты", level: 2 },
      { title: "Интернет-магазин", level: 2 },
      { title: "Онлайн-запись", level: 1 },
    ],
    bottomFeatures: [{ title: "Поддержка", level: 1 }],
  },
  {
    id: "standard",
    title: "Стандартный",
    description: "Для совместной работы всей компании или рабочих групп",
    usersLabel: "50 пользователей",
    storage: "100 ГБ диск",
    monthly: 6990,
    yearly: 4893,
    featured: true,
    features: [
      { title: "Совместная работа", level: 2 },
      { title: "Мессенджер", level: 3 },
      { title: "Коллабы", level: 2 },
      { title: "Задачи и Проекты", level: 2 },
      { title: "CRM", level: 2 },
      { title: "BitrixGPT", level: 3 },
      { title: "Онлайн-подпись", level: 2 },
      { title: "Диск", level: 2 },
      { title: "Доски", level: 3 },
      { title: "Контакт-центр", level: 2 },
      { title: "Сайты", level: 2 },
      { title: "Интернет-магазин", level: 2 },
      { title: "Онлайн-запись", level: 2 },
      { title: "Маркетинг", level: 2 },
      { title: "Документы Онлайн", level: 2 },
      { title: "КЭДО + Госключ", level: 2 },
      { title: "BI Конструктор", level: 2 },
    ],
    bottomFeatures: [
      { title: "Поддержка", level: 2 },
      { title: "Администрирование", level: 2 },
    ],
  },
  {
    id: "professional",
    title: "Профессиональный",
    description: "Для максимальной автоматизации всех процессов в компании",
    usersLabel: "100 пользователей",
    storage: "1 024 ГБ диск",
    monthly: 13990,
    yearly: 9793,
    popular: true,
    features: [
      { title: "Совместная работа", level: 2 },
      { title: "Мессенджер", level: 3 },
      { title: "Коллабы", level: 3 },
      { title: "Задачи и Проекты", level: 3 },
      { title: "CRM", level: 3 },
      { title: "BitrixGPT", level: 3 },
      { title: "Онлайн-подпись", level: 3 },
      { title: "Диск", level: 3 },
      { title: "Доски", level: 3 },
      { title: "Контакт-центр", level: 3 },
      { title: "Сайты", level: 3 },
      { title: "Интернет-магазин", level: 3 },
      { title: "Онлайн-запись", level: 3 },
      { title: "Маркетинг", level: 3 },
      { title: "Документы Онлайн", level: 3 },
      { title: "КЭДО + Госключ", level: 2 },
      { title: "BI Конструктор", level: 3 },
      { title: "Сквозная аналитика", level: 2 },
      { title: "Автоматизация", level: 3 },
      { title: "HR: Компания", level: 3 },
    ],
    bottomFeatures: [
      { title: "Поддержка", level: 2 },
      { title: "Администрирование", level: 2 },
    ],
  },
  {
    id: "enterprise",
    title: "Энтерпрайз",
    description: "Комплексное решение для управления крупным предприятием: интранет, HRM, КЭДО, CRM, автоматизация",
    usersLabel: "250 пользователей",
    storage: "от 3 ТБ диск",
    enterprise: true,
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
    features: [
      { title: "Совместная работа", level: 3 },
      { title: "Мессенджер", level: 3 },
      { title: "Коллабы", level: 3 },
      { title: "Задачи и Проекты", level: 3 },
      { title: "CRM", level: 3 },
      { title: "BitrixGPT", level: 3 },
      { title: "Онлайн-подпись", level: 3 },
      { title: "Диск", level: 3 },
      { title: "Доски", level: 3 },
      { title: "Контакт-центр", level: 3 },
      { title: "Сайты", level: 3 },
      { title: "Интернет-магазин", level: 3 },
      { title: "Онлайн-запись", level: 3 },
      { title: "Маркетинг", level: 3 },
      { title: "Документы Онлайн", level: 3 },
      { title: "КЭДО + Госключ", level: 3 },
      { title: "BI Конструктор", level: 3 },
      { title: "Сквозная аналитика", level: 3 },
      { title: "Автоматизация", level: 3 },
      { title: "HR: Компания", level: 3 },
      { title: "Филиалы", level: 3 },
      { title: "Энтерпрайз-кластер", level: 3 },
      { title: "Энтерпрайз-пакет", level: 3 },
    ],
    bottomFeatures: [
      { title: "Поддержка", level: 3 },
      { title: "Администрирование", level: 3 },
    ],
  },
];

const boxPlans: BoxPlan[] = [
  {
    id: "store",
    title: "Интернет-магазин + CRM",
    description: "Коробочная связка CRM и eCommerce для собственной инфраструктуры и базового портального контура.",
    usersLabel: "12 пользователей",
    meta: "первый контур",
    price: 109000,
    features: ["CRM и eCommerce", "ИИ-ассистент BitrixGPT", "собственная инфраструктура"],
  },
  {
    id: "cp",
    title: "Корпоративный портал",
    description:
      "Собственный портал для структуры компании, внутренних коммуникаций, задач, бизнес-процессов и прав доступа.",
    usersLabel: "50 пользователей",
    meta: "корпоративный портал",
    featured: true,
    price: {
      50: 159000,
      100: 229000,
      250: 349000,
      500: 599000,
    },
    features: [
      "корпоративный мессенджер и видеозвонки",
      "задачи, проекты, документы и доски",
      "бизнес-процессы, КЭДО и BI-аналитика",
    ],
  },
  {
    id: "ent",
    title: "Энтерпрайз",
    description: "Коробочная версия для холдингов, многодепартаментности, повышенной нагрузки и глубокой архитектуры.",
    usersLabel: "1000 пользователей",
    meta: "большая инфраструктура",
    enterprise: true,
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
    features: [
      "холдинговая структура и департаменты",
      "веб-кластер и VIP-поддержка 24/7",
      "персональный менеджер и микросервисная архитектура",
    ],
  },
];

const navigatorCopy: Record<NavigatorPlan, { title: string; text: string }> = {
  basic: {
    title: "Базовый",
    text: "Подходит для маленькой команды, которой нужны CRM, задачи и простой старт без сложной автоматизации.",
  },
  standard: {
    title: "Стандартный",
    text: "Подходит для отдела продаж и рабочей команды, когда нужны CRM, задачи, совместная работа и больше пространства.",
  },
  professional: {
    title: "Профессиональный",
    text: "Хватит ли прав доступа, автоматизации, отчётов и лимитов для ваших отделов.",
  },
  enterprise: {
    title: "Энтерпрайз",
    text: "Проверяем количество пользователей, филиалы, права, отчёты, нагрузку и будущую архитектуру портала.",
  },
  "box-store": {
    title: "Интернет-магазин + CRM",
    text: "Подходит для первого коробочного контура, когда нужен свой сервер и связка CRM с интернет-магазином.",
  },
  "box-portal": {
    title: "Корпоративный портал",
    text: "Подходит для внутреннего корпоративного портала, прав доступа, структуры компании и доработок.",
  },
  "box-enterprise": {
    title: "Коробочный Энтерпрайз",
    text: "Нужен для крупной инфраструктуры, высокой нагрузки, сложных интеграций и требований к владению данными.",
  },
};

function formatPrice(value: number) {
  return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
}

function resolvePrice(value: number | Record<number, number>, users?: number) {
  if (typeof value === "number") return value;
  const first = Number(Object.keys(value)[0]);
  return value[users ?? first] ?? value[first];
}

function leadTitle(title: string) {
  return `Запросить счёт: ${title}`;
}

export function BitrixPricingBlock() {
  const [navigatorPlan, setNavigatorPlan] = useState<NavigatorPlan>("professional");
  const [navigatorEnterpriseOpen, setNavigatorEnterpriseOpen] = useState(false);
  const [navigatorEnterpriseUsers, setNavigatorEnterpriseUsers] = useState(250);
  const [mode, setMode] = useState<Mode>("cloud");
  const [period, setPeriod] = useState<Period>("year");
  const [enterpriseUsersCount, setEnterpriseUsersCount] = useState(250);
  const [portalUsersCount, setPortalUsersCount] = useState(50);
  const [boxEnterpriseUsersCount, setBoxEnterpriseUsersCount] = useState(1000);
  const [openPicker, setOpenPicker] = useState<"cloud-enterprise" | "box-cp" | "box-ent" | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const navigatorActive = navigatorCopy[navigatorPlan];
  const note = useMemo(
    () =>
      mode === "box"
        ? {
            label: "Условия коробки",
            text: "Коробочные цены показываются за годовую лицензию; инфраструктура и сопровождение считаются отдельно.",
          }
        : {
            label: "Условия облака",
            text: "В облаке при оплате на 12 месяцев цена ниже и показывается за месяц использования.",
          },
    [mode],
  );

  return (
    <>
      <section className="obx-tariffs" id="tariffs">
        <div className="obx-tariffs__inner">
          <div className="obx-tariffs__head">
            <div>
              <div className="obx-tariffs__eyebrow">Цены Битрикс24</div>
              <h2 className="obx-tariffs__title">Выбираем тариф по возможностям, которые будут реально использоваться</h2>
            </div>
            <p className="obx-tariffs__lead">
              Сначала отмечаем нужные возможности: CRM, задачи, AI, интеграции, права, отчёты. Потом выбираем облако
              или коробку и считаем внедрение.
            </p>
          </div>

          <div className="obx-tariffs__trial">
            <div className="obx-tariffs__trial-content">
              <span className="obx-tariffs__trial-label">Бесплатный старт</span>
              <h3 className="obx-tariffs__trial-title">
                Можно начать с бесплатного Битрикс24, но рабочую лицензию лучше выбирать после разбора процессов
              </h3>
              <p className="obx-tariffs__trial-text">
                Бесплатный портал подходит для знакомства с CRM, задачами и интерфейсом. Для внедрения с отделами,
                правами, автоматизацией, отчётами и интеграциями обычно нужен платный тариф или коробочная версия.
              </p>
            </div>
            <div className="obx-tariffs__trial-actions">
              <a className="obx-tariffs__trial-btn" href="#lead" data-obx-lead-open>
                Подобрать старт
              </a>
              <span>Подбор без ухода с сайта</span>
            </div>
          </div>

          <div className="obx-tariffs__chooser">
            <aside className="obx-tariffs__main">
              <span className="obx-tariffs__label">Подбор лицензии</span>
              <h3 className="obx-tariffs__main-title">Сначала сценарий, потом цена</h3>
              <p className="obx-tariffs__main-text">
                Количество пользователей важно, но не единственный критерий. Смотрим, какие отделы работают в портале,
                нужны ли права доступа, бизнес-процессы, телефония, 1С, отчёты, коробочная инфраструктура и
                сопровождение.
              </p>
              <a className="obx-tariffs__btn" href="#lead" data-obx-lead-open>
                Подобрать цену
              </a>
            </aside>

            <div className="obx-tariffs__matrix">
              <div className="obx-tariffs__matrix-top">
                <div>
                  <span className="obx-tariffs__estimate-label">Навигатор</span>
                  <h3 className="obx-tariffs__estimate-title">Облако, коробка или старт</h3>
                </div>
                <a className="obx-tariffs__official" href="#bitrix24-prices">
                  Смотреть линейку
                </a>
              </div>

              <div className="obx-tariffs__columns">
                <article className="obx-tariffs__edition obx-tariffs__edition--cloud">
                  <div className="obx-tariffs__edition-head">
                    <span>Облако</span>
                    <h4>Для быстрого запуска без своей инфраструктуры</h4>
                    <p>
                      Подходит, если важны скорость запуска, регулярные обновления, понятная подписка и минимум
                      технической поддержки на стороне компании.
                    </p>
                  </div>
                  <div className="obx-tariffs__plans">
                    {[
                      ["basic", "5", "Базовый", "небольшая команда"],
                      ["standard", "50", "Стандартный", "продажи и задачи"],
                      ["professional", "100", "Профессиональный", "автоматизация и отчёты"],
                    ].map(([id, users, title, caption]) => (
                      <button
                        className={navigatorPlan === id ? "is-active" : ""}
                        type="button"
                        key={id}
                        onClick={() => {
                          setNavigatorPlan(id as NavigatorPlan);
                          setNavigatorEnterpriseOpen(false);
                        }}
                      >
                        <span>{users}</span>
                        <strong>{title}</strong>
                        <em>{caption}</em>
                      </button>
                    ))}
                    <div className={`obx-tariffs__enterprise-picker ${navigatorEnterpriseOpen ? "is-open" : ""}`}>
                      <button
                        className={navigatorPlan === "enterprise" ? "is-active" : ""}
                        type="button"
                        aria-expanded={navigatorEnterpriseOpen}
                        onClick={() => {
                          setNavigatorPlan("enterprise");
                          setNavigatorEnterpriseOpen((value) => !value);
                        }}
                      >
                        <span>{navigatorEnterpriseUsers}</span>
                        <strong>Энтерпрайз</strong>
                        <em>крупная компания</em>
                      </button>
                      <div className="obx-tariffs__enterprise-menu">
                        {enterpriseUsers.map((users) => (
                          <button
                            className={navigatorEnterpriseUsers === users ? "is-active" : ""}
                            type="button"
                            key={users}
                            onClick={() => {
                              setNavigatorEnterpriseUsers(users);
                              setNavigatorPlan("enterprise");
                              setNavigatorEnterpriseOpen(false);
                            }}
                          >
                            {users} пользователей
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ul className="obx-tariffs__edition-list">
                    <li>быстрый старт без сервера;</li>
                    <li>подписка и обновления на стороне Битрикс24;</li>
                    <li>подходит для большинства CRM-сценариев.</li>
                  </ul>
                </article>

                <article className="obx-tariffs__edition obx-tariffs__edition--box">
                  <div className="obx-tariffs__edition-head">
                    <span>Коробка</span>
                    <h4>Для собственного сервера, сложных прав и доработок</h4>
                    <p>
                      Нужна, когда важны контроль инфраструктуры, особые требования безопасности, глубокие доработки,
                      нагрузка или интеграции внутри корпоративного контура.
                    </p>
                  </div>
                  <div className="obx-tariffs__plans obx-tariffs__plans--box">
                    {[
                      ["box-store", "12", "Интернет-магазин + CRM", "старт коробки"],
                      ["box-portal", "50", "Корпоративный портал", "внутренний контур"],
                      ["box-enterprise", "1000", "Энтерпрайз", "большая инфраструктура"],
                    ].map(([id, users, title, caption]) => (
                      <button
                        className={navigatorPlan === id ? "is-active" : ""}
                        type="button"
                        key={id}
                        onClick={() => {
                          setNavigatorPlan(id as NavigatorPlan);
                          setNavigatorEnterpriseOpen(false);
                        }}
                      >
                        <span>{users}</span>
                        <strong>{title}</strong>
                        <em>{caption}</em>
                      </button>
                    ))}
                  </div>
                  <ul className="obx-tariffs__edition-list">
                    <li>свой сервер и администрирование;</li>
                    <li>глубокие доработки и контроль доступа;</li>
                    <li>важно считать не только лицензию, но и владение.</li>
                  </ul>
                </article>
              </div>

              <div className="obx-tariffs__decision">
                <div className="obx-tariffs__fit">
                  <span>Подходит</span>
                  <strong>{navigatorActive.title}</strong>
                </div>
                <div className="obx-tariffs__risk">
                  <span>Проверить перед покупкой</span>
                  <strong>{navigatorActive.text}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="obx-tariffs__note">
            <p className="obx-tariffs__note-text">
              Точная стоимость и состав тарифов могут меняться. <span>Перед покупкой сверяем актуальный прайс, ограничения тарифа и состав внедрения.</span>
            </p>
            <a className="obx-tariffs__note-link" href="#lead" data-obx-lead-open>
              Запросить расчёт
            </a>
          </div>
        </div>
      </section>

      <section className="obx-price-line" id="bitrix24-prices">
        <div className="obx-price-line__inner">
          <div className="obx-price-line__head">
            <div>
              <div className="obx-price-line__eyebrow">Тарифы Битрикс24</div>
              <h2 className="obx-price-line__title">Линейка тарифов: облако и коробка в одном сравнении</h2>
            </div>
            <p className="obx-price-line__lead">
              Цены и пользователи сверены с официальными страницами Битрикс24. Переключите тип лицензии, срок облака
              или количество пользователей, чтобы увидеть нужный вариант.
            </p>
          </div>

          <div className="obx-price-line__control-bar">
            <div className="obx-price-line__control-group">
              <span className="obx-price-line__control-label">Тип лицензии</span>
              <div className="obx-price-line__segmented" role="tablist" aria-label="Тип лицензии Битрикс24">
                <button
                  className={mode === "cloud" ? "is-active" : ""}
                  type="button"
                  role="tab"
                  aria-selected={mode === "cloud"}
                  onClick={() => {
                    setMode("cloud");
                    setOpenPicker(null);
                    setHoveredFeature(null);
                  }}
                >
                  Облако
                </button>
                <button
                  className={mode === "box" ? "is-active" : ""}
                  type="button"
                  role="tab"
                  aria-selected={mode === "box"}
                  onClick={() => {
                    setMode("box");
                    setOpenPicker(null);
                    setHoveredFeature(null);
                  }}
                >
                  Коробка
                </button>
              </div>
            </div>
            <div className={`obx-price-line__control-group ${mode === "box" ? "is-disabled" : ""}`}>
              <span className="obx-price-line__control-label">Срок лицензии</span>
              <div className="obx-price-line__periods" role="tablist" aria-label="Срок лицензии Битрикс24">
                <button
                  className={period === "month" ? "is-active" : ""}
                  type="button"
                  role="tab"
                  aria-selected={period === "month"}
                  onClick={() => mode === "cloud" && setPeriod("month")}
                >
                  1 месяц
                </button>
                <button
                  className={period === "year" ? "is-active" : ""}
                  type="button"
                  role="tab"
                  aria-selected={period === "year"}
                  onClick={() => mode === "cloud" && setPeriod("year")}
                >
                  12 месяцев <span>-30%</span>
                </button>
              </div>
            </div>
            <div className="obx-price-line__control-note">
              <span>{note.label}</span>
              <p>{note.text}</p>
            </div>
          </div>

          {mode === "cloud" ? (
            <div className="obx-price-line__catalog" data-obx-panel="cloud">
              {cloudPlans.map((plan) => {
                const users = plan.id === "enterprise" ? enterpriseUsersCount : undefined;
                const oldPrice = resolvePrice(plan.monthly, users);
                const currentPrice = resolvePrice(period === "year" ? plan.yearly : plan.monthly, users);

                return (
                  <article
                    className={`obx-price-line__card ${plan.featured ? "is-featured" : ""} ${
                      plan.enterprise ? "obx-price-line__card--enterprise" : ""
                    }`}
                    key={plan.id}
                  >
                    {plan.popular && <span className="obx-price-line__popular">Популярный</span>}
                    <h4>{plan.title}</h4>
                    <p className="obx-price-line__description">{plan.description}</p>
                    <div className="obx-price-line__metric-line">
                      <div
                        className={`obx-price-line__user-line ${
                          plan.enterprise ? "" : "obx-price-line__user-line--fixed"
                        }`}
                      >
                        {plan.enterprise ? (
                          <div
                            className={`obx-price-line__user-picker ${
                              openPicker === "cloud-enterprise" ? "is-open" : ""
                            }`}
                          >
                            <button
                              type="button"
                              aria-expanded={openPicker === "cloud-enterprise"}
                              onClick={() =>
                                setOpenPicker(openPicker === "cloud-enterprise" ? null : "cloud-enterprise")
                              }
                            >
                              <span>{enterpriseUsersCount} пользователей</span>
                            </button>
                            <div className="obx-price-line__user-menu">
                              {enterpriseUsers.map((option) => (
                                <button
                                  className={enterpriseUsersCount === option ? "is-active" : ""}
                                  type="button"
                                  key={option}
                                  onClick={() => {
                                    setEnterpriseUsersCount(option);
                                    setOpenPicker(null);
                                  }}
                                >
                                  {option} пользователей
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span>{plan.usersLabel}</span>
                        )}
                      </div>
                      <span className="obx-price-line__users">{plan.storage}</span>
                    </div>
                    <div className="obx-price-line__price">
                      <div className="obx-price-line__price-old-row">
                        {period === "year" && <small>{formatPrice(oldPrice)}</small>}
                        {period === "year" && <span className="obx-price-line__discount">-30%</span>}
                      </div>
                      <strong>{formatPrice(currentPrice)}</strong>
                      <span>{period === "year" ? "за месяц при оплате за год" : "за месяц"}</span>
                    </div>
                    <a className="obx-price-line__link" href="#lead" data-obx-lead-open data-obx-lead-title={leadTitle(plan.title)}>
                      Запросить счёт
                    </a>
                    <ul className="obx-price-line__features">
                      {plan.features.map((feature) => (
                        <li
                          className={hoveredFeature === feature.title ? "is-row-hover" : ""}
                          data-obx-feature={`icon-${feature.level}`}
                          key={`${plan.id}-${feature.title}`}
                          onMouseEnter={() => setHoveredFeature(feature.title)}
                          onMouseLeave={() => setHoveredFeature(null)}
                        >
                          {feature.title}
                        </li>
                      ))}
                    </ul>
                    <ul className="obx-price-line__features obx-price-line__features--bottom">
                      {plan.bottomFeatures.map((feature) => (
                        <li
                          className={hoveredFeature === feature.title ? "is-row-hover" : ""}
                          data-obx-feature={`icon-${feature.level}`}
                          key={`${plan.id}-${feature.title}`}
                          onMouseEnter={() => setHoveredFeature(feature.title)}
                          onMouseLeave={() => setHoveredFeature(null)}
                        >
                          {feature.title}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="obx-price-line__catalog" data-obx-panel="box">
              {boxPlans.map((plan) => {
                const users = plan.id === "cp" ? portalUsersCount : plan.id === "ent" ? boxEnterpriseUsersCount : undefined;
                const currentPrice = resolvePrice(plan.price, users);
                const picker =
                  plan.id === "cp"
                    ? { key: "box-cp" as const, value: portalUsersCount, options: portalUsers, set: setPortalUsersCount }
                    : plan.id === "ent"
                      ? {
                          key: "box-ent" as const,
                          value: boxEnterpriseUsersCount,
                          options: boxEnterpriseUsers,
                          set: setBoxEnterpriseUsersCount,
                        }
                      : null;

                return (
                  <article
                    className={`obx-price-line__card ${plan.featured ? "is-featured" : ""} ${
                      plan.enterprise ? "obx-price-line__card--enterprise" : ""
                    }`}
                    key={plan.id}
                  >
                    <h4>{plan.title}</h4>
                    <div className="obx-price-line__metric-line">
                      <div className={`obx-price-line__user-line ${picker ? "" : "obx-price-line__user-line--fixed"}`}>
                        {picker ? (
                          <div className={`obx-price-line__user-picker ${openPicker === picker.key ? "is-open" : ""}`}>
                            <button
                              type="button"
                              aria-expanded={openPicker === picker.key}
                              onClick={() => setOpenPicker(openPicker === picker.key ? null : picker.key)}
                            >
                              <span>{picker.value} пользователей</span>
                            </button>
                            <div className="obx-price-line__user-menu">
                              {picker.options.map((option) => (
                                <button
                                  className={picker.value === option ? "is-active" : ""}
                                  type="button"
                                  key={option}
                                  onClick={() => {
                                    picker.set(option);
                                    setOpenPicker(null);
                                  }}
                                >
                                  {option} пользователей
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span>{plan.usersLabel}</span>
                        )}
                      </div>
                      <span className="obx-price-line__users">{plan.meta}</span>
                    </div>
                    <div className="obx-price-line__price">
                      <strong>{formatPrice(currentPrice)}</strong>
                      <span>лицензия на год</span>
                    </div>
                    <p className="obx-price-line__description">{plan.description}</p>
                    <ul className="obx-price-line__features">
                      {plan.features.map((feature) => (
                        <li data-obx-feature="check" key={`${plan.id}-${feature}`}>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a className="obx-price-line__link" href="#lead" data-obx-lead-open data-obx-lead-title={leadTitle(plan.title)}>
                      Запросить счёт
                    </a>
                  </article>
                );
              })}
            </div>
          )}

          <div className="obx-price-line__trial">
            <div className="obx-price-line__trial-content">
              <span className="obx-price-line__trial-label">Бесплатный старт</span>
              <h3 className="obx-price-line__trial-title">
                Можно стартовать бесплатно, а рабочий тариф выбрать после разбора сценариев
              </h3>
              <p className="obx-price-line__trial-text">
                Бесплатный портал подходит для знакомства с CRM, задачами, мессенджером и интерфейсом. Для отделов,
                прав доступа, автоматизации, отчётов и интеграций обычно нужен платный тариф или коробочная версия.
              </p>
              <div className="obx-price-line__trial-points" aria-label="Параметры бесплатного тарифа">
                <span>5 ГБ диск</span>
                <span>неограниченно пользователей</span>
              </div>
            </div>
            <div className="obx-price-line__trial-actions">
              <a className="obx-price-line__link" href="#lead" data-obx-lead-open>
                Подобрать старт
              </a>
              <span>Подбор без ухода с сайта</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
