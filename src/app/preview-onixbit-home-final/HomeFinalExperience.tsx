import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  DatabaseZap,
  FileSearch,
  Gauge,
  MessageCircle,
  MousePointerClick,
  Phone,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { company } from "@/data/site";
import {
  diagnosisDeliverables,
  heroCopy,
  mockDataDictionary,
  routeSteps,
  serviceMap,
} from "./data";
import { ExperienceCockpit, ExperienceDiagnosis } from "./HomeFinalExperienceInteractive";
import styles from "./home-final-experience.module.css";

const brandSignals = [
  "Битрикс24",
  "1С-Битрикс",
  "1С",
  "Wazzup / WhatsApp",
] as const;

const painMap = [
  {
    title: "Заявка пришла, но никто не отвечает",
    text: "Форма, чат или мессенджер не связаны с CRM, а срок первого действия не контролируется.",
    icon: MessageCircle,
  },
  {
    title: "CRM есть, управления нет",
    text: "Сделки хранятся, но ответственный, задача и следующий шаг не становятся обязательной частью процесса.",
    icon: Workflow,
  },
  {
    title: "Сайт, CRM и 1С спорят между собой",
    text: "Статусы, счета и документы живут в разных местах, а ошибка обмена всплывает слишком поздно.",
    icon: DatabaseZap,
  },
] as const;

const proofLine = [
  "14 лет интеграционной практики",
  "официальные партнёрские направления",
  "без фейковых кейсов и боевых секретов в preview",
] as const;

const routeIconMap = {
  source: MousePointerClick,
  crm: Workflow,
  owner: BadgeCheck,
  sla: Gauge,
  exchange: DatabaseZap,
  control: FileSearch,
} as const;

export function HomeFinalExperience() {
  return (
    <div className={styles.page}>
      <section className={styles.heroShell} id="top" aria-labelledby="home-final-title">
        <Image
          className={styles.heroImage}
          src="/media/home/onixbit-robot-dashboard-scene.png"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.heroVeil} aria-hidden="true" />

        <header className={styles.header} aria-label="Навигация Onixbit preview">
          <a className={styles.logoLink} href="#top" aria-label="Onixbit">
            <Image
              src="/brand/onixbit-lockup-inverse-white-444x110.svg"
              alt="Onixbit"
              width={222}
              height={55}
              priority
            />
          </a>
          <nav className={styles.nav} aria-label="Основные разделы">
            <a href="#route">Маршрут</a>
            <a href="#services">Что собираем</a>
            <a href="#diagnosis">Диагностика</a>
          </nav>
          <div className={styles.headerActions}>
            <a className={styles.phoneLink} href={company.phoneHref}>
              <Phone size={16} aria-hidden="true" />
              <span>{company.phone}</span>
            </a>
            <a className={styles.headerCta} href="#diagnosis">
              {heroCopy.primaryCta}
            </a>
          </div>
        </header>

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <div className={styles.signalRow}>
              {brandSignals.map((signal) => (
                <span key={signal}>{signal}</span>
              ))}
            </div>
            <span className={styles.eyebrow}>Onixbit собирает маршрут продаж</span>
            <h1 id="home-final-title">{heroCopy.h1}</h1>
            <p>{heroCopy.subcopy}</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#diagnosis">
                <span>{heroCopy.primaryCta}</span>
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className={styles.secondaryAction} href="#route">
                Посмотреть живой маршрут
              </a>
            </div>
            <div className={styles.proofLine} aria-label="Почему можно доверять">
              {proofLine.map((item) => (
                <span key={item}>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <ExperienceCockpit />
        </div>

        <div className={styles.foldHint} aria-hidden="true">
          <span>ниже: где ломается цепочка и что с этим делать</span>
        </div>
      </section>

      <main className={styles.main}>
        <section className={styles.painSection} aria-labelledby="pain-title">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>не сайт ради сайта</span>
            <h2 id="pain-title">Главная должна показать движение заявки, а не каталог услуг</h2>
            <p>
              Поэтому первый экран работает как демонстрация процесса: человек видит мессенджер,
              сайт, CRM, задачу, 1С и контроль в одной сцене.
            </p>
          </div>
          <div className={styles.painGrid}>
            {painMap.map((item) => {
              const PainIcon = item.icon;

              return (
                <article className={styles.painCard} key={item.title}>
                  <PainIcon size={22} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.routeSection} id="route" aria-labelledby="route-title">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>маршрут вместо таблицы</span>
            <h2 id="route-title">Каждый узел отвечает за понятный бизнес-результат</h2>
          </div>
          <div className={styles.routeTimeline}>
            {routeSteps.map((step, index) => {
              const StepIcon = routeIconMap[step.id];

              return (
                <article className={styles.routeStepCard} key={step.id}>
                  <div className={styles.routeStepNumber}>{String(index + 1).padStart(2, "0")}</div>
                  <StepIcon size={21} aria-hidden="true" />
                  <h3>{step.label}</h3>
                  <p>{step.promise}</p>
                  <span>{step.system}</span>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.servicesSection} id="services" aria-labelledby="services-title">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>что собираем</span>
            <h2 id="services-title">Услуги становятся частями одной системы</h2>
            <p>
              На главной это важно показать сразу: Onixbit не продаёт отдельную “настройку”, а
              соединяет участок процесса с остальными.
            </p>
          </div>
          <div className={styles.serviceGrid}>
            {serviceMap.map((service) => (
              <article className={styles.serviceCard} key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className={styles.tagRow}>
                  {service.nodes.map((node) => {
                    const step = routeSteps.find((item) => item.id === node);
                    return <span key={node}>{step?.shortLabel ?? node}</span>;
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>

        <ExperienceDiagnosis />

        <section className={styles.deliverablesSection} aria-labelledby="deliverables-title">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>результат диагностики</span>
            <h2 id="deliverables-title">Что получает клиент после первого разбора</h2>
          </div>
          <div className={styles.deliverableGrid}>
            {diagnosisDeliverables.map((item) => (
              <article className={styles.deliverableCard} key={item}>
                <ShieldCheck size={19} aria-hidden="true" />
                <p>{item}</p>
              </article>
            ))}
          </div>
          <div className={styles.mockDictionary}>
            <span className={styles.eyebrow}>safe mock-data dictionary</span>
            {mockDataDictionary.map((item) => (
              <p key={item.key}>
                <code>{item.key}</code>
                <span>{item.safeExample}</span>
              </p>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
