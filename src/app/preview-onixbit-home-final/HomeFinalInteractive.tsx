"use client";

import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  DatabaseZap,
  FileSearch,
  Flag,
  Gauge,
  GitBranch,
  Globe2,
  PhoneCall,
  Route,
  Send,
  ShieldCheck,
  UserCheck,
  Workflow,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  diagnosisBoundaries,
  mockDataDictionary,
  routeSteps,
  scenarios,
  storyboardFrames,
  type RouteStepId,
  type ScenarioId,
} from "./data";
import styles from "./home-final.module.css";

const scenarioSequence: ScenarioId[] = [
  "lost-leads",
  "crm-control",
  "site-sales",
  "onec-sync",
  "bitrix-tariff",
];

const stepIcons: Record<RouteStepId, LucideIcon> = {
  source: Globe2,
  crm: Workflow,
  owner: UserCheck,
  sla: Clock3,
  exchange: DatabaseZap,
  control: Gauge,
};

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

export function ProcessStand() {
  const reducedMotion = usePrefersReducedMotion();
  const [scenarioId, setScenarioId] = useState<ScenarioId>("lost-leads");
  const [frameIndex, setFrameIndex] = useState(0);
  const [manualMode, setManualMode] = useState(false);
  const activeFrame = storyboardFrames[frameIndex] ?? storyboardFrames[0];
  const selectedScenario = getScenario(scenarioId);

  useEffect(() => {
    if (reducedMotion || manualMode) return;

    const timer = window.setInterval(() => {
      setFrameIndex((current) => {
        const nextFrame = (current + 1) % storyboardFrames.length;
        setScenarioId(scenarioSequence[nextFrame % scenarioSequence.length]);
        return nextFrame;
      });
    }, 1400);

    return () => window.clearInterval(timer);
  }, [manualMode, reducedMotion]);

  const activeNodeSet = useMemo(() => {
    const ids = manualMode ? selectedScenario.route : activeFrame.activeNodes;
    return new Set<RouteStepId>(ids);
  }, [activeFrame.activeNodes, manualMode, selectedScenario.route]);

  const currentStatus = manualMode ? selectedScenario.status : activeFrame.title;

  return (
    <section className={styles.processStand} aria-label="Интерактивный маршрут заявки">
      <div className={styles.processTop}>
        <div>
          <span className={styles.kicker}>живой маршрут</span>
          <h2>Где заявка становится управляемой</h2>
        </div>
        <div className={styles.processStatus} aria-live="polite">
          <Route size={16} aria-hidden="true" />
          <span>{currentStatus}</span>
        </div>
      </div>

      <div className={styles.scenarioTabs} aria-label="Сценарии диагностики">
        {scenarios.map((scenario) => {
          const isActive = scenario.id === scenarioId;

          return (
            <button
              className={isActive ? styles.scenarioTabActive : styles.scenarioTab}
              type="button"
              key={scenario.id}
              aria-pressed={isActive}
              onClick={() => {
                setManualMode(true);
                setScenarioId(scenario.id);
                setFrameIndex(0);
              }}
            >
              <span>{scenario.tab}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.routeRail} aria-label="Узлы маршрута">
        {routeSteps.map((step, index) => {
          const StepIcon = stepIcons[step.id];
          const isActive = activeNodeSet.has(step.id);
          const isScenarioCore = selectedScenario.route.includes(step.id);

          return (
            <article
              className={[
                styles.routeNode,
                isActive ? styles.routeNodeActive : "",
                isScenarioCore ? styles.routeNodeInScenario : "",
              ].join(" ")}
              key={step.id}
            >
              <div className={styles.routeNodeHead}>
                <span className={styles.routeNodeIndex}>{String(index + 1).padStart(2, "0")}</span>
                <StepIcon size={18} aria-hidden="true" />
              </div>
              <h3>{step.shortLabel}</h3>
              <p>{step.system}</p>
              <small>{step.mockValue}</small>
            </article>
          );
        })}
      </div>

      <div className={styles.processBody}>
        <article className={styles.signalPanel}>
          <span className={styles.kicker}>сценарий</span>
          <h3>{selectedScenario.title}</h3>
          <p>{selectedScenario.pain}</p>
          <div className={styles.signalResult}>
            <CheckCircle2 size={18} aria-hidden="true" />
            <strong>{selectedScenario.result}</strong>
          </div>
        </article>

        <article className={styles.mockPanel}>
          <div className={styles.mockPanelHead}>
            <FileSearch size={18} aria-hidden="true" />
            <span>safe mock-data</span>
          </div>
          <ul>
            {selectedScenario.mockRows.map((row) => (
              <li key={row}>{row}</li>
            ))}
          </ul>
        </article>

        <article className={styles.meaningPanel}>
          <span className={styles.kicker}>бизнес-смысл</span>
          <p>{manualMode ? selectedScenario.businessMeaning : activeFrame.businessMeaning}</p>
          <div className={styles.motionHint}>
            {reducedMotion ? (
              <>
                <ShieldCheck size={16} aria-hidden="true" />
                <span>{activeFrame.reducedMotion}</span>
              </>
            ) : (
              <>
                <GitBranch size={16} aria-hidden="true" />
                <span>{activeFrame.motionCue}</span>
              </>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

export function StoryboardStrip() {
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % storyboardFrames.length);
    }, 1300);

    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <section className={styles.storyboardStrip} aria-label="Storyboard первых десяти секунд">
      <div className={styles.sectionIntro}>
        <span className={styles.kicker}>0-10 секунд</span>
        <h2>Storyboard первого экрана</h2>
        <p>
          Порядок кадров уже согласован в P0: каждый кадр показывает не эффект, а бизнес-причину
          следующего шага.
        </p>
      </div>
      <div className={styles.frameGrid}>
        {storyboardFrames.map((frame, index) => (
          <article
            className={index === activeIndex ? styles.frameCardActive : styles.frameCard}
            key={`${frame.time}-${frame.title}`}
          >
            <div className={styles.frameMeta}>
              <span>{frame.time}</span>
              <Flag size={15} aria-hidden="true" />
            </div>
            <h3>{frame.title}</h3>
            <p>{frame.businessMeaning}</p>
            <small>{reducedMotion ? frame.reducedMotion : frame.motionCue}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DiagnosisSimulator() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("lost-leads");
  const [source, setSource] = useState("Форма и чат сайта");
  const [checks, setChecks] = useState({
    crm: true,
    onec: true,
    tariff: false,
  });
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const selectedScenario = getScenario(scenarioId);

  const selectedChecks = [
    checks.crm ? "CRM-маршрут" : null,
    checks.onec ? "1С/обмен" : null,
    checks.tariff ? "тариф Битрикс24" : null,
  ].filter(Boolean);

  return (
    <section className={styles.diagnosisGrid} id="diagnosis" aria-label="Preview диагностики маршрута">
      <form
        className={styles.diagnosisForm}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className={styles.formTop}>
          <span className={styles.kicker}>preview simulation</span>
          <h2>Разобрать мой маршрут</h2>
          <p>
            На preview данные не отправляются. Это безопасная модель будущей формы для согласования
            сценариев и текста.
          </p>
        </div>

        <fieldset className={styles.optionGroup}>
          <legend>Что сейчас болит</legend>
          <div className={styles.optionGrid}>
            {scenarios.map((scenario) => (
              <button
                className={scenario.id === scenarioId ? styles.choiceActive : styles.choice}
                type="button"
                key={scenario.id}
                aria-pressed={scenario.id === scenarioId}
                onClick={() => setScenarioId(scenario.id)}
              >
                {scenario.title}
              </button>
            ))}
          </div>
        </fieldset>

        <label className={styles.fieldLabel}>
          Где начинается заявка
          <select value={source} onChange={(event) => setSource(event.target.value)}>
            <option>Форма и чат сайта</option>
            <option>Телефония и мессенджеры</option>
            <option>CRM без сайта</option>
            <option>Сайт + CRM + 1С</option>
          </select>
        </label>

        <fieldset className={styles.checkGroup}>
          <legend>Нужно проверить</legend>
          <label>
            <input
              type="checkbox"
              checked={checks.crm}
              onChange={(event) => setChecks((value) => ({ ...value, crm: event.target.checked }))}
            />
            CRM, роли, задачи и SLA
          </label>
          <label>
            <input
              type="checkbox"
              checked={checks.onec}
              onChange={(event) => setChecks((value) => ({ ...value, onec: event.target.checked }))}
            />
            1С, документы, статусы и обмен
          </label>
          <label>
            <input
              type="checkbox"
              checked={checks.tariff}
              onChange={(event) => setChecks((value) => ({ ...value, tariff: event.target.checked }))}
            />
            тариф и ограничения Битрикс24
          </label>
        </fieldset>

        <label className={styles.fieldLabel}>
          Комментарий без персональных данных
          <textarea
            maxLength={260}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Например: заявки приходят с сайта, но ответственного и срок первого ответа не видно."
          />
        </label>

        <button className={styles.submitButton} type="submit">
          <Send size={18} aria-hidden="true" />
          <span>Смоделировать диагностику</span>
        </button>
      </form>

      <aside className={styles.diagnosisResult} aria-live="polite">
        <div className={styles.resultHead}>
          <ShieldCheck size={22} aria-hidden="true" />
          <div>
            <span className={styles.kicker}>безопасный результат</span>
            <h3>{submitted ? "Заявка не отправлена в CRM" : "Что увидит пользователь"}</h3>
          </div>
        </div>
        <div className={styles.resultBox}>
          <p>
            Сценарий: <strong>{selectedScenario.title}</strong>
          </p>
          <p>
            Старт: <strong>{source}</strong>
          </p>
          <p>
            Проверка: <strong>{selectedChecks.join(", ") || "не выбрана"}</strong>
          </p>
          <p>
            Вывод: <strong>{selectedScenario.result}</strong>
          </p>
        </div>
        <div className={styles.localEventLog}>
          <span>
            <PhoneCall size={15} aria-hidden="true" />
            event: preview_form_submit
          </span>
          <span>
            <AlertTriangle size={15} aria-hidden="true" />
            crm: disabled_on_preview
          </span>
          <span>
            <ArrowRight size={15} aria-hidden="true" />
            next_step: route_diagnosis
          </span>
        </div>
        <div className={styles.boundaryList}>
          <h4>Границы offer</h4>
          <ul>
            {diagnosisBoundaries.map((boundary) => (
              <li key={boundary}>{boundary}</li>
            ))}
          </ul>
        </div>
        <div className={styles.dictionaryMini}>
          <h4>Mock-data dictionary</h4>
          {mockDataDictionary.slice(0, 4).map((item) => (
            <p key={item.key}>
              <code>{item.key}</code> = {item.safeExample}
            </p>
          ))}
        </div>
      </aside>
    </section>
  );
}
