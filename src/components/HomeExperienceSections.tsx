"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  DatabaseZap,
  FileCheck2,
  GitBranch,
  Headphones,
  Layers3,
  MessageSquareWarning,
  Network,
  PlugZap,
  ReceiptText,
  ShieldCheck,
  SlidersHorizontal,
  Workflow,
  XCircle,
} from "lucide-react";
import { company } from "@/data/site";
import { ButtonLink, LeadButton } from "./Buttons";
import { SectionIntro } from "./Sections";

const painItems = [
  {
    icon: MessageSquareWarning,
    title: "Заявки живут в разных каналах",
    text: "Чаты, телефония, формы сайта и почта не сходятся в единую картину для руководителя.",
    signal: "Нет единой очереди заявок",
    loss: "Ответственный назначается поздно, история общения расползается, руководитель видит проблему только после ручной сверки.",
    fix: "Нужен единый вход обращения и понятный маршрут до сделки, задачи и отчёта.",
    diagnostic: ["канал", "очередь", "ответственный", "ручной контроль"],
  },
  {
    icon: GitBranch,
    title: "CRM настроена поверх процесса",
    text: "Этапы, права и роботы есть, но менеджеры обходят систему, а контроль остаётся ручным.",
    signal: "Автоматизация не совпадает с работой отдела",
    loss: "CRM выглядит настроенной, но команда продолжает держать важные действия в личных заметках, чатах и таблицах.",
    fix: "Нужно пересобрать этапы, роли, права и роботов вокруг фактического процесса продаж.",
    diagnostic: ["процесс", "CRM-этап", "робот", "обход системы"],
  },
  {
    icon: DatabaseZap,
    title: "1С, сайт и CRM спорят данными",
    text: "Заказы, остатки, статусы и ответственные расходятся, появляются дубли и уточнения вручную.",
    signal: "Данные расходятся между системами",
    loss: "Сотрудники уточняют остатки, цены, статусы и документы вручную, а ошибка в одном месте быстро размножается дальше.",
    fix: "Нужна карта обменов: какие данные главные, куда они уходят и кто отвечает за ошибку.",
    diagnostic: ["сайт", "CRM", "1С", "расхождение"],
  },
  {
    icon: AlertTriangle,
    title: "Подрядчики закрывают только свой кусок",
    text: "Сайт, CRM, учёт и аналитика развиваются отдельно, поэтому итоговая система не управляется целиком.",
    signal: "Никто не отвечает за связку целиком",
    loss: "Каждый подрядчик прав внутри своей зоны, но на стыках появляются разрывы, спорные задачи и бесконечные согласования.",
    fix: "Нужен один владелец архитектуры, который видит весь путь заявки и границы ответственности.",
    diagnostic: ["сайт", "CRM", "учёт", "нет владельца"],
  },
];

const solutionNodes = [
  {
    icon: Workflow,
    title: "Битрикс24",
    text: "воронки, роботы, задачи, коммуникации",
    problem: "Разрозненные обращения из чатов, телефонии, форм и почты.",
    before: "Заявка живёт в канале, где её заметили первым.",
    after: "Заявка сразу попадает в воронку, получает ответственного и срок.",
    result: "Заявка попадает в нужную воронку, получает ответственного, задачу, контроль срока и понятную историю общения.",
    action: "Снимаем хаос из чатов и таблиц, чтобы менеджеры работали в одном маршруте.",
    linkLabel: "Открыть CRM-направление",
    href: "/vnedrenie-bitrix24",
    motion: "crm",
    className: "ob-system-node--crm",
  },
  {
    icon: Layers3,
    title: "1С-Битрикс",
    text: "структура сайта, каталог, формы, заявки",
    problem: "Формы и каталог собирают интерес, но не ведут клиента дальше по процессу.",
    before: "Сайт передаёт заявку как отдельное сообщение без контекста.",
    after: "Форма, каталог и CRM работают как один маршрут клиента.",
    result: "Сайт становится источником качественных заявок: формы, каталог и контент сразу связаны с CRM и аналитикой.",
    action: "Проектируем не витрину страниц, а понятный путь клиента от интереса до заявки.",
    linkLabel: "Открыть сайты на Битрикс",
    href: "/razrabotka-saitov-na-1c-bitrix",
    motion: "site",
    className: "ob-system-node--site",
  },
  {
    icon: DatabaseZap,
    title: "1С и обмены",
    text: "заказы, остатки, цены, документы",
    problem: "Заказы, остатки, цены и статусы расходятся между сайтом, CRM и 1С.",
    before: "Сотрудники сверяют данные вручную и исправляют последствия дублей.",
    after: "Обмены идут по понятным правилам, а спорные статусы разобраны заранее.",
    result: "Данные о заказах, остатках, ценах и статусах проходят между сайтом, CRM и учётом без ручного дублирования.",
    action: "Фиксируем границы обмена и заранее разбираем спорные статусы, чтобы интеграция была управляемой.",
    linkLabel: "Открыть работы по 1С",
    href: "/raboty-po-1c-predpriyatie",
    motion: "onec",
    className: "ob-system-node--onec",
  },
  {
    icon: BarChart3,
    title: "Отчёты",
    text: "контроль этапов, нагрузка, потери",
    problem: "Руководитель узнаёт о потерях из ручных отчётов, когда повлиять уже сложнее.",
    before: "Контроль собирается в конце недели из таблиц и сообщений.",
    after: "Этапы, нагрузка и потери видны по ходу работы.",
    result: "Руководитель видит, где застревают сделки, кто перегружен и какие этапы требуют внимания.",
    action: "Собираем контроль вокруг процесса, а не вокруг ручной выгрузки в конце недели.",
    motion: "analytics",
    className: "ob-system-node--analytics",
  },
  {
    icon: PlugZap,
    title: "Интеграции",
    text: "телефония, мессенджеры, обмены, отчёты",
    problem: "Сервисы подключены отдельно, поэтому на стыках появляются ручные действия и спорные зоны.",
    before: "Каждая интеграция решает свою маленькую задачу и добавляет новый стык.",
    after: "Интеграции поддерживают один сценарий заявки, учёта и контроля.",
    result: "Телефония, мессенджеры, формы, склад и внешние сервисы не спорят между собой, а поддерживают один сценарий.",
    action: "Подключаем только те сервисы, которые реально закрывают путь заявки и контроль качества.",
    motion: "api",
    className: "ob-system-node--api",
  },
];

function SolutionActionIcon({ type }: { type: string }) {
  if (type === "crm") {
    return (
      <span className="ob-system-action-icon is-crm" aria-hidden="true">
        <svg className="ob-solution-mark" viewBox="0 0 48 48" focusable="false">
          <path className="ob-solution-mark__stroke ob-solution-mark__funnel" d="M12 10h24l-9 11v11l-6 4V21z" />
          <rect className="ob-solution-mark__card is-one" x="8" y="28" width="14" height="8" rx="3" />
          <rect className="ob-solution-mark__card is-two" x="26" y="24" width="14" height="8" rx="3" />
          <circle className="ob-solution-mark__spark" cx="35" cy="36" r="3.5" />
        </svg>
      </span>
    );
  }

  if (type === "site") {
    return (
      <span className="ob-system-action-icon is-site" aria-hidden="true">
        <svg className="ob-solution-mark" viewBox="0 0 48 48" focusable="false">
          <path className="ob-solution-mark__stroke ob-solution-mark__cart" d="M9 12h5l4 20h19l4-14H17" />
          <path className="ob-solution-mark__stroke ob-solution-mark__cart-basket" d="M20 23h17M22 28h12" />
          <circle className="ob-solution-mark__wheel is-one" cx="21" cy="38" r="3.2" />
          <circle className="ob-solution-mark__wheel is-two" cx="35" cy="38" r="3.2" />
          <path className="ob-solution-mark__stroke ob-solution-mark__cart-spark" d="M31 10l2 4 4 1-4 1.5-2 4-2-4-4-1.5 4-1z" />
        </svg>
      </span>
    );
  }

  if (type === "onec") {
    return (
      <span className="ob-system-action-icon is-onec" aria-hidden="true">
        <svg className="ob-solution-mark" viewBox="0 0 48 48" focusable="false">
          <rect className="ob-solution-mark__box is-left" x="7" y="13" width="14" height="18" rx="4" />
          <rect className="ob-solution-mark__box is-right" x="27" y="13" width="14" height="18" rx="4" />
          <path className="ob-solution-mark__stroke ob-solution-mark__exchange is-top" d="M20 17h9l-3-3" />
          <path className="ob-solution-mark__stroke ob-solution-mark__exchange is-bottom" d="M28 28h-9l3 3" />
          <text className="ob-solution-mark__text" x="24" y="42">1С</text>
        </svg>
      </span>
    );
  }

  if (type === "analytics") {
    return (
      <span className="ob-system-action-icon is-analytics" aria-hidden="true">
        <svg className="ob-solution-mark" viewBox="0 0 48 48" focusable="false">
          <path className="ob-solution-mark__stroke ob-solution-mark__axis" d="M10 38h30M10 38V12" />
          <rect className="ob-solution-mark__bar is-one" x="14" y="27" width="5" height="11" rx="2" />
          <rect className="ob-solution-mark__bar is-two" x="22" y="19" width="5" height="19" rx="2" />
          <rect className="ob-solution-mark__bar is-three" x="30" y="24" width="5" height="14" rx="2" />
          <path className="ob-solution-mark__stroke ob-solution-mark__trend" d="M13 23l8-7 8 5 8-11" />
        </svg>
      </span>
    );
  }

  if (type === "api") {
    return (
      <span className="ob-system-action-icon is-api" aria-hidden="true">
        <svg className="ob-solution-mark" viewBox="0 0 48 48" focusable="false">
          <rect className="ob-solution-mark__port is-left" x="7" y="15" width="13" height="18" rx="4" />
          <rect className="ob-solution-mark__port is-right" x="28" y="15" width="13" height="18" rx="4" />
          <path className="ob-solution-mark__stroke ob-solution-mark__cable" d="M20 24h8" />
          <circle className="ob-solution-mark__spark" cx="24" cy="24" r="3.5" />
          <path className="ob-solution-mark__stroke ob-solution-mark__plug is-left" d="M12 12v5M16 12v5" />
          <path className="ob-solution-mark__stroke ob-solution-mark__plug is-right" d="M32 31v5M36 31v5" />
        </svg>
      </span>
    );
  }

  return (
    <span className={"ob-system-action-icon is-" + type}>
      <svg className="ob-solution-mark" viewBox="0 0 48 48" focusable="false">
        <circle className="ob-solution-mark__spark" cx="24" cy="24" r="6" />
      </svg>
    </span>
  );
}

const benefits = [
  {
    icon: ShieldCheck,
    title: "Понятные границы проекта",
    text: "До старта фиксируем задачи, роли, данные, ограничения и ожидаемый результат, чтобы не расползался объём работ.",
  },
  {
    icon: Network,
    title: "Единая архитектура",
    text: "Смотрим на CRM, сайт, 1С, телефонию и мессенджеры как на связанную систему, а не как на отдельные настройки.",
  },
  {
    icon: BadgeCheck,
    title: "Подтверждённые компетенции",
    text: "Партнёрские статусы и сертификаты вынесены в отдельный раздел, чтобы их можно было проверить до проекта.",
  },
  {
    icon: SlidersHorizontal,
    title: "Настройки по процессу",
    text: "Оставляем в системе только то, что помогает команде работать: этапы, права, автоматизацию, отчёты и контроль.",
  },
  {
    icon: Headphones,
    title: "Запуск с обучением",
    text: "После внедрения передаём регламент, объясняем логику пользователям и остаёмся на поддержке развития.",
  },
];

const benefitSignals = [
  "карта процесса и ответственности до настройки",
  "единая логика CRM, сайта, 1С и коммуникаций",
  "регламент, обучение и поддержка после запуска",
];

const pricingFactors = [
  "тарифы и количество пользователей",
  "объём внедрения, прав и автоматизации",
  "интеграции с 1С, сайтом и коммуникациями",
  "обучение команды и регламенты",
  "поддержка после запуска и развитие системы",
];

const pricingRoute = [
  {
    label: "Лицензии",
    text: "тарифы Битрикс24, 1С-Битрикс и сервисов под реальный сценарий",
  },
  {
    label: "Внедрение",
    text: "воронки, права, роботы, отчёты и проверка процесса",
  },
  {
    label: "Интеграции",
    text: "1С, сайт, телефония, мессенджеры, обмены и статусы",
  },
  {
    label: "Обучение",
    text: "регламент, запуск пользователей и понятный план поддержки",
  },
];

const trustSignals = [
  "официальные статусы партнёра Битрикс24 и 1С-Битрикс",
  "компетенции по CRM, бизнес-процессам, коробке и интеграции с 1С",
  "сертификаты и документы можно открыть до старта работ",
];

const trustCertificates = [
  {
    label: "Битрикс24",
    title: "Золотой партнёр",
    image: "/media/certificates/Золотой%20партнёр%20Битрикс24.jpg",
    orientation: "landscape",
    className: "is-main",
  },
  {
    label: "1С-Битрикс",
    title: "Золотой партнёр",
    image: "/media/certificates/Золотой%20партнёр%201С-Битрикс.jpg",
    orientation: "landscape",
    className: "is-second",
  },
  {
    label: "Интеграция с 1С",
    title: "Компетенция",
    image: "/media/certificates/Компетенция%20Интеграция%20с%201С.jpg",
    orientation: "portrait",
    className: "is-third",
  },
] as const;

const faqItems = [
  {
    question: "С чего лучше начать: сайт, CRM или интеграции?",
    answer:
      "Начинаем с бизнес-процесса и точки потерь. После короткой диагностики становится понятно, что даст эффект быстрее: настройка CRM, доработка сайта, обмен с 1С или связка нескольких частей.",
  },
  {
    question: "Можно ли просто купить лицензию Битрикс24 без внедрения?",
    answer:
      "Да. Но мы всё равно уточняем сценарий: пользователей, коммуникации, автоматизацию, отчёты и ограничения. Так меньше риск купить тариф, который не подходит под реальную работу.",
  },
  {
    question: "Вы берёте задачи по 1С полностью?",
    answer:
      "Основной фокус Ониксбит - интеграции 1С с Битрикс24 и сайтами на 1С-Битрикс. Глубокие 1С-задачи усиливаем партнёрской экспертизой и честно обозначаем границы ответственности.",
  },
  {
    question: "Почему на главной нет вымышленных кейсов и отзывов?",
    answer:
      "Для корпоративных решений важнее проверяемость. Публикуем только материалы, которые можно согласовать с клиентом: задача, ограничения, решение и польза для бизнеса без декоративных логотипов.",
  },
  {
    question: "Как быстро можно получить первый план работ?",
    answer:
      "После первичного разбора обычно можно определить ближайший практичный шаг: аудит, настройка, прототип, расчёт лицензии или отдельное ТЗ на интеграцию.",
  },
];

export function PainSection() {
  const [activePain, setActivePain] = useState(0);
  const selectedPain = painItems[activePain] ?? painItems[0];
  const SelectedPainIcon = selectedPain.icon;

  return (
    <section className="ob-section ob-home-pain" id="problems">
      <div className="ob-container ob-home-pain__grid">
        <div className="ob-home-pain__intro">
          <SectionIntro
            kicker="Блок проблем"
            title="Сначала показываем, где система теряет управляемость"
            text="Проблема видна не как список жалоб, а как разрыв маршрута: обращение приходит в одном месте, данные живут в другом, контроль собирается вручную. Выберите сигнал - панель покажет, что именно ломается."
          />
          <div className="ob-home-pain__diagnostic" aria-live="polite">
            <div className="ob-pain-console__head">
              <span><AlertTriangle size={17} aria-hidden="true" /> Диагностика разрыва</span>
              <em>выберите сигнал</em>
            </div>
            <div className="ob-pain-console__switches" aria-label="Сигналы проблем">
              {painItems.map((item, index) => (
                <button
                  aria-pressed={activePain === index}
                  className={activePain === index ? "is-active" : ""}
                  key={item.signal}
                  onClick={() => setActivePain(index)}
                  onFocus={() => setActivePain(index)}
                  type="button"
                >
                  <span>{item.signal}</span>
                </button>
              ))}
            </div>
            <div className="ob-pain-console__flow" aria-label="Как проблема проходит через системы">
              {selectedPain.diagnostic.map((item, index) => (
                <span className={index === selectedPain.diagnostic.length - 1 ? "is-loss" : ""} key={item + index}>
                  {item}
                </span>
              ))}
            </div>
            <div className="ob-pain-console__result">
              <SelectedPainIcon size={21} aria-hidden="true" />
              <div>
                <strong>{selectedPain.signal}</strong>
                <p>{selectedPain.loss}</p>
              </div>
            </div>
            <div className="ob-pain-console__fix">
              <XCircle size={17} aria-hidden="true" />
              <span>{selectedPain.fix}</span>
            </div>
          </div>
        </div>
        <div className="ob-home-pain__cards" aria-label="Выберите тип проблемы">
          {painItems.map((item, index) => {
            const isActive = activePain === index;
            return (
              <button
                aria-pressed={isActive}
                className={"ob-home-pain-card" + (isActive ? " is-active" : "")}
                key={item.title}
                onClick={() => setActivePain(index)}
                onFocus={() => setActivePain(index)}
                onMouseEnter={() => setActivePain(index)}
                type="button"
              >
                <span className="ob-home-pain-card__status">сигнал процесса</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <em>Что чинить: {item.fix}</em>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SystemSolutionSection() {
  const [activeNode, setActiveNode] = useState(0);
  const activeSolution = solutionNodes[activeNode] ?? solutionNodes[0];

  return (
    <section className="ob-section ob-home-system" id="solution">
      <div className="ob-container ob-home-system__grid">
        <div className={"ob-home-system__map ob-system-route is-step-" + activeNode} aria-label="Интерактивный маршрут решения">
          <div className="ob-system-route__head">
            <span>Блок решения</span>
            <strong>маршрут заявки без разрывов</strong>
            <p>Выберите станцию: слева подсвечивается участок, справа меняется объяснение.</p>
          </div>
          <div className="ob-system-route__track" aria-label="Станции решения">
            <span className="ob-system-route__rail" aria-hidden="true"><i /></span>
            {solutionNodes.map((node, index) => {
              const isActive = activeNode === index;
              return (
                <button
                  aria-label={node.title + ": " + node.result}
                  aria-pressed={isActive}
                  className={"ob-system-route__station is-station-" + index + (isActive ? " is-active" : "")}
                  key={node.title}
                  onClick={() => setActiveNode(index)}
                  onFocus={() => setActiveNode(index)}
                  onMouseEnter={() => setActiveNode(index)}
                  type="button"
                >
                  <span className="ob-system-route__node" aria-hidden="true">
                    <SolutionActionIcon type={node.motion} />
                  </span>
                  <span className="ob-system-route__copy">
                    <strong>{node.title}</strong>
                    <small>{node.text}</small>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="ob-system-route__result" aria-live="polite">
            <span>активная станция</span>
            <strong>{activeSolution.title}</strong>
            <p>{activeSolution.problem}</p>
            <div className="ob-system-route__mini" aria-hidden="true">
              <b>вход</b>
              <b>данные</b>
              <b>контроль</b>
            </div>
          </div>
        </div>
        <div className="ob-home-system__content">
          <SectionIntro
            kicker="Решение"
            title="Ниже тот же маршрут, но уже собранный в управляемую систему"
            text="Выберите узел на схеме или во вкладках: покажем, какую проблему он закрывает и каким становится путь заявки после внедрения."
          />
          <div className="ob-home-system__tabs" aria-label="Выберите узел решения">
            {solutionNodes.map((node, index) => {
              const isActive = activeNode === index;
              return (
                <button
                  aria-pressed={isActive}
                  className={isActive ? "is-active" : ""}
                  key={node.title}
                  onClick={() => setActiveNode(index)}
                  onFocus={() => setActiveNode(index)}
                  type="button"
                >
                  <SolutionActionIcon type={node.motion} />
                  <span>{node.title}</span>
                </button>
              );
            })}
          </div>
          <div className="ob-home-system__transform" aria-label="Как проблема превращается в решение">
            <div className="is-before">
              <span>Было</span>
              <strong>{activeSolution.before}</strong>
            </div>
            <div className="ob-home-system__transform-arrow" aria-hidden="true">
              <ArrowUpRight size={18} />
            </div>
            <div className="is-after">
              <span>Стало</span>
              <strong>{activeSolution.after}</strong>
            </div>
          </div>
          <div className="ob-home-system__active">
            <span>Активный узел решения</span>
            <div className="ob-home-system__active-title">
              <SolutionActionIcon type={activeSolution.motion} />
              <strong>{activeSolution.title}</strong>
            </div>
            <div className="ob-home-system__closes">
              <XCircle size={17} aria-hidden="true" />
              <span>Закрывает: {activeSolution.problem}</span>
            </div>
            <p>{activeSolution.result}</p>
            <small>{activeSolution.action}</small>
            {activeSolution.href && (
              <Link href={activeSolution.href}>
                <span>{activeSolution.linkLabel}</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            )}
          </div>
          <div className="ob-home-system__steps">
            <div><CheckCircle2 size={18} /> фиксируем путь клиента и данные</div>
            <div><CheckCircle2 size={18} /> проектируем роли, права и этапы</div>
            <div><CheckCircle2 size={18} /> связываем сайт, CRM, 1С и коммуникации</div>
            <div><CheckCircle2 size={18} /> оставляем регламент и поддержку</div>
          </div>
          <div className="ob-actions">
            <LeadButton>Разобрать мою систему</LeadButton>
            <ButtonLink href="/cases" variant="secondary">Посмотреть формат кейсов</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section className="ob-section ob-home-benefits" id="benefits">
      <div className="ob-container">
        <SectionIntro
          kicker="Преимущества"
          title="Собираем систему так, чтобы ей управляли после запуска"
          text="Ониксбит держит вместе процесс, платформы и ответственность: сначала разбираем задачу, затем настраиваем CRM, сайт, 1С и коммуникации как одну рабочую связку."
        />
        <div className="ob-home-benefits-clean">
          <article className="ob-home-benefits-clean__lead">
            <span>главный принцип</span>
            <h3>Не отдельные доработки, а понятный маршрут заявки и данных</h3>
            <p>
              Мы убираем разрывы между отделами и системами: заявка получает ответственного, данные не дублируются вручную,
              руководитель видит контрольные точки, а команда понимает, как работать в обновлённом процессе.
            </p>
            <div className="ob-home-benefits-clean__signals" aria-label="Что получает бизнес">
              {benefitSignals.map((item) => (
                <span key={item}><CheckCircle2 size={16} aria-hidden="true" /> {item}</span>
              ))}
            </div>
          </article>
          <div className="ob-home-benefits-clean__cards">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <article className="ob-home-benefit-clean-card" key={item.title}>
                  <span aria-hidden="true"><Icon size={21} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePricingSection() {
  return (
    <section className="ob-section ob-home-pricing" id="pricing">
      <div className="ob-container">
        <SectionIntro
          kicker="Формула бюджета"
          title="Расчёт собирается из понятных шагов и превращается в КП"
          text="Показываем, из чего складывается предложение: лицензии, внедрение, интеграции, обучение и финальный расчёт. Так легче понять бюджет и не потерять важные работы."
        />
        <div className="ob-home-pricing__matrix">
          <div className="ob-home-pricing__formula" aria-label="Формула расчёта">
            <span>формула бюджета</span>
            <strong>Смета собирается из понятных слоёв, а не из одной туманной суммы</strong>
            <p>На консультации быстро отделяем обязательный контур от того, что можно запускать вторым этапом.</p>
            <div className="ob-home-pricing__formula-visual ob-pricing-flow ob-pricing-estimate" aria-hidden="true">
              <div className="ob-pricing-flow__steps ob-pricing-estimate__steps">
                <span className="is-license">лицензии</span>
                <span className="is-project">внедрение</span>
                <span className="is-integration">интеграции</span>
                <span className="is-training">обучение</span>
              </div>
              <div className="ob-pricing-flow__core ob-pricing-estimate__calc">
                <span>Расчёт</span>
              </div>
              <div className="ob-pricing-estimate__bills">
                <i />
                <i />
                <i />
              </div>
              <div className="ob-pricing-estimate__offer">
                <b>КП</b>
                <span>коммерческое предложение</span>
                <i />
                <em />
              </div>
              <div className="ob-pricing-flow__mail ob-pricing-estimate__mail">
                <b>КП</b>
                <i />
              </div>
              <span className="ob-pricing-estimate__client">
                <i />
                <b />
              </span>
              <i className="ob-pricing-flow__dot ob-pricing-estimate__dot" />
            </div>
          </div>
          <div className="ob-home-pricing__cards" aria-label="Основные части бюджета">
            <article className="is-license">
              <div className="ob-home-pricing-card__icon"><CircleDollarSign size={31} aria-hidden="true" /></div>
              <div className="ob-home-pricing-card__copy">
                <span>лицензии</span>
                <h3>Подбор тарифа</h3>
                <p>Определяем продукты, пользователей и редакции Битрикс24, 1С-Битрикс и сервисов под рабочий сценарий.</p>
              </div>
            </article>
            <article className="is-project">
              <div className="ob-home-pricing-card__icon"><ReceiptText size={31} aria-hidden="true" /></div>
              <div className="ob-home-pricing-card__copy">
                <span>внедрение</span>
                <h3>Настройка процесса</h3>
                <p>Считаем воронки, права, роботов, отчёты, перенос данных, тестирование и запуск команды.</p>
              </div>
            </article>
            <article className="is-integration">
              <div className="ob-home-pricing-card__icon"><PlugZap size={31} aria-hidden="true" /></div>
              <div className="ob-home-pricing-card__copy">
                <span>интеграции</span>
                <h3>Связи между системами</h3>
                <p>Отдельно оцениваем 1С, сайт, телефонию, мессенджеры, статусы, обмены и нестандартные сервисы.</p>
              </div>
            </article>
            <article className="is-training">
              <div className="ob-home-pricing-card__icon"><Headphones size={31} aria-hidden="true" /></div>
              <div className="ob-home-pricing-card__copy">
                <span>обучение</span>
                <h3>Регламент и передача</h3>
                <p>Закладываем инструктаж пользователей, описание правил работы и поддержку после запуска.</p>
              </div>
            </article>
          </div>
          <div className="ob-home-pricing__calculation">
            <div className="ob-home-pricing__route" aria-label="Как формируется стоимость">
              {pricingRoute.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
            <div className="ob-home-pricing__factors" aria-label="Что влияет на стоимость">
              {pricingFactors.map((item) => (
                <span key={item}><CheckCircle2 size={16} aria-hidden="true" /> {item}</span>
              ))}
            </div>
            <div className="ob-actions">
              <ButtonLink href="/tarify-licenziy">Открыть тарифы</ButtonLink>
              <LeadButton variant="secondary">Получить расчёт</LeadButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeTrustSection() {
  const [activeTrustCertificate, setActiveTrustCertificate] = useState<number | null>(null);
  const activeCertificate = activeTrustCertificate === null ? null : trustCertificates[activeTrustCertificate];

  useEffect(() => {
    if (!activeCertificate) return;

    const originalOverflow = document.documentElement.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveTrustCertificate(null);
    };

    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.documentElement.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeCertificate]);

  return (
    <section className="ob-section ob-section--tight ob-home-trust">
      <div className="ob-container">
        <div className="ob-home-trust__board">
          <div>
            <span className="ob-kicker">Доказательства</span>
            <h2>Сертификаты и компетенции можно проверить до начала работ</h2>
            <p>
              В этом блоке собраны подтверждения экспертизы Ониксбит: партнёрские статусы Битрикс24 и 1С-Битрикс,
              компетенции по CRM, бизнес-процессам, коробочной версии и интеграции с 1С. Полный список документов открыт в разделе сертификатов.
            </p>
          </div>
          <div className="ob-home-trust__vault" aria-label="Сертификаты и партнёрские документы">
            {trustCertificates.map((certificate, index) => (
              <button
                className={"ob-home-trust__cert " + certificate.className + " is-" + certificate.orientation}
                key={certificate.image}
                onClick={() => setActiveTrustCertificate(index)}
                type="button"
              >
                <div className="ob-home-trust__cert-preview">
                  <Image
                    src={certificate.image}
                    alt={certificate.label + ": " + certificate.title}
                    width={certificate.orientation === "landscape" ? 240 : 150}
                    height={certificate.orientation === "landscape" ? 170 : 214}
                    sizes="(max-width: 760px) 44vw, 210px"
                  />
                </div>
                <span>{certificate.label}</span>
                <strong>{certificate.title}</strong>
              </button>
            ))}
            <div className="ob-home-trust__light" aria-hidden="true" />
          </div>
          <div className="ob-home-trust__shelf">
            <div className="ob-home-trust__badges" aria-label="Подтверждения компетенций">
              <article className="is-bitrix24">
                <span className="ob-home-trust__badge-cert" aria-hidden="true">
                  <Image src="/media/certificates/Золотой%20партнёр%20Битрикс24.jpg" alt="" width={96} height={68} sizes="96px" />
                </span>
                <div>
                  <strong><BadgeCheck size={18} aria-hidden="true" /> партнёр Битрикс24</strong>
                  <p>Подтверждает право подбирать лицензии, внедрять CRM и сопровождать портал по стандартам вендора.</p>
                </div>
              </article>
              <article className="is-bitrix">
                <span className="ob-home-trust__badge-cert" aria-hidden="true">
                  <Image src="/media/certificates/Золотой%20партнёр%201С-Битрикс.jpg" alt="" width={96} height={68} sizes="96px" />
                </span>
                <div>
                  <strong><BadgeCheck size={18} aria-hidden="true" /> партнёр 1С-Битрикс</strong>
                  <p>Показывает опыт в проектах на 1С-Битрикс: структура сайта, каталог, заявки и связка с CRM.</p>
                </div>
              </article>
              <article className="is-integration">
                <span className="ob-home-trust__badge-cert" aria-hidden="true">
                  <Image src="/media/certificates/Компетенция%20Интеграция%20с%201С.jpg" alt="" width={78} height={108} sizes="78px" />
                </span>
                <div>
                  <strong><ShieldCheck size={18} aria-hidden="true" /> интеграция с 1С</strong>
                  <p>Отдельная компетенция по обменам: заказы, остатки, статусы, документы и правила синхронизации.</p>
                </div>
              </article>
              <article className="is-quality">
                <span className="ob-home-trust__badge-cert is-document" aria-hidden="true">
                  <FileCheck2 size={28} />
                </span>
                <div>
                  <strong><FileCheck2 size={18} aria-hidden="true" /> документы открыты</strong>
                  <p>Сертификаты можно посмотреть до старта: без скрытых обещаний и неподтверждённых регалий.</p>
                </div>
              </article>
            </div>
            <div className="ob-home-trust__signals">
              <strong>Что подтверждают</strong>
              {trustSignals.map((item) => (
                <span key={item}><CheckCircle2 size={16} aria-hidden="true" /> {item}</span>
              ))}
            </div>
            <Link className="ob-home-trust__link" href="/certificates">
              <span>Смотреть сертификаты</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        {activeCertificate ? (
          <div className="ob-home-cert-frame" role="dialog" aria-modal="true" aria-label={activeCertificate.label + ": " + activeCertificate.title}>
            <button className="ob-home-cert-frame__backdrop" type="button" onClick={() => setActiveTrustCertificate(null)} aria-label="Закрыть сертификат" />
            <div className="ob-home-cert-frame__panel">
              <button className="ob-home-cert-frame__close" type="button" onClick={() => setActiveTrustCertificate(null)} aria-label="Закрыть сертификат">
                ×
              </button>
              <div className={"ob-home-cert-frame__sheet is-" + activeCertificate.orientation}>
                <Image
                  src={activeCertificate.image}
                  alt={activeCertificate.label + ": " + activeCertificate.title}
                  width={activeCertificate.orientation === "landscape" ? 1280 : 920}
                  height={activeCertificate.orientation === "landscape" ? 910 : 1280}
                  sizes="96vw"
                  priority
                />
              </div>
              <div className="ob-home-cert-frame__caption">
                <span>{activeCertificate.label}</span>
                <strong>{activeCertificate.title}</strong>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function HomeFaqSection() {
  return (
    <section className="ob-section ob-home-faq" id="faq">
      <div className="ob-container">
        <div className="ob-home-faq__header">
          <SectionIntro
            kicker="FAQ"
            title="Ответы перед стартом без лишней переписки"
            text={"Если вопрос срочный, можно сразу позвонить " + company.phone + " или оставить заявку. Ниже - ответы, которые помогают понять формат работы."}
          />
        </div>
        <div className="ob-home-faq__grid">
          <div className="ob-home-faq__guide" aria-label="Как быстро получить ответ">
            <span>как отвечаем</span>
            <strong>Определяем тип вопроса и сразу ведём к следующему шагу</strong>
            <div>
              <article>
                <b>01</b>
                <p>Что выбрать: CRM, сайт, 1С или связку?</p>
              </article>
              <article>
                <b>02</b>
                <p>Какие ограничения и риски есть в текущей системе?</p>
              </article>
              <article>
                <b>03</b>
                <p>Какой ближайший шаг даст понятный результат?</p>
              </article>
            </div>
            <LeadButton>Задать вопрос</LeadButton>
          </div>
          <div className="ob-home-faq__items">
            {faqItems.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>
                  <span>{item.question}</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
