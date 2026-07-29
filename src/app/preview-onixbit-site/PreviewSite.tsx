"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cookie,
  DatabaseZap,
  Globe2,
  Mail,
  Menu,
  MessageSquareText,
  Phone,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import {
  getPreviewPage,
  previewBasePath,
  previewNav,
  previewPages,
  previewProof,
  previewServiceCards,
  type PreviewPage,
  type PreviewPageKey,
} from "./data";
import styles from "./preview-site.module.css";

const iconMap = {
  workflow: Workflow,
  globe: Globe2,
  database: DatabaseZap,
};

const visualNodes = [
  { label: "Битрикс24", detail: "CRM / задачи / роботы", x: "77%", y: "28%", icon: Workflow },
  { label: "1С-Битрикс", detail: "сайт / каталог / заказ", x: "22%", y: "32%", icon: Globe2 },
  { label: "1С", detail: "цены / остатки / статусы", x: "69%", y: "70%", icon: DatabaseZap },
  { label: "Каналы", detail: "формы / звонки / чаты", x: "17%", y: "68%", icon: MessageSquareText },
  { label: "Контроль", detail: "отчёты / просрочки / ошибки", x: "50%", y: "14%", icon: BarChart3 },
] as const;

const scrollStorySteps = [
  {
    marker: "01",
    title: "Заявка входит в систему",
    text: "Форма, звонок или чат получают источник, контекст, ответственного и срок реакции.",
    panel: "Новый лид: сайт, форма, UTM, товар, комментарий",
    metric: "0 потерянных обращений",
  },
  {
    marker: "02",
    title: "Сайт передаёт смысл",
    text: "1С-Битрикс не просто отправляет заявку, а передаёт страницу, товар, форму и сценарий клиента.",
    panel: "Каталог, заказ, форма, история перехода",
    metric: "контекст сделки",
  },
  {
    marker: "03",
    title: "CRM превращает сигнал в работу",
    text: "Битрикс24 собирает сделку, задачу, коммуникацию, робота и контрольный маркер руководителя.",
    panel: "Сделка -> задача -> робот -> контроль",
    metric: "SLA под контролем",
  },
  {
    marker: "04",
    title: "1С синхронизирует данные",
    text: "Цены, остатки, заказы и статусы проходят по понятным правилам обмена без ручного дубляжа.",
    panel: "Остатки, цены, статус заказа, ошибки обмена",
    metric: "единый источник истины",
  },
  {
    marker: "05",
    title: "Руководитель видит контур",
    text: "Система показывает, где заявка, кто отвечает, что зависло и какой следующий шаг нужен.",
    panel: "Отчёты, просрочки, ошибки, план развития",
    metric: "управляемый процесс",
  },
] as const;

const scrollStoryNodes = [
  { key: "channel", label: "Канал", detail: "форма / звонок / чат", icon: MessageSquareText },
  { key: "site", label: "1С-Битрикс", detail: "страница / каталог / заказ", icon: Globe2 },
  { key: "crm", label: "Битрикс24", detail: "сделка / задача / робот", icon: Workflow },
  { key: "onec", label: "1С", detail: "цены / остатки / статусы", icon: DatabaseZap },
  { key: "control", label: "Контроль", detail: "SLA / отчёты / ошибки", icon: BarChart3 },
] as const;
const caseCards = [
  {
    title: "Внедрение Битрикс24 с коммуникациями",
    text: "Как воронки, права, роботы и контроль менеджеров собираются вокруг входящих обращений.",
    image: "/media/home/case-crm-cover.png",
  },
  {
    title: "Сайт на 1С-Битрикс как часть продаж",
    text: "Как формы, каталог и CRM превращаются в единый маршрут заявки.",
    image: "/media/home/case-site-cover.png",
  },
  {
    title: "Обмен 1С, сайта и Битрикс24",
    text: "Как заказы, остатки, цены и статусы проходят без ручного дублирования.",
    image: "/media/home/case-integration-cover.png",
  },
] as const;

const articleCards = [
  {
    title: "Поверхностное внедрение Битрикс24",
    text: "Как понять, что CRM выглядит настроенной, но не управляет процессом.",
    image: "/media/articles/bitrix24-surface-audit.svg",
  },
  {
    title: "Заявка с сайта в Битрикс24",
    text: "Что должно попасть в сделку, чтобы менеджер понимал контекст.",
    image: "/media/articles/website-request-route.svg",
  },
  {
    title: "Источник истины между сайтом, CRM и 1С",
    text: "Как заранее договориться о ценах, остатках, заказах и статусах.",
    image: "/media/articles/crm-1c-source-of-truth.svg",
  },
] as const;

const certificateCards = [
  {
    title: "Золотой партнёр Битрикс24",
    label: "CRM и бизнес-процессы",
    image: "/media/certificates/Золотой партнёр Битрикс24.jpg",
  },
  {
    title: "Золотой партнёр 1С-Битрикс",
    label: "Сайты, каталоги, e-commerce",
    image: "/media/certificates/Золотой партнёр 1С-Битрикс.jpg",
  },
  {
    title: "Партнёрская экосистема",
    label: "ASPRO, Wazzup, ChatApp, Scloud",
    image: "/brand/onixbit-og.png",
  },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === previewBasePath) return pathname === previewBasePath;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getSecondaryHref(page: PreviewPage) {
  switch (page.key) {
    case "vnedrenie-bitrix24":
      return `${previewBasePath}/tarify-licenziy`;
    case "razrabotka-saitov-na-1c-bitrix":
      return `${previewBasePath}/cases`;
    case "raboty-po-1c-predpriyatie":
      return `${previewBasePath}/certificates`;
    case "tarify-licenziy":
      return `${previewBasePath}/contacts`;
    case "cases":
      return `${previewBasePath}/articles`;
    case "certificates":
      return `${previewBasePath}/o-kompanii`;
    case "articles":
      return `${previewBasePath}/contacts`;
    case "o-kompanii":
      return `${previewBasePath}/certificates`;
    case "contacts":
      return "https://t.me/onixbitru";
    case "privacy":
      return previewBasePath;
    default:
      return `${previewBasePath}/contacts`;
  }
}

function DemoHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <Link className={styles.brand} href={previewBasePath} aria-label="Ониксбит demo">
        <Image src="/brand/onixbit-logo-header.png" alt="Ониксбит" width={150} height={45} priority />
        <span>demo system</span>
      </Link>

      <nav className={styles.nav} aria-label="Демо-навигация">
        {previewNav.slice(0, 6).map((item) => (
          <Link className={isActivePath(pathname, item.href) ? styles.activeLink : ""} href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.headerActions}>
        <a href="tel:+78001005303">8 800 100-53-03</a>
        <Link className={styles.headerCta} href={`${previewBasePath}/contacts`}>
          <span>Обсудить</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <button className={styles.menuButton} type="button" aria-label="Меню" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      <div className={styles.mobileMenu} data-open={open}>
        {previewNav.map((item) => (
          <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link href={`${previewBasePath}/tarify-licenziy`} onClick={() => setOpen(false)}>
          Тарифы
        </Link>
        <Link href={`${previewBasePath}/privacy`} onClick={() => setOpen(false)}>
          Privacy
        </Link>
      </div>
    </header>
  );
}

function DemoCookie() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(window.localStorage.getItem("onixbitDemoCookie") !== "ok");
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <aside className={styles.cookie} aria-label="Cookie demo">
      <span aria-hidden="true">
        <Cookie size={20} />
      </span>
      <div>
        <strong>Демо использует cookies и аналитику</strong>
        <p>
          В финальной версии эта плашка будет связана с политикой конфиденциальности и режимом обязательных cookies.
        </p>
      </div>
      <Link href={`${previewBasePath}/privacy`}>Политика</Link>
      <button
        type="button"
        onClick={() => {
          window.localStorage.setItem("onixbitDemoCookie", "ok");
          setVisible(false);
        }}
      >
        Принять
      </button>
    </aside>
  );
}

function SystemVisual({ mode = "system" }: { mode?: PreviewPage["visual"] }) {
  return (
    <div className={styles.systemVisual} data-mode={mode} aria-hidden="true">
      <svg className={styles.threads} viewBox="0 0 1000 680" preserveAspectRatio="none">
        <defs>
          <linearGradient id="demoThread" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(237, 28, 36, 0)" />
            <stop offset="48%" stopColor="rgba(255, 212, 90, 0.88)" />
            <stop offset="100%" stopColor="rgba(140, 239, 255, 0.46)" />
          </linearGradient>
        </defs>
        <path d="M120 430 C290 160 438 224 500 338 S736 564 880 232" />
        <path d="M170 210 C330 362 426 360 500 338 S686 240 838 452" />
        <path d="M250 560 C390 480 444 430 500 338 S596 116 680 84" />
        <path className={styles.softThread} d="M500 338 C442 470 558 520 720 588" />
      </svg>

      <div className={styles.core}>
        <Image src="/brand/onixbit-mark.png" alt="" width={88} height={88} />
        <strong>Onixbit</strong>
        <span>архитектура системы</span>
      </div>

      {visualNodes.map((node) => {
        const Icon = node.icon;
        return (
          <div className={styles.visualNode} style={{ left: node.x, top: node.y }} key={node.label}>
            <Icon size={19} aria-hidden="true" />
            <strong>{node.label}</strong>
            <span>{node.detail}</span>
          </div>
        );
      })}

      <span className={styles.signal} data-signal="one" />
      <span className={styles.signal} data-signal="two" />
      <span className={styles.signal} data-signal="three" />
    </div>
  );
}

function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = scrollStorySteps[activeIndex] ?? scrollStorySteps[0];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const maxScroll = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / maxScroll));
      const rawIndex = Math.min(scrollStorySteps.length - 1, Math.floor(progress * scrollStorySteps.length));
      const localProgress = Math.min(1, Math.max(0, progress * scrollStorySteps.length - rawIndex));

      section.style.setProperty("--story-progress", progress.toFixed(3));
      section.style.setProperty("--story-local", localProgress.toFixed(3));
      section.style.setProperty("--story-drift", `${((localProgress - 0.5) * -20).toFixed(2)}px`);
      section.style.setProperty("--story-tilt", `${((localProgress - 0.5) * -5).toFixed(2)}deg`);
      section.style.setProperty("--story-core-scale", (0.95 + localProgress * 0.05).toFixed(3));
      section.style.setProperty("--story-glow-opacity", (0.42 + localProgress * 0.18).toFixed(3));
      section.style.setProperty("--story-path-offset", `${(920 - progress * 920).toFixed(2)}px`);
      section.style.setProperty("--story-pulse-scale", (0.8 + localProgress * 0.7).toFixed(3));
      section.style.setProperty("--story-panel-primary", `${(localProgress * 26).toFixed(2)}px`);
      section.style.setProperty("--story-panel-secondary", `${(localProgress * -24).toFixed(2)}px`);

      if (rawIndex !== activeIndexRef.current) {
        activeIndexRef.current = rawIndex;
        setActiveIndex(rawIndex);
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section className={styles.scrollStory} ref={sectionRef} aria-label="Маршрут заявки и данных">
      <div className={styles.scrollSticky} data-scene={activeIndex}>
        <div className={styles.storyCopy}>
          <span>{activeStep.marker} / 05</span>
          <h2>{activeStep.title}</h2>
          <p>{activeStep.text}</p>
          <div className={styles.storyMetric}>
            <strong>{activeStep.metric}</strong>
            <span>{activeStep.panel}</span>
          </div>
          <div className={styles.storySteps} aria-hidden="true">
            {scrollStorySteps.map((step, index) => (
              <i key={step.marker} data-active={index === activeIndex} />
            ))}
          </div>
        </div>

        <div className={styles.storyStage} aria-hidden="true">
          <svg className={styles.storyThreads} viewBox="0 0 1000 700" preserveAspectRatio="none">
            <defs>
              <linearGradient id="storyThreadWarm" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="rgba(237, 28, 36, 0)" />
                <stop offset="46%" stopColor="rgba(255, 218, 104, 0.95)" />
                <stop offset="100%" stopColor="rgba(140, 239, 255, 0.28)" />
              </linearGradient>
            </defs>
            <path data-path="main" d="M82 372 C198 156 356 154 490 318 S752 540 912 206" />
            <path data-path="return" d="M892 502 C688 430 600 468 490 318 S286 210 108 516" />
            <path data-path="control" d="M220 110 C408 230 538 190 682 86 S790 124 910 98" />
            <path data-path="sync" d="M178 606 C342 514 390 432 490 318 S664 248 842 414" />
          </svg>

          <div className={styles.storyCore}>
            <Image src="/brand/onixbit-mark.png" alt="" width={90} height={90} />
            <strong>Ониксбит</strong>
            <span>собирает контур</span>
          </div>

          {scrollStoryNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div className={styles.storyNode} data-node={node.key} key={node.key}>
                <Icon size={22} aria-hidden="true" />
                <strong>{node.label}</strong>
                <span>{node.detail}</span>
              </div>
            );
          })}

          <div className={styles.storyPanel} data-panel="primary">
            <span>{activeStep.marker}</span>
            <strong>{activeStep.panel}</strong>
          </div>
          <div className={styles.storyPanel} data-panel="secondary">
            <span>контроль</span>
            <strong>{activeStep.metric}</strong>
          </div>

          <span className={styles.storyPulse} data-pulse="one" />
          <span className={styles.storyPulse} data-pulse="two" />
          <span className={styles.storyPulse} data-pulse="three" />
        </div>
      </div>
    </section>
  );
}
function HomePage() {
  const page = previewPages.home;

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>
            <Sparkles size={16} aria-hidden="true" />
            {page.eyebrow}
          </span>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href={`${previewBasePath}/contacts`}>
              {page.cta}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className={styles.secondaryButton} href={`${previewBasePath}/vnedrenie-bitrix24`}>
              {page.secondary}
            </Link>
          </div>
          <div className={styles.heroTags} aria-label="Что входит в систему">
            {page.highlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <SystemVisual />
      </section>

      <ScrollStory />

      <ServicesSection />
      <ProofSection />
      <CasesArticlesSection />
      <LeadPanel />
    </>
  );
}

function ServicesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <span>Направления</span>
        <h2>Три компетенции остаются, но подаются как части одной системы</h2>
      </div>
      <div className={styles.serviceGrid}>
        {previewServiceCards.map((card) => {
          const Icon = iconMap[card.icon];
          return (
            <Link className={styles.serviceCard} href={card.href} key={card.title}>
              <Icon size={28} aria-hidden="true" />
              <span>{card.label}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <em>
                Открыть
                <ArrowRight size={16} aria-hidden="true" />
              </em>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section className={styles.proofSection}>
      <div className={styles.sectionHead}>
        <span>Доверие</span>
        <h2>Вау-эффект должен приводить к проверяемым доказательствам</h2>
      </div>
      <div className={styles.proofGrid}>
        {previewProof.map((item) => (
          <article key={item.title}>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CasesArticlesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.splitHead}>
        <div>
          <span>Кейсы и статьи</span>
          <h2>После фильма остаётся спокойная зона для выбора и доверия</h2>
        </div>
        <Link href={`${previewBasePath}/articles`}>Открыть базу знаний</Link>
      </div>
      <div className={styles.mediaGrid}>
        {[...caseCards.slice(0, 2), articleCards[0]].map((item) => (
          <article className={styles.mediaCard} key={item.title}>
            <div>
              <Image src={item.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PageHero({ page }: { page: PreviewPage }) {
  return (
    <section className={styles.pageHero}>
      <div>
        <span className={styles.eyebrow}>
          <Sparkles size={16} aria-hidden="true" />
          {page.eyebrow}
        </span>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
        <div className={styles.heroActions}>
          <Link className={styles.primaryButton} href={`${previewBasePath}/contacts`}>
            {page.cta}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          {page.secondary && (
            <Link className={styles.secondaryButton} href={getSecondaryHref(page)}>
              {page.secondary}
            </Link>
          )}
        </div>
      </div>
      <SystemVisual mode={page.visual} />
    </section>
  );
}

function GenericPage({ page }: { page: PreviewPage }) {
  return (
    <>
      <PageHero page={page} />
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span>{page.caption}</span>
          <h2>Как эта страница работает в демо-концепции</h2>
        </div>
        <div className={styles.detailGrid}>
          <article className={styles.detailLead}>
            <h3>Ключевые акценты</h3>
            <div className={styles.heroTags}>
              {page.highlights.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
          {page.sections.map((section) => (
            <article className={styles.detailCard} key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.text}</p>
              <ul>
                {section.points.map((point) => (
                  <li key={point}>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <ContextualSection page={page} />
      <LeadPanel />
    </>
  );
}

function ContextualSection({ page }: { page: PreviewPage }) {
  if (page.kind === "proof") {
    return (
      <section className={styles.section}>
        <div className={styles.mediaGrid}>
          {certificateCards.map((item) => (
            <article className={styles.mediaCard} key={item.title}>
              <div>
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 760px) 100vw, 33vw" />
              </div>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (page.kind === "cases") {
    return (
      <section className={styles.section}>
        <div className={styles.mediaGrid}>
          {caseCards.map((item) => (
            <article className={styles.mediaCard} key={item.title}>
              <div>
                <Image src={item.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (page.key === "articles") {
    return (
      <section className={styles.section}>
        <div className={styles.mediaGrid}>
          {articleCards.map((item) => (
            <article className={styles.mediaCard} key={item.title}>
              <div>
                <Image src={item.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (page.kind === "company") {
    return (
      <section className={styles.companySection}>
        <div className={styles.companyPhoto}>
          <Image src="/media/team/founder-alexander-site.webp" alt="Александр, Ониксбит" fill sizes="(max-width: 760px) 100vw, 38vw" />
        </div>
        <div>
          <span>живой экспертный контекст</span>
          <h2>Люди нужны, но по делу: эксперт, архитектор, команда поддержки</h2>
          <p>
            На странице о компании можно использовать реальный образ основателя и команды. На главной же люди должны быть частью системной сцены, а не случайными фотографиями в каждом блоке.
          </p>
        </div>
      </section>
    );
  }

  if (page.kind === "contact") {
    return <ContactPanel />;
  }

  if (page.kind === "legal") {
    return <PrivacyText />;
  }

  return <ServicesSection />;
}

function ContactPanel() {
  return (
    <section className={styles.contactPanel} id="lead">
      <div>
        <span>Контакты</span>
        <h2>Расскажите, где сейчас разрывается система</h2>
        <p>Опишите, что уже есть: сайт, CRM, 1С, телефония, мессенджеры, формы, отчёты. Мы предложим ближайший практичный шаг.</p>
      </div>
      <div className={styles.contactList}>
        <a href="tel:+78001005303">
          <Phone size={19} />
          8 800 100-53-03
        </a>
        <a href="mailto:info@onixbit.ru">
          <Mail size={19} />
          info@onixbit.ru
        </a>
        <a href="https://t.me/onixbitru">
          <MessageSquareText size={19} />
          Telegram
        </a>
      </div>
    </section>
  );
}

function PrivacyText() {
  return (
    <section className={styles.legalText}>
      <article>
        <h2>Кратко о данных</h2>
        <p>
          Демо показывает будущую структуру юридической страницы. В финальной версии текст будет сверяться с реальными формами, аналитикой, CRM и cookie-настройками.
        </p>
        <h3>Для чего нужны данные</h3>
        <p>Чтобы ответить на обращение, подготовить первичную оценку, улучшать страницы и понимать, какие материалы помогают клиентам.</p>
        <h3>Что можно запросить</h3>
        <p>Пользователь может запросить уточнение, исправление или удаление своих данных через контактную почту Ониксбит.</p>
      </article>
    </section>
  );
}

function LeadPanel() {
  return (
    <section className={styles.leadPanel} id="lead">
      <div>
        <span>Следующий шаг</span>
        <h2>Разберём вашу связку и предложим ближайшее действие</h2>
        <p>Без продажи “пакета на всё”. Сначала смотрим, где теряются заявки, данные и контроль.</p>
      </div>
      <Link className={styles.primaryButton} href={`${previewBasePath}/contacts`}>
        Обсудить проект
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}

function DemoFooter() {
  return (
    <footer className={styles.footer}>
      <div>
        <Image src="/brand/onixbit-logo-footer.png" alt="Ониксбит" width={150} height={45} />
        <p>Демо редизайна: тёмная фирменная система, cinematic scroll, понятные услуги и проверяемые доказательства.</p>
      </div>
      <nav aria-label="Демо-подвал">
        <Link href={previewBasePath}>Главная</Link>
        <Link href={`${previewBasePath}/certificates`}>Сертификаты</Link>
        <Link href={`${previewBasePath}/cases`}>Кейсы</Link>
        <Link href={`${previewBasePath}/articles`}>Статьи</Link>
        <Link href={`${previewBasePath}/contacts`}>Контакты</Link>
        <Link href={`${previewBasePath}/privacy`}>Политика</Link>
      </nav>
      <small>© 2026 Ониксбит. Preview-версия, не рабочий сайт.</small>
    </footer>
  );
}

export function PreviewSite({ pageKey }: { pageKey: PreviewPageKey }) {
  const page = getPreviewPage(pageKey) ?? previewPages.home;

  return (
    <div className={styles.site}>
      <div className={styles.backdrop} aria-hidden="true" />
      <DemoHeader />
      {page.key === "home" ? <HomePage /> : <GenericPage page={page} />}
      <DemoFooter />
      <DemoCookie />
    </div>
  );
}
