import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  DatabaseZap,
  Eye,
  Flag,
  Gauge,
  GitBranch,
  MonitorSmartphone,
  MousePointerClick,
  SearchCheck,
  ShieldCheck,
  Smartphone,
  Workflow,
} from "lucide-react";
import { company } from "@/data/site";
import {
  diagnosisDeliverables,
  heroCopy,
  mockDataDictionary,
  routeSteps,
  sectionDecisionMap,
  serviceMap,
  storyboardFrames,
} from "./data";
import { DiagnosisSimulator, ProcessStand, StoryboardStrip } from "./HomeFinalInteractive";
import styles from "./home-final.module.css";

const heroProofs = [
  "источник заявки не теряется",
  "ответственный и SLA видны сразу",
  "1С, CRM и сайт проверяются в одной цепочке",
] as const;

const mobileAdaptation = [
  "Hero складывается в одну колонку: H1, CTA, затем процесс stand.",
  "Route nodes становятся вертикальными карточками с короткими labels.",
  "Форма диагностики не требует персональных данных и не перекрывает CTA.",
] as const;

const rejectionCriteria = [
  "Первый экран выглядит как обычный список услуг без маршрута заявки.",
  "CTA ведёт к боевой Bitrix-форме или отправляет данные на preview.",
  "Есть горизонтальный overflow на 375/390 px или текст перекрывает узлы.",
  "Reduced-motion всё ещё запускает существенные движения или таймеры.",
  "В mock-data появляются реальные телефоны, токены, webhook URL, ФИО или коммерческие реквизиты.",
] as const;

const qaChecklist = [
  "noindex metadata на preview route",
  "route не добавлен в sitemap",
  "боевые Bitrix popup/analytics отключены на preview",
  "keyboard navigation по tabs, форме и CTA",
  "Playwright screenshots: 375/390, 768, 1024, 1366, 1440/wide",
] as const;

const routeIconMap = {
  source: MousePointerClick,
  crm: Workflow,
  owner: ClipboardCheck,
  sla: Gauge,
  exchange: DatabaseZap,
  control: Eye,
} as const;

export function HomeFinalPreview() {
  return (
    <div className={styles.page}>
      <header className={styles.previewHeader} aria-label="Preview навигация Onixbit">
        <a className={styles.logoLink} href="#top" aria-label="Onixbit preview">
          <Image
            src="/brand/onixbit-lockup-primary-444x110.svg"
            alt="Onixbit"
            width={222}
            height={55}
            priority
          />
        </a>
        <nav className={styles.previewNav} aria-label="Разделы preview">
          <a href="#route">Маршрут</a>
          <a href="#storyboard">Storyboard</a>
          <a href="#diagnosis">Диагностика</a>
          <a href="#qa">QA</a>
        </nav>
        <div className={styles.headerActions}>
          <a className={styles.phoneLink} href={company.phoneHref}>
            {company.phone}
          </a>
          <a className={styles.headerCta} href="#diagnosis">
            {heroCopy.primaryCta}
          </a>
        </div>
      </header>

      <section className={styles.hero} id="top" aria-labelledby="home-final-title">
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>главная Onixbit / preview route</span>
          <h1 id="home-final-title">{heroCopy.h1}</h1>
          <p>{heroCopy.subcopy}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#diagnosis">
              <span>{heroCopy.primaryCta}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className={styles.secondaryAction} href="#storyboard">
              {heroCopy.secondaryCta}
            </a>
          </div>
          <ul className={styles.heroProofs} aria-label="Что показывает первый экран">
            {heroProofs.map((proof) => (
              <li key={proof}>
                <CheckCircle2 size={17} aria-hidden="true" />
                <span>{proof}</span>
              </li>
            ))}
          </ul>
        </div>

        <div id="route" className={styles.heroProcess}>
          <ProcessStand />
        </div>
      </section>

      <section className={styles.recommendationBand} aria-label="Рекомендации по H1 и CTA">
        <article>
          <SearchCheck size={20} aria-hidden="true" />
          <div>
            <span className={styles.kicker}>H1</span>
            <p>{heroCopy.h1Recommendation}</p>
          </div>
        </article>
        <article>
          <Flag size={20} aria-hidden="true" />
          <div>
            <span className={styles.kicker}>CTA</span>
            <p>{heroCopy.ctaRecommendation}</p>
          </div>
        </article>
      </section>

      <section className={styles.routeSummary} aria-label="Активные узлы интерфейса">
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>active interface nodes</span>
          <h2>Узлы, вокруг которых строится главная</h2>
          <p>
            Каждый блок страницы обязан отвечать на вопрос, какой участок маршрута он делает
            видимым для клиента и команды.
          </p>
        </div>
        <div className={styles.routeSummaryGrid}>
          {routeSteps.map((step) => {
            const StepIcon = routeIconMap[step.id];

            return (
              <article className={styles.summaryCard} key={step.id}>
                <StepIcon size={20} aria-hidden="true" />
                <h3>{step.label}</h3>
                <p>{step.promise}</p>
                <small>{step.risk}</small>
              </article>
            );
          })}
        </div>
      </section>

      <div id="storyboard">
        <StoryboardStrip />
      </div>

      <section className={styles.mobileSection} aria-label="Мобильная адаптация">
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>mobile adaptation</span>
          <h2>Мобильная версия без потери смысла</h2>
          <p>Сценарий остаётся тем же, но интерфейс становится вертикальным и компактным.</p>
        </div>
        <div className={styles.mobileGrid}>
          <div className={styles.phoneFrame} aria-hidden="true">
            <div className={styles.phoneTop}>
              <Smartphone size={18} />
              <span>390px</span>
            </div>
            <div className={styles.phoneH1}>Показываем, где теряется заявка</div>
            <div className={styles.phoneRoute}>
              <span>Источник</span>
              <span>CRM</span>
              <span>SLA</span>
              <span>1С</span>
              <span>Контроль</span>
            </div>
          </div>
          <div className={styles.mobileRules}>
            {mobileAdaptation.map((item) => (
              <article key={item}>
                <MonitorSmartphone size={19} aria-hidden="true" />
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.serviceSection} aria-label="Section decision map и услуги">
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>section decision map</span>
          <h2>Секции продают части маршрута</h2>
          <p>Так главная не распадается на четыре услуги, а собирает единую систему.</p>
        </div>
        <div className={styles.serviceGrid}>
          {serviceMap.map((service) => (
            <article className={styles.serviceCard} key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <div className={styles.nodeTags}>
                {service.nodes.map((node) => {
                  const step = routeSteps.find((item) => item.id === node);
                  return <span key={node}>{step?.shortLabel ?? node}</span>;
                })}
              </div>
            </article>
          ))}
        </div>
        <div className={styles.decisionList}>
          {sectionDecisionMap.map((item) => (
            <article key={item.section}>
              <GitBranch size={18} aria-hidden="true" />
              <div>
                <h3>{item.section}: {item.decision}</h3>
                <p>{item.why}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.diagnosisIntro} aria-label="Что получает диагностика">
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>diagnosis offer</span>
          <h2>Что обещает диагностика маршрута</h2>
          <p>
            Offer ограничен понятным результатом: карта цепочки, точки риска и ближайший практичный
            этап без доступа к production-секретам.
          </p>
        </div>
        <div className={styles.deliverableGrid}>
          {diagnosisDeliverables.map((item) => (
            <article key={item}>
              <ShieldCheck size={18} aria-hidden="true" />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <DiagnosisSimulator />

      <section className={styles.safetySection} id="qa" aria-label="Критерии отклонения и QA">
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>QA gates</span>
          <h2>Критерии отклонения</h2>
          <p>Эти условия блокируют переход от preview к production реализации.</p>
        </div>
        <div className={styles.qaGrid}>
          <article className={styles.qaCard}>
            <h3>Reject if</h3>
            <ul>
              {rejectionCriteria.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className={styles.qaCard}>
            <h3>Проверки</h3>
            <ul>
              {qaChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className={styles.qaCard}>
            <h3>Mock-data dictionary</h3>
            <div className={styles.dictionaryList}>
              {mockDataDictionary.map((item) => (
                <p key={item.key}>
                  <code>{item.key}</code>
                  <span>{item.safeExample}</span>
                  <small>{item.note}</small>
                </p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className={styles.frameRejects} aria-label="Критерии отклонения storyboard">
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>storyboard gates</span>
          <h2>Отдельные стоп-критерии по кадрам</h2>
        </div>
        <div className={styles.rejectGrid}>
          {storyboardFrames.map((frame) => (
            <article key={frame.time}>
              <span>{frame.time}</span>
              <h3>{frame.title}</h3>
              <p>{frame.rejectIf}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
