"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
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
    image: "/media/logos/bitrix24-logo-rus.svg",
    className: "ob-system-logo--b24 ob-system-logo--cloud",
  },
  {
    title: "1С-Битрикс",
    badge: "сайт",
    image: "/media/logos/1c-bitrix-logo-dark.svg",
    className: "ob-system-logo--bitrix",
  },
  {
    title: "1С:Предприятие",
    badge: "учёт",
    image: "/media/logos/1c-logo.svg",
    className: "ob-system-logo--onec",
  },
  {
    title: "BI-конструктор",
    badge: "аналитика",
    image: "/media/logos/power-bi-logo.svg",
    className: "ob-system-logo--bi",
  },
  {
    title: "AI-помощник",
    badge: "AI",
    image: "/media/logos/ai-logo.svg",
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
    flow: [
      { label: "Проверяем", value: "заявки и CRM", system: ecosystemItems[0] },
      { label: "Сверяем", value: "сайт, 1С и каналы" },
      { label: "Фиксируем", value: "карту процессов и ограничений" },
    ],
  },
  {
    icon: Route,
    title: "Архитектура",
    text: "Проектируем, где рождается заявка, кто её обрабатывает и какие данные уходят дальше.",
    result: "схема данных и ролей",
    flow: [
      { label: "Проектируем", value: "маршрут заявки" },
      { label: "Соединяем", value: "CRM, сайт и 1С" },
      { label: "Фиксируем", value: "схему данных и ролей" },
    ],
  },
  {
    icon: Settings2,
    title: "Внедрение",
    text: "Настраиваем CRM, сайт, обмены, права, роботов и контрольные точки для команды.",
    result: "готовые сценарии команды",
    flow: [
      { label: "Настраиваем", value: "воронки и права", system: ecosystemItems[0] },
      { label: "Подключаем", value: "формы, обмены, роботов" },
      { label: "Фиксируем", value: "готовые сценарии команды" },
    ],
  },
  {
    icon: BarChart3,
    title: "Развитие",
    text: "Добавляем отчёты, BI, AI-сценарии и улучшаем маршрут после запуска.",
    result: "план улучшений по данным",
    flow: [
      { label: "Собираем", value: "BI-отчёты", system: ecosystemItems[3] },
      { label: "Ускоряем", value: "AI-сценарии", system: ecosystemItems[4] },
      { label: "Фиксируем", value: "план улучшений по данным" },
    ],
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

const materialItems = [
  ...articles,
  {
    category: "Разборы",
    title: "Ответы на частые вопросы по интеграциям",
    text: "Короткие практические материалы о связке Битрикс24, сайта, 1С и отчётности: без воды, с примерами и ограничениями.",
    minutes: "скоро",
  },
  {
    category: "Видео",
    title: "Как руководителю принять CRM без хаоса",
    text: "Короткий формат о том, какие вопросы стоит задать до внедрения и как понять, что система действительно готова к работе.",
    minutes: "скоро",
  },
];

const materialShapes = [
  "ob-about-material--wide",
  "ob-about-material--round",
  "ob-about-material--tall",
  "ob-about-material--square",
  "ob-about-material--small",
];

const competencyRoutes = [
  {
    title: "Продажи\nи коммуникации",
    text: "Битрикс24 собирает обращения, 1С хранит данные, BI показывает качество обработки.",
    result: "Заявки\nне теряются\nмежду каналами",
    systems: [ecosystemItems[0], ecosystemItems[2], ecosystemItems[3]],
  },
  {
    title: "Сайт\nкак часть CRM",
    text: "Формы и корзина передают контекст в CRM, а учёт получает нужные данные.",
    result: "Сайт\nпередаёт заявки\nв CRM",
    systems: [ecosystemItems[1], ecosystemItems[2], ecosystemItems[0]],
  },
  {
    title: "Учёт\nи обмены",
    text: "Заказы, товары, клиенты и статусы уходят между системами без ручной рутины.",
    result: "Учёт\nсинхронизируется\nбез ручного переноса",
    systems: [ecosystemItems[2], ecosystemItems[0], ecosystemItems[1]],
  },
];

const directionAboutTitles = ["Внедрение\nБитрикс24", "Сайты на\n1С-Битрикс", "Работы по\n1С:Предприятие"];

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
        <strong>{item.badge}</strong>
      )}
    </span>
  );
}

export function AboutPageContent() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeMaterial, setActiveMaterial] = useState(0);
  const [activeCompetency, setActiveCompetency] = useState(0);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const work = workSteps[activeStep] ?? workSteps[0];
  const WorkIcon = work.icon;
  const material = materialItems[activeMaterial] ?? materialItems[0];
  const competency = competencyRoutes[activeCompetency] ?? competencyRoutes[0];

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
            <div className="ob-about-hero__orbit ob-about-hero__orbit--markers" aria-hidden="true" />
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
            kicker="Подход"
            title="Как мы снижаем риск внедрения для клиента"
            text="Этот блок про то, почему проект не превращается в хаос: сначала границы, потом архитектура, затем внедрение и понятная ответственность."
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
            <h2>Что будет происходить после заявки</h2>
            <p>
              Клиент заранее видит маршрут проекта: что проверяем, что проектируем,
              где внедряем и по каким признакам понятно, что этап завершён.
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
                  <span>Этап {String(activeStep + 1).padStart(2, "0")}</span>
                  <strong>{work.title}</strong>
                </div>
              </div>
              <p>{work.text}</p>
              <div className="ob-about-work__flow">
                {work.flow.map((card, index) => (
                  <Fragment key={card.label}>
                    <div>
                      <span>{card.label}</span>
                      {"system" in card && card.system ? <SystemLogo item={card.system} compact /> : null}
                      <strong>{card.value}</strong>
                    </div>
                    {index < work.flow.length - 1 ? <i aria-hidden="true" /> : null}
                  </Fragment>
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
            title="Где Ониксбит полезен B2B-команде"
            text="Мы сильнее всего там, где нужно связать продажи, сайт, учёт и аналитику в один понятный маршрут данных."
          />
          <div className="ob-about-competency-stage" aria-label="Практические зоны компетенций Ониксбит">
            <div className="ob-about-competency-tabs" role="tablist" aria-label="Зоны компетенций">
              {competencyRoutes.map((route, index) => (
                <button
                  className={index === activeCompetency ? "is-active" : ""}
                  type="button"
                  role="tab"
                  aria-selected={index === activeCompetency}
                  key={route.title}
                  onClick={() => setActiveCompetency(index)}
                  onMouseEnter={() => setActiveCompetency(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{route.title}</strong>
                </button>
              ))}
            </div>
            <div className="ob-about-competency-visual" aria-live="polite">
              <div className="ob-about-competency-visual__head">
                <span>{competency.title}</span>
                <h3>{competency.result}</h3>
                <p>{competency.text}</p>
              </div>
              <div className="ob-about-competency-flow">
                {competency.systems.map((item, index) => (
                  <div key={item.title}>
                    <SystemLogo item={item} compact />
                    <span>{item.title}</span>
                    {index < competency.systems.length - 1 ? <i aria-hidden="true" /> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="ob-card-grid ob-card-grid--3 ob-about-direction-grid">
            {directions.map((direction, index) => (
              <Link className="ob-direction-card" href={direction.href} key={direction.id}>
                <span>{direction.badge}</span>
                <strong>{directionAboutTitles[index] ?? direction.title}</strong>
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
            <div className="ob-about-cert-lite__stack">
              {certificatePreview.map((item, index) => (
                <article key={item.title} style={{ "--cert-index": index } as CSSProperties}>
                  <Image src={item.image} alt={item.title} width={360} height={250} />
                  <span>{item.title}</span>
                </article>
              ))}
            </div>
            <button className="ob-about-cert-lite__zoom" type="button" onClick={() => setIsCertificateOpen(true)}>
              <Image src="/media/certificates/Золотой партнёр Битрикс24.jpg" alt="Золотой партнёр Битрикс24" width={420} height={300} />
              <span>Открыть золотой статус крупно</span>
            </button>
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-about-materials">
          <SectionIntro
            kicker="Материалы"
            title="Материалы, которые покажут экспертизу на практике"
            text="Здесь будут статьи, видео и короткие разборы: как выбирать CRM-логику, где ломаются обмены, что проверять в сайтах и как готовиться к внедрению."
          />
          <div className="ob-about-materials__grid">
            <div className="ob-about-materials__cards">
              {materialItems.map((article, index) => (
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

      {isCertificateOpen ? (
        <div className="ob-about-cert-modal" role="dialog" aria-modal="true" aria-label="Золотой партнёр Битрикс24">
          <button className="ob-about-cert-modal__close" type="button" onClick={() => setIsCertificateOpen(false)} aria-label="Закрыть сертификат">
            ×
          </button>
          <div className="ob-about-cert-modal__card">
            <Image src="/media/certificates/Золотой партнёр Битрикс24.jpg" alt="Золотой партнёр Битрикс24" width={1100} height={760} />
          </div>
        </div>
      ) : null}

      <LeadSection />
    </>
  );
}
