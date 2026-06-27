"use client";

import { type CSSProperties, type MouseEvent as ReactMouseEvent, useMemo, useRef, useState } from "react";
import { CheckCircle2, Sparkles, UsersRound } from "lucide-react";
import { BitrixCrmProof } from "./BitrixCrmProof";

type Mode = "cloud" | "box";
type Period = "month" | "year";
type FeatureLevel = 0 | 1 | 2 | 3;
type CloudPlanId = "basic" | "standard" | "professional" | "enterprise";
type BoxPlanId = "box-50" | "box-100" | "box-250" | "box-500";
type NavigatorPlan = CloudPlanId | BoxPlanId;
type OpenPicker = "cloud-enterprise" | "market-enterprise" | null;
type FeatureHighlight = { top: number; height: number };

type FeatureRow = { id: string; title: string };
type CloudPlan = {
  id: CloudPlanId;
  title: string;
  description: string;
  usersLabel: string;
  storage: string;
  monthly: number | Record<number, number>;
  yearly: number | Record<number, number>;
  levels: Record<string, FeatureLevel>;
  popular?: boolean;
  featured?: boolean;
  enterprise?: boolean;
};
type BoxPlan = {
  id: BoxPlanId;
  title: string;
  description: string;
  usersLabel: string;
  price: number;
  accent: string;
  features: string[];
  featured?: boolean;
};
type MarketplacePlan = {
  id: CloudPlanId | BoxPlanId;
  title: string;
  usersLabel: string;
  storage?: string;
  price: number | Record<number, number> | string;
  oldPrice?: number | Record<number, number>;
  description: string;
  features: string[];
  enterprise?: boolean;
  popular?: boolean;
};

const REGISTER_URL = "https://www.bitrix24.ru/create.php?p=10553488";

const enterpriseUsers = [250, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
const enterpriseStorage: Record<number, string> = {
  250: "3 ТБ диск",
  500: "5 ТБ диск",
  1000: "10 ТБ диск",
  2000: "20 ТБ диск",
  3000: "30 ТБ диск",
  4000: "40 ТБ диск",
  5000: "50 ТБ диск",
  6000: "60 ТБ диск",
  7000: "70 ТБ диск",
  8000: "80 ТБ диск",
  9000: "90 ТБ диск",
  10000: "100 ТБ диск",
};

const comparisonRows: FeatureRow[] = [
  { id: "collab", title: "Совместная работа" },
  { id: "messenger", title: "Мессенджер" },
  { id: "collabs", title: "Коллабы" },
  { id: "tasks", title: "Задачи и Проекты" },
  { id: "crm", title: "CRM" },
  { id: "gpt", title: "BitrixGPT" },
  { id: "sign", title: "Онлайн-подпись" },
  { id: "disk", title: "Диск" },
  { id: "boards", title: "Доски" },
  { id: "contact", title: "Контакт-центр" },
  { id: "sites", title: "Сайты" },
  { id: "store", title: "Интернет-магазин" },
  { id: "booking", title: "Онлайн-запись" },
  { id: "marketing", title: "Маркетинг" },
  { id: "docs", title: "Документы Онлайн" },
  { id: "hrsign", title: "КЭДО + Госключ" },
  { id: "bi", title: "BI Конструктор" },
  { id: "analytics", title: "Сквозная аналитика" },
  { id: "automation", title: "Автоматизация" },
  { id: "hr", title: "HR: Компания" },
  { id: "support", title: "Поддержка" },
  { id: "admin", title: "Администрирование" },
];

const cloudPlans: CloudPlan[] = [
  {
    id: "basic",
    title: "Базовый",
    description: "CRM для небольшого отдела продаж: лиды, сделки, задачи, простая коммуникация и стартовая автоматизация.",
    usersLabel: "5 пользователей",
    storage: "24 ГБ диск",
    monthly: 2490,
    yearly: 1743,
    levels: {
      collab: 2, messenger: 2, collabs: 1, tasks: 1, crm: 2, gpt: 3, sign: 2, disk: 1, boards: 3,
      contact: 2, sites: 2, store: 2, booking: 1, marketing: 0, docs: 0, hrsign: 0, bi: 0, analytics: 0,
      automation: 0, hr: 0, support: 1, admin: 0,
    },
  },
  {
    id: "standard",
    title: "Стандартный",
    description: "Для отдела продаж и рабочих групп: больше пользователей, совместная работа, документы и базовая аналитика.",
    usersLabel: "50 пользователей",
    storage: "100 ГБ диск",
    monthly: 6990,
    yearly: 4893,
    featured: true,
    levels: {
      collab: 2, messenger: 3, collabs: 2, tasks: 2, crm: 2, gpt: 3, sign: 2, disk: 2, boards: 3,
      contact: 2, sites: 2, store: 2, booking: 2, marketing: 2, docs: 2, hrsign: 2, bi: 2, analytics: 0,
      automation: 0, hr: 0, support: 2, admin: 2,
    },
  },
  {
    id: "professional",
    title: "Профессиональный",
    description: "Для компании, где CRM уже должна управлять процессами, отчётами, автоматизацией и несколькими отделами.",
    usersLabel: "100 пользователей",
    storage: "1 024 ГБ диск",
    monthly: 13990,
    yearly: 9793,
    popular: true,
    levels: {
      collab: 2, messenger: 3, collabs: 3, tasks: 3, crm: 3, gpt: 3, sign: 3, disk: 3, boards: 3,
      contact: 3, sites: 3, store: 3, booking: 3, marketing: 3, docs: 3, hrsign: 2, bi: 3, analytics: 2,
      automation: 3, hr: 3, support: 2, admin: 2,
    },
  },
  {
    id: "enterprise",
    title: "Энтерпрайз",
    description: "Для крупной компании: филиалы, повышенные лимиты, расширенное администрирование, HRM и масштабирование портала.",
    usersLabel: "250 пользователей",
    storage: "3 ТБ диск",
    enterprise: true,
    monthly: {
      250: 33990, 500: 59990, 1000: 99990, 2000: 199990, 3000: 299990, 4000: 399990,
      5000: 499990, 6000: 599990, 7000: 699990, 8000: 799990, 9000: 899990, 10000: 999990,
    },
    yearly: {
      250: 23793, 500: 41993, 1000: 69993, 2000: 139993, 3000: 209993, 4000: 279993,
      5000: 349993, 6000: 419993, 7000: 489993, 8000: 559993, 9000: 629993, 10000: 699993,
    },
    levels: {
      collab: 3, messenger: 3, collabs: 3, tasks: 3, crm: 3, gpt: 3, sign: 3, disk: 3, boards: 3,
      contact: 3, sites: 3, store: 3, booking: 3, marketing: 3, docs: 3, hrsign: 3, bi: 3, analytics: 3,
      automation: 3, hr: 3, support: 3, admin: 3,
    },
  },
];

const boxPlans: BoxPlan[] = [
  {
    id: "box-50",
    title: "Корпоративный портал - 50",
    usersLabel: "50 пользователей",
    price: 159000,
    accent: "для управляемого контура",
    description: "Стартовая коробка для компании, где нужен собственный сервер, роли, задачи, документы и базовые процессы.",
    features: ["собственная инфраструктура", "портал, задачи и документы", "основа для доработок"],
  },
  {
    id: "box-100",
    title: "Корпоративный портал - 100",
    usersLabel: "100 пользователей",
    price: 229000,
    accent: "для нескольких отделов",
    description: "Когда в портале работает не один отдел, появляются права, регламенты, согласования и интеграции с учётом.",
    features: ["больше пользователей", "права и бизнес-процессы", "интеграции с 1С и сайтом"],
    featured: true,
  },
  {
    id: "box-250",
    title: "Корпоративный портал - 250",
    usersLabel: "250 пользователей",
    price: 349000,
    accent: "для крупной структуры",
    description: "Подходит для B2B-компаний с несколькими подразделениями, регламентами, отчётами и нагрузкой на портал.",
    features: ["много подразделений", "сложные сценарии прав", "масштабирование процессов"],
  },
  {
    id: "box-500",
    title: "Корпоративный портал - 500",
    usersLabel: "500 пользователей",
    price: 599000,
    accent: "для распределённой компании",
    description: "Вариант для компаний с высокой вовлечённостью сотрудников, корпоративными сервисами и долгим горизонтом развития.",
    features: ["распределённая команда", "внутренние сервисы", "запас по росту портала"],
  },
];

const navigatorItems: Array<{ id: NavigatorPlan; mode: Mode; users: string; title: string; caption: string }> = [
  { id: "basic", mode: "cloud", users: "5", title: "Базовый", caption: "малый отдел" },
  { id: "standard", mode: "cloud", users: "50", title: "Стандартный", caption: "команда продаж" },
  { id: "professional", mode: "cloud", users: "100", title: "Профессиональный", caption: "автоматизация" },
  { id: "enterprise", mode: "cloud", users: "250", title: "Энтерпрайз", caption: "крупная компания" },
  { id: "box-50", mode: "box", users: "50", title: "Корпоративный портал - 50", caption: "свой сервер" },
  { id: "box-100", mode: "box", users: "100", title: "Корпоративный портал - 100", caption: "несколько отделов" },
  { id: "box-250", mode: "box", users: "250", title: "Корпоративный портал - 250", caption: "крупный контур" },
  { id: "box-500", mode: "box", users: "500", title: "Корпоративный портал - 500", caption: "распределённая компания" },
];

const navigatorCopy: Record<NavigatorPlan, { title: string; text: string; check: string }> = {
  basic: {
    title: "Базовый",
    text: "Для небольшой команды, которой нужно быстро начать вести лиды и сделки без сложной архитектуры.",
    check: "Проверяем, хватит ли 5 пользователей, 24 ГБ диска и базовых прав доступа.",
  },
  standard: {
    title: "Стандартный",
    text: "Для отдела продаж и рабочих групп, где CRM уже связана с задачами, документами и коммуникациями.",
    check: "Смотрим структуру отделов, телефонию, документы, права и будущие отчёты.",
  },
  professional: {
    title: "Профессиональный",
    text: "Для компании, где важны автоматизация, отчёты, процессы, маркетинг и управляемая CRM-логика.",
    check: "Сверяем сценарии роботов, права, отчёты, BI, интеграции и ограничения по отделам.",
  },
  enterprise: {
    title: "Энтерпрайз 250+",
    text: "Для крупной компании с филиалами, повышенными лимитами, HRM, расширенным администрированием и ростом портала.",
    check: "Оцениваем количество сотрудников, филиалы, нагрузку, требования безопасности и администрирование.",
  },
  "box-50": {
    title: "Коробка на 50 пользователей",
    text: "Для компании, которой нужен собственный сервер и управляемый корпоративный контур без лишнего масштаба.",
    check: "Считаем сервер, сопровождение, обновления, резервное копирование и набор доработок.",
  },
  "box-100": {
    title: "Коробка на 100 пользователей",
    text: "Для нескольких отделов, где появляются права, регламенты, обмены с 1С и требования к владению данными.",
    check: "Проверяем роли, согласования, обмены, нагрузку, администрирование и контур поддержки.",
  },
  "box-250": {
    title: "Коробка на 250 пользователей",
    text: "Для крупной структуры, где портал становится частью внутренней операционной системы компании.",
    check: "Закладываем масштабирование, интеграции, карту процессов и требования к инфраструктуре.",
  },
  "box-500": {
    title: "Коробка на 500 пользователей",
    text: "Для распределённой компании, где портал должен выдерживать рост, сервисы сотрудников и долгий жизненный цикл.",
    check: "Отдельно считаем владение системой: серверы, сопровождение, обновления, безопасность и развитие.",
  },
};

const marketplaceCloudPlans: MarketplacePlan[] = [
  {
    id: "basic",
    title: "Базовый",
    usersLabel: "5 пользователей",
    storage: "24 ГБ диск",
    oldPrice: 1000,
    price: 500,
    description: "Стартовая подписка для небольшого облачного портала.",
    features: ["приложения Маркетплейса", "BitrixGPT", "стоимость за всех пользователей"],
  },
  {
    id: "standard",
    title: "Стандартный",
    usersLabel: "50 пользователей",
    storage: "100 ГБ диск",
    oldPrice: 3000,
    price: 1500,
    description: "Для команды, где уже появляются приложения, виджеты и документы.",
    features: ["приложения Маркетплейса", "BitrixGPT", "стоимость за всех пользователей"],
  },
  {
    id: "professional",
    title: "Профессиональный",
    usersLabel: "100 пользователей",
    storage: "1 024 ГБ диск",
    oldPrice: 6000,
    price: 3000,
    description: "Для портала с автоматизацией, BI, телефонией и несколькими отделами.",
    features: ["приложения Маркетплейса", "BitrixGPT", "стоимость за всех пользователей"],
    popular: true,
  },
  {
    id: "enterprise",
    title: "Энтерпрайз",
    usersLabel: "250 пользователей",
    storage: "3 ТБ диск",
    oldPrice: {
      250: 13600, 500: 24000, 1000: 40000, 2000: 80000, 3000: 120000, 4000: 160000,
      5000: 200000, 6000: 240000, 7000: 280000, 8000: 320000, 9000: 360000, 10000: 400000,
    },
    price: {
      250: 6800, 500: 12000, 1000: 20000, 2000: 40000, 3000: 60000, 4000: 80000,
      5000: 100000, 6000: 120000, 7000: 140000, 8000: 160000, 9000: 180000, 10000: 200000,
    },
    description: "Для крупного облачного портала с расширенной командой и приложениями.",
    features: ["приложения Маркетплейса", "BitrixGPT", "стоимость за всех пользователей"],
    enterprise: true,
  },
];

const marketplaceBoxPlans: MarketplacePlan[] = [
  {
    id: "box-50",
    title: "Корпоративный портал - 50",
    usersLabel: "50 пользователей",
    price: 73200,
    description: "Подписка для коробочного портала на 50 пользователей: приложения Маркетплейса и BitrixGPT для собственного контура.",
    features: ["приложения Маркетплейса", "BitrixGPT", "стоимость для коробочной лицензии"],
  },
  {
    id: "box-100",
    title: "Корпоративный портал - 100",
    usersLabel: "100 пользователей",
    price: 97600,
    description: "Для портала с несколькими отделами, ролями, регламентами и набором рабочих приложений.",
    features: ["приложения Маркетплейса", "BitrixGPT", "стоимость для коробочной лицензии"],
  },
  {
    id: "box-250",
    title: "Корпоративный портал - 250",
    usersLabel: "250 пользователей",
    price: 146400,
    description: "Для крупного коробочного контура, где приложения и AI-сценарии подключаются к рабочим процессам.",
    features: ["приложения Маркетплейса", "BitrixGPT", "стоимость для коробочной лицензии"],
  },
  {
    id: "box-500",
    title: "Корпоративный портал - 500",
    usersLabel: "500 пользователей",
    oldPrice: 256200,
    price: 128100,
    description: "Для распределённой компании с большим порталом, приложениями, AI-сценариями и долгим циклом владения.",
    features: ["приложения Маркетплейса", "BitrixGPT", "стоимость для коробочной лицензии"],
  },
];

function formatPrice(value: number) {
  return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
}

function formatMaybePrice(value: number | string) {
  return typeof value === "number" ? formatPrice(value) : value;
}

function resolvePrice(value: number | Record<number, number>, users?: number) {
  if (typeof value === "number") return value;
  const first = Number(Object.keys(value)[0]);
  return value[users ?? first] ?? value[first];
}

function resolveMaybePrice(value: number | Record<number, number> | string, users?: number) {
  if (typeof value === "string") return value;
  return resolvePrice(value, users);
}

function getCloudStorageLabel(planId: CloudPlanId, users: number) {
  if (planId === "enterprise") return enterpriseStorage[users];
  return cloudPlans.find((plan) => plan.id === planId)?.storage ?? "";
}

function leadTitle(title: string) {
  return `Запросить счёт: ${title}`;
}

function FeatureIndicator({ level }: { level: FeatureLevel }) {
  return (
    <span className={`obx-feature-indicator obx-feature-indicator--${level}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function UserCapacity({ value }: { value: string }) {
  return (
    <span className="obx-user-capacity" aria-label={`${value} пользователей`}>
      <UsersRound size={15} aria-hidden="true" />
      <b>{value}</b>
    </span>
  );
}

export function BitrixPricingBlock() {
  const cloudCatalogRef = useRef<HTMLDivElement | null>(null);
  const [navigatorPlan, setNavigatorPlan] = useState<NavigatorPlan>("professional");
  const [navigatorEnterpriseOpen, setNavigatorEnterpriseOpen] = useState(false);
  const [navigatorEnterpriseUsers, setNavigatorEnterpriseUsers] = useState(250);
  const [mode, setMode] = useState<Mode>("cloud");
  const [period, setPeriod] = useState<Period>("year");
  const [enterpriseUsersCount, setEnterpriseUsersCount] = useState(250);
  const [marketMode, setMarketMode] = useState<Mode>("cloud");
  const [marketPeriod, setMarketPeriod] = useState<Period>("month");
  const [marketEnterpriseUsers, setMarketEnterpriseUsers] = useState(250);
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [featureHighlight, setFeatureHighlight] = useState<FeatureHighlight | null>(null);

  const syncEnterpriseUsers = (users: number) => {
    setEnterpriseUsersCount(users);
    setMarketEnterpriseUsers(users);
    setNavigatorEnterpriseUsers(users);
  };

  const navigatorActive = navigatorCopy[navigatorPlan];
  const note = useMemo(
    () =>
      mode === "box"
        ? "Коробочная цена — это лицензия. Сервер, администрирование, обновления, безопасность и внедрение считаются отдельно."
        : "В облаке цена ниже при оплате за 12 месяцев. Перед счётом сверяем актуальные условия и ограничения тарифа.",
    [mode],
  );

  const marketplacePlans = marketMode === "cloud" ? marketplaceCloudPlans : marketplaceBoxPlans;

  const syncMode = (nextMode: Mode) => {
    setMode(nextMode);
    setMarketMode(nextMode);
    setOpenPicker(null);
    setHoveredFeature(null);
    setFeatureHighlight(null);
  };

  const clearFeatureHover = () => {
    setHoveredFeature(null);
    setFeatureHighlight(null);
  };

  const handleFeatureEnter = (rowId: string, event: ReactMouseEvent<HTMLLIElement>) => {
    const catalogRect = cloudCatalogRef.current?.getBoundingClientRect();
    const rowRect = event.currentTarget.getBoundingClientRect();

    setHoveredFeature(rowId);

    if (catalogRect) {
      setFeatureHighlight({
        top: rowRect.top - catalogRect.top,
        height: rowRect.height,
      });
    }
  };

  const featureHoverStyle = featureHighlight
    ? ({
        "--obx-feature-hover-top": `${featureHighlight.top}px`,
        "--obx-feature-hover-height": `${featureHighlight.height}px`,
      } as CSSProperties)
    : undefined;

  return (
    <>
      <section className="obx-tariffs" id="tariffs">
        <div className="obx-tariffs__inner">
          <div className="obx-tariffs__head">
            <div>
              <div className="obx-tariffs__eyebrow">Цены Битрикс24</div>
              <h2 className="obx-tariffs__title">Сначала выбираем сценарий, потом тариф и формат лицензии</h2>
            </div>
            <div className="obx-tariffs__lead obx-tariffs__lead--important">
              <p>
                Не покупаем лицензию “на глаз”: считаем пользователей, права, отчёты, интеграции, объём диска и контур владения системой.
              </p>
            </div>
          </div>

          <div className="obx-tariffs__trial">
            <div className="obx-tariffs__trial-content">
              <span className="obx-tariffs__trial-label">Бесплатный старт</span>
              <h3 className="obx-tariffs__trial-title">Можно открыть бесплатный портал и спокойно проверить интерфейс</h3>
              <p className="obx-tariffs__trial-text">
                Бесплатный Битрикс24 подходит для знакомства с CRM, задачами и мессенджером. Для рабочих отделов,
                прав, отчётов, автоматизации и интеграций тариф лучше выбирать после короткого разбора.
              </p>
            </div>
            <div className="obx-tariffs__trial-actions">
              <a className="obx-tariffs__trial-btn" href={REGISTER_URL} target="_blank" rel="noreferrer">
                Зарегистрировать портал
              </a>
            </div>
          </div>

          <div className="obx-tariffs__chooser">
            <aside className="obx-tariffs__main">
              <span className="obx-tariffs__label">Навигатор</span>
              <h3 className="obx-tariffs__main-title">Лицензия должна совпасть с реальной моделью работы</h3>
              <p className="obx-tariffs__main-text">
                Облако чаще выигрывает скоростью запуска. Коробка нужна, когда важны собственный сервер, контроль данных,
                сложная архитектура, нестандартные права и глубокие доработки.
              </p>
              <div className="obx-tariffs__method-note">
                <span>Как мы выбираем тариф</span>
                <p>Фиксируем команду, права, каналы коммуникаций, обмены с 1С, отчёты, объём диска и запас роста на ближайший год.</p>
              </div>
              <a className="obx-tariffs__btn" href="#lead" data-obx-lead-open>
                Подобрать тариф
              </a>
            </aside>

            <div className="obx-tariffs__matrix">
              <div className="obx-tariffs__matrix-top">
                <div>
                  <span className="obx-tariffs__estimate-label">Навигатор тарифов</span>
                  <h3 className="obx-tariffs__estimate-title">Облачные и коробочные варианты</h3>
                </div>
                <a className="obx-tariffs__official" href="#bitrix24-prices">
                  К таблице цен
                </a>
              </div>

              <div className="obx-tariffs__columns">
                <article className="obx-tariffs__edition obx-tariffs__edition--cloud">
                  <div className="obx-tariffs__edition-head">
                    <span>Облако</span>
                    <h3>Быстрый запуск без своего сервера</h3>
                    <p>Выбираем, когда важны скорость, обновления на стороне сервиса и понятная подписка.</p>
                  </div>
                  <div className="obx-tariffs__plans">
                    {navigatorItems.filter((item) => item.mode === "cloud").map((item) => {
                      const isEnterprise = item.id === "enterprise";
                      const storageLabel = getCloudStorageLabel(item.id as CloudPlanId, navigatorEnterpriseUsers);
                      return (
                        <div className={`obx-tariffs__plan-shell ${isEnterprise && navigatorEnterpriseOpen ? "is-open" : ""}`} key={item.id}>
                          <button
                            className={navigatorPlan === item.id ? "is-active" : ""}
                            type="button"
                            aria-expanded={isEnterprise ? navigatorEnterpriseOpen : undefined}
                            onClick={() => {
                              setNavigatorPlan(item.id);
                              setMode("cloud");
                              setMarketMode("cloud");
                              setOpenPicker(null);
                              if (isEnterprise) setNavigatorEnterpriseOpen((value) => !value);
                              else setNavigatorEnterpriseOpen(false);
                            }}
                          >
                            <UserCapacity value={isEnterprise ? String(navigatorEnterpriseUsers) : item.users} />
                            <strong>{item.title}</strong>
                            <span className="obx-tariffs__plan-storage">{storageLabel}</span>
                            <em>{isEnterprise ? "250+ пользователей" : item.caption}</em>
                          </button>
                          {isEnterprise && (
                            <div className="obx-tariffs__enterprise-menu">
                              {enterpriseUsers.map((users) => (
                                <button
                                  className={navigatorEnterpriseUsers === users ? "is-active" : ""}
                                  type="button"
                                  key={users}
                                  onClick={() => {
                                    syncEnterpriseUsers(users);
                                    setNavigatorPlan("enterprise");
                                    setMode("cloud");
                                    setMarketMode("cloud");
                                    setNavigatorEnterpriseOpen(false);
                                  }}
                                >
                                  {users} пользователей
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </article>

                <article className="obx-tariffs__edition obx-tariffs__edition--box">
                  <div className="obx-tariffs__edition-head">
                    <span>Коробка</span>
                    <h3>Собственный сервер и контроль контура</h3>
                    <p>Для компаний, где важны инфраструктура, безопасность, доработки и владение данными.</p>
                  </div>
                  <div className="obx-tariffs__plans obx-tariffs__plans--box">
                    {navigatorItems.filter((item) => item.mode === "box").map((item) => (
                      <button
                        className={navigatorPlan === item.id ? "is-active" : ""}
                        type="button"
                        key={item.id}
                        onClick={() => {
                          setNavigatorPlan(item.id);
                          setMode("box");
                          setMarketMode("box");
                          setNavigatorEnterpriseOpen(false);
                          setOpenPicker(null);
                        }}
                      >
                        <UserCapacity value={item.users} />
                        <strong>{item.title}</strong>
                        <em>{item.caption}</em>
                      </button>
                    ))}
                  </div>
                </article>
              </div>

              <div className="obx-tariffs__decision">
                <div className="obx-tariffs__fit">
                  <span>Кому подходит</span>
                  <p>{navigatorActive.text}</p>
                </div>
                <div className="obx-tariffs__risk">
                  <span>Проверить перед покупкой</span>
                  <p>{navigatorActive.check}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="obx-price-line" id="bitrix24-prices">
        <div className="obx-price-line__inner">
          <div className="obx-price-line__head">
            <div>
              <div className="obx-price-line__eyebrow">Тарифы Битрикс24</div>
              <h2 className="obx-price-line__title">Облако и коробка в одном сравнении</h2>
            </div>
            <div className="obx-price-line__lead obx-price-line__lead--important">
              <p>
                Цены и лимиты сверяем перед выставлением счёта. В таблице показываем ориентиры по официальной линейке Битрикс24.
              </p>
              <BitrixCrmProof variant="hero" className="ob-crm-proof--tariffs" />
            </div>
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
                  onClick={() => syncMode("cloud")}
                >
                  Облако
                </button>
                <button
                  className={mode === "box" ? "is-active" : ""}
                  type="button"
                  role="tab"
                  aria-selected={mode === "box"}
                  onClick={() => syncMode("box")}
                >
                  Коробка
                </button>
              </div>
            </div>
            <div className={`obx-price-line__control-group obx-price-line__control-group--period ${mode === "box" ? "is-disabled" : ""}`}>
              <span className="obx-price-line__control-label">Срок лицензии</span>
              <div className="obx-price-line__periods" role="tablist" aria-label="Срок лицензии Битрикс24">
                <button className={period === "month" ? "is-active" : ""} type="button" role="tab" aria-selected={period === "month"} onClick={() => mode === "cloud" && setPeriod("month")}>1 месяц</button>
                <button className={period === "year" ? "is-active" : ""} type="button" role="tab" aria-selected={period === "year"} onClick={() => mode === "cloud" && setPeriod("year")}>12 месяцев <span>-30%</span></button>
              </div>
            </div>
            <div className="obx-price-line__control-note">
              <p>{note}</p>
            </div>
          </div>

          {mode === "cloud" ? (
            <div
              ref={cloudCatalogRef}
              className={`obx-price-line__catalog ${hoveredFeature && featureHighlight ? "has-row-hover" : ""}`}
              data-obx-panel="cloud"
              style={featureHoverStyle}
              onMouseLeave={clearFeatureHover}
            >
              {hoveredFeature && featureHighlight && <div className="obx-price-line__row-highlight" aria-hidden="true" />}
              {cloudPlans.map((plan) => {
                const users = plan.id === "enterprise" ? enterpriseUsersCount : undefined;
                const oldPrice = resolvePrice(plan.monthly, users);
                const currentPrice = resolvePrice(period === "year" ? plan.yearly : plan.monthly, users);
                const storageLabel = plan.id === "enterprise" ? enterpriseStorage[enterpriseUsersCount] : plan.storage;
                const isPickerOpen = plan.id === "enterprise" && openPicker === "cloud-enterprise";

                return (
                  <article className={`obx-price-line__card ${plan.featured ? "is-featured" : ""} ${plan.enterprise ? "obx-price-line__card--enterprise" : ""} ${isPickerOpen ? "is-picker-open" : ""}`} key={plan.id}>
                    {plan.popular && <span className="obx-price-line__popular">Популярный</span>}
                    <h3>{plan.title}</h3>
                    <p className="obx-price-line__description">{plan.description}</p>
                    <div className="obx-price-line__metric-line">
                      <div className={`obx-price-line__user-line ${plan.enterprise ? "obx-price-line__user-line--picker" : "obx-price-line__user-line--fixed"}`}>
                        {plan.enterprise ? (
                          <div className={`obx-price-line__user-picker ${isPickerOpen ? "is-open" : ""}`}>
                            <button type="button" aria-expanded={isPickerOpen} onClick={() => setOpenPicker(isPickerOpen ? null : "cloud-enterprise")}>
                              <span>{enterpriseUsersCount} пользователей</span>
                            </button>
                            <div className="obx-price-line__user-menu">
                              {enterpriseUsers.map((option) => (
                                <button className={enterpriseUsersCount === option ? "is-active" : ""} type="button" key={option} onClick={() => { syncEnterpriseUsers(option); setOpenPicker(null); }}>
                                  {option} пользователей
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span>{plan.usersLabel}</span>
                        )}
                      </div>
                      <span className="obx-price-line__storage-badge obx-price-line__storage-badge--metric">{storageLabel}</span>
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
                      {comparisonRows.map((row) => {
                        const level = plan.levels[row.id] ?? 0;
                        const isRowHover = hoveredFeature === row.id;
                        return (
                          <li
                            className={`${isRowHover ? "is-row-hover" : ""} ${level === 0 ? "is-empty" : ""}`}
                            key={`${plan.id}-${row.id}`}
                            onMouseEnter={(event) => handleFeatureEnter(row.id, event)}
                          >
                            {level > 0 && <FeatureIndicator level={level} />}
                            {level > 0 && <span>{row.title}</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="obx-price-line__catalog" data-obx-panel="box">
              {boxPlans.map((plan) => (
                <article className={`obx-price-line__card ${plan.featured ? "is-featured" : ""}`} key={plan.id}>
                  <h3>{plan.title}</h3>
                  <p className="obx-price-line__description">{plan.description}</p>
                  <div className="obx-price-line__metric-line">
                    <div className="obx-price-line__user-line obx-price-line__user-line--fixed"><span>{plan.usersLabel}</span></div>
                    <span className="obx-price-line__users">{plan.accent}</span>
                  </div>
                  <div className="obx-price-line__price">
                    <strong>{formatPrice(plan.price)}</strong>
                    <span>лицензия на год</span>
                  </div>
                  <a className="obx-price-line__link" href="#lead" data-obx-lead-open data-obx-lead-title={leadTitle(plan.title)}>
                    Запросить счёт
                  </a>
                  <ul className="obx-price-line__features obx-price-line__features--box">
                    {plan.features.map((feature) => (
                      <li data-obx-feature="check" key={`${plan.id}-${feature}`}>
                        <CheckCircle2 size={16} aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}

          <div className="obx-price-line__trial">
            <div className="obx-price-line__trial-content">
              <span className="obx-price-line__trial-label">Бесплатный старт</span>
              <h3 className="obx-price-line__trial-title">Бесплатный портал можно открыть сразу</h3>
              <p className="obx-price-line__trial-text">
                Это хороший способ посмотреть интерфейс и собрать первые вопросы перед внедрением. Для рабочего запуска затем выбираем тариф под реальные процессы.
              </p>
              <div className="obx-price-line__trial-points" aria-label="Параметры бесплатного тарифа">
                <span>5 ГБ диск</span>
                <span>неограниченно пользователей</span>
                <span>все с правами администратора</span>
              </div>
            </div>
            <div className="obx-price-line__trial-actions">
              <a className="obx-price-line__link" href={REGISTER_URL} target="_blank" rel="noreferrer">
                Зарегистрировать портал
              </a>
            </div>
          </div>

          <div className="obx-marketplace-plus obx-marketplace-plus--table">
            <div className="obx-marketplace-plus__head">
              <div className="obx-marketplace-plus__main">
                <span className="obx-price-line__trial-label">Дополнительно</span>
                <h3>Подписка Маркетплейс + BitrixGPT</h3>
                <p>
                  Отдельно проверяем подписку на приложения Маркетплейса и возможности BitrixGPT. Для облака показываем
                  официальную логику по тарифам, для коробки фиксируем расчётный контур перед счётом.
                </p>
              </div>
              <div className="obx-marketplace-plus__controls">
                <div className="obx-marketplace-plus__switch" role="tablist" aria-label="Тип подписки Маркетплейс и BitrixGPT">
                  <button
                    className={marketMode === "cloud" ? "is-active" : ""}
                    type="button"
                    role="tab"
                    aria-selected={marketMode === "cloud"}
                    onClick={() => {
                      setMarketMode("cloud");
                      setOpenPicker(null);
                    }}
                  >
                    Облако
                  </button>
                  <button
                    className={marketMode === "box" ? "is-active" : ""}
                    type="button"
                    role="tab"
                    aria-selected={marketMode === "box"}
                    onClick={() => {
                      setMarketMode("box");
                      setOpenPicker(null);
                    }}
                  >
                    Коробка
                  </button>
                </div>
                <div className={`obx-marketplace-plus__periods ${marketMode === "cloud" ? "" : "is-placeholder"}`} role="tablist" aria-label="Срок подписки Маркетплейс и BitrixGPT" aria-hidden={marketMode !== "cloud"}>
                  <button className={marketPeriod === "month" ? "is-active" : ""} type="button" role="tab" aria-selected={marketPeriod === "month"} tabIndex={marketMode === "cloud" ? 0 : -1} onClick={() => marketMode === "cloud" && setMarketPeriod("month")}>1 месяц</button>
                  <button className={marketPeriod === "year" ? "is-active" : ""} type="button" role="tab" aria-selected={marketPeriod === "year"} tabIndex={marketMode === "cloud" ? 0 : -1} onClick={() => marketMode === "cloud" && setMarketPeriod("year")}>12 месяцев</button>
                </div>
              </div>
            </div>

            <div className="obx-marketplace-plus__catalog" data-obx-market-mode={marketMode}>
              {marketplacePlans.map((plan) => {
                const isEnterprise = marketMode === "cloud" && plan.enterprise;
                const isPickerOpen = isEnterprise && openPicker === "market-enterprise";
                const users = isEnterprise ? marketEnterpriseUsers : undefined;
                const price = resolveMaybePrice(plan.price, users);
                const oldPrice = plan.oldPrice ? resolveMaybePrice(plan.oldPrice, users) : null;
                const storage = isEnterprise ? enterpriseStorage[marketEnterpriseUsers] : plan.storage;
                const discount = typeof oldPrice === "number" && typeof price === "number" ? Math.round((1 - price / oldPrice) * 100) : null;

                return (
                  <article className={`obx-marketplace-plus__card ${plan.popular ? "is-popular" : ""} ${isEnterprise ? "is-enterprise" : ""} ${isPickerOpen ? "is-picker-open" : ""}`} key={`${marketMode}-${plan.id}`}>
                    {plan.popular && <span className="obx-marketplace-plus__popular">Популярный</span>}
                    <Sparkles size={18} aria-hidden="true" />
                    <h3>{plan.title}</h3>
                    <p>{plan.description}</p>
                    <div className="obx-marketplace-plus__metrics">
                      {isEnterprise ? (
                        <div className={`obx-price-line__user-picker obx-marketplace-plus__user-picker ${isPickerOpen ? "is-open" : ""}`}>
                          <button type="button" aria-expanded={isPickerOpen} onClick={() => setOpenPicker(isPickerOpen ? null : "market-enterprise")}>
                            <span>{marketEnterpriseUsers} пользователей</span>
                          </button>
                          <div className="obx-price-line__user-menu">
                            {enterpriseUsers.map((option) => (
                              <button className={marketEnterpriseUsers === option ? "is-active" : ""} type="button" key={option} onClick={() => { syncEnterpriseUsers(option); setOpenPicker(null); }}>
                                {option} пользователей
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span>{plan.usersLabel}</span>
                      )}
                      {storage && <span>{storage}</span>}
                    </div>
                    <div className="obx-marketplace-plus__price">
                      {(typeof oldPrice === "number" || discount !== null) && (
                        <div className="obx-marketplace-plus__old-row">
                          {typeof oldPrice === "number" && <small>{formatPrice(oldPrice)}</small>}
                          {discount !== null && <em>-{discount}%</em>}
                        </div>
                      )}
                      <strong>{formatMaybePrice(price)}</strong>
                      <span>{typeof price === "number" ? (marketMode === "cloud" ? (marketPeriod === "year" ? "в месяц при покупке на год" : "в месяц за всех пользователей") : "стоимость подписки") : "после проверки условий"}</span>
                    </div>
                    <ul>
                      {plan.features.map((feature) => (
                        <li key={`${plan.id}-${feature}`}>
                          <CheckCircle2 size={15} aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
