import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  CalendarClock,
  Cable,
  ChartNoAxesCombined,
  CheckCircle2,
  ClipboardCheck,
  DatabaseZap,
  FileCheck2,
  FileStack,
  Gauge,
  HelpCircle,
  LayoutDashboard,
  Mail,
  MessageSquareText,
  MonitorCheck,
  MousePointerClick,
  PackageCheck,
  PanelTop,
  Phone,
  ReceiptText,
  RefreshCw,
  Route,
  SearchCheck,
  ServerCog,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
  Workflow,
} from "lucide-react";
import {
  articles,
  bitrix24FaqItems,
  sitesFaqItems,
  onecFaqItems,
  cases,
  company,
  directions,
  proofItems,
  testimonials,
  type Direction,
} from "@/data/site";
import { ButtonLink, LeadButton } from "./Buttons";
import { BitrixPricingBlock } from "./BitrixPricingBlock";
import { BitrixCrmProof } from "./BitrixCrmProof";
import { PartnerCertificatesBlock } from "./PartnerCertificatesBlock";
import { LeadFormPanel } from "./BitrixForms";
import { ProductScene } from "./ProductScene";
import { MessengerLinks } from "./Messengers";
import { ContactMapSwitcher } from "./ContactMapSwitcher";

export function SectionIntro({
  kicker,
  title,
  text,
}: {
  kicker?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="ob-section-intro">
      {kicker && <span className="ob-kicker">{kicker}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

const proofIcons = [CalendarClock, ShieldCheck, Route, Building2] as const;

const caseCovers = [
  "/media/home/case-crm-cover.png",
  "/media/home/case-site-cover.png",
  "/media/home/case-integration-cover.png",
] as const;

const articleCovers = [
  "/media/home/article-crm-audit-cover.png",
  "/media/home/article-site-conversion-cover.png",
  "/media/home/article-integration-cover.png",
] as const;

export function ProofStrip() {
  return (
    <section className="ob-section ob-section--tight">
      <div className="ob-container ob-proof" aria-label="Ключевые факты Ониксбит">
        {proofItems.map((item, index) => {
          const Icon = proofIcons[index] ?? ShieldCheck;
          return (
            <article className="ob-proof__item" key={item.label}>
              <span className="ob-proof__icon" aria-hidden="true"><Icon size={22} /></span>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function DirectionsSection() {
  return (
    <section className="ob-section">
      <div className="ob-container">
        <SectionIntro
          kicker="Направления"
          title="Три компетенции в одной системе"
          text="Главная ценность не в отдельных настройках, а в связке: CRM получает заявки, сайт продаёт, учётная система отдаёт данные без ручной суеты."
        />
        <div className="ob-card-grid ob-card-grid--3">
          {directions.map((direction) => (
            <Link className="ob-direction-card" href={direction.href} key={direction.id}>
              <span>{direction.badge}</span>
              <strong>{direction.title}</strong>
              <p>{direction.description}</p>
              <em>
                Подробнее
                <ArrowUpRight size={17} />
              </em>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ApproachSection() {
  const steps = [
    {
      icon: ClipboardCheck,
      label: "Диагностика",
      title: "Сначала процесс",
      text: "Разбираем роли, данные, статусы, ограничения и ожидания руководителя.",
    },
    {
      icon: Route,
      label: "Архитектура",
      title: "Потом интерфейс",
      text: "Проектируем страницы, CRM-воронки и обмены так, чтобы ими пользовались.",
    },
    {
      icon: Sparkles,
      label: "Запуск",
      title: "Затем внедрение",
      text: "Собираем решение, тестируем сценарии, обучаем и оставляем понятный регламент.",
    },
  ];

  return (
    <section className="ob-section ob-home-approach">
      <div className="ob-container ob-home-approach__grid">
        <div className="ob-home-approach__intro">
          <SectionIntro
            kicker="Подход"
            title="Не продаём хаотичную разработку"
            text="Мы держим в фокусе бизнес-цель, а не количество экранов и настроек. Поэтому сайт, CRM и обмены проектируются как одна операционная система."
          />
          <div className="ob-home-approach__signal">
            <CheckCircle2 size={18} aria-hidden="true" />
            <div>
              <strong>Каждый этап заканчивается проверяемым артефактом</strong>
              <p>Карта процесса, схема интеграций, список ролей, тестовые сценарии и регламент запуска.</p>
            </div>
          </div>
          <div className="ob-actions">
            <LeadButton>Получить экспресс-аудит</LeadButton>
          </div>
        </div>
        <div className="ob-home-approach__map">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article className="ob-process-item ob-home-approach-step" key={step.title}>
                <span aria-hidden="true"><Icon size={22} /></span>
                <div>
                  <em>{step.label}</em>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CasesPreview({ full = false }: { full?: boolean }) {
  return (
    <section className={"ob-section ob-home-cases" + (full ? " is-full" : "")}>
      <div className="ob-container">
        <SectionIntro
          kicker="Кейсы"
          title={full ? "Кейсы готовятся к публикации" : "Кейсы: честный разбор задачи, решения и ограничений"}
          text="Показываем стандарт материала: задача, ограничения, решение и польза для бизнеса. Не публикуем вымышленные результаты и неподтверждённые отзывы."
        />
        <div className="ob-home-cases__layout">
          {cases.map((item, index) => (
            <Link className={"ob-case-card ob-home-case-card is-visual-" + index + (index === 0 ? " is-featured" : "")} href="/cases" key={item.title}>
              <div className="ob-home-case-card__visual">
                <Image src={caseCovers[index] ?? caseCovers[0]} alt={"Визуальное превью кейса: " + item.title} fill sizes="(max-width: 760px) 100vw, (max-width: 1180px) 44vw, 28vw" />
                <span aria-hidden="true" />
              </div>
              <div className="ob-home-case-card__body">
                <div className="ob-home-case-card__top">
                  <span>{item.sector}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.result}</p>
                <div>
                  {item.tags.map((tag) => (
                    <em key={tag}>{tag}</em>
                  ))}
                </div>
              </div>
              <span className="ob-home-case-card__cta">
                Читать разбор
                <ArrowUpRight size={18} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
        {!full && (
          <div className="ob-section-tail">
            <ButtonLink href="/cases">Смотреть кейсы</ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="ob-section ob-section--tight">
      <div className="ob-container">
        <SectionIntro
          kicker="Отзывы"
          title="Отзывы появятся только после согласования с клиентами"
          text="Для B2B важнее доверие, чем декоративные цитаты. Этот блок уже показывает будущий формат: подтверждённый отзыв, фото со встречи или короткий видеоразбор."
        />
        <div className="ob-card-grid ob-card-grid--3">
          {testimonials.map((item) => (
            <article className="ob-testimonial ob-testimonial--soon" key={`${item.name}-${item.company}`}>
              <p>{item.text}</p>
              <strong>{item.name}</strong>
              <span>{item.company}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ArticlesPreview({ full = false }: { full?: boolean }) {
  return (
    <section className={"ob-section ob-home-articles" + (full ? " is-full" : "")}>
      <div className="ob-container">
        <SectionIntro
          kicker="Статьи"
          title={full ? "Готовим базу знаний Ониксбит" : "Статьи для руководителей о CRM, сайтах и интеграциях"}
          text="Материалы без пустого копирайтинга: разборы Битрикс24, 1С-Битрикс, обменов, лицензий и поддержки простым языком для руководителей."
        />
        <div className="ob-home-articles__layout">
          {articles.map((article, index) => (
            <Link className={"ob-article-card ob-home-article-card is-visual-" + index + (index === 0 ? " is-featured" : "")} href="/articles" key={article.title}>
              <div className="ob-home-article-card__visual">
                <Image src={articleCovers[index] ?? articleCovers[0]} alt={"Обложка статьи: " + article.title} fill sizes="(max-width: 760px) 100vw, (max-width: 1180px) 92vw, 48vw" />
                <span aria-hidden="true" />
              </div>
              <div className="ob-home-article-card__meta">
                <BookOpen size={18} aria-hidden="true" />
                <span>{article.category}</span>
                <em>{article.minutes}</em>
              </div>
              <h3>{article.title}</h3>
              <p>{article.text}</p>
              <span className="ob-home-article-card__cta">
                Читать статью
                <ArrowUpRight size={17} aria-hidden="true" />
              </span>
              <span className="ob-home-article-card__line" aria-hidden="true" />
            </Link>
          ))}
        </div>
        {!full && (
          <div className="ob-section-tail">
            <ButtonLink href="/articles">Открыть статьи</ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}

export function CertificatesGrid() {
  return <PartnerCertificatesBlock />;
}

export function LicenseGrid() {
  return <BitrixPricingBlock />;
}


type ServiceDetail = {
  decisionTitle: string;
  decisionText: string;
  signals: string[];
  outcomes: Array<{ title: string; text: string }>;
  risks: string[];
  firstStep: string;
};

const servicePageDetails: Record<Direction["id"], ServiceDetail> = {
  bitrix24: {
    decisionTitle: "Когда Битрикс24 нужен не формально, а как система управления продажами",
    decisionText:
      "Руководителю важно быстро понять: где будут фиксироваться заявки, как менеджеры увидят следующий шаг, кто контролирует просрочки и какие данные попадут в отчёты.",
    signals: [
      "заявки приходят из разных каналов и теряются между менеджерами",
      "руководитель не видит причины зависших сделок и ручных переносов",
      "команде нужны правила, роботы, права и отчёты, а не просто новый портал",
    ],
    outcomes: [
      {
        title: "Карта воронок и ролей",
        text: "Понятно, какие этапы нужны, кто отвечает за сделку и где появляются задачи, уведомления и контроль.",
      },
      {
        title: "Рабочий CRM-контур",
        text: "Лиды, сделки, коммуникации, роботы, права и отчёты настроены под реальный процесс компании.",
      },
      {
        title: "Запуск без провала",
        text: "Команда получает регламент, тестовые сценарии и поддержку после старта, чтобы CRM не осталась витриной.",
      },
    ],
    risks: [
      "слишком много полей и роботов без понятной логики",
      "интеграции с телефонией, сайтом и 1С работают отдельно от CRM",
      "менеджеры обходят систему, потому что им неудобно работать",
    ],
    firstStep:
      "Начинаем с короткого разбора текущего пути заявки: источники, этапы, роли, отчёты и ручные операции. После этого предлагаем карту внедрения.",
  },
  sites: {
    decisionTitle: "Когда сайт на 1С-Битрикс должен продавать и передавать данные дальше",
    decisionText:
      "Сайт должен не только выглядеть современно, но и вести клиента к заявке, отдавать менеджеру контекст, поддерживать каталог и не ломать SEO-рост после запуска.",
    signals: [
      "сайт не объясняет услугу или товар так, чтобы заявка дошла до менеджера",
      "каталог, формы и корзина живут отдельно от CRM и учёта",
      "нужна управляемая платформа для развития, SEO и интеграций",
    ],
    outcomes: [
      {
        title: "Структура и сценарии",
        text: "Фиксируем страницы, навигацию, формы, каталог и точки конверсии до начала разработки.",
      },
      {
        title: "Сайт на управляемой базе",
        text: "Собираем интерфейс, контентные блоки, каталог, заявки и админку, которую можно поддерживать.",
      },
      {
        title: "Связка с продажами",
        text: "Формы, заказы и данные передаются в Битрикс24, 1С или другие сервисы по согласованной логике.",
      },
    ],
    risks: [
      "сайт выглядит отдельно от продаж и не даёт менеджеру контекст заявки",
      "запуск затягивается из-за неясной структуры, контента и интеграций",
      "SEO и скорость вспоминают уже после разработки",
    ],
    firstStep:
      "Начинаем с карты страниц, типов заявок, каталога, интеграций и роли сайта в продажах. Это помогает оценить сроки и бюджет без угадывания.",
  },
  onec: {
    decisionTitle: "Когда 1С нужно связать с сайтом, CRM и обменами без ручного дублирования",
    decisionText:
      "Здесь особенно важны честные границы: Ониксбит берёт интеграции и связки, а глубокую 1С-разработку усиливает партнёрской экспертизой.",
    signals: [
      "заказы, остатки, цены или статусы вручную переносят между системами",
      "ошибки обмена видны поздно, когда уже страдает клиент или менеджер",
      "нужно понять, где задача интеграционная, а где требуется профильный 1С-специалист",
    ],
    outcomes: [
      {
        title: "Границы обмена",
        text: "Фиксируем, какие данные живут в 1С, что уходит на сайт и что возвращается в CRM.",
      },
      {
        title: "Настроенная связка",
        text: "Проверяем модули, расписания, статусы, ошибки и правила синхронизации между системами.",
      },
      {
        title: "Регламент поддержки",
        text: "Описываем контроль ошибок, ответственных и случаи, где подключается отдельная 1С-экспертиза.",
      },
    ],
    risks: [
      "данные расходятся между сайтом, CRM и учётной системой",
      "обмен ломается без понятного владельца и регламента",
      "интеграционную задачу принимают за полноценную 1С-разработку",
    ],
    firstStep:
      "Начинаем с проверки текущих обменов, источников данных, модулей, расписаний и ошибок. Затем честно определяем зону работ.",
  },
};

function ServiceHeroBullets({ direction }: { direction: Direction }) {
  return (
    <div className="ob-service-hero__bullets" aria-label="Ключевые задачи направления">
      {direction.bullets.map((item) => (
        <span key={item}><CheckCircle2 size={15} aria-hidden="true" /> {item}</span>
      ))}
    </div>
  );
}

function ServicePageExperience({ direction, details }: { direction: Direction; details: ServiceDetail }) {
  if (direction.id === "bitrix24") return <Bitrix24ServiceExperience direction={direction} details={details} />;
  if (direction.id === "sites") return <SitesServiceExperience direction={direction} details={details} />;
  return <OneCServiceExperience direction={direction} details={details} />;
}

function Bitrix24ServiceExperience({ direction, details }: { direction: Direction; details: ServiceDetail }) {
  const commandTiles = [
    { icon: MousePointerClick, title: "Входящие", text: "форма, звонок, мессенджер и повторное обращение попадают в один контур" },
    { icon: UsersRound, title: "Роли", text: "менеджер, руководитель и администратор видят свой уровень ответственности" },
    { icon: Workflow, title: "Роботы", text: "задачи, уведомления и документы появляются по понятному условию" },
    { icon: ChartNoAxesCombined, title: "Контроль", text: "отчёты показывают узкие места, просрочки и качество обработки" },
  ];

  const automationRows = [
    { if: "новая заявка без ответственного", then: "назначить менеджера и поставить дело", control: "SLA первого касания" },
    { if: "сделка ждёт КП", then: "создать задачу и напомнить о сроке", control: "просрочки в отчёте" },
    { if: "клиент оплатил", then: "передать проект в работу", control: "статус и ответственный" },
  ];

  return (
    <>
      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-service-b24-command">
          <div className="ob-service-b24-command__copy">
            <span className="ob-kicker">CRM как рабочий пульт</span>
            <h2>{details.decisionTitle}</h2>
            <p>{details.decisionText}</p>
            <div className="ob-service-b24-signals" aria-label="Сигналы для внедрения Битрикс24">
              {details.signals.map((signal) => (
                <span key={signal}><ShieldCheck size={16} aria-hidden="true" /> {signal}</span>
              ))}
            </div>
          </div>
          <div className="ob-service-b24-console" aria-label="Схема CRM-контура Битрикс24">
            <div className="ob-service-b24-console__bar">
              <LayoutDashboard size={20} aria-hidden="true" />
              <strong>Центр продаж</strong>
              <span>заявки → сделки → контроль</span>
            </div>
            <div className="ob-service-b24-console__grid">
              {commandTiles.map((tile) => {
                const Icon = tile.icon;
                return (
                  <article key={tile.title}>
                    <Icon size={22} aria-hidden="true" />
                    <strong>{tile.title}</strong>
                    <p>{tile.text}</p>
                  </article>
                );
              })}
            </div>
            <div className="ob-service-b24-console__route" aria-hidden="true">
              <span>сайт</span><i /><span>Битрикс24</span><i /><span>1С</span><i /><span>отчёт</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ob-section" id="scope">
        <div className="ob-container ob-service-b24-workflow" id="service-plan">
          <div className="ob-service-b24-workflow__head">
            <span className="ob-kicker">Проектирование внедрения</span>
            <h2>Собираем не набор настроек, а маршрут сделки</h2>
            <p>Воронки, права, роботы и коммуникации связываются с реальным путём клиента. Поэтому менеджеру понятно, что делать, а руководителю понятно, где теряются деньги и время.</p>
          </div>
          <div className="ob-service-b24-workflow__lanes">
            {direction.process.map((step, index) => (
              <article key={step.title}>
                <span>{index === 0 ? "аудит" : index === 1 ? "карта" : index === 2 ? "запуск" : "рост"}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <div className="ob-service-b24-outcomes">
            {details.outcomes.map((item) => (
              <article key={item.title}>
                <ClipboardCheck size={22} aria-hidden="true" />
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-service-b24-automation">
          <div>
            <span className="ob-kicker">Автоматизация без хаоса</span>
            <h2>Каждый робот получает условие, действие и точку контроля</h2>
            <p>{details.firstStep}</p>
          </div>
          <div className="ob-service-b24-automation__table" aria-label="Примеры автоматизации Битрикс24">
            {automationRows.map((row) => (
              <article key={row.if}>
                <span>если</span><p>{row.if}</p>
                <span>то</span><p>{row.then}</p>
                <span>контроль</span><p>{row.control}</p>
              </article>
            ))}
          </div>
          <div className="ob-service-b24-automation__chips" aria-label="Интеграции Битрикс24">
            {direction.integrations.map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="ob-service-next-inline">
            <LeadButton>{direction.cta}</LeadButton>
          </div>
        </div>
      </section>

      <Bitrix24ConversionSections />
    </>
  );
}

function Bitrix24ConversionSections() {
  const formats = [
    {
      icon: ClipboardCheck,
      title: "Аудит и карта внедрения",
      text: "Подходит, если портал уже есть, но сделки зависают, отчёты спорные, а роботы мешают менеджерам.",
      note: "итог: понятный список точек потерь и следующий этап",
    },
    {
      icon: LayoutDashboard,
      title: "Запуск отдела продаж",
      text: "Настраиваем базовый CRM-контур: воронки, поля, роли, права, дела, напоминания и контроль руководителя.",
      note: "итог: команда начинает вести сделки в единой логике",
    },
    {
      icon: Workflow,
      title: "Автоматизация и интеграции",
      text: "Связываем сайт, телефонию, мессенджеры, 1С и внутренние сервисы с маршрутом сделки в Битрикс24.",
      note: "итог: меньше ручного переноса и больше прозрачности",
    },
    {
      icon: MonitorCheck,
      title: "Развитие после запуска",
      text: "Улучшаем отчёты, регламенты, пользовательский опыт и сценарии, которые проявились только в работе команды.",
      note: "итог: CRM развивается вместе с процессом продаж",
    },
  ];

  const deliverables = [
    "карта воронок, этапов, ролей и ответственных",
    "настроенные права, поля, дела, роботы и уведомления",
    "контрольные отчёты по просрочкам, источникам и качеству обработки",
    "тестовые сценарии и понятный регламент для менеджеров",
  ];

  const boundaries = [
    "не навешиваем роботов без понятного условия и владельца",
    "не обещаем бюджет без разбора интеграций, лицензий и объёма данных",
    "не переносим хаос из текущего процесса в новую CRM",
  ];

  return (
    <>
      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-service-b24-formats">
          <div className="ob-service-b24-formats__head">
            <span className="ob-kicker">Форматы работ</span>
            <h2>Можно начать с аудита, быстрого запуска или отдельной интеграции</h2>
            <p>
              Не каждый проект нужно сразу превращать в большое внедрение. Сначала выбираем формат,
              который даёт управляемый результат и не ломает работу отдела продаж.
            </p>
          </div>
          <div className="ob-service-b24-formats__grid">
            {formats.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title}>
                  <Icon size={24} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span>{item.note}</span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-service-b24-delivery">
          <div className="ob-service-b24-delivery__main">
            <span className="ob-kicker">Результат первого этапа</span>
            <h2>После разбора становится понятно, что внедрять сейчас, а что оставить на развитие</h2>
            <p>
              Клиент получает не абстрактную консультацию, а рабочую рамку проекта: что настроить,
              кто отвечает, какие интеграции нужны и как проверить, что CRM действительно помогает продажам.
            </p>
            <div className="ob-service-b24-delivery__list" aria-label="Что получает клиент после первого этапа">
              {deliverables.map((item) => <span key={item}><FileCheck2 size={17} aria-hidden="true" /> {item}</span>)}
            </div>
          </div>
          <aside className="ob-service-b24-delivery__aside" aria-label="Честные ограничения внедрения">
            <ReceiptText size={26} aria-hidden="true" />
            <h3>Границы фиксируем до настройки</h3>
            <p>Это защищает бюджет, сроки и ожидания команды.</p>
            {boundaries.map((item) => <span key={item}><ShieldCheck size={16} aria-hidden="true" /> {item}</span>)}
            <LeadButton>Получить план внедрения</LeadButton>
          </aside>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-service-b24-faq">
          <div className="ob-service-b24-faq__head">
            <span className="ob-kicker">Вопросы перед стартом</span>
            <h2>Коротко о сроках, аудите, коробке, интеграциях и запуске команды</h2>
          </div>
          <div className="ob-service-b24-faq__items">
            {bitrix24FaqItems.map((item) => (
              <article key={item.question}>
                <HelpCircle size={22} aria-hidden="true" />
                <div>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SitesServiceExperience({ direction, details }: { direction: Direction; details: ServiceDetail }) {
  const blueprint = [
    { icon: PanelTop, title: "Структура", text: "главная, услуги, каталог, карточки, статьи и точки доверия" },
    { icon: ShoppingCart, title: "Каталог", text: "товары, фильтры, корзина, формы и сценарии заказа" },
    { icon: SearchCheck, title: "SEO-основа", text: "чистые посадочные страницы, метаданные и управляемый контент" },
    { icon: Gauge, title: "Скорость", text: "адаптив, лёгкие блоки, понятная админка и проверка перед запуском" },
  ];

  const conversionSteps = [
    "клиент понимает предложение без звонка",
    "форма передаёт менеджеру контекст, а не пустое имя",
    "каталог и заявки связаны с CRM и учётом",
  ];

  return (
    <>
      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-service-sites-blueprint">
          <div className="ob-service-sites-browser" aria-label="Схема сайта на 1С-Битрикс">
            <div className="ob-service-sites-browser__top">
              <span /><span /><span />
              <strong>site.ru / каталог / заявка</strong>
            </div>
            <div className="ob-service-sites-browser__hero">
              <em>первый экран</em>
              <strong>понятное предложение</strong>
              <p>сервис, каталог, форма и доказательства рядом</p>
            </div>
            <div className="ob-service-sites-browser__grid">
              <span>услуги</span><span>каталог</span><span>кейсы</span><span>форма</span>
            </div>
            <div className="ob-service-sites-browser__flow">
              <i>SEO</i><i>контент</i><i>CRM</i><i>1С</i>
            </div>
          </div>
          <div className="ob-service-sites-blueprint__copy">
            <span className="ob-kicker">Сайт как часть продаж</span>
            <h2>{details.decisionTitle}</h2>
            <p>{details.decisionText}</p>
            <div className="ob-service-sites-blueprint__signals">
              {details.signals.map((signal) => (
                <article key={signal}><MousePointerClick size={18} aria-hidden="true" /><span>{signal}</span></article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ob-section" id="scope">
        <div className="ob-container ob-service-sites-lab" id="service-plan">
          <div className="ob-service-sites-lab__head">
            <span className="ob-kicker">Архитектура запуска</span>
            <h2>Разводим по полкам контент, каталог, заявки и обмены</h2>
            <p>На странице должно быть видно, что сайт проектируется как рабочая система: клиенту удобно выбрать, менеджеру понятно обработать, владельцу понятно развивать.</p>
          </div>
          <div className="ob-service-sites-lab__cards">
            {blueprint.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title}>
                  <Icon size={25} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
          <div className="ob-service-sites-lab__scope" aria-label="Что входит в разработку сайта">
            {direction.scope.map((item) => <span key={item}><CheckCircle2 size={16} aria-hidden="true" /> {item}</span>)}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-service-sites-release">
          <div className="ob-service-sites-release__copy">
            <span className="ob-kicker">От макета до заявки</span>
            <h2>Запуск проверяется по пользовательскому сценарию, а не по факту “страницы открываются”</h2>
            <p>{details.firstStep}</p>
            <div className="ob-service-sites-release__steps">
              {conversionSteps.map((step) => <span key={step}><FileStack size={16} aria-hidden="true" /> {step}</span>)}
            </div>
          </div>
          <div className="ob-service-sites-release__board">
            <div className="ob-service-sites-release__outcomes">
              {details.outcomes.map((item) => (
                <article key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
            <div className="ob-service-sites-release__risks" aria-label="Риски запуска сайта">
              {details.risks.map((risk) => <span key={risk}><ShieldCheck size={16} aria-hidden="true" /> {risk}</span>)}
            </div>
          </div>
          <div className="ob-service-next-inline">
            <LeadButton>{direction.cta}</LeadButton>
          </div>
        </div>
      </section>

      <SitesConversionSections />
    </>
  );
}

function SitesConversionSections() {
  const formats = [
    {
      icon: PanelTop,
      title: "Корпоративный сайт",
      text: "Подходит, когда нужно понятно объяснить услуги, усилить доверие и передавать заявки в CRM с контекстом.",
      note: "итог: структура, страницы, формы и управляемый контент",
    },
    {
      icon: ShoppingCart,
      title: "Каталог или интернет-магазин",
      text: "Проектируем разделы, фильтры, карточки, корзину, оформление заказа и связь с учётом.",
      note: "итог: понятный путь от выбора до заказа",
    },
    {
      icon: RefreshCw,
      title: "Редизайн или миграция",
      text: "Разбираем текущий сайт, сохраняем SEO-основу, переносим важный контент и убираем технический долг.",
      note: "итог: аккуратный переход без хаоса в структуре",
    },
    {
      icon: Cable,
      title: "Интеграции и развитие",
      text: "Связываем формы, заказы, статусы, CRM, 1С, аналитику и дорабатываем сайт по реальным сценариям.",
      note: "итог: сайт работает как часть продаж",
    },
  ];

  const deliverables = [
    "карта страниц, разделов, типов заявок и точек доверия",
    "структура каталога, карточек, фильтров и сценариев заказа",
    "список интеграций с Битрикс24, 1С, оплатой и аналитикой",
    "план запуска с рисками по контенту, SEO, скорости и поддержке",
  ];

  const boundaries = [
    "не обещаем стоимость без структуры, каталога и интеграций",
    "не переносим старую навигацию, если она мешает продажам и SEO",
    "не запускаем формы без проверки, что менеджер получает нужный контекст",
  ];

  return (
    <>
      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-service-sites-formats">
          <div className="ob-service-sites-formats__head">
            <span className="ob-kicker">Форматы работ</span>
            <h2>Можно начать с нового сайта, каталога, редизайна или отдельной интеграции</h2>
            <p>
              Сначала выбираем формат под бизнес-задачу: где сайт должен продавать, где обслуживать каталог,
              а где важно сохранить SEO и аккуратно связать системы.
            </p>
          </div>
          <div className="ob-service-sites-formats__grid">
            {formats.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title}>
                  <Icon size={24} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span>{item.note}</span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-service-sites-delivery">
          <div className="ob-service-sites-delivery__main">
            <span className="ob-kicker">Результат первого этапа</span>
            <h2>После разбора видно, какие страницы, данные и интеграции нужны для запуска</h2>
            <p>
              Первый этап нужен не для красивой презентации, а для управляемого решения: какие страницы делать,
              какие заявки собирать, какие данные передавать и где могут сорваться сроки.
            </p>
            <div className="ob-service-sites-delivery__list" aria-label="Что получает клиент после первого этапа">
              {deliverables.map((item) => <span key={item}><FileCheck2 size={17} aria-hidden="true" /> {item}</span>)}
            </div>
          </div>
          <aside className="ob-service-sites-delivery__aside" aria-label="Честные ограничения разработки сайта">
            <ReceiptText size={26} aria-hidden="true" />
            <h3>Границы фиксируем до дизайна и разработки</h3>
            <p>Это защищает бюджет, сроки, SEO и ожидания отдела продаж.</p>
            {boundaries.map((item) => <span key={item}><ShieldCheck size={16} aria-hidden="true" /> {item}</span>)}
            <LeadButton>Получить структуру сайта</LeadButton>
          </aside>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-service-sites-faq">
          <div className="ob-service-sites-faq__head">
            <span className="ob-kicker">Вопросы перед стартом</span>
            <h2>Коротко о сроках, доработках, ASPRO, интеграциях и первичной оценке</h2>
          </div>
          <div className="ob-service-sites-faq__items">
            {sitesFaqItems.map((item) => (
              <article key={item.question}>
                <HelpCircle size={22} aria-hidden="true" />
                <div>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function OneCServiceExperience({ direction, details }: { direction: Direction; details: ServiceDetail }) {
  const packets = ["заказы", "остатки", "цены", "статусы"];
  const responsibility = [
    { title: "Ониксбит", text: "интеграционный сценарий, связка с Битрикс24 и сайтом, контроль обменов", icon: Cable },
    { title: "Scloud / 1С-эксперт", text: "глубокая 1С-логика, конфигурации, сложные доработки и консультации", icon: ServerCog },
    { title: "Клиент", text: "правила учёта, владельцы данных, тестовые примеры и согласование регламента", icon: UsersRound },
  ];

  const monitorRows = [
    { name: "Заказы с сайта", state: "контролируем статус", meta: "сайт → 1С → CRM" },
    { name: "Остатки и цены", state: "проверяем расхождения", meta: "1С → сайт" },
    { name: "Ошибки обмена", state: "фиксируем владельца", meta: "лог → задача" },
  ];

  return (
    <>
      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-service-onec-hub">
          <div className="ob-service-onec-hub__copy">
            <span className="ob-kicker">Данные без ручного дубляжа</span>
            <h2>{details.decisionTitle}</h2>
            <p>{details.decisionText}</p>
            <div className="ob-service-onec-hub__signals">
              {details.signals.map((signal) => <span key={signal}><DatabaseZap size={16} aria-hidden="true" /> {signal}</span>)}
            </div>
          </div>
          <div className="ob-service-onec-diagram" aria-label="Схема обмена 1С с CRM и сайтом">
            <div className="ob-service-onec-diagram__node is-core"><DatabaseZap size={32} aria-hidden="true" /><strong>1С</strong><span>источник учёта</span></div>
            <div className="ob-service-onec-diagram__node is-crm"><LayoutDashboard size={24} aria-hidden="true" /><strong>Битрикс24</strong><span>сделки и задачи</span></div>
            <div className="ob-service-onec-diagram__node is-site"><ShoppingCart size={24} aria-hidden="true" /><strong>Сайт</strong><span>каталог и заказ</span></div>
            <div className="ob-service-onec-diagram__node is-support"><MonitorCheck size={24} aria-hidden="true" /><strong>Контроль</strong><span>ошибки и регламент</span></div>
            <div className="ob-service-onec-diagram__packets" aria-hidden="true">
              {packets.map((packet) => <span key={packet}>{packet}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="ob-section" id="scope">
        <div className="ob-container ob-service-onec-boundary" id="service-plan">
          <div className="ob-service-onec-boundary__head">
            <span className="ob-kicker">Честные границы работ</span>
            <h2>Сначала определяем, где интеграция, а где нужна профильная 1С-разработка</h2>
            <p>Так задача не превращается в бесконечный спор между сайтом, CRM и учётом. У каждого участка появляется владелец, тестовый пример и понятный результат.</p>
          </div>
          <div className="ob-service-onec-boundary__grid">
            {responsibility.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title}>
                  <Icon size={25} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
          <div className="ob-service-onec-boundary__scope" aria-label="Зона работ по 1С">
            {direction.scope.map((item) => <span key={item}><PackageCheck size={16} aria-hidden="true" /> {item}</span>)}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-service-onec-monitor">
          <div>
            <span className="ob-kicker">Контроль обменов</span>
            <h2>После настройки остаётся не магия, а регламент: что проверять и кто реагирует</h2>
            <p>{details.firstStep}</p>
          </div>
          <div className="ob-service-onec-monitor__panel" aria-label="Монитор обменов 1С">
            {monitorRows.map((row) => (
              <article key={row.name}>
                <RefreshCw size={19} aria-hidden="true" />
                <div><strong>{row.name}</strong><span>{row.meta}</span></div>
                <em>{row.state}</em>
              </article>
            ))}
          </div>
          <div className="ob-service-onec-monitor__outcomes">
            {details.outcomes.map((item) => (
              <article key={item.title}>
                <SlidersHorizontal size={20} aria-hidden="true" />
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <div className="ob-service-onec-monitor__risks" aria-label="Риски интеграции 1С">
            {details.risks.map((risk) => <span key={risk}><ShieldCheck size={16} aria-hidden="true" /> {risk}</span>)}
          </div>
          <div className="ob-service-next-inline">
            <LeadButton>{direction.cta}</LeadButton>
          </div>
        </div>
      </section>

      <OneCConversionSections />
    </>
  );
}

function OneCConversionSections() {
  const formats = [
    {
      icon: Route,
      title: "Интеграция сайта и 1С",
      text: "Разбираем поток товаров, цен, остатков, заказов и статусов между интернет-магазином и учётной системой.",
      note: "итог: понятная схема обмена и тестовые сценарии",
    },
    {
      icon: LayoutDashboard,
      title: "Связка Битрикс24 и 1С",
      text: "Настраиваем передачу заказов, статусов, контрагентов и служебных данных так, чтобы менеджер видел контекст сделки.",
      note: "итог: меньше ручного переноса и спорных данных",
    },
    {
      icon: SearchCheck,
      title: "Разбор ошибок обмена",
      text: "Смотрим логи, расписания, модули, тестовые заказы и места, где обмен ломается без понятного владельца.",
      note: "итог: список причин, владельцев и следующих шагов",
    },
    {
      icon: ServerCog,
      title: "Scloud и 1С-экспертиза",
      text: "Если задача уходит в конфигурацию, методологию учёта или сложную 1С-логику, заранее отделяем эту часть.",
      note: "итог: честная зона ответственности без подмены работ",
    },
  ];

  const deliverables = [
    "карта потоков данных: товары, цены, остатки, заказы и статусы",
    "источники истины, владельцы данных и точки ручной обработки",
    "тестовые сценарии обмена и список проверок перед запуском",
    "маршрут подключения Scloud или профильного 1С-эксперта",
  ];

  const boundaries = [
    "не обещаем переписать конфигурацию без отдельного 1С-разбора",
    "не смешиваем интеграцию, учётную методологию и поддержку пользователей",
    "не запускаем обмен без тестовых заказов, товаров, цен и статусов",
  ];

  return (
    <>
      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-service-onec-formats">
          <div className="ob-service-onec-formats__head">
            <span className="ob-kicker">Форматы работ</span>
            <h2>Берём интеграции и обмены, а сложную 1С-логику отделяем заранее</h2>
            <p>
              Клиенту важно понимать границы до старта: где достаточно настроить обмен, где нужна диагностика,
              а где без профильной 1С-экспертизы будет риск для учёта.
            </p>
          </div>
          <div className="ob-service-onec-formats__grid">
            {formats.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title}>
                  <Icon size={24} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span>{item.note}</span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-service-onec-diagnostics">
          <div className="ob-service-onec-diagnostics__main">
            <span className="ob-kicker">Результат диагностики</span>
            <h2>После первого разбора видно, какие данные передавать и кто отвечает за каждый участок</h2>
            <p>
              Диагностика нужна, чтобы не лечить обмен вслепую. Мы фиксируем источники данных,
              примеры ошибок, тестовые сценарии и границу между интеграцией и 1С-разработкой.
            </p>
            <div className="ob-service-onec-diagnostics__list" aria-label="Что получает клиент после диагностики 1С">
              {deliverables.map((item) => <span key={item}><FileCheck2 size={17} aria-hidden="true" /> {item}</span>)}
            </div>
          </div>
          <aside className="ob-service-onec-diagnostics__aside" aria-label="Честные ограничения работ по 1С">
            <ReceiptText size={26} aria-hidden="true" />
            <h3>Границы фиксируем до оценки</h3>
            <p>Это защищает учёт, сроки и ожидания команды, которая работает с данными каждый день.</p>
            {boundaries.map((item) => <span key={item}><ShieldCheck size={16} aria-hidden="true" /> {item}</span>)}
            <LeadButton>Проверить обмен 1С</LeadButton>
          </aside>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-service-onec-faq">
          <div className="ob-service-onec-faq__head">
            <span className="ob-kicker">Вопросы перед стартом</span>
            <h2>Коротко о зоне работ, 1С-разработке, обменах, диагностике и Scloud</h2>
          </div>
          <div className="ob-service-onec-faq__items">
            {onecFaqItems.map((item) => (
              <article key={item.question}>
                <HelpCircle size={22} aria-hidden="true" />
                <div>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function ServicePage({ direction }: { direction: Direction }) {
  const details = servicePageDetails[direction.id];

  return (
    <>
      <section className={"ob-service-hero ob-section ob-service-page ob-service-page--" + direction.id}>
        <div className="ob-container ob-service-hero__grid">
          <div>
            <span className="ob-kicker">{direction.badge}</span>
            <h1>{direction.headline}</h1>
            <p>{direction.description}</p>
            <ServiceHeroBullets direction={direction} />
            <div className="ob-actions">
              <LeadButton>{direction.cta}</LeadButton>
              <a className="ob-btn ob-btn--secondary" href="#service-plan">
                <span>{direction.secondaryCta}</span>
              </a>
            </div>
            {direction.id === "bitrix24" && <BitrixCrmProof variant="hero" />}
            <div className="ob-stat-row">
              {direction.stats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ProductScene type={direction.scene} />
        </div>
      </section>

      <ServicePageExperience direction={direction} details={details} />

      <LeadSection />
    </>
  );
}

export function LeadSection() {
  return (
    <section className="ob-section ob-section--lead" id="lead">
      <div className="ob-container ob-lead ob-lead--premium">
        <div className="ob-lead__content">
          <span className="ob-kicker">Диагностика проекта</span>
          <h2>Разберём задачу и покажем, где система теряет деньги, время или управляемость</h2>
          <p>
            На первом контакте не продаём пакет работ. Смотрим контекст: CRM, сайт, 1С,
            коммуникации, роли, отчёты и ограничения. После этого предлагаем понятный
            следующий шаг.
          </p>
          <div className="ob-lead__proofs" aria-label="Что входит в первый разбор">
            <span>15-30 минут первичного разбора</span>
            <span>честные границы ответственности</span>
            <span>рекомендация по маршруту проекта</span>
          </div>
          <div className="ob-lead__contacts" aria-label="Контакты для связи">
            <a href={company.phoneHref}>
              <span>Телефон</span>
              <strong>{company.phone}</strong>
            </a>
            <a href={company.emailHref}>
              <span>E-mail</span>
              <strong>{company.email}</strong>
            </a>
          </div>
          <MessengerLinks className="ob-lead__messengers" />
        </div>
        <LeadFormPanel />
      </div>
    </section>
  );
}

const contactScenarios = [
  "внедрение и аудит Битрикс24",
  "сайты и каталоги на 1С-Битрикс",
  "интеграции 1С, CRM и сайта",
  "лицензии, продление и поддержка",
];

const contactOffices = [
  {
    city: "Тула",
    label: "Основной офис",
    address: "г. Тула, Красноармейский проспект, 7",
    note: "Встречи проводим по предварительной договоренности",
    coords: { lat: 54.1959222, lon: 37.6044318 },
  },
  {
    city: "Кимовск",
    label: "Почтовый адрес",
    address: "г. Кимовск, ул. Бессолова, д. 16, офис 425",
    note: "Сюда можно направлять почтовые отправления и документы",
    coords: { lat: 53.9691867, lon: 38.528019 },
  },
];

const contactRoutes = [
  {
    icon: ClipboardCheck,
    title: "Новая задача или аудит",
    text: "Опишите систему, цель и ограничения. Ответим, какой формат первого разбора подойдёт.",
  },
  {
    icon: MessageSquareText,
    title: "Вопрос по лицензиям",
    text: "Подскажем по тарифам, продлению, коробочным решениям и документам для оплаты.",
  },
  {
    icon: Route,
    title: "Встреча или документы",
    text: "Встречи согласуем в Туле. Почтовые отправления и документы принимаем по адресу в Кимовске.",
  },
];

const legalItems = [
  { label: "Юридический статус", value: "ИП Тужилкин А.П." },
  { label: "ИНН", value: "711501986455" },
  { label: "ОГРНИП", value: "311715403800278" },
  { label: "НДС", value: "работаем без НДС" },
  { label: "Документы", value: "договор, счёт-оферта, закрывающие документы" },
  { label: "ЭДО", value: "ID ЭДО предоставим по запросу" },
];

const contactFaq = [
  {
    question: "Как быстрее всего связаться с Ониксбит?",
    answer:
      "Для новой задачи лучше оставить заявку в форме на странице контактов. Если вопрос короткий, можно позвонить, написать на email или выбрать мессенджер.",
  },
  {
    question: "Можно ли обсудить проект удалённо?",
    answer:
      "Да. Большинство проектов по Битрикс24, 1С-Битрикс, 1С и интеграциям ведём удалённо: созвоны, постановка задач, документы и ЭДО.",
  },
  {
    question: "Куда отправлять документы?",
    answer:
      "Основной адрес компании находится в Туле. Почтовые отправления и документы можно направлять на адрес в Кимовске.",
  },
];

export function ContactsContent() {
  return (
    <>
      <section className="ob-contacts-hero ob-section">
        <div className="ob-container ob-contacts-hero__grid">
          <div className="ob-contacts-hero__content">
            <span className="ob-kicker">Контакты Ониксбит</span>
            <h1>Свяжитесь с Ониксбит по проекту, лицензиям или поддержке</h1>
            <p>
              Опишите задачу в форме, если нужно внедрение, интеграция или доработка. Для короткого вопроса
              позвоните, напишите на email или выберите удобный мессенджер.
            </p>
            <div className="ob-contacts-hero__quick" aria-label="Основные контакты">
              <a href={company.phoneHref}>
                <Phone size={18} aria-hidden="true" />
                <span>{company.phone}</span>
              </a>
              <a href={company.emailHref}>
                <Mail size={18} aria-hidden="true" />
                <span>{company.email}</span>
              </a>
            </div>
            <div className="ob-contacts-hero__scenarios" aria-label="С какими задачами обращаться">
              {contactScenarios.map((item) => (
                <span key={item}><CheckCircle2 size={16} /> {item}</span>
              ))}
            </div>
          </div>
          <LeadFormPanel id="contact-form" className="ob-lead-panel--contact ob-contacts-form" />
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-contact-command">
          <a className="ob-contact-command__phone" href={company.phoneHref}>
            <span>Основной телефон</span>
            <strong>{company.phone}</strong>
            <em>будни с 10:00 до 18:00</em>
            <Phone size={28} aria-hidden="true" />
          </a>

          <div className="ob-contact-command__stack" aria-label="Дополнительные каналы связи">
            <a className="ob-contact-mini ob-contact-mini--mail" href={company.emailHref}>
              <Mail size={20} aria-hidden="true" />
              <span>E-mail</span>
              <strong>{company.email}</strong>
              <em>заявки, документы и КП</em>
            </a>
            <a className="ob-contact-mini ob-contact-mini--direct" href={company.directPhoneHref}>
              <Phone size={20} aria-hidden="true" />
              <span>Прямой номер</span>
              <strong>{company.directPhone}</strong>
              <em>текущие вопросы и связь с основателем</em>
            </a>
          </div>

          <div className="ob-contact-command__messengers">
            <div>
              <span>Мессенджеры</span>
              <strong>Telegram, MAX, VK</strong>
              <p>Удобны для быстрых уточнений, согласований и связи по текущим проектам.</p>
            </div>
            <MessengerLinks className="ob-contact-messengers" />
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-contact-map-shell">
          <div className="ob-contact-map-shell__intro">
            <span className="ob-kicker">Адреса</span>
            <h2>Основной офис в Туле и почтовый адрес в Кимовске</h2>
            <p>
              Встречи проводим по предварительной договоренности в Туле. Почтовые отправления и документы
              направляйте в Кимовск. Оба адреса можно открыть в Яндекс.Картах.
            </p>
          </div>
          <ContactMapSwitcher offices={contactOffices} />
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-contact-route-flow">
          <div className="ob-contact-route-flow__head">
            <span className="ob-kicker">Маршрут обращения</span>
            <h2>Как выбрать канал связи</h2>
            <p>
              Для проектной задачи лучше отправить форму. Для срочного уточнения — позвонить или написать.
              Для счетов, договоров и закрывающих документов используйте email или ЭДО.
            </p>
          </div>
          <ol className="ob-contact-route-flow__list">
            {contactRoutes.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title}>
                  <span aria-hidden="true"><CheckCircle2 size={20} /></span>
                  <Icon size={22} aria-hidden="true" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-contact-proof-band">
          <span><Sparkles size={16} /> ответим по сути задачи</span>
          <span><ShieldCheck size={16} /> договор и закрывающие документы</span>
          <span><CalendarClock size={16} /> встреча или созвон по записи</span>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-contact-docs">
          <div className="ob-contact-docs__main">
            <span className="ob-kicker">Реквизиты</span>
            <h2>Документы, договоры и оплата для B2B-клиентов</h2>
            <p>
              Работаем официально: фиксируем состав работ, условия оплаты и закрывающие документы.
              Для типовых лицензий возможен счёт-оферта, для проектов — договор.
            </p>
            <div className="ob-contact-docs__badges" aria-label="Условия работы">
              <span><FileCheck2 size={16} /> работаем по договору</span>
              <span><ReceiptText size={16} /> возможны счета-оферты</span>
              <span><Building2 size={16} /> без НДС</span>
              <span><CalendarClock size={16} /> ЭДО по запросу</span>
            </div>
          </div>
          <div className="ob-contact-docs__grid">
            {legalItems.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-contact-faq">
          <div className="ob-contact-faq__intro">
            <span className="ob-kicker">Частые вопросы</span>
            <h2>Перед обращением</h2>
            <p>
              Ответы на вопросы, которые обычно появляются перед первой заявкой или встречей.
            </p>
          </div>
          <div className="ob-contact-faq__items">
            {contactFaq.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>
                  <HelpCircle size={20} aria-hidden="true" />
                  <span>{item.question}</span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--lead">
        <div className="ob-container ob-contact-final">
          <div className="ob-contact-final__content">
            <span className="ob-kicker">Следующий шаг</span>
            <h2>Начнём с короткого описания задачи</h2>
            <p>
              Напишите, какая система уже используется, что нужно связать или доработать и какой результат
              нужен бизнесу. Мы вернёмся с уточняющими вопросами и предложим следующий шаг.
            </p>
            <div className="ob-contact-final__actions" aria-label="Действия в конце страницы контактов">
              <a className="ob-contact-final__primary" href="#contact-form">
                <ClipboardCheck size={18} aria-hidden="true" /> Оставить заявку
              </a>
              <a className="ob-contact-final__secondary" href={company.phoneHref}>
                <Phone size={18} aria-hidden="true" /> Позвонить
              </a>
            </div>
          </div>

          <div className="ob-contact-final__channels">
            <span>Короткий вопрос?</span>
            <strong>Напишите в удобный канал</strong>
            <p>Мессенджеры подходят для быстрых уточнений. Документы, счета и реквизиты лучше отправлять на email.</p>
            <MessengerLinks className="ob-contact-final__messengers ob-contact-messengers" />
          </div>
        </div>
      </section>
    </>
  );
}
