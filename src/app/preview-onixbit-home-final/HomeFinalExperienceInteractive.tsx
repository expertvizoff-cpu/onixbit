"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  DatabaseZap,
  Gauge,
  MessageCircle,
  PhoneCall,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Workflow,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  diagnosisBoundaries,
  routeSteps,
  scenarios,
  type RouteStepId,
  type ScenarioId,
} from "./data";
import styles from "./home-final-experience.module.css";

const scenarioSequence: ScenarioId[] = [
  "lost-leads",
  "site-sales",
  "crm-control",
  "onec-sync",
  "bitrix-tariff",
];

const routeStepOrder: RouteStepId[] = [
  "source",
  "crm",
  "owner",
  "sla",
  "exchange",
  "control",
];

const channelLabels = {
  "lost-leads": "Wazzup / WhatsApp",
  "crm-control": "Битрикс24",
  "site-sales": "Форма сайта",
  "onec-sync": "CRM + 1С",
  "bitrix-tariff": "Тариф Битрикс24",
} satisfies Record<ScenarioId, string>;

function getScenario(id: ScenarioId) {
  return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reducedMotion;
}

export function ExperienceCockpit() {
  const reducedMotion = usePrefersReducedMotion();
  const [scenarioId, setScenarioId] = useState<ScenarioId>("lost-leads");
  const [stepIndex, setStepIndex] = useState(0);
  const [manualMode, setManualMode] = useState(false);
  const scenario = getScenario(scenarioId);
  const activeStepId = scenario.route[stepIndex % scenario.route.length] ?? scenario.activeStep;
  const activeStep = routeSteps.find((step) => step.id === activeStepId) ?? routeSteps[0];

  useEffect(() => {
    if (reducedMotion) return;

    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        const next = current + 1;
        if (!manualMode && next % 5 === 0) {
          const nextScenarioIndex =
            (scenarioSequence.indexOf(scenarioId) + 1) % scenarioSequence.length;
          setScenarioId(scenarioSequence[nextScenarioIndex]);
          return 0;
        }

        return next;
      });
    }, 1350);

    return () => window.clearInterval(timer);
  }, [manualMode, reducedMotion, scenarioId]);

  const activeNodeSet = useMemo(() => {
    const activeIndex = routeStepOrder.indexOf(activeStepId);
    return new Set(routeStepOrder.slice(0, activeIndex + 1));
  }, [activeStepId]);

  return (
    <section className={styles.cockpit} aria-label="Живой маршрут заявки Onixbit">
      <div className={styles.cockpitTop}>
        <div className={styles.signalCluster}>
          <span className={styles.liveDot} aria-hidden="true" />
          <span>live process</span>
        </div>
        <div className={styles.cockpitStatus} aria-live="polite">
          <Sparkles size={16} aria-hidden="true" />
          <span>{scenario.status}</span>
        </div>
      </div>

      <div className={styles.cockpitStage}>
        <article className={styles.messengerWindow}>
          <div className={styles.windowBar}>
            <MessageCircle size={16} aria-hidden="true" />
            <span>{channelLabels[scenario.id]}</span>
          </div>
          <div className={styles.chatBubbleClient}>
            Нужен сайт, CRM и обмен с 1С. Заявки сейчас теряются.
          </div>
          <div className={styles.chatBubbleSystem}>
            Источник и страница уже переданы в сделку.
          </div>
          <div className={styles.incomingLead}>
            <PhoneCall size={16} aria-hidden="true" />
            <div>
              <strong>DEMO-248</strong>
              <span>{activeStep.mockValue}</span>
            </div>
          </div>
        </article>

        <div className={styles.routeBeam} aria-label="Маршрут заявки">
          {routeStepOrder.map((id, index) => {
            const step = routeSteps.find((item) => item.id === id) ?? routeSteps[0];
            const isDone = activeNodeSet.has(id);
            const isActive = id === activeStepId;

            return (
              <div
                className={[
                  styles.beamNode,
                  isDone ? styles.beamNodeDone : "",
                  isActive ? styles.beamNodeActive : "",
                ].join(" ")}
                key={id}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step.shortLabel}</strong>
              </div>
            );
          })}
        </div>

        <article className={styles.crmBoard}>
          <div className={styles.windowBar}>
            <Workflow size={16} aria-hidden="true" />
            <span>Битрикс24 / сделка</span>
          </div>
          <div className={styles.dealCardLive}>
            <div>
              <span>Новая сделка</span>
              <strong>{scenario.title}</strong>
            </div>
            <CheckCircle2 size={18} aria-hidden="true" />
          </div>
          <div className={styles.pipeline}>
            <span>Новая</span>
            <span>Квалификация</span>
            <span>КП</span>
            <span>Контроль</span>
          </div>
        </article>

        <article className={styles.controlStack}>
          <div className={styles.controlTileAccent}>
            <UserCheck size={18} aria-hidden="true" />
            <span>Ответственный</span>
            <strong>роль назначена</strong>
          </div>
          <div className={styles.controlTile}>
            <Clock3 size={18} aria-hidden="true" />
            <span>SLA</span>
            <strong>30 минут</strong>
          </div>
          <div className={styles.controlTile}>
            <DatabaseZap size={18} aria-hidden="true" />
            <span>1С</span>
            <strong>обмен проверен</strong>
          </div>
          <div className={styles.controlTile}>
            <Gauge size={18} aria-hidden="true" />
            <span>Контроль</span>
            <strong>риск виден</strong>
          </div>
        </article>
      </div>

      <div className={styles.scenarioDock} aria-label="Выбор сценария">
        {scenarios.map((item) => {
          const isActive = item.id === scenarioId;

          return (
            <button
              className={isActive ? styles.scenarioButtonActive : styles.scenarioButton}
              key={item.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                setManualMode(true);
                setScenarioId(item.id);
                setStepIndex(0);
              }}
            >
              <span>{item.title}</span>
              <small>{item.result}</small>
            </button>
          );
        })}
      </div>

      <div className={styles.cockpitFooter}>
        <strong>{activeStep.label}</strong>
        <span>{scenario.businessMeaning}</span>
      </div>
    </section>
  );
}

export function ExperienceDiagnosis() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("lost-leads");
  const [source, setSource] = useState("Wazzup / WhatsApp + форма сайта");
  const [submitted, setSubmitted] = useState(false);
  const scenario = getScenario(scenarioId);

  return (
    <section className={styles.diagnosisExperience} id="diagnosis" aria-label="Диагностика маршрута">
      <div className={styles.diagnosisCopy}>
        <span className={styles.eyebrow}>диагностика маршрута</span>
        <h2>Покажем, где цепочка ломается, до того как вы начнёте внедрение</h2>
        <p>
          Preview-форма не отправляет данные в CRM. Она показывает будущую механику заявки:
          какой сценарий выбрать, какие границы обещать и что отдавать клиенту после разбора.
        </p>
        <div className={styles.boundaryRail}>
          {diagnosisBoundaries.slice(0, 3).map((item) => (
            <div key={item}>
              <ShieldCheck size={17} aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <form
        className={styles.diagnosisCard}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <fieldset className={styles.fieldsetReset}>
          <legend>Что проверить первым</legend>
          <div className={styles.diagnosisChoices}>
            {scenarios.map((item) => (
              <button
                className={item.id === scenarioId ? styles.choiceButtonActive : styles.choiceButton}
                type="button"
                key={item.id}
                aria-pressed={item.id === scenarioId}
                onClick={() => setScenarioId(item.id)}
              >
                {item.title}
              </button>
            ))}
          </div>
        </fieldset>

        <label className={styles.diagnosisField}>
          Где начинается обращение
          <select value={source} onChange={(event) => setSource(event.target.value)}>
            <option>Wazzup / WhatsApp + форма сайта</option>
            <option>Телефония, чат и мессенджеры</option>
            <option>Только сайт без CRM</option>
            <option>Битрикс24 + 1С</option>
          </select>
        </label>

        <div className={styles.previewOutcome} aria-live="polite">
          <AlertTriangle size={18} aria-hidden="true" />
          <div>
            <span>{submitted ? "CRM отключена на preview" : "Предварительный вывод"}</span>
            <strong>{scenario.result}</strong>
            <small>{source}</small>
          </div>
        </div>

        <button className={styles.diagnosisSubmit} type="submit">
          <Send size={18} aria-hidden="true" />
          <span>Смоделировать диагностику</span>
        </button>

        <p className={styles.formFootnote}>
          Реальные телефоны, токены, webhook URL и персональные данные сюда не вводим.
        </p>
      </form>
    </section>
  );
}
