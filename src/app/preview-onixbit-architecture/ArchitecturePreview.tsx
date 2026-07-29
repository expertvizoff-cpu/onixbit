"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  ClipboardList,
  DatabaseZap,
  FileText,
  GitBranch,
  Globe2,
  Layers3,
  LifeBuoy,
  Mail,
  Map,
  Phone,
  Route,
  ShieldCheck,
  Sparkles,
  Workflow,
  Wrench,
} from "lucide-react";
import styles from "./architecture-preview.module.css";

type PageMode = "light" | "dark" | "system";
type PageGroup = "main" | "services" | "proof" | "process" | "support";

type SitePageConfig = {
  id: string;
  title: string;
  url: string;
  group: PageGroup;
  mode: PageMode;
  priority: "A" | "B" | "C";
  icon: LucideIcon;
  role: string;
  audience: string;
  cta: string;
  blocks: string[];
  links: string[];
};

const groupMeta: Record<PageGroup, { title: string; label: string; icon: LucideIcon }> = {
  main: { title: "Основной сайт", label: "светлый контур", icon: Globe2 },
  services: { title: "Услуги", label: "SEO и заявки", icon: Wrench },
  proof: { title: "Доверие и контент", label: "кейсы, знания, proof", icon: ShieldCheck },
  process: { title: "Процессы", label: "тёмные демо", icon: Workflow },
  support: { title: "Системные", label: "контакт и юридическое", icon: FileText },
};

const modeLabel: Record<PageMode, string> = {
  light: "светлая",
  dark: "тёмная",
  system: "служебная",
};

const sitePages = [
  {
    id: "home",
    title: "Главная",
    url: "/",
    group: "main",
    mode: "light",
    priority: "A",
    icon: Globe2,
    role: "Быстро объяснить, что Ониксбит соединяет сайт, Битрикс24, 1С, коммуникации и контроль в одну систему.",
    audience: "собственник, директор, руководитель продаж, IT-ответственный",
    cta: "Обсудить систему",
    blocks: [
      "Первый экран: единый контур бизнеса, телефон, CTA и вход в процессное демо",
      "Три направления: Битрикс24, 1С-Битрикс, работы по 1С",
      "Короткая визуальная схема: заявка проходит через сайт, CRM, менеджера, 1С и контроль",
      "Блок проблем: потери заявок, ручные дубли, непрозрачные ответственные",
      "Доказательства: кейсы, сертификаты, статьи, партнёрские статусы",
      "Короткая форма диагностики и прямые контакты",
    ],
    links: ["/vnedrenie-bitrix24", "/processy/marshrut-zayavki", "/cases", "/contacts"],
  },
  {
    id: "bitrix24",
    title: "Внедрение Битрикс24",
    url: "/vnedrenie-bitrix24",
    group: "services",
    mode: "light",
    priority: "A",
    icon: Workflow,
    role: "Продать настройку CRM как управляемый процесс, а не набор полей и роботов.",
    audience: "руководитель продаж, собственник, операционный директор",
    cta: "Разобрать CRM",
    blocks: [
      "Hero: кому подходит внедрение и что станет прозрачным",
      "CRM command center: лиды, сделки, задачи, роботы, SLA",
      "Сценарии: заявка с сайта, обращение из мессенджера, задача менеджеру",
      "Что настраиваем: воронки, права, роботы, задачи, интеграции, отчёты",
      "Риски поверхностного внедрения и как их диагностируем",
      "Кейсы, статьи по CRM, CTA в процессную страницу маршрута заявки",
    ],
    links: ["/processy/marshrut-zayavki", "/articles/poverhnostnoe-vnedrenie-bitrix24", "/cases", "/contacts"],
  },
  {
    id: "site-bitrix",
    title: "Сайты на 1С-Битрикс",
    url: "/razrabotka-saitov-na-1c-bitrix",
    group: "services",
    mode: "light",
    priority: "A",
    icon: Globe2,
    role: "Показать сайт как часть продаж, а не отдельно стоящую витрину.",
    audience: "директор, маркетолог, владелец сайта, e-commerce руководитель",
    cta: "Обсудить сайт",
    blocks: [
      "Hero: сайт, который передаёт смысл заявки в CRM и учёт",
      "Blueprint: структура страниц, формы, каталог, заказы, статусы",
      "Связка с CRM: источник, страница, товар, комментарий, UTM",
      "Связка с 1С: цены, остатки, статусы, документы, ошибки обмена",
      "UX и SEO: посадочные страницы, скорость, понятная навигация",
      "CTA в демо заказа через сайт, CRM и 1С",
    ],
    links: ["/processy/zakaz-sait-1c-crm", "/cases", "/articles", "/contacts"],
  },
  {
    id: "onec",
    title: "Работы по 1С",
    url: "/raboty-po-1c-predpriyatie",
    group: "services",
    mode: "light",
    priority: "A",
    icon: DatabaseZap,
    role: "Объяснить ценность 1С через обмены, документы, статусы и снижение ручного дубляжа.",
    audience: "бухгалтерия, IT, руководитель операций, собственник",
    cta: "Проверить обмены",
    blocks: [
      "Hero: 1С как источник учётных данных для сайта и CRM",
      "Integration hub: где живут цены, остатки, документы и статусы",
      "Границы ответственности: что делает 1С, что делает сайт, что делает CRM",
      "Монитор обмена: ошибки, задержки, повторная отправка, уведомления",
      "Типовые работы: доработка, обмен, права, отчёты, сопровождение",
      "CTA в демо сбоя обмена и форму диагностики",
    ],
    links: ["/processy/sboy-obmena", "/processy/zakaz-sait-1c-crm", "/cases", "/contacts"],
  },
  {
    id: "tariffs",
    title: "Тарифы и лицензии",
    url: "/tarify-licenziy",
    group: "services",
    mode: "light",
    priority: "B",
    icon: ClipboardList,
    role: "Помочь выбрать лицензию, пакет работ или консультацию без давления и путаницы.",
    audience: "директор, закупки, IT, руководитель подразделения",
    cta: "Подобрать тариф",
    blocks: [
      "Hero: подбор лицензии под реальный процесс",
      "Сегменты: Битрикс24, 1С-Битрикс, Scloud/1С, сопровождение",
      "Сравнение: кому подходит, что входит, что уточнить перед покупкой",
      "Пояснение про внедрение: лицензия не заменяет настройку процесса",
      "FAQ по оплате, продлению, переходам и расширению",
      "Форма подбора и будущие реферальные ссылки после подтверждения URL",
    ],
    links: ["/vnedrenie-bitrix24", "/razrabotka-saitov-na-1c-bitrix", "/raboty-po-1c-predpriyatie", "/contacts"],
  },
  {
    id: "cases",
    title: "Кейсы",
    url: "/cases",
    group: "proof",
    mode: "light",
    priority: "A",
    icon: Briefcase,
    role: "Дать доказательства компетенции через понятные бизнес-задачи и результат.",
    audience: "директор, руководитель проекта, собственник",
    cta: "Показать похожую задачу",
    blocks: [
      "Hero: не галерея логотипов, а доказательства решённых процессов",
      "Фильтры: CRM, сайт, 1С, интеграции, поддержка",
      "Карточка кейса: проблема, система до, что сделали, система после, результат",
      "Связь с процессными демо: показать похожий маршрут",
      "Блок доверия: сертификаты, статьи, консультация",
      "Форма запроса похожего решения",
    ],
    links: ["/certificates", "/processy", "/articles", "/contacts"],
  },
  {
    id: "case-detail",
    title: "Страница кейса",
    url: "/cases/[slug]",
    group: "proof",
    mode: "light",
    priority: "B",
    icon: FileText,
    role: "Развернуть один проект: задача, ограничения, решение, контроль, результат.",
    audience: "клиент, который ищет подрядчика под похожий проект",
    cta: "Разобрать похожий процесс",
    blocks: [
      "Краткое резюме: отрасль, системы, задача, результат",
      "Состояние до: где терялись заявки, данные или ответственность",
      "Что сделали: этапы внедрения и технические решения без лишней воды",
      "Схема процесса после внедрения",
      "Что можно повторить в похожем бизнесе",
      "CTA: аудит процесса и ссылки на услуги",
    ],
    links: ["/cases", "/processy/marshrut-zayavki", "/contacts"],
  },
  {
    id: "certificates",
    title: "Сертификаты",
    url: "/certificates",
    group: "proof",
    mode: "light",
    priority: "B",
    icon: ShieldCheck,
    role: "Подтвердить партнёрство и компетенции, не превращая страницу в сухой реестр.",
    audience: "клиент, который проверяет надёжность подрядчика",
    cta: "Проверить компетенции",
    blocks: [
      "Hero: штаб компетенций и партнёрская экосистема",
      "Битрикс24: CRM, процессы, коммуникации",
      "1С-Битрикс: сайты, каталоги, интеграции",
      "Партнёры: Aspro, Concept, Wazzup, ChatApp, Scloud",
      "Как сертификаты связаны с реальными задачами клиента",
      "CTA: подобрать связку систем",
    ],
    links: ["/cases", "/tarify-licenziy", "/contacts"],
  },
  {
    id: "articles",
    title: "База знаний",
    url: "/articles",
    group: "proof",
    mode: "light",
    priority: "A",
    icon: BookOpen,
    role: "Собирать SEO и доверие через понятные материалы о CRM, сайте, 1С и управлении процессом.",
    audience: "руководители и специалисты, которые разбираются перед обращением",
    cta: "Получить диагностику",
    blocks: [
      "Hero: записки интегратора и практическая база знаний",
      "Серии: CRM, заявки с сайта, 1С, обмены, контроль руководителя",
      "Рекомендованные статьи для директоров и для специалистов",
      "Внутренние ссылки на услуги и процессные демо",
      "Медиаплан будущих материалов",
      "CTA: обсудить, как это применить в компании",
    ],
    links: ["/articles/poverhnostnoe-vnedrenie-bitrix24", "/vnedrenie-bitrix24", "/processy", "/contacts"],
  },
  {
    id: "article-detail",
    title: "Статья",
    url: "/articles/[slug]",
    group: "proof",
    mode: "light",
    priority: "B",
    icon: FileText,
    role: "Объяснить одну проблему глубже и привести читателя к диагностике или услуге.",
    audience: "руководитель, менеджер, IT-специалист",
    cta: "Проверить у себя",
    blocks: [
      "Ввод: проблема и кому важно прочитать",
      "Карта процесса или чек-лист диагностики",
      "Типовые ошибки и признаки риска",
      "Что должно быть настроено в нормальной системе",
      "FAQ и источники",
      "Связанные услуги, кейсы и форма",
    ],
    links: ["/articles", "/vnedrenie-bitrix24", "/contacts"],
  },
  {
    id: "about",
    title: "О компании",
    url: "/o-kompanii",
    group: "proof",
    mode: "light",
    priority: "B",
    icon: Building2,
    role: "Показать Ониксбит как спокойную, опытную и ответственную команду.",
    audience: "клиент, который выбирает подрядчика и снижает риск",
    cta: "Познакомиться с подходом",
    blocks: [
      "Hero: команда, которая отвечает за систему целиком",
      "Принципы: понятный процесс, диагностика, границы ответственности",
      "Компетенции: CRM, сайт, 1С, обмены, сопровождение",
      "Как проходит проект: от диагностики до поддержки",
      "Карта, контакты, юридическая и фактическая ясность",
      "CTA: первый разговор без сложной подготовки",
    ],
    links: ["/certificates", "/cases", "/contacts"],
  },
  {
    id: "process-hub",
    title: "Процессы",
    url: "/processy",
    group: "process",
    mode: "dark",
    priority: "A",
    icon: Map,
    role: "Стать входом в тёмные демонстрационные страницы с живыми бизнес-сценариями.",
    audience: "клиент, которому проще понять через демонстрацию",
    cta: "Выбрать сценарий",
    blocks: [
      "Dark hero: несколько сценариев вместо абстрактной анимации",
      "Каталог процессов: заявка, заказ, сбой обмена, поддержка, контроль",
      "Краткий смысл каждого сценария: действие, система, бизнес-результат",
      "Связь с услугами: какой процесс относится к какой странице",
      "Ограничение: демо без обязательного preloader и без реальных клиентских данных",
      "CTA: перейти к услуге или обсудить похожий процесс",
    ],
    links: ["/processy/marshrut-zayavki", "/processy/zakaz-sait-1c-crm", "/vnedrenie-bitrix24", "/contacts"],
  },
  {
    id: "process-request",
    title: "Маршрут заявки",
    url: "/processy/marshrut-zayavki",
    group: "process",
    mode: "dark",
    priority: "A",
    icon: Route,
    role: "Главная фирменная демо-сцена: заявка проходит сайт, CRM, менеджера, 1С и контроль.",
    audience: "собственник, руководитель продаж, директор",
    cta: "Разобрать мой маршрут заявки",
    blocks: [
      "Первый экран: заявка появляется сразу, без загрузочного барьера",
      "Sticky scene: Chat -> CRM -> Manager -> 1C -> Control",
      "Микродемо: отправка сообщения создаёт сделку и задачу",
      "Директорская расшифровка: что сделал клиент, что сделали системы, что видно руководителю",
      "Proof strip: SLA, источник, ответственный, статус обмена",
      "Возврат к услуге Битрикс24, кейсам и форме диагностики",
    ],
    links: ["/vnedrenie-bitrix24", "/cases", "/contacts"],
  },
  {
    id: "process-order",
    title: "Заказ сайт + CRM + 1С",
    url: "/processy/zakaz-sait-1c-crm",
    group: "process",
    mode: "dark",
    priority: "A",
    icon: GitBranch,
    role: "Показать, как заказ и данные проходят через сайт, CRM и 1С без ручного копирования.",
    audience: "e-commerce, B2B-продажи, директор, IT",
    cta: "Проверить маршрут заказа",
    blocks: [
      "Сцена выбора услуги, лицензии или товара на сайте",
      "Передача состава заказа, цены, источника и клиента в CRM",
      "Проверка в 1С: цена, остаток, документ, статус",
      "Возврат статуса в сделку и уведомление менеджера",
      "Риски ручного дубляжа и что видно руководителю",
      "Переходы к сайту на 1С-Битрикс, работам по 1С и форме",
    ],
    links: ["/razrabotka-saitov-na-1c-bitrix", "/raboty-po-1c-predpriyatie", "/contacts"],
  },
  {
    id: "process-exchange",
    title: "Сбой обмена",
    url: "/processy/sboy-obmena",
    group: "process",
    mode: "dark",
    priority: "B",
    icon: LifeBuoy,
    role: "Показать зрелость системы: проблема видна до того, как клиент пожалуется.",
    audience: "IT, руководитель операций, бухгалтерия, собственник",
    cta: "Проверить обмены",
    blocks: [
      "Сцена: обмен задержался или вернул ошибку",
      "Система подсвечивает, где сбой: сайт, 1С, CRM, канал",
      "Создаётся задача ответственному и понятный срок реакции",
      "Руководитель видит влияние на заказ, клиента и выручку",
      "Короткий план профилактики: логирование, уведомления, регламент",
      "Переходы к работам по 1С, поддержке и форме диагностики",
    ],
    links: ["/raboty-po-1c-predpriyatie", "/cases", "/contacts"],
  },
  {
    id: "process-support",
    title: "Поддержка из каналов",
    url: "/processy/podderzhka-iz-kanalov",
    group: "process",
    mode: "dark",
    priority: "B",
    icon: Mail,
    role: "Объяснить, как обращения из чатов и мессенджеров становятся задачами, а не личной перепиской.",
    audience: "отдел продаж, поддержка, руководитель сервиса",
    cta: "Собрать каналы",
    blocks: [
      "Сцена: сообщение приходит из WhatsApp, Telegram, формы или чата",
      "CRM связывает обращение с клиентом и историей",
      "Ответственный получает задачу и срок реакции",
      "Руководитель видит очередь, просрочки и повторные обращения",
      "Связь с Wazzup, ChatApp и Битрикс24",
      "Переходы к Битрикс24, сертификатам партнёров и форме",
    ],
    links: ["/vnedrenie-bitrix24", "/certificates", "/contacts"],
  },
  {
    id: "process-control",
    title: "Контроль руководителя",
    url: "/processy/kontrol-rukovoditelya",
    group: "process",
    mode: "dark",
    priority: "B",
    icon: BarChart3,
    role: "Показать итоговую ценность: руководитель видит не красивую CRM, а управляемость.",
    audience: "собственник, директор, руководитель отдела",
    cta: "Построить контроль",
    blocks: [
      "Сцена: директор открывает управленческую панель",
      "Показатели: источник заявки, ответственный, срок, статус заказа, ошибки",
      "Переход от метрики к конкретной сделке или задаче",
      "Что автоматизируется, что остаётся человеку, что контролирует руководитель",
      "План внедрения: от диагностики до отчётов",
      "Переходы к услугам, кейсам и форме",
    ],
    links: ["/vnedrenie-bitrix24", "/raboty-po-1c-predpriyatie", "/contacts"],
  },
  {
    id: "contacts",
    title: "Контакты",
    url: "/contacts",
    group: "support",
    mode: "light",
    priority: "A",
    icon: Phone,
    role: "Снять последнее трение перед обращением: телефон, мессенджеры, форма, карта, ожидания первого разговора.",
    audience: "любой готовый к контакту посетитель",
    cta: "Написать или позвонить",
    blocks: [
      "Hero: как быстро связаться и что подготовить необязательно",
      "Контакты: 8 800 100-53-03, прямой мобильный, мессенджеры, почта",
      "Форма диагностики с понятными полями",
      "Что произойдёт после заявки: первый звонок, уточнение, план",
      "Карта и юридическая информация",
      "Ссылки на услуги и процессные демо",
    ],
    links: ["/", "/processy/marshrut-zayavki", "/privacy"],
  },
  {
    id: "privacy",
    title: "Политика конфиденциальности",
    url: "/privacy",
    group: "support",
    mode: "system",
    priority: "C",
    icon: FileText,
    role: "Закрыть юридическую обязанность и доверие к форме.",
    audience: "посетитель, который оставляет контактные данные",
    cta: "Вернуться к контакту",
    blocks: [
      "Юридический текст",
      "Обработка персональных данных",
      "Связь с формами и cookie consent",
      "Контакты оператора",
    ],
    links: ["/contacts", "/"],
  },
] as const satisfies readonly SitePageConfig[];

const mapColumns = [
  {
    title: "Светлый сайт",
    note: "доверие, SEO, услуги, заявка",
    mode: "light",
    routes: ["/", "/vnedrenie-bitrix24", "/razrabotka-saitov-na-1c-bitrix", "/raboty-po-1c-predpriyatie", "/tarify-licenziy"],
  },
  {
    title: "Доказательства",
    note: "кейсы, сертификаты, знания",
    mode: "light",
    routes: ["/cases", "/cases/[slug]", "/certificates", "/articles", "/articles/[slug]", "/o-kompanii"],
  },
  {
    title: "Тёмные процессы",
    note: "живые сценарии без обязательной загрузки",
    mode: "dark",
    routes: ["/processy", "/processy/marshrut-zayavki", "/processy/zakaz-sait-1c-crm", "/processy/sboy-obmena", "/processy/podderzhka-iz-kanalov", "/processy/kontrol-rukovoditelya"],
  },
  {
    title: "Финиш",
    note: "контакт, юридическое, возврат",
    mode: "system",
    routes: ["/contacts", "/privacy"],
  },
] as const;

const headerNav = [
  "Услуги",
  "Процессы",
  "Кейсы",
  "База знаний",
  "О компании",
  "Контакты",
] as const;

const footerGroups = [
  { title: "Услуги", links: ["Битрикс24", "1С-Битрикс", "1С", "Лицензии"] },
  { title: "Процессы", links: ["Маршрут заявки", "Заказ сайт + CRM + 1С", "Сбой обмена", "Контроль"] },
  { title: "Доверие", links: ["Кейсы", "Сертификаты", "Статьи", "О компании"] },
  { title: "Контакт", links: ["8 800 100-53-03", "Форма диагностики", "Политика"] },
] as const;

const stylePillars = [
  {
    title: "Светлая основа",
    icon: Sparkles,
    text: "Больше воздуха, понятные заголовки, короткие доказательства, быстрый CTA. Это публичный сайт, который индексируется и продаёт.",
    tokens: ["фон #F6F7F4", "текст графит", "Onixbit red", "amber focus"],
  },
  {
    title: "Тёмные демо",
    icon: Workflow,
    text: "Глубокий графит, красно-янтарные акценты, тонкие линии маршрута, sticky-сцены и управляемое движение.",
    tokens: ["near black", "black cherry", "warm glow", "cyan только как data signal"],
  },
  {
    title: "Единая система",
    icon: Layers3,
    text: "Один язык блоков, CTA, иконок и микро-анимации. Человек не должен чувствовать, что попал на другой сайт.",
    tokens: ["lucide icons", "радиус 8px", "Manrope/Montserrat", "motion 150-300ms"],
  },
] as const;

const phases = [
  {
    title: "1. Утвердить карту",
    text: "Согласовать страницы, блоки, связи и первый процессный сценарий.",
    done: true,
  },
  {
    title: "2. Собрать светлый каркас",
    text: "Главная, услуги, кейсы, статьи, контакты с новой навигацией и CTA в процессы.",
    done: false,
  },
  {
    title: "3. Сделать первую тёмную страницу",
    text: "Начать с маршрута заявки, потому что он понятнее всего объясняет ценность связки.",
    done: false,
  },
  {
    title: "4. Заменить mock на реальные материалы",
    text: "Использовать обезличенные экраны, демо-данные и безопасные сценарии из Битрикс24, сайта и 1С.",
    done: false,
  },
  {
    title: "5. Довести до продакшена",
    text: "SEO, формы, аналитика, скорость, мобильная версия, тесты, публикация.",
    done: false,
  },
] as const;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ArchitecturePreview() {
  const [activePageId, setActivePageId] = useState<(typeof sitePages)[number]["id"]>("home");
  const [activeGroup, setActiveGroup] = useState<PageGroup>("main");

  const activePage = useMemo(
    () => sitePages.find((page) => page.id === activePageId) ?? sitePages[0],
    [activePageId],
  );

  const visiblePages = useMemo(
    () => sitePages.filter((page) => page.group === activeGroup),
    [activeGroup],
  );

  const ActiveIcon = activePage.icon;

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}>O</span>
          <span>
            <strong>Onixbit</strong>
            <small>site architecture</small>
          </span>
        </Link>
        <nav className={styles.topnav} aria-label="Разделы прототипа">
          <a href="#map">Карта</a>
          <a href="#pages">Страницы</a>
          <a href="#style">Стиль</a>
          <a href="#plan">План</a>
        </nav>
        <Link className={styles.topCta} href="/preview-onixbit-system-tour">
          <span>Демо процесса</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </header>

      <section className={styles.controlPanel} aria-labelledby="architecture-title">
        <div className={styles.summary}>
          <p className={styles.eyebrow}>полная карта будущего сайта</p>
          <h1 id="architecture-title">Светлый сайт продаёт доверие, тёмные страницы показывают процессы</h1>
          <p>
            Это рабочий прототип структуры: каждая страница имеет роль, блоки, CTA и связь с соседними
            разделами. Главная логика - не спорить между светлым и тёмным стилем, а развести их по задачам.
          </p>
          <div className={styles.summaryStats} aria-label="Сводка структуры">
            <span><strong>{sitePages.length}</strong> страниц и шаблонов</span>
            <span><strong>6</strong> процессных демо</span>
            <span><strong>1</strong> общий маршрут заявки</span>
          </div>
        </div>

        <div className={styles.routeBridge} aria-label="Основная логика перехода">
          <div>
            <Globe2 size={22} aria-hidden="true" />
            <strong>Светлая услуга</strong>
            <span>понять и доверять</span>
          </div>
          <ArrowRight size={18} aria-hidden="true" />
          <div className={styles.darkNode}>
            <Workflow size={22} aria-hidden="true" />
            <strong>Тёмное демо</strong>
            <span>увидеть процесс</span>
          </div>
          <ArrowRight size={18} aria-hidden="true" />
          <div>
            <Phone size={22} aria-hidden="true" />
            <strong>Заявка</strong>
            <span>обсудить свой контур</span>
          </div>
        </div>
      </section>

      <section className={styles.mapSection} id="map" aria-labelledby="map-title">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>sitemap</p>
          <h2 id="map-title">Иерархия сайта</h2>
        </div>
        <div className={styles.mapGrid}>
          {mapColumns.map((column) => (
            <article className={cx(styles.mapColumn, column.mode === "dark" && styles.mapColumnDark)} key={column.title}>
              <div className={styles.mapColumnHead}>
                <strong>{column.title}</strong>
                <span>{column.note}</span>
              </div>
              <div className={styles.routeList}>
                {column.routes.map((route) => (
                  <span key={route}>{route}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.pagesSection} id="pages" aria-labelledby="pages-title">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>page map</p>
          <h2 id="pages-title">Страницы, блоки и смысл</h2>
        </div>

        <div className={styles.groupTabs} role="tablist" aria-label="Группы страниц">
          {(Object.keys(groupMeta) as PageGroup[]).map((group) => {
            const meta = groupMeta[group];
            const Icon = meta.icon;
            return (
              <button
                className={cx(styles.groupTab, activeGroup === group && styles.groupTabActive)}
                type="button"
                role="tab"
                aria-selected={activeGroup === group}
                key={group}
                onClick={() => {
                  setActiveGroup(group);
                  setActivePageId(sitePages.find((page) => page.group === group)?.id ?? "home");
                }}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{meta.title}</span>
                <small>{meta.label}</small>
              </button>
            );
          })}
        </div>

        <div className={styles.pageWorkspace}>
          <aside className={styles.pageList} aria-label="Страницы выбранной группы">
            {visiblePages.map((page) => {
              const Icon = page.icon;
              return (
                <button
                  className={cx(styles.pageButton, activePage.id === page.id && styles.pageButtonActive)}
                  type="button"
                  key={page.id}
                  onClick={() => setActivePageId(page.id)}
                  aria-pressed={activePage.id === page.id}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>
                    <strong>{page.title}</strong>
                    <small>{page.url}</small>
                  </span>
                  <em>{page.priority}</em>
                </button>
              );
            })}
          </aside>

          <article className={cx(styles.pageDetail, activePage.mode === "dark" && styles.pageDetailDark)}>
            <div className={styles.pageDetailHead}>
              <div className={styles.pageIcon}>
                <ActiveIcon size={28} aria-hidden="true" />
              </div>
              <div>
                <span className={styles.modeBadge}>{modeLabel[activePage.mode]} страница</span>
                <h3>{activePage.title}</h3>
                <code>{activePage.url}</code>
              </div>
            </div>

            <div className={styles.detailGrid}>
              <div>
                <span>роль</span>
                <p>{activePage.role}</p>
              </div>
              <div>
                <span>аудитория</span>
                <p>{activePage.audience}</p>
              </div>
              <div>
                <span>основной CTA</span>
                <p>{activePage.cta}</p>
              </div>
            </div>

            <div className={styles.blocksPanel}>
              <h4>Блоки страницы</h4>
              <ol>
                {activePage.blocks.map((block) => (
                  <li key={block}>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    <span>{block}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className={styles.linkPanel}>
              <h4>Куда должна вести</h4>
              <div>
                {activePage.links.map((link) => (
                  <span key={link}>{link}</span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.navSection} aria-labelledby="nav-title">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>navigation</p>
          <h2 id="nav-title">Навигация без хаоса</h2>
        </div>
        <div className={styles.navGrid}>
          <article className={styles.navCard}>
            <h3>Header</h3>
            <div className={styles.navItems}>
              {headerNav.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <p>Справа постоянный CTA: «Обсудить задачу». На страницах услуг рядом появляется ссылка в подходящее процессное демо.</p>
          </article>
          <article className={styles.navCard}>
            <h3>Footer</h3>
            <div className={styles.footerColumns}>
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <strong>{group.title}</strong>
                  {group.links.map((link) => (
                    <span key={link}>{link}</span>
                  ))}
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className={styles.styleSection} id="style" aria-labelledby="style-title">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>visual system</p>
          <h2 id="style-title">Стиль: одна компания, два режима</h2>
        </div>
        <div className={styles.styleGrid}>
          {stylePillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article className={styles.styleCard} key={pillar.title}>
                <Icon size={24} aria-hidden="true" />
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
                <div>
                  {pillar.tokens.map((token) => (
                    <span key={token}>{token}</span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
        <div className={styles.swatches} aria-label="Палитра направления">
          <span style={{ "--swatch": "#f6f7f4" } as CSSProperties}>warm light</span>
          <span style={{ "--swatch": "#171413" } as CSSProperties}>graphite</span>
          <span style={{ "--swatch": "#c4272f" } as CSSProperties}>onix red</span>
          <span style={{ "--swatch": "#f0b23f" } as CSSProperties}>amber</span>
          <span style={{ "--swatch": "#2f8f83" } as CSSProperties}>teal signal</span>
        </div>
      </section>

      <section className={styles.planSection} id="plan" aria-labelledby="plan-title">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>implementation</p>
          <h2 id="plan-title">Порядок сборки</h2>
        </div>
        <div className={styles.phaseGrid}>
          {phases.map((phase) => (
            <article className={cx(styles.phaseCard, phase.done && styles.phaseCardDone)} key={phase.title}>
              <span>{phase.done ? "текущий шаг" : "следующий шаг"}</span>
              <h3>{phase.title}</h3>
              <p>{phase.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
