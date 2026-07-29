"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock3,
  DatabaseZap,
  MessageCircle,
  MousePointerClick,
  Radio,
  Send,
  ShieldCheck,
  UserCheck,
  Workflow,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  diagnosisBoundaries,
  scenarios,
  type ScenarioId,
} from "./data";
import styles from "./home-final-cinema.module.css";

const routeSteps = [
  {
    id: "source",
    label: "Источник",
    status: "Новая",
    human: "Клиент пишет в WhatsApp/Wazzup или отправляет форму на сайте.",
    system: "В событии сохраняются страница, канал, UTM и смысл обращения.",
    result: "заявка не остаётся в чате или почте",
    icon: MessageCircle,
  },
  {
    id: "crm",
    label: "Битрикс24",
    status: "Сделка создана",
    human: "Обращение превращается в карточку сделки.",
    system: "CRM получает источник, сообщение, интерес и нужную воронку.",
    result: "менеджер видит контекст до первого звонка",
    icon: Workflow,
  },
  {
    id: "owner",
    label: "Ответственный",
    status: "Назначена",
    human: "Система выбирает роль или отдел для первого шага.",
    system: "Ответственный появляется в сделке, а руководитель видит владельца.",
    result: "у заявки появляется владелец",
    icon: UserCheck,
  },
  {
    id: "sla",
    label: "Задача/SLA",
    status: "В работе",
    human: "Менеджеру ставится задача первого касания.",
    system: "Робот запускает дедлайн и подсвечивает риск просрочки.",
    result: "срок первого действия контролируется",
    icon: Clock3,
  },
  {
    id: "exchange",
    label: "1С/обмен",
    status: "Синхронизирована",
    human: "Заказ, счёт или статус проверяются в учётной системе.",
    system: "CRM и 1С перестают спорить о цене, документе и статусе.",
    result: "обмен становится проверяемым",
    icon: DatabaseZap,
  },
  {
    id: "control",
    label: "Контроль",
    status: "Под контролем",
    human: "Руководитель видит весь маршрут и следующий риск.",
    system: "На дашборде сходятся источник, ответственный, SLA и обмен.",
    result: "процесс виден целиком",
    icon: BarChart3,
  },
] as const;

const scenarioOrder: ScenarioId[] = [
  "lost-leads",
  "site-sales",
  "crm-control",
  "onec-sync",
  "bitrix-tariff",
];

function getScenario(id: ScenarioId) {
  return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
}

function useRouteLoop(paused = false) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (paused || reduceMotion) return;

    const timer = window.setInterval(() => {
      setPhase((current) => (current + 1) % routeSteps.length);
    }, 1250);

    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  return { phase, setPhase, reduceMotion: Boolean(reduceMotion) };
}

function getPhaseClass(phase: number) {
  return styles[`leadPacketPhase${phase}` as keyof typeof styles] ?? "";
}

function getStepStateClass(index: number, phase: number) {
  if (index === phase) return styles.routeNodeActive;
  if (index < phase) return styles.routeNodeDone;
  return "";
}

function RouteCinemaVisual({
  phase,
  scenarioId,
  compact = false,
}: {
  phase: number;
  scenarioId: ScenarioId;
  compact?: boolean;
}) {
  const step = routeSteps[phase] ?? routeSteps[0];
  const StepIcon = step.icon;
  const scenario = getScenario(scenarioId);
  const activeProgress = `${Math.max(12, ((phase + 1) / routeSteps.length) * 100)}%`;

  return (
    <div className={compact ? styles.cinemaStageCompact : styles.cinemaStage}>
      <div className={styles.stageGrid} aria-hidden="true" />
      <div className={styles.energyRing} aria-hidden="true" />
      <div className={styles.routeRibbon} aria-hidden="true">
        <span style={{ width: activeProgress }} />
      </div>
      <div className={`${styles.leadPacket} ${getPhaseClass(phase)}`} aria-hidden="true">
        <Radio size={18} />
        <span>DEMO-248</span>
      </div>

      <div className={`${styles.sceneWindow} ${styles.windowMessenger} ${phase >= 0 ? styles.windowVisible : ""}`}>
        <div className={styles.windowTop}>
          <MessageCircle size={16} aria-hidden="true" />
          <span>Wazzup / WhatsApp</span>
        </div>
        <motion.div
          className={styles.clientMessage}
          key={`client-${phase === 0 ? "active" : "idle"}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          Нужен сайт + CRM + 1С. Заявки сейчас теряются.
        </motion.div>
        <div className={styles.eventTag}>
          <MousePointerClick size={15} aria-hidden="true" />
          <span>source_page: /vnedrenie-bitrix24</span>
        </div>
      </div>

      <div className={`${styles.sceneWindow} ${styles.windowCrm} ${phase >= 1 ? styles.windowVisible : ""}`}>
        <div className={styles.windowTop}>
          <Workflow size={16} aria-hidden="true" />
          <span>Битрикс24</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            className={styles.dealTicket}
            key={`${scenarioId}-${phase}`}
            initial={{ opacity: 0, x: 34, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -16, scale: 0.98 }}
            transition={{ duration: 0.32 }}
          >
            <span>{step.status}</span>
            <strong>{scenario.title}</strong>
            <small>{scenario.result}</small>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={`${styles.sceneWindow} ${styles.windowOps} ${phase >= 2 ? styles.windowVisible : ""}`}>
        <div className={styles.operatorAvatar} aria-hidden="true">
          <UserCheck size={24} />
        </div>
        <div>
          <span>Ответственный</span>
          <strong>{phase >= 2 ? "роль назначена" : "ожидает правила"}</strong>
        </div>
      </div>

      <div className={`${styles.sceneWindow} ${styles.windowSla} ${phase >= 3 ? styles.windowVisible : ""}`}>
        <Clock3 size={20} aria-hidden="true" />
        <div>
          <span>SLA первого ответа</span>
          <strong>{phase >= 3 ? "30 минут запущено" : "не контролируется"}</strong>
        </div>
      </div>

      <div className={`${styles.sceneWindow} ${styles.windowOnec} ${phase >= 4 ? styles.windowVisible : ""}`}>
        <DatabaseZap size={20} aria-hidden="true" />
        <div>
          <span>1С / обмен</span>
          <strong>{phase >= 4 ? "статус проверен" : "ждём синхронизацию"}</strong>
        </div>
        <div className={styles.syncBars} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>

      <div className={`${styles.sceneWindow} ${styles.windowControl} ${phase >= 5 ? styles.windowVisible : ""}`}>
        <BarChart3 size={20} aria-hidden="true" />
        <div>
          <span>Контроль руководителя</span>
          <strong>{phase >= 5 ? "маршрут собран" : "ждёт финальный статус"}</strong>
        </div>
      </div>

      <div className={styles.routeNodes} aria-label="Маршрут заявки">
        {routeSteps.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              className={`${styles.routeNode} ${getStepStateClass(index, phase)}`}
              key={item.id}
              type="button"
              aria-current={index === phase ? "step" : undefined}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.phaseCaption} aria-live="polite">
        <StepIcon size={18} aria-hidden="true" />
        <div>
          <span>{step.status}</span>
          <strong>{step.human}</strong>
          <p>{step.system}</p>
        </div>
      </div>
    </div>
  );
}

export function AnimatedHeroRoute() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("lost-leads");
  const [manualMode, setManualMode] = useState(false);
  const { phase, setPhase, reduceMotion } = useRouteLoop(manualMode);
  const scenario = getScenario(scenarioId);

  useEffect(() => {
    if (manualMode || reduceMotion) return;

    const timer = window.setInterval(() => {
      setScenarioId((current) => {
        const index = scenarioOrder.indexOf(current);
        return scenarioOrder[(index + 1) % scenarioOrder.length];
      });
    }, 7500);

    return () => window.clearInterval(timer);
  }, [manualMode, reduceMotion]);

  return (
    <section className={styles.animatedHeroRoute} aria-label="Анимированный маршрут заявки">
      <div className={styles.cinemaTopbar}>
        <div className={styles.liveBadge}>
          <span aria-hidden="true" />
          route simulation
        </div>
        <div className={styles.currentScenario} aria-live="polite">
          <AlertTriangle size={16} aria-hidden="true" />
          <span>{scenario.status}</span>
        </div>
      </div>

      <RouteCinemaVisual phase={phase} scenarioId={scenarioId} />

      <div className={styles.scenarioRail} aria-label="Сценарии маршрута">
        {scenarios.map((item) => (
          <button
            className={item.id === scenarioId ? styles.scenarioChoiceActive : styles.scenarioChoice}
            key={item.id}
            type="button"
            aria-pressed={item.id === scenarioId}
            onClick={() => {
              setManualMode(true);
              setScenarioId(item.id);
              setPhase(0);
            }}
          >
            <span>{item.title}</span>
            <small>{item.result}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export function ScrollDrivenRoute() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    let raf = 0;
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, travel)));
      setPhase(Math.min(routeSteps.length - 1, Math.floor(progress * routeSteps.length)));
    };

    const onScroll = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  const activeStep = routeSteps[phase] ?? routeSteps[0];
  const ActiveStepIcon = activeStep.icon;

  return (
    <section className={styles.scrollCinema} id="animation" ref={sectionRef} aria-labelledby="scroll-cinema-title">
      <div className={styles.scrollSticky}>
        <div className={styles.scrollCopy}>
          <span className={styles.eyebrow}>scroll-driven scene</span>
          <h2 id="scroll-cinema-title">Скролл проводит заявку через всю систему</h2>
          <p>
            Это уже не список преимуществ: картинка меняется вместе с шагом процесса, как в
            продуктовой демонстрации.
          </p>
          <div className={styles.scrollStepText} aria-live="polite">
            <ActiveStepIcon size={20} aria-hidden="true" />
            <div>
              <strong>{activeStep.label}</strong>
              <span>{activeStep.result}</span>
            </div>
          </div>
        </div>
        <RouteCinemaVisual phase={reduceMotion ? 5 : phase} scenarioId="lost-leads" compact />
      </div>
    </section>
  );
}

export function CinemaDiagnosis() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("lost-leads");
  const [submitted, setSubmitted] = useState(false);
  const scenario = getScenario(scenarioId);

  return (
    <section className={styles.diagnosisCinema} id="diagnosis" aria-label="Диагностика маршрута">
      <div>
        <span className={styles.eyebrow}>первый безопасный шаг</span>
        <h2>Диагностика маршрута заявки</h2>
        <p>
          После анимации человек должен не просто впечатлиться, а выбрать свою проблему и понять,
          что именно получит на первом разборе.
        </p>
        <div className={styles.boundaryList}>
          {diagnosisBoundaries.slice(0, 3).map((item) => (
            <span key={item}>
              <ShieldCheck size={16} aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </div>
      <form
        className={styles.cinemaForm}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <fieldset>
          <legend>Сценарий для разбора</legend>
          {scenarios.map((item) => (
            <button
              className={item.id === scenarioId ? styles.formScenarioActive : styles.formScenario}
              type="button"
              key={item.id}
              aria-pressed={item.id === scenarioId}
              onClick={() => setScenarioId(item.id)}
            >
              {item.title}
            </button>
          ))}
        </fieldset>
        <div className={styles.formResult} aria-live="polite">
          <Activity size={18} aria-hidden="true" />
          <div>
            <span>{submitted ? "CRM отключена на preview" : "Будущий результат"}</span>
            <strong>{scenario.result}</strong>
          </div>
        </div>
        <button className={styles.formSubmit} type="submit">
          <Send size={18} aria-hidden="true" />
          Смоделировать диагностику
        </button>
      </form>
    </section>
  );
}
