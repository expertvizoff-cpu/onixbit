import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  DatabaseZap,
  Phone,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { company } from "@/data/site";
import { diagnosisDeliverables, heroCopy, serviceMap } from "./data";
import {
  AnimatedHeroRoute,
  CinemaDiagnosis,
  ScrollDrivenRoute,
} from "./HomeFinalCinemaInteractive";
import styles from "./home-final-cinema.module.css";

const trustSignals = [
  "сайт, CRM, 1С и коммуникации в одной цепочке",
  "анимация показывает бизнес-причину каждого шага",
  "preview без боевых CRM-секретов и реальных персональных данных",
] as const;

const systemModules = [
  {
    title: "Входящий канал",
    text: "WhatsApp/Wazzup, форма, звонок или заявка с сайта становятся стартом маршрута, а не отдельной перепиской.",
    icon: BadgeCheck,
  },
  {
    title: "CRM и регламент",
    text: "Битрикс24 получает сделку, ответственного, задачу и SLA первого действия.",
    icon: Workflow,
  },
  {
    title: "1С и контроль",
    text: "Заказ, счёт, статус и риск обмена попадают в управляемую цепочку.",
    icon: DatabaseZap,
  },
] as const;

export function HomeFinalCinema() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-final-title">
        <Image
          className={styles.heroImage}
          src="/media/home/onixbit-robot-dashboard-scene.png"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.heroShade} aria-hidden="true" />

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
            <a href="#animation">Анимация</a>
            <a href="#modules">Контур</a>
            <a href="#diagnosis">Диагностика</a>
          </nav>
          <div className={styles.headerActions}>
            <a className={styles.phoneLink} href={company.phoneHref}>
              <Phone size={16} aria-hidden="true" />
              {company.phone}
            </a>
            <a className={styles.headerCta} href="#diagnosis">
              {heroCopy.primaryCta}
            </a>
          </div>
        </header>

        <div className={styles.heroContent} id="top">
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>animated route of request</span>
            <h1 id="home-final-title">
              Связываем сайт, Битрикс24, 1С и коммуникации в управляемый процесс
            </h1>
            <p>
              Показываем, где теряется заявка, кто отвечает за следующий шаг и какой
              статус видит руководитель.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryCta} href="#diagnosis">
                {heroCopy.primaryCta}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className={styles.secondaryCta} href="#animation">
                Посмотреть путь заявки
              </a>
            </div>
            <div className={styles.trustLine}>
              {trustSignals.map((signal) => (
                <span key={signal}>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  {signal}
                </span>
              ))}
            </div>
          </div>

          <AnimatedHeroRoute />
        </div>
      </section>

      <main className={styles.main}>
        <ScrollDrivenRoute />

        <section className={styles.modulesSection} id="modules" aria-labelledby="modules-title">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>контур вместо карточек</span>
            <h2 id="modules-title">Услуги показываются как части одного маршрута</h2>
            <p>
              После анимации становится понятно, зачем нужны Битрикс24, сайт, 1С и тарифы:
              они усиливают разные участки одной цепочки.
            </p>
          </div>
          <div className={styles.moduleRail}>
            {systemModules.map((module) => {
              const ModuleIcon = module.icon;

              return (
                <article className={styles.moduleObject} key={module.title}>
                  <ModuleIcon size={22} aria-hidden="true" />
                  <h3>{module.title}</h3>
                  <p>{module.text}</p>
                </article>
              );
            })}
          </div>
          <div className={styles.serviceContour}>
            {serviceMap.map((service) => (
              <article key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <CinemaDiagnosis />

        <section className={styles.deliverables} aria-labelledby="deliverables-title">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>что останется после wow</span>
            <h2 id="deliverables-title">Анимация ведёт к конкретному первому шагу</h2>
          </div>
          <div className={styles.deliverableRail}>
            {diagnosisDeliverables.map((item) => (
              <article key={item}>
                <ShieldCheck size={18} aria-hidden="true" />
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
