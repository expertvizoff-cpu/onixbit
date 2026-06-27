import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  HelpCircle,
  Mail,
  MessageSquareText,
  Phone,
  ReceiptText,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  articles,
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
    <section className="ob-section ob-home-directions">
      <div className="ob-container">
        <SectionIntro
          kicker="Направления"
          title="Три компетенции в одной системе"
          text="Главная ценность не в отдельных настройках, а в связке: CRM получает заявки, сайт продаёт, учётная система отдаёт данные без ручной суеты."
        />
        <div className="ob-home-directions__grid">
          {directions.map((direction, index) => (
            <Link
              className={"ob-direction-card ob-home-direction-tile" + (index === 0 ? " is-featured" : "")}
              href={direction.href}
              key={direction.id}
            >
              <span>{direction.shortTitle}</span>
              <strong>{direction.title}</strong>
              <p>{direction.description}</p>
              <div className="ob-home-direction-tile__scope" aria-label="Что входит">
                {direction.scope.slice(0, 3).map((item) => (
                  <b key={item}>{item}</b>
                ))}
              </div>
              <em>
                Смотреть направление
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
            <article className={"ob-case-card ob-home-case-card" + (index === 0 ? " is-featured" : "")} key={item.title}>
              <span>{item.sector}</span>
              <h3>{item.title}</h3>
              <p>{item.result}</p>
              <div>
                {item.tags.map((tag) => (
                  <em key={tag}>{tag}</em>
                ))}
              </div>
            </article>
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
            <article className={"ob-article-card ob-home-article-card" + (index === 0 ? " is-featured" : "")} key={article.title}>
              <div>
                <BookOpen size={18} aria-hidden="true" />
                <span>{article.category}</span>
                <em>{article.minutes}</em>
              </div>
              <h3>{article.title}</h3>
              <p>{article.text}</p>
            </article>
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

export function ServicePage({ direction }: { direction: Direction }) {
  return (
    <>
      <section className="ob-service-hero ob-section">
        <div className="ob-container ob-service-hero__grid">
          <div>
            <span className="ob-kicker">{direction.badge}</span>
            <h1>{direction.headline}</h1>
            <p>{direction.description}</p>
            <div className="ob-actions">
              <LeadButton>{direction.cta}</LeadButton>
              <a className="ob-btn ob-btn--secondary" href="#scope">
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

      <section className="ob-section ob-section--tight" id="scope">
        <div className="ob-container ob-split">
          <div>
            <SectionIntro
              kicker="Зона работ"
              title="Что берём в работу"
              text="Без размытого «сделаем всё». Фиксируем понятную область ответственности и показываем, где нужна партнёрская экспертиза."
            />
          </div>
          <div className="ob-check-list">
            {direction.scope.map((item) => (
              <div key={item}>
                <CheckCircle2 size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ob-section">
        <div className="ob-container">
          <SectionIntro
            kicker="Процесс"
            title="Как движется проект"
            text="Делаем так, чтобы решение можно было объяснить команде, развивать и поддерживать после запуска."
          />
          <div className="ob-card-grid ob-card-grid--4">
            {direction.process.map((step, index) => (
              <article className="ob-process-card" key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-integrations">
          <div>
            <ShieldCheck size={28} />
            <h2>Интеграции и партнёрства</h2>
            <p>
              Подключаем нужные сервисы без лишней витрины технологий. Важен
              рабочий сценарий, данные и ответственность за поддержку.
            </p>
          </div>
          <div>
            {direction.integrations.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

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
            {contactRoutes.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={item.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
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
