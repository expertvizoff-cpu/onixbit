import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Boxes,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import {
  articles,
  cases,
  certificates,
  directions,
  proofItems,
  testimonials,
  type Direction,
} from "@/data/site";
import { ButtonLink, LeadButton } from "./Buttons";
import { BitrixPricingBlock } from "./BitrixPricingBlock";
import { InlineBitrixForm } from "./BitrixForms";
import { ProductScene } from "./ProductScene";

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
          title={full ? "Демо-кейсы для структуры страницы" : "Как будет выглядеть блок кейсов"}
          text="Пока здесь временные примеры для дизайна. После наполнения заменим названия, цифры и отзывы на реальные согласованные материалы."
        />
        <div className="ob-card-grid ob-card-grid--3">
          {cases.map((item) => (
            <article className="ob-case-card" key={item.title}>
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
          title="Блок отзывов пока собран как дизайн-макет"
        />
        <div className="ob-card-grid ob-card-grid--3">
          {testimonials.map((item) => (
            <article className="ob-testimonial" key={`${item.name}-${item.company}`}>
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
          title={full ? "База знаний Onixbit" : "Статьи, которые помогают выбрать решение"}
          text="Материалы будут работать как вход в экспертность: CRM, сайты, интеграции, обмены, лицензии и поддержка."
        />
        <div className="ob-card-grid ob-card-grid--3">
          {articles.map((article) => (
            <article className="ob-article-card" key={article.title}>
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
  return (
    <section className="ob-section ob-section--certificates">
      <div className="ob-container">
        <SectionIntro
          kicker="Сертификаты"
          title="Партнёрские статусы и компетенции"
          text="Здесь собраны ключевые статусы, которые подтверждают профиль Ониксбит: CRM, сайты, коммуникации и партнёрская поддержка по 1С. Реальные сканы сертификатов добавим в эти карточки отдельным слоем."
        />
        <div className="ob-card-grid ob-card-grid--certs">
          {certificates.map((item, index) => (
            <article className="ob-cert-card" key={item.title}>
              <div className="ob-cert-card__top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <BadgeCheck size={24} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
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
      <div className="ob-container ob-lead">
        <div>
          <span className="ob-kicker">Старт проекта</span>
          <h2>Расскажите, что нужно связать или улучшить</h2>
          <p>
            Можно начать с короткого описания задачи. Мы разберём контекст,
            предложим ближайший шаг и честно скажем, где нужна дополнительная
            экспертиза.
          </p>
        </div>
        <div className="ob-lead__form">
          <InlineBitrixForm />
        </div>
      </div>
    </section>
  );
}

export function ContactsContent() {
  return (
    <>
      <section className="ob-service-hero ob-section">
        <div className="ob-container ob-contact-grid">
          <div>
            <span className="ob-kicker">Контакты</span>
            <h1>Давайте обсудим проект без долгой анкеты</h1>
            <p>
              Опишите задачу в форме или напишите напрямую. Для сложных задач
              лучше сразу приложить краткое описание текущей системы.
            </p>
            <div className="ob-contact-cards">
              <a href="tel:+79202724828">+7 (920) 272-48-28</a>
              <a href="mailto:info@onixbit.ru">info@onixbit.ru</a>
            </div>
          </div>
          <div className="ob-lead__form ob-lead__form--contact">
            <InlineBitrixForm />
          </div>
        </div>
      </section>
      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-requisites">
          <Boxes size={28} />
          <div>
            <h2>Реквизиты и юридические данные</h2>
            <p>
              Добавим точные реквизиты компании перед публикацией, чтобы раздел
              контактов был готов для B2B-клиентов и договорной работы.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
