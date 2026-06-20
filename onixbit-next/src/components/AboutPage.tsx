"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  ContactRound,
  Download,
  FileText,
  Handshake,
  Mail,
  Network,
  Route,
  SearchCheck,
  Settings2,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { articles, company, directions } from "@/data/site";
import { LeadButton } from "./Buttons";
import { MessengerLinks } from "./Messengers";
import { LeadSection, SectionIntro } from "./Sections";

const founderFacts = [
  { icon: BriefcaseBusiness, value: "14 лет", label: "опыт" },
  { icon: Building2, value: "B2B", label: "фокус" },
  { icon: Award, value: "Gold", label: "статусы" },
];

const workStepDuration = 5600;

const ecosystemItems = [
  {
    title: "Битрикс24",
    badge: "CRM",
    image: "/media/logos/bitrix24-logo.svg",
    className: "ob-system-logo--b24 ob-system-logo--cloud",
  },
  {
    title: "1С-Битрикс",
    badge: "сайт",
    image: "/media/logos/1c-bitrix-logo.svg",
    className: "ob-system-logo--bitrix",
  },
  {
    title: "1С:Предприятие",
    badge: "учёт",
    image: "/media/logos/1c-logo-small.svg",
    className: "ob-system-logo--onec",
  },
  {
    title: "BI-конструктор",
    badge: "аналитика",
    image: null,
    mark: "BI",
    className: "ob-system-logo--bi",
  },
  {
    title: "AI-помощник",
    badge: "AI",
    image: null,
    mark: "AI",
    className: "ob-system-logo--ai",
  },
];

const positionTeasers = [
  {
    icon: Network,
    title: "Смотрим на систему целиком",
    text: "CRM, сайт, 1С и отчёты должны работать как один маршрут заявки.",
  },
  {
    icon: ShieldCheck,
    title: "Фиксируем границы проекта",
    text: "Честно отделяем интеграции от задач, где нужна отдельная 1С-экспертиза.",
  },
  {
    icon: UserRoundCheck,
    title: "Держим управляемость",
    text: "Роли, сроки, ответственность и следующий шаг понятны до старта работ.",
  },
];

const workSteps = [
  {
    icon: SearchCheck,
    title: "Диагностика",
    text: "Смотрим текущие заявки, CRM, сайт, 1С, коммуникации и ручные операции.",
    result: "карта процессов и ограничений",
    systems: ["Битрикс24", "сайт", "1С"],
  },
  {
    icon: Route,
    title: "Архитектура",
    text: "Проектируем, где рождается заявка, кто её обрабатывает и какие данные уходят дальше.",
    result: "схема связки систем",
    systems: ["Битрикс24", "1С-Битрикс", "1С"],
  },
  {
    icon: Settings2,
    title: "Внедрение",
    text: "Настраиваем CRM, сайт, обмены, права, роботов и контрольные точки для команды.",
    result: "рабочая система вместо набора настроек",
    systems: ["CRM", "API", "обмены"],
  },
  {
    icon: BarChart3,
    title: "Развитие",
    text: "Добавляем отчёты, BI, AI-сценарии и улучшаем маршрут после запуска.",
    result: "управляемые улучшения по данным",
    systems: ["BI", "AI", "отчёты"],
  },
];

const publicFormats = [
  {
    icon: BookOpen,
    title: "Статьи от первого лица",
    text: "Практические материалы про CRM, сайты, обмены и ошибки внедрения.",
  },
  {
    icon: FileText,
    title: "Кейсы и разборы",
    text: "Задача, решение, ограничения и результат без выдуманных логотипов.",
  },
  {
    icon: Handshake,
    title: "Отзывы и встречи",
    text: "Публикуем только согласованные материалы с реальными клиентами.",
  },
];

const legalItems = [
  { label: "Юридический статус", value: "ИП Тужилкин А.П." },
  { label: "Документы", value: "договор, счёт-оферта, закрывающие документы" },
  { label: "ИНН", value: "711501986455" },
  { label: "ОГРНИП", value: "311715403800278" },
  { label: "ЭДО СБИС", value: "2BEf4772b9db7964211b7013a56fb14b87f" },
  { label: "ЭДО ТОЧКА", value: "2MH0d4cc0a6fe5a11ee8a420242ac110002" },
];

const certificatePreview = [
  {
    title: "Золотой партнёр Битрикс24",
    image: "/media/certificates/Золотой партнёр Битрикс24.jpg",
  },
  {
    title: "Компетенция CRM",
    image: "/media/certificates/Компетенция CRM.jpg",
  },
  {
    title: "Интеграция с 1С",
    image: "/media/certificates/Компетенция Интеграция с 1С.jpg",
  },
];

const materialShapes = ["ob-about-material--wide", "ob-about-material--round", "ob-about-material--tall"];

const directionLogoSets = [
  [ecosystemItems[0], ecosystemItems[2], ecosystemItems[3]],
  [ecosystemItems[1], ecosystemItems[2], ecosystemItems[0]],
  [ecosystemItems[2], ecosystemItems[0], ecosystemItems[1]],
];

function SystemLogo({ item, compact = false }: { item: (typeof ecosystemItems)[number]; compact?: boolean }) {
  return (
    <span className={["ob-system-logo", item.className, compact ? "ob-system-logo--compact" : ""].filter(Boolean).join(" ")}>
      {item.image ? (
        <Image src={item.image} alt={item.title} width={compact ? 90 : 132} height={compact ? 34 : 46} />
      ) : (
        <strong>{item.mark}</strong>
      )}
    </span>
  );
}

export function AboutPageContent() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeMaterial, setActiveMaterial] = useState(0);
  const work = workSteps[activeStep] ?? workSteps[0];
  const WorkIcon = work.icon;
  const material = articles[activeMaterial] ?? articles[0];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveStep((value) => (value + 1) % workSteps.length);
    }, workStepDuration);

    return () => window.clearTimeout(timer);
  }, [activeStep]);

  return (
    <>
      <section className="ob-about-hero ob-section">
        <div className="ob-container ob-about-hero__grid">
          <div className="ob-about-hero__content">
            <span className="ob-kicker">О компании</span>
            <h1 className="ob-about-hero__title">
              <span>Ониксбит — интегратор</span>
              <span>Битрикс24, сайтов</span>
              <span>и 1С-интеграций</span>
            </h1>
            <p>
              Меня зовут Александр Тужилкин. Я основатель Ониксбит и эксперт по
              Битрикс24, сайтам на 1С-Битрикс и интеграциям с 1С. Помогаю B2B-компаниям
              связывать продажи, сайт, учёт и коммуникации в рабочую систему.
            </p>
            <div className="ob-actions">
              <LeadButton>Обсудить проект</LeadButton>
              <a
                className="ob-btn ob-btn--secondary"
                href="mailto:expert@onixbit.ru?subject=%D0%9B%D0%B8%D1%87%D0%BD%D0%BE%D0%B5%20%D0%BE%D0%B1%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20%D0%9E%D0%BD%D0%B8%D0%BA%D1%81%D0%B1%D0%B8%D1%82"
              >
                <span>Написать лично</span>
                <Mail size={18} aria-hidden="true" />
              </a>
            </div>
            <MessengerLinks className="ob-about-hero__messengers" />
            <div className="ob-about-hero__facts" aria-label="Факты об Ониксбит">
              {founderFacts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <div key={fact.label}>
                    <Icon size={23} aria-hidden="true" />
                    <strong>{fact.value}</strong>
                    <span>{fact.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="ob-about-hero__visual" aria-label="Александр Тужилкин и экосистема Ониксбит">
            <div className="ob-about-hero__orbit" aria-hidden="true">
              {ecosystemItems.map((item) => (
                <span key={item.title}>
                  <SystemLogo item={item} compact />
                  <em>{item.badge}</em>
                </span>
              ))}
            </div>
            <div className="ob-about-hero__portrait">
              <Image
                src="/media/team/founder-alexander-site.webp"
                alt="Александр Тужилкин, основатель Ониксбит"
                width={900}
                height={900}
                priority
              />
            </div>
            <div className="ob-about-hero__badge ob-about-hero__badge--top">
              <Award size={18} aria-hidden="true" />
              <span>Статусы и сертификаты</span>
            </div>
            <div className="ob-about-hero__badge ob-about-hero__badge--bottom">
              <BriefcaseBusiness size={18} aria-hidden="true" />
              <span>Личный разбор B2B-задач</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container">
          <SectionIntro
            kicker="Принципы"
            title="Не набор услуг, а управляемая система для продаж и учёта"
          />
          <div className="ob-about-teasers">
            {positionTeasers.map((card) => {
              const Icon = card.icon;
              return (
                <article className="ob-about-teaser" key={card.title}>
                  <Icon size={30} aria-hidden="true" />
                  <strong>{card.title}</strong>
                  <p>{card.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ob-section">
        <div className="ob-container ob-about-work">
          <div className="ob-about-work__intro">
            <span className="ob-kicker">Как устроена работа</span>
            <h2>От диагностики до развития: понятный маршрут проекта</h2>
            <p>
              Мы не начинаем с разработки вслепую. Сначала собираем контекст, затем
              проектируем связку систем и только после этого внедряем настройки, обмены и отчёты.
            </p>
          </div>
          <div className="ob-about-work__panel">
            <div className="ob-about-work__steps" role="tablist" aria-label="Этапы работы">
              {workSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <button
                    className={index === activeStep ? "is-active" : ""}
                    type="button"
                    role="tab"
                    aria-selected={index === activeStep}
                    key={step.title}
                    onClick={() => setActiveStep(index)}
                    onMouseEnter={() => setActiveStep(index)}
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span>{step.title}</span>
                    <i aria-hidden="true" />
                  </button>
                );
              })}
            </div>
            <div className="ob-about-work__screen" aria-live="polite">
              <div className="ob-about-work__screen-head">
                <WorkIcon size={28} aria-hidden="true" />
                <div>
                  <span>{String(activeStep + 1).padStart(2, "0")}</span>
                  <strong>{work.title}</strong>
                </div>
              </div>
              <p>{work.text}</p>
              <div className="ob-about-work__systems">
                {work.systems.map((system) => (
                  <em key={system}>{system}</em>
                ))}
              </div>
              <div className="ob-about-work__result">
                <ClipboardCheck size={20} aria-hidden="true" />
                <span>{work.result}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-about-competencies">
          <SectionIntro
            kicker="Компетенции"
            title="Три направления связаны между собой, а не живут отдельно"
            text="Клиент видит один маршрут: заявка приходит с сайта, обрабатывается в CRM, данные синхронизируются с 1С, а руководитель получает отчётность."
          />
          <div className="ob-about-link-map" aria-label="Связка систем Ониксбит">
            <div className="ob-about-link-map__center">
              <Image src="/brand/onixbit-mark.png" alt="" width={86} height={86} />
              <strong>Ониксбит</strong>
              <span>единая архитектура</span>
            </div>
            <div className="ob-about-link-map__nodes">
              {ecosystemItems.map((item) => (
                <div className="ob-about-link-map__node" key={item.title}>
                  <SystemLogo item={item} compact />
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ob-card-grid ob-card-grid--3 ob-about-direction-grid">
            {directions.map((direction, index) => (
              <Link className="ob-direction-card" href={direction.href} key={direction.id}>
                <span>{direction.badge}</span>
                <strong>{direction.title}</strong>
                <p>{direction.description}</p>
                <div className="ob-about-direction-card__logos" aria-hidden="true">
                  {(directionLogoSets[index] ?? []).map((item) => (
                    <SystemLogo item={item} compact key={item.title} />
                  ))}
                </div>
                <em>
                  Подробнее <ArrowRight size={16} aria-hidden="true" />
                </em>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-about-public">
          <div>
            <span className="ob-kicker">Публичная экспертность</span>
            <h2>Экспертность Ониксбит без случайной витрины</h2>
            <p>
              Статьи, видео и разборы будут развивать доверие вокруг реального опыта:
              сначала личная позиция, затем подтверждённые кейсы, отзывы и фото с заказчиками.
            </p>
          </div>
          <div className="ob-about-public__grid">
            {publicFormats.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title}>
                  <Icon size={24} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-about-cert-lite">
          <div className="ob-about-cert-lite__content">
            <span className="ob-kicker">Сертификаты</span>
            <h2>Статусы и компетенции, которые подтверждают опыт</h2>
            <p>
              На странице сертификатов можно открыть документы крупнее и посмотреть,
              какую компетенцию подтверждает каждый статус.
            </p>
            <Link className="ob-btn ob-btn--primary" href="/certificates">
              <span>Смотреть сертификаты</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="ob-about-cert-lite__visual">
            <article className="ob-about-cert-lite__open">
              <Image src="/media/certificates/Золотой партнёр Битрикс24.jpg" alt="Золотой партнёр Битрикс24" width={520} height={360} />
              <span>Золотой партнёр Битрикс24</span>
            </article>
            <div className="ob-about-cert-lite__stack">
              {certificatePreview.slice(1).map((item, index) => (
                <article key={item.title} style={{ "--cert-index": index } as CSSProperties}>
                  <Image src={item.image} alt={item.title} width={320} height={220} />
                  <span>{item.title}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-about-materials">
          <SectionIntro
            kicker="Материалы"
            title="Редакционный план экспертных материалов"
            text="Наведите или нажмите на карточку: темы будут превращаться в статьи, видео и практические чек-листы."
          />
          <div className="ob-about-materials__grid">
            <div className="ob-about-materials__cards">
              {articles.map((article, index) => (
                <button
                  className={["ob-about-material", materialShapes[index % materialShapes.length], index === activeMaterial ? "is-active" : ""].join(" ")}
                  type="button"
                  key={article.title}
                  onClick={() => setActiveMaterial(index)}
                  onMouseEnter={() => setActiveMaterial(index)}
                >
                  <span>{article.category}</span>
                  <strong>{article.title}</strong>
                  <em>{article.minutes}</em>
                </button>
              ))}
            </div>
            <div className="ob-about-materials__preview" aria-live="polite">
              <BookOpen size={28} aria-hidden="true" />
              <span>{material.category}</span>
              <h3>{material.title}</h3>
              <p>{material.text}</p>
              <i>готовим</i>
            </div>
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-about-requisites">
          <div className="ob-about-requisites__content">
            <span className="ob-kicker">Реквизиты</span>
            <h2>Документы и контакты для закупки, договора или счёта</h2>
            <p>
              Работаем официально: договор, счёт-оферта, закрывающие документы и ЭДО.
              Для закупки можно скачать карточку компании или сохранить контакт.
            </p>
            <div className="ob-about-requisites__actions">
              <a className="ob-btn ob-btn--primary" href="/docs/onixbit-company-card.pdf" download>
                <span>Скачать карточку PDF</span>
                <Download size={18} aria-hidden="true" />
              </a>
              <a className="ob-btn ob-btn--secondary" href="/docs/onixbit-contact.vcf" download>
                <span>Сохранить контакт</span>
                <ContactRound size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="ob-about-requisites__grid">
            {legalItems.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
            <div>
              <span>Телефон</span>
              <strong>{company.phone}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{company.email}</strong>
            </div>
          </div>
        </div>
      </section>

      <LeadSection />
    </>
  );
}
