"use client";

import Link from "next/link";
import type { CSSProperties, PointerEvent } from "react";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  DatabaseZap,
  Gauge,
  MessageSquareText,
  MonitorSmartphone,
  MousePointer2,
  Network,
  PhoneCall,
  Radar,
  Route,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import styles from "./ImmersiveItConcept.module.css";

type SystemNode = {
  id: string;
  title: string;
  label: string;
  text: string;
  stat: string;
  x: number;
  y: number;
  icon: LucideIcon;
};

type Scenario = {
  title: string;
  eyebrow: string;
  description: string;
  steps: string[];
  result: string;
};

type NodeStyle = CSSProperties & {
  "--node-x": string;
  "--node-y": string;
};

const systemNodes: SystemNode[] = [
  {
    id: "site",
    title: "Сайт",
    label: "формы, каталог, заказы",
    text: "Точка входа фиксирует источник, запрос, товар или услугу и сразу передает понятный контекст в CRM.",
    stat: "вход без ручного копирования",
    x: 13,
    y: 35,
    icon: MonitorSmartphone,
  },
  {
    id: "crm",
    title: "Битрикс24",
    label: "лиды, сделки, задачи",
    text: "CRM становится рабочей картой процесса: стадия, ответственный, срок, следующий шаг и история клиента.",
    stat: "контроль каждой сделки",
    x: 39,
    y: 19,
    icon: Workflow,
  },
  {
    id: "comms",
    title: "Коммуникации",
    label: "звонки, чаты, почта",
    text: "Звонки, сообщения и письма не живут отдельно: они привязаны к клиенту и помогают менеджеру не терять диалог.",
    stat: "диалог в карточке клиента",
    x: 71,
    y: 31,
    icon: MessageSquareText,
  },
  {
    id: "onec",
    title: "1С",
    label: "остатки, цены, заказы",
    text: "Обмены с 1С показывают, где находится источник истины по товарам, заказам, оплатам и статусам.",
    stat: "данные без двойного ввода",
    x: 25,
    y: 72,
    icon: DatabaseZap,
  },
  {
    id: "control",
    title: "Контроль",
    label: "отчеты, SLA, риски",
    text: "Руководитель видит не красивую витрину настроек, а узкие места: просрочки, потери, ошибки обмена и нагрузку команды.",
    stat: "видимость проблем до пожара",
    x: 67,
    y: 72,
    icon: BarChart3,
  },
];

const scenarios: Scenario[] = [
  {
    eyebrow: "Сценарий 01",
    title: "Заявка проходит без потерь",
    description:
      "Посетитель оставляет форму на сайте, CRM создает сделку, менеджер получает задачу, а руководитель видит контрольный срок.",
    steps: ["сайт передал источник", "CRM назначила ответственного", "задача получила срок", "отчет показал результат"],
    result: "заявка не зависает между сайтом, чатами и памятью менеджера",
  },
  {
    eyebrow: "Сценарий 02",
    title: "Обмен с 1С не превращается в черный ящик",
    description:
      "Товары, цены, остатки и статусы проходят через понятную схему: видно, где источник данных и где нужно ловить ошибку.",
    steps: ["разделили источники истины", "задали правила обмена", "проверили тестовые заказы", "вывели ошибки в контроль"],
    result: "команда понимает, где искать проблему, а не спорит, какая система виновата",
  },
  {
    eyebrow: "Сценарий 03",
    title: "Автоматизация помогает, а не шумит",
    description:
      "Роботы, уведомления и задачи привязаны к действиям клиента и этапам сделки, а не просто создают лишние сообщения.",
    steps: ["убрали лишние роботы", "оставили значимые события", "связали действия со стадиями", "проверили нагрузку команды"],
    result: "автоматизация ускоряет процесс и не раздражает людей",
  },
];

const principles = [
  {
    icon: Radar,
    title: "Сначала карта процесса",
    text: "Показываем, как заявка и данные идут между системами, прежде чем обещать дизайн, интеграцию или автоматизацию.",
  },
  {
    icon: ShieldCheck,
    title: "Одна зона ответственности",
    text: "Не размазываем работу между сайтом, CRM и 1С: фиксируем, кто за что отвечает и как проверяется результат.",
  },
  {
    icon: Gauge,
    title: "Контроль после запуска",
    text: "Страница должна продавать не только старт проекта, но и спокойное развитие системы после релиза.",
  },
] as const;

const serviceLinks = [
  {
    href: "/vnedrenie-bitrix24",
    title: "Внедрение Битрикс24",
    text: "CRM, воронки, роботы, права, отчеты и коммуникации.",
    icon: Route,
  },
  {
    href: "/razrabotka-saitov-na-1c-bitrix",
    title: "Сайты на 1С-Битрикс",
    text: "Структура, каталог, формы, SEO-основа и обмены с CRM.",
    icon: MonitorSmartphone,
  },
  {
    href: "/raboty-po-1c-predpriyatie",
    title: "Связка с 1С",
    text: "Заказы, остатки, цены, статусы и контроль ошибок обмена.",
    icon: ServerCog,
  },
] as const;

export function ImmersiveItConcept() {
  const [activeNodeId, setActiveNodeId] = useState("crm");
  const [activeScenario, setActiveScenario] = useState(0);
  const activeNode = useMemo(
    () => systemNodes.find((node) => node.id === activeNodeId) ?? systemNodes[1],
    [activeNodeId],
  );
  const activeScenarioData = scenarios[activeScenario] ?? scenarios[0];
  const ActiveIcon = activeNode.icon;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 24;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
    event.currentTarget.style.setProperty("--tilt-x", `${x.toFixed(2)}px`);
    event.currentTarget.style.setProperty("--tilt-y", `${y.toFixed(2)}px`);
  }

  function resetPointer(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--tilt-x", "0px");
    event.currentTarget.style.setProperty("--tilt-y", "0px");
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="it-contour-title">
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>Экспериментальная страница Onixbit</span>
          <h1 id="it-contour-title">Живой IT-контур, в котором CRM, сайт и 1С работают как одна система</h1>
          <p>
            Концепт в духе immersive digital-студий, но без пустого вау: анимация показывает,
            как заявка, данные, коммуникации и контроль проходят через реальный B2B-процесс.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#lead" data-obx-lead-open>
              <span>Обсудить такой формат</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <Link className={styles.secondaryAction} href="/">
              Вернуться на текущий сайт
            </Link>
          </div>
          <dl className={styles.signalGrid} aria-label="Что демонстрирует концепт">
            <div>
              <dt>5 узлов</dt>
              <dd>сайт, CRM, коммуникации, 1С и контроль</dd>
            </div>
            <div>
              <dt>3 сценария</dt>
              <dd>поток заявки, обмен данных и автоматизация</dd>
            </div>
            <div>
              <dt>Noindex</dt>
              <dd>страница не добавлена в меню и поиск</dd>
            </div>
          </dl>
        </div>

        <div
          className={styles.stage}
          aria-label="Интерактивная схема IT-контура Onixbit"
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
        >
          <div className={styles.stageChrome}>
            <span />
            <span />
            <span />
            <strong>Onixbit command layer</strong>
          </div>

          <svg className={styles.networkSvg} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <path className={styles.networkLine} d="M13 35 C 24 16, 30 12, 39 19 S 58 24, 71 31" />
            <path className={styles.networkLine} d="M39 19 C 32 41, 27 54, 25 72" />
            <path className={styles.networkLine} d="M71 31 C 66 45, 65 56, 67 72" />
            <path className={styles.networkLineStrong} d="M25 72 C 38 60, 52 59, 67 72" />
            <path className={styles.networkLineStrong} d="M13 35 C 30 48, 47 51, 67 72" />
          </svg>

          <span className={`${styles.packet} ${styles.packetOne}`} />
          <span className={`${styles.packet} ${styles.packetTwo}`} />
          <span className={`${styles.packet} ${styles.packetThree}`} />

          <div className={styles.core} aria-hidden="true">
            <Network size={34} />
            <span>Onixbit</span>
            <strong>единый контур</strong>
          </div>

          <div className={styles.nodeLayer}>
            {systemNodes.map((node) => {
              const Icon = node.icon;
              const isActive = node.id === activeNode.id;
              const nodeStyle: NodeStyle = {
                "--node-x": `${node.x}%`,
                "--node-y": `${node.y}%`,
              };

              return (
                <button
                  className={`${styles.node} ${isActive ? styles.activeNode : ""}`}
                  key={node.id}
                  style={nodeStyle}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveNodeId(node.id)}
                  onFocus={() => setActiveNodeId(node.id)}
                  onMouseEnter={() => setActiveNodeId(node.id)}
                >
                  <Icon size={24} aria-hidden="true" />
                  <span>{node.title}</span>
                  <small>{node.label}</small>
                </button>
              );
            })}
          </div>

          <aside className={styles.nodeDetails} aria-live="polite">
            <span className={styles.detailLabel}>
              <ActiveIcon size={18} aria-hidden="true" />
              {activeNode.title}
            </span>
            <strong>{activeNode.stat}</strong>
            <p>{activeNode.text}</p>
          </aside>
        </div>
      </section>

      <section className={styles.story} aria-labelledby="scenario-title">
        <div className={styles.sectionHead}>
          <span className={styles.kicker}>Scroll-сценарии вместо обычных блоков</span>
          <h2 id="scenario-title">Сайт объясняет не “что мы делаем”, а как система начинает работать</h2>
          <p>
            В финальной версии эти сцены можно связать со скроллом, чтобы посетитель видел путь от хаоса
            к управляемому процессу. В прототипе сценарии переключаются кликом и фокусом.
          </p>
        </div>

        <div className={styles.scenarioGrid}>
          <div className={styles.scenarioTabs} role="tablist" aria-label="Сценарии IT-контура">
            {scenarios.map((scenario, index) => {
              const isActive = index === activeScenario;

              return (
                <button
                  className={isActive ? styles.activeScenario : ""}
                  key={scenario.title}
                  id={"it-contour-scenario-tab-" + index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="it-contour-scenario-panel"
                  onClick={() => setActiveScenario(index)}
                  onFocus={() => setActiveScenario(index)}
                >
                  <span>{scenario.eyebrow}</span>
                  <strong>{scenario.title}</strong>
                </button>
              );
            })}
          </div>

          <article
            className={styles.scenarioPanel}
            id="it-contour-scenario-panel"
            role="tabpanel"
            aria-labelledby={"it-contour-scenario-tab-" + activeScenario}
          >
            <span>{activeScenarioData.eyebrow}</span>
            <h3>{activeScenarioData.title}</h3>
            <p>{activeScenarioData.description}</p>
            <ol>
              {activeScenarioData.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className={styles.resultBox}>
              <Sparkles size={20} aria-hidden="true" />
              <strong>{activeScenarioData.result}</strong>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.principles} aria-labelledby="principles-title">
        <div className={styles.sectionHead}>
          <span className={styles.kicker}>Почему это подходит IT-интегратору</span>
          <h2 id="principles-title">Визуальный эффект продает инженерную зрелость</h2>
        </div>

        <div className={styles.principleGrid}>
          {principles.map((item) => {
            const Icon = item.icon;

            return (
              <article className={styles.principleCard} key={item.title}>
                <Icon size={24} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.routes} aria-labelledby="routes-title">
        <div>
          <span className={styles.kicker}>Как развить дальше</span>
          <h2 id="routes-title">Из одного immersive-контура можно собрать входы в услуги</h2>
          <p>
            Если направление понравится, следующий шаг — привязать узлы схемы к реальным service-pages,
            кейсам, сертификатам и статьям, а не оставлять их декоративными объектами.
          </p>
        </div>
        <div className={styles.routeCards}>
          {serviceLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link className={styles.routeCard} href={item.href} key={item.href}>
                <Icon size={23} aria-hidden="true" />
                <strong>{item.title}</strong>
                <span>{item.text}</span>
                <em>
                  Открыть направление
                  <ArrowRight size={15} aria-hidden="true" />
                </em>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.finalCta} aria-label="Следующее действие">
        <div>
          <MousePointer2 size={24} aria-hidden="true" />
          <h2>Это прототип визуального языка, а не замена текущей главной</h2>
          <p>
            Его можно оценить отдельно: если ощущение верное, дальше аккуратно перенесем лучшие решения
            на главную или на страницы услуг.
          </p>
        </div>
        <a className={styles.primaryAction} href="#lead" data-obx-lead-open>
          <span>Обсудить доработку</span>
          <PhoneCall size={18} aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}
