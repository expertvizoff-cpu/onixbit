"use client";

import { useState } from "react";
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
    diagnostic: ["чат", "телефония", "форма", "ручная сводка"],
  },
  {
    icon: GitBranch,
    title: "CRM настроена поверх процесса",
    text: "Этапы, права и роботы есть, но менеджеры обходят систему, а контроль остаётся ручным.",
    signal: "Автоматизация не совпадает с работой отдела",
    loss: "CRM выглядит настроенной, но команда продолжает держать важные действия в личных заметках, чатах и таблицах.",
    fix: "Нужно пересобрать этапы, роли, права и роботов вокруг фактического процесса продаж.",
    diagnostic: ["этапы", "права", "роботы", "обход CRM"],
  },
  {
    icon: DatabaseZap,
    title: "1С, сайт и CRM спорят данными",
    text: "Заказы, остатки, статусы и ответственные расходятся, появляются дубли и уточнения вручную.",
    signal: "Данные расходятся между системами",
    loss: "Сотрудники уточняют остатки, цены, статусы и документы вручную, а ошибка в одном месте быстро размножается дальше.",
    fix: "Нужна карта обменов: какие данные главные, куда они уходят и кто отвечает за ошибку.",
    diagnostic: ["сайт", "CRM", "1С", "дубли"],
  },
  {
    icon: AlertTriangle,
    title: "Подрядчики закрывают только свой кусок",
    text: "Сайт, CRM, учёт и аналитика развиваются отдельно, поэтому итоговая система не управляется целиком.",
    signal: "Никто не отвечает за связку целиком",
    loss: "Каждый подрядчик прав внутри своей зоны, но на стыках появляются разрывы, спорные задачи и бесконечные согласования.",
    fix: "Нужен один владелец архитектуры, который видит весь путь заявки и границы ответственности.",
    diagnostic: ["сайт", "CRM", "учёт", "разрыв"],
  },
];

const solutionPaths = [
  "M320 230 C270 140 205 120 138 112",
  "M320 230 C398 118 484 94 548 136",
  "M320 230 C240 328 162 354 96 320",
  "M320 230 C428 238 505 276 552 348",
  "M320 230 C322 320 320 374 320 424",
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
    className: "ob-system-node--api",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Понятные границы работ",
    text: "Сначала фиксируем процесс, роли, данные и ограничения, затем предлагаем реалистичный маршрут.",
  },
  {
    icon: Network,
    title: "Единый владелец архитектуры",
    text: "Один подрядчик держит связку CRM, сайта, 1С и коммуникаций, поэтому решения не конфликтуют между собой.",
  },
  {
    icon: BadgeCheck,
    title: "Проверяемая экспертиза",
    text: "Партнёрские статусы, сертификаты и компетенции вынесены в отдельный раздел, где их можно открыть.",
  },
  {
    icon: SlidersHorizontal,
    title: "Настройки без хаоса",
    text: "Не превращаем CRM и сайт в витрину возможностей. Оставляем только то, что помогает работе команды.",
  },
  {
    icon: Headphones,
    title: "Запуск с поддержкой",
    text: "После внедрения остаётся понятный регламент, обучение и маршрут развития системы.",
  },
];

const pricingFactors = [
  "количество пользователей и отделов",
  "число воронок, прав и роботов",
  "объём каталога, форм и контента",
  "интеграции с 1С, телефонией и сервисами",
  "требования к коробке, серверу и поддержке",
];

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
              <strong>{String(activePain + 1).padStart(2, "0")}</strong>
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
            const Icon = item.icon;
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
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon size={24} aria-hidden="true" />
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
  const ActiveSolutionIcon = activeSolution.icon;

  return (
    <section className="ob-section ob-home-system" id="solution">
      <div className="ob-container ob-home-system__grid">
        <div className="ob-home-system__map" aria-label="Интерактивная схема связки CRM, сайта, 1С и интеграций">
          <div className="ob-system-map-label">
            <span>Блок решения</span>
            <strong>собранный контур заявки</strong>
          </div>
          <svg className="ob-home-system__links" viewBox="0 0 640 460" aria-hidden="true">
            {solutionPaths.map((path, index) => (
              <path className={activeNode === index ? "is-active" : ""} d={path} key={path} />
            ))}
          </svg>
          <div className="ob-system-core">
            <Network size={34} aria-hidden="true" />
            <strong>Ониксбит</strong>
            <span>архитектура связки</span>
          </div>
          {solutionNodes.map((node, index) => {
            const Icon = node.icon;
            const isActive = activeNode === index;
            return (
              <button
                aria-label={node.title + ": " + node.result}
                aria-pressed={isActive}
                className={"ob-system-node " + node.className + (isActive ? " is-active" : "")}
                key={node.title}
                onClick={() => setActiveNode(index)}
                onFocus={() => setActiveNode(index)}
                onMouseEnter={() => setActiveNode(index)}
                type="button"
              >
                <Icon size={22} aria-hidden="true" />
                <strong>{node.title}</strong>
                <span>{node.text}</span>
              </button>
            );
          })}
        </div>
        <div className="ob-home-system__content">
          <SectionIntro
            kicker="Решение"
            title="Ниже тот же маршрут, но уже собранный в управляемую систему"
            text="Выберите узел на схеме: покажем, какую проблему он закрывает и каким становится путь заявки после внедрения."
          />
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
              <ActiveSolutionIcon size={20} aria-hidden="true" />
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
          title="Чем Ониксбит отличается от подрядчика на одну настройку"
          text="Сильная сторона - связка компетенций. Мы смотрим на CRM, сайт, 1С и лицензии как на одну операционную систему, где важна ответственность за результат."
        />
        <div className="ob-home-benefits__grid">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <article className="ob-home-benefit" key={item.title}>
                <Icon size={25} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomePricingSection() {
  return (
    <section className="ob-section ob-home-pricing" id="pricing">
      <div className="ob-container ob-home-pricing__grid">
        <div className="ob-home-pricing__panel">
          <SectionIntro
            kicker="Ценообразование"
            title="Сначала считаем задачу, потом подбираем тариф и формат работ"
            text="На главной оставляем понятную логику цены. Полную таблицу тарифов Битрикс24 и коробочных лицензий лучше смотреть в отдельном разделе, где есть сравнение и переключатели."
          />
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
        <div className="ob-home-pricing__cards">
          <article>
            <CircleDollarSign size={25} aria-hidden="true" />
            <span>01</span>
            <h3>Лицензии</h3>
            <p>Подбираем тариф Битрикс24, 1С-Битрикс или сервисов коммуникаций под сценарий, а не по названию пакета.</p>
          </article>
          <article>
            <ReceiptText size={25} aria-hidden="true" />
            <span>02</span>
            <h3>Внедрение</h3>
            <p>Стоимость зависит от процессов, прав, роботов, интеграций, данных и обучения команды.</p>
          </article>
          <article>
            <FileCheck2 size={25} aria-hidden="true" />
            <span>03</span>
            <h3>Поддержка</h3>
            <p>После запуска можно вести развитие по задачам, регламенту или отдельному плану улучшений.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export function HomeTrustSection() {
  return (
    <section className="ob-section ob-section--tight ob-home-trust">
      <div className="ob-container ob-home-trust__grid">
        <div>
          <span className="ob-kicker">Доказательства</span>
          <h2>Статусы и сертификаты не прячем в тексте</h2>
          <p>
            Партнёрства Битрикс24, 1С-Битрикс и компетенции вынесены в проверяемый раздел.
            На главной они работают как доверительный мост, а не как набор непонятных слов.
          </p>
        </div>
        <div className="ob-home-trust__badges" aria-label="Подтверждения компетенций">
          <span><BadgeCheck size={18} /> партнёр Битрикс24</span>
          <span><BadgeCheck size={18} /> партнёр 1С-Битрикс</span>
          <span><ShieldCheck size={18} /> компетенции CRM и интеграций</span>
          <span><FileCheck2 size={18} /> документы можно открыть</span>
        </div>
        <Link className="ob-home-trust__link" href="/certificates">
          <span>Смотреть сертификаты</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export function HomeFaqSection() {
  return (
    <section className="ob-section ob-home-faq" id="faq">
      <div className="ob-container ob-home-faq__grid">
        <div>
          <SectionIntro
            kicker="FAQ"
            title="Коротко о частых вопросах перед стартом"
            text={"Если вопрос срочный, можно сразу позвонить " + company.phone + " или оставить заявку. Ниже - ответы, которые помогают понять формат работы."}
          />
          <div className="ob-actions">
            <LeadButton>Задать вопрос</LeadButton>
          </div>
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
    </section>
  );
}
