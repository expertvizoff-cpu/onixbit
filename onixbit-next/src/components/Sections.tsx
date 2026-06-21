import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  ShieldCheck,
  UserRoundCheck,
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

export function ProofStrip() {
  return (
    <section className="ob-section ob-section--tight">
      <div className="ob-container ob-proof">
        {proofItems.map((item) => (
          <div className="ob-proof__item" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
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
      title: "Сначала процесс",
      text: "Разбираем роли, данные, статусы, ограничения и ожидания руководителя.",
    },
    {
      title: "Потом интерфейс",
      text: "Проектируем страницы, CRM-воронки и обмены так, чтобы ими пользовались.",
    },
    {
      title: "Затем внедрение",
      text: "Собираем решение, тестируем сценарии, обучаем и оставляем понятный регламент.",
    },
  ];

  return (
    <section className="ob-section">
      <div className="ob-container ob-split">
        <div>
          <SectionIntro
            kicker="Подход"
            title="Не продаём хаотичную разработку"
            text="Мы держим в фокусе бизнес-цель, а не количество экранов и настроек. Поэтому сайт, CRM и обмены проектируются как одна операционная система."
          />
          <div className="ob-actions">
            <LeadButton>Получить экспресс-аудит</LeadButton>
          </div>
        </div>
        <div className="ob-process-list">
          {steps.map((step, index) => (
            <article className="ob-process-item" key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CasesPreview({ full = false }: { full?: boolean }) {
  return (
    <section className="ob-section">
      <div className="ob-container">
        <SectionIntro
          kicker="Кейсы"
          title={full ? "Кейсы готовятся к публикации" : "Скоро здесь будут реальные разборы проектов"}
          text="Не выдаём выдуманные логотипы за опыт. Готовим публичные материалы с понятной задачей, решением, ограничениями и пользой для бизнеса."
        />
        <div className="ob-card-grid ob-card-grid--3">
          {cases.map((item) => (
            <article className="ob-case-card ob-case-card--soon" key={item.title}>
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
    <section className="ob-section">
      <div className="ob-container">
        <SectionIntro
          kicker="Статьи"
          title={full ? "Готовим базу знаний Ониксбит" : "Скоро: статьи от лица основателя"}
          text="Собираем материалы без пустого копирайтинга: CRM, сайты, интеграции, обмены, лицензии и поддержка простым языком для руководителей."
        />
        <div className="ob-card-grid ob-card-grid--3">
          {articles.map((article) => (
            <article className="ob-article-card ob-article-card--soon" key={article.title}>
              <div>
                <BookOpen size={18} />
                <span>{article.category}</span>
                <em>{article.minutes}</em>
              </div>
              <h3>{article.title}</h3>
              <p>{article.text}</p>
            </article>
          ))}
        </div>
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
  "внедрение или аудит Битрикс24",
  "сайт, каталог или интернет-магазин на 1С-Битрикс",
  "интеграция 1С, CRM и сайта",
  "лицензии, продление и коробочные решения",
];

const contactOffices = [
  {
    city: "Тула",
    label: "Основной офис",
    address: "г. Тула, Красноармейский проспект, 7",
    note: "Встречи по предварительной договоренности",
    mapQuery: "Россия, Тула, Красноармейский проспект, 7",
  },
  {
    city: "Кимовск",
    label: "Рабочий офис",
    address: "г. Кимовск, ул. Бессолова, д. 16, офис 425",
    note: "Документы и рабочие встречи по записи",
    mapQuery: "Россия, Тульская область, Кимовск, улица Бессолова, 16",
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

const contactMapUrl = (query: string) =>
  `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(query)}&z=16`;

const yandexRouteUrl = (query: string) =>
  `https://yandex.ru/maps/?text=${encodeURIComponent(query)}`;

export function ContactsContent() {
  return (
    <>
      <section className="ob-contacts-hero ob-section">
        <div className="ob-container ob-contacts-hero__grid">
          <div className="ob-contacts-hero__content">
            <span className="ob-kicker">Контакты Ониксбит</span>
            <h1>Обсудим проект, интеграцию или лицензии без лишней анкеты</h1>
            <p>
              Напишите в форму, позвоните или выберите удобный мессенджер. Для сложной
              задачи достаточно коротко описать текущую систему, цель и ограничения.
            </p>
            <div className="ob-contacts-hero__scenarios" aria-label="С какими задачами обращаться">
              {contactScenarios.map((item) => (
                <span key={item}><CheckCircle2 size={16} /> {item}</span>
              ))}
            </div>
          </div>
          <LeadFormPanel className="ob-lead-panel--contact ob-contacts-form" />
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-contacts-direct">
          <div className="ob-contacts-direct__intro">
            <span className="ob-kicker">Быстрая связь</span>
            <h2>Куда написать, если нужно быстро понять следующий шаг</h2>
            <p>
              Основной канал для заявок — форма Битрикс24. Для текущих вопросов можно
              написать напрямую: менеджер или специалист поддержки вернётся с ответом.
            </p>
          </div>
          <div className="ob-contacts-direct__cards">
            <a href={company.phoneHref} className="ob-contact-card">
              <Phone size={22} />
              <span>Телефон</span>
              <strong>{company.phone}</strong>
              <em>будни с 10:00 до 18:00</em>
            </a>
            <a href={company.emailHref} className="ob-contact-card">
              <Mail size={22} />
              <span>E-mail</span>
              <strong>{company.email}</strong>
              <em>для заявок, документов и КП</em>
            </a>
            <div className="ob-contact-card ob-contact-card--messengers">
              <UserRoundCheck size={22} />
              <span>Мессенджеры</span>
              <strong>Telegram, MAX, VK</strong>
              <MessengerLinks className="ob-contact-messengers" />
            </div>
            <div className="ob-contact-card">
              <Clock3 size={22} />
              <span>Поддержка</span>
              <strong>Гибкий график</strong>
              <em>по согласованному регламенту проекта</em>
            </div>
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-offices">
          <div className="ob-section-intro ob-offices__intro">
            <span className="ob-kicker">Офисы</span>
            <h2>Работаем с клиентами по всей России, офисы — в Тульской области</h2>
            <p>
              Большинство задач ведём удалённо: созвоны, Битрикс24, документы и ЭДО.
              Очные встречи лучше согласовать заранее, чтобы подготовить нужного специалиста.
            </p>
          </div>
          <div className="ob-offices__grid">
            {contactOffices.map((office) => (
              <article className="ob-office-card" key={office.city}>
                <div className="ob-office-card__map">
                  <iframe
                    title={`Яндекс.Карта: ${office.address}`}
                    src={contactMapUrl(office.mapQuery)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="ob-office-pin">
                    <MapPin size={18} />
                    <span>{office.city}</span>
                  </div>
                </div>
                <div className="ob-office-card__body">
                  <span>{office.label}</span>
                  <h3>{office.city}</h3>
                  <p>{office.address}</p>
                  <em>{office.note}</em>
                  <a href={yandexRouteUrl(office.mapQuery)} target="_blank" rel="noreferrer">
                    Открыть в Яндекс.Картах <ArrowUpRight size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-contact-docs">
          <div className="ob-contact-docs__main">
            <span className="ob-kicker">Реквизиты</span>
            <h2>Документы, договоры и оплата для B2B-клиентов</h2>
            <p>
              Работаем официально: фиксируем состав работ, условия оплаты и закрывающие
              документы. Для типовых лицензий возможен счёт-оферта, для проектов — договор.
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

      <section className="ob-section ob-section--lead">
        <div className="ob-container ob-contact-person">
          <div className="ob-contact-person__photo">
            <Image
              src="/media/team/founder-alexander-site.webp"
              alt="Александр Тужилкин, основатель Ониксбит"
              width={720}
              height={720}
              sizes="(max-width: 760px) 100vw, 360px"
            />
          </div>
          <div className="ob-contact-person__content">
            <span className="ob-kicker">Личный контакт</span>
            <h2>Александр Тужилкин</h2>
            <p>
              Основатель Ониксбит и эксперт по Битрикс24/интеграциям с 1С. 14 лет
              помогаю B2B-компаниям связывать CRM, сайт и учётные системы в управляемую
              инфраструктуру без лишнего шума и случайных решений.
            </p>
            <div className="ob-contact-person__role">
              <strong>Когда писать лично</strong>
              <span>Если задача сложная, нужна интеграция Битрикс24 с 1С или сайтом, либо важно быстро понять реалистичный маршрут проекта.</span>
            </div>
            <a
              className="ob-btn ob-btn--primary ob-contact-person__button"
              href="mailto:expert@onixbit.ru?subject=%D0%9B%D0%B8%D1%87%D0%BD%D0%BE%D0%B5%20%D0%BE%D0%B1%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20%D0%9E%D0%BD%D0%B8%D0%BA%D1%81%D0%B1%D0%B8%D1%82"
            >
              <span>Написать лично</span>
              <Mail size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
