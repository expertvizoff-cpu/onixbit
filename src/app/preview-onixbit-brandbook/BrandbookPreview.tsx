import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  BrainCircuit,
  CheckCircle2,
  CircleDot,
  Component,
  CopyCheck,
  Eye,
  Grid3X3,
  Layers3,
  MonitorCog,
  MousePointer2,
  Palette,
  PenLine,
  Route,
  Sparkles,
  SunMedium,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import styles from "./brandbook-preview.module.css";

const figmaUrl = "https://www.figma.com/design/QmWZap5UbNRmBnLtvcshi7/Untitled?node-id=0-1&t=fGCffiUH9YpQMKjg-1";

const brandStats = [
  { value: "1700px", label: "рабочая ширина сайта" },
  { value: "2 режима", label: "светлый сайт и тёмные процессы" },
  { value: "5 шагов", label: "маршрут заявки до контроля" },
  { value: "14 лет", label: "опыт разработки и интеграций" },
];

const dnaCards: Array<{ title: string; text: string; icon: LucideIcon }> = [
  {
    title: "Позиция",
    text: "B2B-интегратор, который соединяет сайт, Битрикс24, 1С, коммуникации и управление в один рабочий контур.",
    icon: BadgeCheck,
  },
  {
    title: "Обещание",
    text: "Руководитель видит источник заявки, ответственного, срок, статус обмена и точку риска без ручной сверки.",
    icon: Eye,
  },
  {
    title: "Метафора",
    text: "Не агентство и не набор услуг, а операционная система бизнеса: понятная, связанная, управляемая.",
    icon: MonitorCog,
  },
  {
    title: "Характер",
    text: "Спокойный эксперт: объясняет конкретно, показывает процесс, не обещает чудес и не прячет ограничения.",
    icon: BrainCircuit,
  },
];

const principles = [
  "Сначала процесс, потом интерфейсы и настройки",
  "Светлый публичный сайт продаёт доверие, ясность и SEO",
  "Тёмные страницы показывают живые бизнес-сценарии",
  "Красный и янтарный работают как энергия бренда, не как шум",
  "Каждый CTA ведёт к диагностике, услуге, доказательству или процессу",
];

const colors = [
  { name: "Onixbit red", token: "--ob-red", value: "#ed1c24", role: "действие, риск, фокус" },
  { name: "Deep red", token: "--ob-red-deep", value: "#b80f17", role: "глубина и hover" },
  { name: "Amber", token: "--ob-yellow", value: "#ffd45a", role: "тепло и proof" },
  { name: "Graphite", token: "--ob-ink", value: "#080808", role: "главный текст" },
  { name: "Soft", token: "--ob-soft", value: "#f5f5f2", role: "фон светлого сайта" },
  { name: "Signal blue", token: "signal", value: "#2f86ff", role: "данные и CRM" },
  { name: "Signal green", token: "signal", value: "#66e3a2", role: "контроль и успех" },
  { name: "Night", token: "process", value: "#09090b", role: "тёмные процессы" },
];

const voiceRows = [
  {
    label: "Говорим",
    good: "Заявка проходит весь маршрут: сайт, CRM, менеджер, 1С и контроль.",
    bad: "Мы предлагаем инновационные решения для цифровой трансформации.",
  },
  {
    label: "Объясняем",
    good: "Сначала фиксируем процесс, потом настраиваем поля, роботов и обмены.",
    bad: "Настроим всё максимально эффективно и быстро.",
  },
  {
    label: "Доказываем",
    good: "Показываем источник, ответственного, срок и статус обмена.",
    bad: "Мы гарантируем лучший результат на рынке.",
  },
];

const components = [
  { title: "CTA", text: "Один главный красный action, рядом спокойная вторичная ссылка в процесс или услугу.", icon: MousePointer2 },
  { title: "Route nodes", text: "Сайт, CRM, менеджер, 1С и контроль всегда соединяются видимой причинной линией.", icon: Route },
  { title: "Proof strip", text: "Сертификаты, статьи, кейсы и партнёрства показываются как доказательства компетенции.", icon: BadgeCheck },
  { title: "HUD panel", text: "В тёмных процессах панели показывают состояние системы, а не служат декором.", icon: Component },
];

const motionRules = [
  { title: "Причина", text: "Действие клиента меняет состояние CRM, 1С или контроля." },
  { title: "Скорость", text: "Микроанимации 150-300 мс, сложные сцены без блокирующего loader." },
  { title: "Доступность", text: "Reduced motion оставляет контент и маршрут полностью понятными." },
];

function SectionTitle({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return (
    <div className={styles.sectionTitle}>
      <p>{kicker}</p>
      <h2>{title}</h2>
      <span>{text}</span>
    </div>
  );
}

export function BrandbookPreview() {
  return (
    <main className={styles.shell}>
      <nav className={styles.topbar} aria-label="Навигация брендбука">
        <Link className={styles.brand} href="/preview-onixbit-brandbook" aria-label="Брендбук Onixbit">
          <span className={styles.brandMark}>O</span>
          <span>
            <strong>Onixbit</strong>
            <small>brand operating system</small>
          </span>
        </Link>
        <div className={styles.topnav}>
          <a href="#dna">ДНК</a>
          <a href="#visual">Визуал</a>
          <a href="#components">Компоненты</a>
          <a href="#voice">Голос</a>
          <a href="#figma">Figma</a>
        </div>
        <Link className={styles.topCta} href="/preview-onixbit-architecture">
          Архитектура
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Onixbit brandbook 2026</p>
          <h1>Бренд как управляемая система, а не набор красивых экранов</h1>
          <p>
            Эта страница собирает позиционирование, визуальный язык, сетку, компоненты,
            tone of voice и Figma-направление Ониксбит в один рабочий брендбук для сайта,
            статей, процессных демо и коммерческих материалов.
          </p>
          <div className={styles.heroActions}>
            <a href={figmaUrl} target="_blank" rel="noreferrer">
              Открыть Figma
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <Link href="/preview-onixbit-system-tour">Смотреть маршрут заявки</Link>
          </div>
          <div className={styles.stats} aria-label="Ключевые параметры брендбука">
            {brandStats.map((item) => (
              <span key={item.label}>
                <strong>{item.value}</strong>
                <small>{item.label}</small>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.heroStage} aria-label="Схема связанного бренда Onixbit">
          <div className={styles.stageHeader}>
            <span>connected contour</span>
            <strong>сайт + CRM + 1C + контроль</strong>
          </div>
          <div className={styles.coreOrbit}>
            <div className={styles.core}>Onixbit</div>
            <span className={styles.nodeSite}>Сайт</span>
            <span className={styles.nodeCrm}>CRM</span>
            <span className={styles.nodeOnec}>1C</span>
            <span className={styles.nodeControl}>Контроль</span>
            <i className={styles.lineA} />
            <i className={styles.lineB} />
            <i className={styles.lineC} />
            <i className={styles.lineD} />
          </div>
          <div className={styles.stageFooter}>
            <span><CircleDot size={14} aria-hidden="true" /> заявка не теряется</span>
            <span><CircleDot size={14} aria-hidden="true" /> статус виден</span>
            <span><CircleDot size={14} aria-hidden="true" /> риск управляется</span>
          </div>
        </div>
      </section>

      <section className={styles.dnaSection} id="dna">
        <SectionTitle
          kicker="01 / ДНК бренда"
          title="Ониксбит должен ощущаться как спокойный системный архитектор"
          text="Клиенту важно быстро понять: команда видит весь процесс, а не продаёт отдельную настройку CRM или сайта."
        />
        <div className={styles.dnaGrid}>
          {dnaCards.map((item) => {
            const Icon = item.icon;
            return (
              <article className={styles.dnaCard} key={item.title}>
                <Icon size={26} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
        <div className={styles.principles}>
          {principles.map((principle) => (
            <span key={principle}>
              <CheckCircle2 size={18} aria-hidden="true" />
              {principle}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.visualSection} id="visual">
        <SectionTitle
          kicker="02 / Визуальная система"
          title="Светлый сайт объясняет. Тёмные страницы показывают процесс."
          text="В брендбуке оба режима живут вместе: доверительный B2B-сайт и кинематографичные process pages."
        />
        <div className={styles.modeGrid}>
          <article className={[styles.modeCard, styles.modeLight].join(" ")}>
            <SunMedium size={26} aria-hidden="true" />
            <h3>Light public mode</h3>
            <p>Главная, услуги, статьи, кейсы, сертификаты, контакты. Быстро, ясно, SEO-дружелюбно, с рабочей шириной сайта.</p>
            <div>
              <span>услуги</span><span>доверие</span><span>формы</span>
            </div>
          </article>
          <article className={[styles.modeCard, styles.modeDark].join(" ")}>
            <Sparkles size={26} aria-hidden="true" />
            <h3>Dark process mode</h3>
            <p>Маршрут заявки, заказ через сайт, сбой обмена, поддержка и контроль руководителя как живые системные сцены.</p>
            <div>
              <span>route</span><span>HUD</span><span>state</span>
            </div>
          </article>
        </div>

        <div className={styles.colorGrid} aria-label="Цветовая система Onixbit">
          {colors.map((color) => (
            <article className={styles.colorCard} key={color.name}>
              <span className={styles.swatch} style={{ backgroundColor: color.value }} />
              <div>
                <h3>{color.name}</h3>
                <p>{color.token}</p>
                <strong>{color.value}</strong>
                <small>{color.role}</small>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.typeGrid}>
          <article>
            <p>Display / Montserrat</p>
            <h3>Соединяем системы в управляемый контур</h3>
          </article>
          <article>
            <p>Body / Manrope</p>
            <span>
              Настраиваем Битрикс24, сайты на 1С-Битрикс и обмены с 1С так, чтобы заявки,
              статусы и ответственные были видны в одном маршруте.
            </span>
          </article>
          <article>
            <p>Grid / live site rhythm</p>
            <strong>1700px</strong>
            <span>Desktop max container, not a fixed 1440px Figma artboard.</span>
          </article>
        </div>
      </section>

      <section className={styles.componentsSection} id="components">
        <SectionTitle
          kicker="03 / Компоненты"
          title="Компоненты должны объяснять состояние бизнеса"
          text="Кнопки, панели и линии работают не как декор, а как язык процесса: действие, система, контроль, доказательство."
        />
        <div className={styles.componentGrid}>
          {components.map((item) => {
            const Icon = item.icon;
            return (
              <article className={styles.componentCard} key={item.title}>
                <Icon size={24} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
        <div className={styles.routeDemo} aria-label="Пример маршрута заявки">
          {["Сайт", "CRM", "Менеджер", "1C", "Контроль"].map((step, index) => (
            <span key={step}>
              <i>{index + 1}</i>
              {step}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.voiceSection} id="voice">
        <SectionTitle
          kicker="04 / Голос"
          title="Голос Ониксбит: уверенно, конкретно, без рекламного тумана"
          text="Брендбук фиксирует не только визуал, но и то, как мы объясняем ценность клиенту."
        />
        <div className={styles.voiceGrid}>
          {voiceRows.map((row) => (
            <article className={styles.voiceCard} key={row.label}>
              <h3>{row.label}</h3>
              <div className={styles.goodCopy}>
                <CopyCheck size={18} aria-hidden="true" />
                <p>{row.good}</p>
              </div>
              <div className={styles.badCopy}>
                <PenLine size={18} aria-hidden="true" />
                <p>{row.bad}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.motionSection}>
        <SectionTitle
          kicker="05 / Motion"
          title="Анимация показывает причинно-следственную связь"
          text="Главное движение бренда: человек сделал действие, системы изменили состояние, руководитель увидел контроль."
        />
        <div className={styles.motionGrid}>
          {motionRules.map((rule) => (
            <article className={styles.motionCard} key={rule.title}>
              <Zap size={22} aria-hidden="true" />
              <h3>{rule.title}</h3>
              <p>{rule.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.figmaSection} id="figma">
        <div className={styles.figmaPanel}>
          <div>
            <p className={styles.eyebrow}>06 / Figma handoff</p>
            <h2>Брендбук должен жить в Figma как рабочая библиотека, а не как разовая презентация</h2>
            <p>
              Следующий слой: страницы Brand DNA, Colors, Typography, Layout, Components,
              Voice и Motion в текущем Figma-файле. Там же должны быть стили, токены,
              компоненты и примеры light/dark экранов.
            </p>
          </div>
          <div className={styles.figmaChecklist}>
            <span><Palette size={18} aria-hidden="true" /> Paint styles and variables</span>
            <span><Grid3X3 size={18} aria-hidden="true" /> 1700px production grid note</span>
            <span><Layers3 size={18} aria-hidden="true" /> Light and dark page examples</span>
            <span><Workflow size={18} aria-hidden="true" /> Request route component language</span>
            <span><BookOpenText size={18} aria-hidden="true" /> Voice and copy rules</span>
          </div>
          <a className={styles.figmaButton} href={figmaUrl} target="_blank" rel="noreferrer">
            Перейти в Figma
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
