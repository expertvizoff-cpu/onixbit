"use client";

import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Building2,
  Check,
  ChevronDown,
  CircleDollarSign,
  Cloud,
  Database,
  FileSearch,
  Headphones,
  Layers3,
  Link2,
  Mail,
  MessageCircle,
  Network,
  PanelTop,
  Phone,
  Rocket,
  Route,
  Settings2,
  ShieldCheck,
  Users2,
  Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./Bitrix24Prototype.module.css";

const navItems = [
  { id: "overview", label: "Обзор" },
  { id: "tasks", label: "Задачи" },
  { id: "approach", label: "Подход" },
  { id: "integrations", label: "Интеграции" },
  { id: "formats", label: "Форматы и цены" },
  { id: "trust", label: "Доверие" },
  { id: "faq", label: "Вопросы" },
  { id: "contact", label: "Контакты" },
] as const;

const painPoints = [
  {
    id: "channels",
    label: "Обращение",
    title: "Заявка остаётся там, где её заметили первой",
    text: "Формы, почта, телефония и мессенджеры живут отдельно. История клиента распадается между каналами.",
    after: "Все обращения фиксируются в едином маршруте и сохраняют источник, контекст и переписку.",
  },
  {
    id: "owner",
    label: "Ответственный",
    title: "Никто не отвечает за следующий шаг",
    text: "Менеджеры выбирают заявки вручную, а руководитель узнаёт о потерях после жалобы клиента.",
    after: "Система назначает владельца по правилам и сразу создаёт обязательное действие.",
  },
  {
    id: "action",
    label: "Действие",
    title: "Сделка существует, но работа по ней остановилась",
    text: "В CRM есть карточка, но нет понятного следующего шага, срока и причины ожидания.",
    after: "На каждом этапе определены действие, срок, уведомление и условие перехода дальше.",
  },
  {
    id: "control",
    label: "Контроль",
    title: "Руководитель видит отчёт, но не видит причину",
    text: "Цифры собираются вручную, а просрочки и отклонения обнаруживаются слишком поздно.",
    after: "Контроль строится вокруг SLA, зависших сделок, нагрузки и качества обработки.",
  },
  {
    id: "result",
    label: "Результат",
    title: "CRM не связана с учётом и исполнением",
    text: "После продажи данные снова переносятся руками — в 1С, производство, сервис или таблицы.",
    after: "Оплата, заказ и статус передаются дальше по согласованной архитектуре интеграций.",
  },
] as const;

const scaleOptions = [
  {
    id: "point",
    label: "Точечная задача",
    title: "Одна понятная настройка без большого проекта",
    text: "Подключить почту, форму, пользователя, робота, отчёт или исправить конкретную проблему.",
    timing: "обычно 1–3 рабочих дня",
    route: "Коротко описываем результат, доступы и стоимость до начала работ.",
  },
  {
    id: "launch",
    label: "Быстрый запуск",
    title: "Один законченный рабочий процесс",
    text: "Воронка, поля, ответственные, несколько автоматизаций, один канал заявок и короткое обучение.",
    timing: "обычно от 1–2 недель",
    route: "Запускаем необходимый контур и оставляем возможность развивать его дальше.",
  },
  {
    id: "system",
    label: "Системное внедрение",
    title: "Несколько процессов, данные и интеграции",
    text: "Продажи, роли, отчёты, сайт, телефония, мессенджеры, перенос данных и связанные подразделения.",
    timing: "срок определяется после разбора",
    route: "Фиксируем этапы, границы и критерии приёмки до начала настройки.",
  },
  {
    id: "enterprise",
    label: "Enterprise",
    title: "Архитектура для бизнес-критичных процессов",
    text: "Несколько подразделений, 1С, коробочный контур, миграция, безопасность и управляемый запуск.",
    timing: "поэтапная программа внедрения",
    route: "Начинаем с архитектурной встречи или расширенного предпроектного обследования.",
  },
] as const;

const architectureLayers = [
  { index: "01", title: "Бизнес-процесс", text: "Фиксируем реальный путь заявки, исключения и точки принятия решений.", icon: Route },
  { index: "02", title: "Роли и ответственность", text: "Определяем владельцев, права, сроки и эскалации.", icon: Users2 },
  { index: "03", title: "CRM и автоматизация", text: "Настраиваем воронки, карточки, роботов и обязательные действия.", icon: Workflow },
  { index: "04", title: "Данные и интеграции", text: "Связываем сайт, коммуникации, 1С и внешние сервисы.", icon: Database },
  { index: "05", title: "Аналитика и развитие", text: "Оставляем контроль, документацию и понятный план следующих улучшений.", icon: BarChart3 },
] as const;

const integrationGroups = [
  {
    id: "channels",
    label: "Коммуникации",
    title: "Все обращения попадают в один рабочий контур",
    text: "Сайт, формы, почта, телефония и мессенджеры передают в CRM не только контакт, но и контекст обращения.",
    items: ["Сайт и формы", "Почта", "Телефония", "Мессенджеры"],
  },
  {
    id: "operations",
    label: "Учёт и операции",
    title: "Продажа продолжается после CRM",
    text: "Заказы, оплаты, статусы, остатки и документы передаются в системы, где компания исполняет обязательства.",
    items: ["1С и учёт", "Платежи", "Склад и заказы", "Документы"],
  },
  {
    id: "management",
    label: "Управление",
    title: "Руководитель получает единую картину",
    text: "BI, отчёты, API и внешние сервисы используют согласованные данные, а не отдельные ручные выгрузки.",
    items: ["BI и отчёты", "Внешние API", "Аналитика", "Сервисные системы"],
  },
] as const;

const plans = [
  {
    id: "point",
    eyebrow: "Одна понятная задача",
    title: "Точечная задача",
    price: "от 5 000 ₽",
    timing: "от 1 рабочего дня",
    result: "Согласованный результат без обязательного аудита и большого проекта.",
    bullets: ["почта, форма или канал", "робот, поле или отчёт", "права и пользователи", "исправление конкретной проблемы"],
    cta: "Поставить задачу",
    featured: false,
  },
  {
    id: "launch",
    eyebrow: "Законченный первый контур",
    title: "Быстрый запуск",
    price: "от 35 000 ₽",
    timing: "обычно 1–2 недели",
    result: "Одна рабочая воронка с ответственными, действиями и контролем.",
    bullets: ["простая воронка и карточка", "базовые роли и права", "несколько автоматизаций", "один канал и короткое обучение"],
    cta: "Получить оценку",
    featured: true,
  },
  {
    id: "system",
    eyebrow: "Несколько процессов и систем",
    title: "Системное внедрение",
    price: "от 90 000 ₽",
    timing: "по согласованным этапам",
    result: "Связанная система для продаж, данных, коммуникаций и контроля.",
    bullets: ["несколько воронок и ролей", "перенос и качество данных", "сайт, телефония, мессенджеры", "интеграции и приёмочные сценарии"],
    cta: "Обсудить внедрение",
    featured: false,
  },
] as const;

const faqItems = [
  ["Можно обратиться с одной небольшой задачей?", "Да. Если задача понятна и ограничена, мы заранее согласуем результат, стоимость и нужные доступы без обязательного большого обследования."],
  ["Лицензия Битрикс24 входит в стоимость работ?", "Нет. Лицензия, телефония, платные приложения и другие внешние сервисы рассчитываются отдельно. Поможем подобрать и продлить нужный тариф."],
  ["Можно доработать уже настроенный портал?", "Да. Сначала определим, можно ли оценить задачу сразу. Для запутанного портала, миграции или нескольких интеграций предложим аудит и карту изменений."],
  ["Что требуется от нашей команды?", "Владелец процесса, доступы, реальные примеры сделок и документов, а также своевременная обратная связь на проверочных сценариях."],
  ["Можно внедрять поэтапно?", "Да. Сначала запускаем обязательный рабочий контур, затем подключаем интеграции, аналитику и дополнительные процессы без повторного внедрения с нуля."],
  ["Как согласуются дополнительные работы?", "Всё, что выходит за зафиксированные границы, сначала оценивается и согласовывается. Дополнительные работы не появляются в счёте без подтверждения."],
  ["Что происходит после запуска?", "Период стабилизации, исправление обнаруженных проблем, обучение, поддержка и плановое развитие — в зависимости от выбранного формата."],
  ["Работаете с облачной и коробочной версиями?", "Да. Для коробочной версии отдельно учитываем сервер, обновления, резервное копирование, тестовую среду и требования безопасности."],
] as const;

function SectionMark({ number, kicker }: { number: string; kicker: string }) {
  return (
    <div className={styles.sectionMark}>
      <span>{number}</span>
      <em>{kicker}</em>
    </div>
  );
}

function HeroConsole() {
  return (
    <div className={styles.heroVisual} aria-label="Технологичная панель Битрикс24">
      <div className={styles.consoleGlow} />
      <div className={styles.consolePanel}>
        <div className={styles.consoleSidebar}>
          <strong>Битрикс24</strong>
          {['CRM', 'Задачи', 'Клиенты', 'Автоматизация', 'Аналитика'].map((item, index) => (
            <span className={index === 0 ? styles.isActive : undefined} key={item}>{item}</span>
          ))}
        </div>
        <div className={styles.consoleBody}>
          <div className={styles.consoleTop}>
            <div><em>Рабочий контур</em><strong>Продажи и процессы</strong></div>
            <span>Система активна</span>
          </div>
          <div className={styles.metricGrid}>
            <article><span>Новые заявки</span><strong>24</strong><em>в единой очереди</em></article>
            <article><span>Под контролем</span><strong>92%</strong><em>есть следующее действие</em></article>
            <article><span>Просрочки</span><strong>3</strong><em>видны руководителю</em></article>
          </div>
          <div className={styles.consoleChart}>
            <div>
              <span>Динамика обработки</span>
              <strong>Заявка → результат</strong>
            </div>
            <svg viewBox="0 0 480 130" aria-hidden="true">
              <defs>
                <linearGradient id="b24Chart" x1="0" x2="1">
                  <stop offset="0" stopColor="#62d7ff" />
                  <stop offset="1" stopColor="#ed1c24" />
                </linearGradient>
              </defs>
              <path d="M8 112 C74 110 96 78 142 84 S214 96 250 57 S328 72 364 38 S424 42 472 14" fill="none" stroke="url(#b24Chart)" strokeWidth="5" strokeLinecap="round" />
              <path d="M8 112 C74 110 96 78 142 84 S214 96 250 57 S328 72 364 38 S424 42 472 14 L472 130 L8 130 Z" fill="url(#b24Chart)" opacity=".08" />
            </svg>
          </div>
          <div className={styles.consoleRoute}>
            {['Заявка', 'Ответственный', 'Действие', 'Контроль', 'Результат'].map((item, index) => (
              <span key={item}><i>{index + 1}</i>{item}</span>
            ))}
          </div>
        </div>
      </div>
      <div className={`${styles.floatingBadge} ${styles.badgeOne}`}><Mail size={17} />Почта</div>
      <div className={`${styles.floatingBadge} ${styles.badgeTwo}`}><Database size={17} />1С</div>
      <div className={`${styles.floatingBadge} ${styles.badgeThree}`}><Link2 size={17} />Сайт</div>
    </div>
  );
}

export function Bitrix24Prototype() {
  const [activeSection, setActiveSection] = useState("overview");
  const [activePain, setActivePain] = useState(0);
  const [activeScale, setActiveScale] = useState(0);
  const [activeIntegration, setActiveIntegration] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [leadType, setLeadType] = useState("Точечная задача");
  const [fileName, setFileName] = useState("Файл не выбран");

  useEffect(() => {
    document.body.classList.add("ob-b24-prototype");
    return () => document.body.classList.remove("ob-b24-prototype");
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-32% 0px -58% 0px", threshold: [0.05, 0.2, 0.45] },
    );
    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  const pain = painPoints[activePain];
  const scale = scaleOptions[activeScale];
  const integration = integrationGroups[activeIntegration];

  return (
    <div className={styles.page}>
      <div className={styles.ambientGrid} aria-hidden="true" />

      <section className={styles.hero} id="overview">
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <SectionMark number="01" kicker="Внедрение Битрикс24" />
              <h1>Внедрение Битрикс24<br />для B2B-компаний</h1>
              <p className={styles.heroLead}>От точечной настройки до корпоративной архитектуры. Продажи, процессы и интеграции — в одной управляемой системе.</p>
              <div className={styles.heroActions}>
                <a className={styles.primaryButton} href="#contact">Решить задачу в Битрикс24 <ArrowRight size={18} /></a>
                <a className={styles.secondaryButton} href="#formats">Форматы и цены <ArrowRight size={17} /></a>
              </div>
              <div className={styles.heroProofs}>
                <span><ShieldCheck size={18} />Золотой партнёр Битрикс24</span>
                <span><Network size={18} />CRM, сайт и 1С в одной архитектуре</span>
                <span><Users2 size={18} />Внедрение, обучение и развитие</span>
              </div>
            </div>
            <HeroConsole />
          </div>
        </div>
      </section>

      <nav className={styles.pageNav} aria-label="Навигация по странице">
        <div className={styles.container}>
          <span className={styles.pageNavLabel}>На странице</span>
          <div className={styles.pageNavLinks}>
            {navItems.map((item) => (
              <a className={activeSection === item.id ? styles.activeNav : undefined} href={`#${item.id}`} key={item.id}>{item.label}</a>
            ))}
          </div>
          <a className={styles.navCta} href="#contact">Решить задачу <ArrowRight size={16} /></a>
        </div>
      </nav>

      <section className={styles.section} id="tasks">
        <div className={styles.container}>
          <div className={styles.splitHead}>
            <div>
              <SectionMark number="02" kicker="Диагностика разрыва" />
              <h2>Где компания теряет заявки и управляемость</h2>
            </div>
            <p>Выберите участок маршрута. Покажем, что ломается в работе и каким становится этот же шаг после внедрения.</p>
          </div>
          <div className={styles.painRoute}>
            <div className={styles.painRail}>
              {painPoints.map((item, index) => (
                <button className={activePain === index ? styles.activePain : undefined} onClick={() => setActivePain(index)} type="button" key={item.id}>
                  <span>{index + 1}</span><strong>{item.label}</strong>
                </button>
              ))}
            </div>
            <div className={styles.painDetail}>
              <div className={styles.painBefore}>
                <span>Что происходит</span>
                <h3>{pain.title}</h3>
                <p>{pain.text}</p>
              </div>
              <div className={styles.painArrow}><ArrowRight /></div>
              <div className={styles.painAfter}>
                <span>После внедрения</span>
                <h3>Появляется понятный маршрут</h3>
                <p>{pain.after}</p>
              </div>
            </div>
          </div>

          <div className={styles.scaleBlock}>
            <div className={styles.scaleIntro}>
              <SectionMark number="03" kicker="Масштаб задачи" />
              <h2>Начните с объёма, который действительно нужен сейчас</h2>
              <p>Небольшую задачу не превращаем в большой проект. Сложную систему не пытаемся честно упаковать в универсальный пакет.</p>
            </div>
            <div className={styles.scaleExperience}>
              <div className={styles.scaleTrack}>
                {scaleOptions.map((item, index) => (
                  <button className={activeScale === index ? styles.activeScale : undefined} onClick={() => setActiveScale(index)} type="button" key={item.id}>
                    <i />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
              <div className={styles.scaleResult}>
                <div>
                  <span>Подходящий формат</span>
                  <h3>{scale.title}</h3>
                  <p>{scale.text}</p>
                </div>
                <div className={styles.scaleMeta}>
                  <strong>{scale.timing}</strong>
                  <p>{scale.route}</p>
                  <a href="#formats">Перейти к форматам <ArrowRight size={17} /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.statement} aria-label="Принцип работы">
        <div className={styles.container}>
          <p>Не предлагаем большой проект,<br />если задачу можно решить за несколько часов.</p>
          <span>Масштаб меняется. Стандарт ответственности остаётся.</span>
        </div>
      </section>

      <section className={styles.section} id="approach">
        <div className={styles.container}>
          <div className={styles.architectureGrid}>
            <div className={styles.architectureCopy}>
              <SectionMark number="04" kicker="Архитектура решения" />
              <h2>Сначала процесс — затем настройки</h2>
              <p>Фиксируем путь заявки, роли и данные. Только после этого настраиваем CRM, автоматизацию и интеграции.</p>
              <a className={styles.textLink} href="#formats">Обсудить подход <ArrowRight size={17} /></a>
            </div>
            <div className={styles.architectureLayers}>
              {architectureLayers.map((layer, index) => {
                const Icon = layer.icon;
                return (
                  <article style={{ "--layer-index": index } as React.CSSProperties} key={layer.index}>
                    <span>{layer.index}</span>
                    <Icon size={24} />
                    <div><h3>{layer.title}</h3><p>{layer.text}</p></div>
                  </article>
                );
              })}
            </div>
          </div>
          <div className={styles.deliveryRoute}>
            {['Заявка', 'Ответственный', 'Следующее действие', 'Контроль срока', 'Результат'].map((item, index) => (
              <span key={item}><i>{String(index + 1).padStart(2, '0')}</i>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.integrationSection}`} id="integrations">
        <div className={styles.container}>
          <div className={styles.integrationGrid}>
            <div className={styles.integrationCopy}>
              <SectionMark number="05" kicker="Рабочая экосистема" />
              <h2>Связываем Битрикс24 с сайтом, 1С и рабочими каналами</h2>
              <p>Выберите группу систем. Схема показывает не список логотипов, а роль каждого контура в общем маршруте данных.</p>
              <div className={styles.integrationTabs}>
                {integrationGroups.map((group, index) => (
                  <button className={activeIntegration === index ? styles.activeIntegration : undefined} onClick={() => setActiveIntegration(index)} type="button" key={group.id}>{group.label}</button>
                ))}
              </div>
              <div className={styles.integrationText}>
                <h3>{integration.title}</h3>
                <p>{integration.text}</p>
              </div>
            </div>
            <div className={styles.integrationScene}>
              <div className={styles.integrationHub}>
                <span>Битрикс24</span>
                <strong>единый контур</strong>
              </div>
              {integration.items.map((item, index) => (
                <div className={`${styles.integrationNode} ${styles[`node${index + 1}`]}`} key={item}>
                  {[PanelTop, Phone, Cloud, Database][index] ? (() => { const Icon = [PanelTop, Phone, Cloud, Database][index]; return <Icon size={22} />; })() : null}
                  <span>{item}</span>
                </div>
              ))}
              <svg viewBox="0 0 720 560" aria-hidden="true">
                <path d="M358 282 C265 190 182 178 104 142" />
                <path d="M358 282 C260 274 188 286 92 322" />
                <path d="M358 282 C458 190 538 182 622 142" />
                <path d="M358 282 C454 286 536 306 626 374" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.statement} aria-label="Принцип масштаба">
        <div className={styles.container}>
          <p>Один партнёр — от отдельной настройки<br />до корпоративной архитектуры.</p>
          <span>Начинаем с необходимого и развиваем систему без повторного внедрения с нуля.</span>
        </div>
      </section>

      <section className={`${styles.section} ${styles.pricingSection}`} id="formats">
        <div className={styles.container}>
          <div className={styles.pricingHead}>
            <SectionMark number="06" kicker="Форматы и стоимость" />
            <h2>От одной задачи до корпоративной системы</h2>
            <p>Состав, границы и порядок дополнительных работ фиксируем до начала. Лицензии Битрикс24 и внешние сервисы рассчитываются отдельно.</p>
          </div>

          <div className={styles.freeReview}>
            <div><MessageCircle size={25} /><span><strong>Бесплатный первичный разбор</strong>За 30–45 минут определим подходящий первый шаг без навязывания большого проекта.</span></div>
            <a href="#contact">Записаться на разбор <ArrowRight size={17} /></a>
          </div>

          <div className={styles.planGrid}>
            {plans.map((plan) => (
              <article className={`${styles.planCard} ${plan.featured ? styles.featuredPlan : ""}`} key={plan.id}>
                {plan.featured && <span className={styles.planBadge}>Законченный первый контур</span>}
                <em>{plan.eyebrow}</em>
                <h3>{plan.title}</h3>
                <div className={styles.planPrice}><strong>{plan.price}</strong><span>{plan.timing}</span></div>
                <p className={styles.planResult}>{plan.result}</p>
                <ul>{plan.bullets.map((bullet) => <li key={bullet}><Check size={16} />{bullet}</li>)}</ul>
                <a href="#contact">{plan.cta} <ArrowRight size={17} /></a>
                <button type="button">Полный состав и ограничения <ChevronDown size={16} /></button>
              </article>
            ))}
          </div>

          <div className={styles.enterpriseScene}>
            <div className={styles.enterpriseCopy}>
              <span className={styles.enterpriseLabel}>ONIXBIT Enterprise</span>
              <h3>Для процессов, где цена ошибки выше стоимости внедрения</h3>
              <p>Корпоративная архитектура Битрикс24 для нескольких подразделений, сложных интеграций и бизнес-критичных процессов.</p>
              <div className={styles.enterprisePrice}>Индивидуальная архитектура и смета</div>
              <a href="#contact">Назначить архитектурную встречу <ArrowRight size={18} /></a>
            </div>
            <div className={styles.enterprisePrinciples}>
              <article><Layers3 size={24} /><strong>Архитектура</strong><span>процессы, данные и очереди запуска</span></article>
              <article><ShieldCheck size={24} /><strong>Безопасность</strong><span>доступы, тестовая среда и регламент</span></article>
              <article><Building2 size={24} /><strong>Ответственность</strong><span>архитектор, руководитель проекта и владельцы</span></article>
              <article><Rocket size={24} /><strong>Управляемый запуск</strong><span>приёмка, обучение и расширенная стабилизация</span></article>
            </div>
          </div>

          <div className={styles.continuationGrid}>
            <a href="#contact"><FileSearch size={23} /><span><strong>Аудит и карта внедрения</strong>Для сложного или уже запутанного портала.</span><ArrowUpRight size={18} /></a>
            <a href="#contact"><Headphones size={23} /><span><strong>Поддержка и развитие</strong>Разовые задачи, пакет часов или сопровождение.</span><ArrowUpRight size={18} /></a>
            <a href="/tarify-licenziy"><CircleDollarSign size={23} /><span><strong>Лицензии и продление</strong>Подбор, оформление и напоминание о продлении.</span><ArrowUpRight size={18} /></a>
          </div>
        </div>
      </section>

      <section className={styles.section} id="trust">
        <div className={styles.container}>
          <div className={styles.trustHead}>
            <div>
              <SectionMark number="07" kicker="Компетенции и ответственность" />
              <h2>Берём в одну ответственность CRM, сайт, 1С и интеграции</h2>
            </div>
            <p>Не просим верить общим обещаниям. Показываем официальный статус, реальные зоны компетенций и понятные границы проекта.</p>
          </div>
          <div className={styles.trustGrid}>
            <article className={styles.certificateCard}>
              <div className={styles.certificateImage}>
                <Image src="/media/certificates/Битрикс24 сертификаты/bitrix24-gold-partner-2026-11-01.png" alt="Золотой партнёр Битрикс24" fill sizes="360px" priority />
              </div>
              <div><span>Официальный статус</span><h3>Золотой партнёр Битрикс24</h3><p>Статус и компетенции можно проверить до начала работ.</p><a href="/certificates">Открыть сертификаты <ArrowUpRight size={17} /></a></div>
            </article>
            <article className={styles.competencyCard}>
              <Settings2 size={27} /><span>CRM и автоматизация</span><h3>Воронки, роли, роботы, коммуникации и контроль</h3><p>Настройки привязываются к фактической работе команды и критериям приёмки.</p>
            </article>
            <article className={styles.competencyCard}>
              <Boxes size={27} /><span>Сайты, 1С и API</span><h3>Данные продолжают путь за пределами CRM</h3><p>Проектируем обмены, источники истины, контроль ошибок и ответственность систем.</p>
            </article>
          </div>

          <div className={styles.examplesHead}>
            <SectionMark number="08" kicker="Примеры задач и решений" />
            <h2>Показываем разные масштабы без вымышленных результатов</h2>
          </div>
          <div className={styles.examplesGrid}>
            <article className={styles.exampleCard}>
              <div className={styles.exampleVisual}><Image src="/media/home/case-crm-cover.png" alt="Пример небольшого CRM-сценария" fill sizes="720px" priority /></div>
              <div><span>Небольшая задача</span><h3>Почта, форма и автоматическое назначение ответственного</h3><p><strong>Исходно:</strong> обращения приходят в разные места. <strong>Решение:</strong> подключить каналы, правило назначения и обязательное действие.</p><a href="#contact">Оценить похожую задачу <ArrowRight size={17} /></a></div>
            </article>
            <article className={styles.exampleCard}>
              <div className={styles.exampleVisual}><Image src="/media/home/case-integration-cover.png" alt="Пример системной интеграции" fill sizes="720px" priority /></div>
              <div><span>Системный контур</span><h3>CRM, сайт, 1С и коммуникации в одной архитектуре</h3><p><strong>Исходно:</strong> заявки и статусы расходятся. <strong>Решение:</strong> определить владельцев данных, настроить обмены и контрольные сценарии.</p><a href="#contact">Обсудить архитектуру <ArrowRight size={17} /></a></div>
            </article>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.faqSection}`} id="faq">
        <div className={styles.container}>
          <div className={styles.faqGrid}>
            <div className={styles.faqIntro}>
              <SectionMark number="09" kicker="Перед обращением" />
              <h2>Коротко о важном</h2>
              <p>Ответы на вопросы о небольших задачах, лицензиях, поэтапном запуске и работе после внедрения.</p>
            </div>
            <div className={styles.faqList}>
              {faqItems.map(([question, answer], index) => (
                <article className={openFaq === index ? styles.openFaq : undefined} key={question}>
                  <button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                    <span>{question}</span><ChevronDown size={21} />
                  </button>
                  <div><p>{answer}</p></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contactSection} id="contact">
        <div className={styles.container}>
          <div className={styles.contactFrame}>
            <SectionMark number="10" kicker="Бесплатный первичный разбор" />
            <h2>Разберём задачу и предложим следующий шаг</h2>
            <p>Уточним ситуацию, подберём подходящий формат работы и обозначим порядок оценки.</p>
            <form className={styles.contactForm} onSubmit={(event) => event.preventDefault()}>
              <fieldset>
                <legend>Что вам нужно?</legend>
                <div className={styles.leadTypes}>
                  {['Точечная задача', 'Запуск CRM', 'Системное внедрение', 'Enterprise', 'Лицензия или поддержка'].map((item) => (
                    <button className={leadType === item ? styles.activeLeadType : undefined} type="button" onClick={() => setLeadType(item)} key={item}>{item}</button>
                  ))}
                </div>
              </fieldset>
              <label><span>Ваше имя</span><input name="name" autoComplete="name" placeholder="Как к вам обращаться" /></label>
              <label><span>Телефон или удобный мессенджер</span><input name="contact" autoComplete="tel" placeholder="+7 900 000-00-00 или @username" /></label>
              <label><span>Компания <em>необязательно</em></span><input name="company" autoComplete="organization" placeholder="Название компании" /></label>
              <label><span>Коротко о задаче <em>необязательно</em></span><textarea name="task" rows={5} placeholder="Что нужно настроить, запустить или связать" /></label>
              <label className={styles.fileField}>
                <span>Скриншот или файл <em>необязательно</em></span>
                <input
                  name="file"
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.pdf"
                  onChange={(event) => setFileName(event.target.files?.[0]?.name || "Файл не выбран")}
                />
                <div className={styles.fileControl}>
                  <strong>Выбрать файл</strong>
                  <span>{fileName}</span>
                  <em>PNG, JPG, WebP или PDF — до 10 МБ</em>
                </div>
              </label>
              <button className={styles.submitButton} type="submit">Получить оценку задачи <ArrowRight size={18} /></button>
              <small>Первичный разбор бесплатный. Точную стоимость согласуем после уточнения задачи. Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных.</small>
              <a className={styles.diagnosticLink} href="#tasks">Не готовы описывать задачу? Пройти диагностику за одну минуту <ArrowRight size={16} /></a>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
