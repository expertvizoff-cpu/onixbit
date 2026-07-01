"use client";

import Link from "next/link";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  DatabaseZap,
  Gauge,
  MessageSquareText,
  MonitorSmartphone,
  Network,
  Radar,
  Route,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import styles from "./ImmersiveItConcept.module.css";

type SceneNode = {
  id: string;
  title: string;
  short: string;
  descriptor: string;
  detail: string;
  metric: string;
  x: number;
  y: number;
  z: number;
  tone: string;
  icon: LucideIcon;
};

type SceneMode = {
  id: string;
  label: string;
  title: string;
  focusNodeId: string;
  summary: string;
  checkpoints: string[];
  result: string;
};

type SceneLink = {
  from: string;
  to: string;
  modes: string[];
};

type PointerPosition = {
  x: number;
  y: number;
};

type NodeStyle = CSSProperties & Record<`--${string}`, string | number>;

const sceneNodes: SceneNode[] = [
  {
    id: "site",
    title: "Сайт",
    short: "вход и контекст",
    descriptor: "формы, каталог, заявки, источники",
    detail:
      "Витрина не просто собирает обращения. Она передает в CRM источник, услугу, товар, город, вложения и технический контекст без ручного копирования.",
    metric: "меньше потерь на первом касании",
    x: 0.18,
    y: 0.39,
    z: 0.72,
    tone: "#65f0ff",
    icon: MonitorSmartphone,
  },
  {
    id: "crm",
    title: "Битрикс24",
    short: "процесс продаж",
    descriptor: "лиды, сделки, задачи, права, роботы",
    detail:
      "CRM держит маршрут сделки: стадия, ответственный, срок, коммуникации и следующий шаг видны без поиска в чатах и таблицах.",
    metric: "управляемая работа отдела продаж",
    x: 0.5,
    y: 0.28,
    z: 1,
    tone: "#f8f2a4",
    icon: Workflow,
  },
  {
    id: "comms",
    title: "Связь",
    short: "история диалога",
    descriptor: "телефония, мессенджеры, почта",
    detail:
      "Звонки и сообщения попадают в карточку клиента, а менеджер видит историю обращения рядом со сделкой и задачами.",
    metric: "диалог не распадается по каналам",
    x: 0.79,
    y: 0.42,
    z: 0.62,
    tone: "#ff6f61",
    icon: MessageSquareText,
  },
  {
    id: "onec",
    title: "1С",
    short: "учет и обмен",
    descriptor: "остатки, цены, заказы, оплаты",
    detail:
      "1С остается источником учетной истины там, где это нужно бизнесу: цены, остатки, статусы, оплаты и документы проходят по понятным правилам обмена.",
    metric: "меньше двойного ввода и спорных данных",
    x: 0.32,
    y: 0.73,
    z: 0.78,
    tone: "#a7ff83",
    icon: DatabaseZap,
  },
  {
    id: "control",
    title: "Контроль",
    short: "сроки и риски",
    descriptor: "отчеты, SLA, ошибки, нагрузка",
    detail:
      "Руководитель видит не набор настроек, а состояние контура: где зависла заявка, где сломался обмен и какой участок перегружен.",
    metric: "проблемы видны до пожара",
    x: 0.68,
    y: 0.73,
    z: 0.86,
    tone: "#ffffff",
    icon: BarChart3,
  },
];

const sceneLinks: SceneLink[] = [
  { from: "site", to: "crm", modes: ["request", "control"] },
  { from: "crm", to: "comms", modes: ["request", "automation"] },
  { from: "crm", to: "onec", modes: ["data", "automation"] },
  { from: "onec", to: "control", modes: ["data", "control"] },
  { from: "comms", to: "control", modes: ["control"] },
  { from: "site", to: "control", modes: ["request", "control"] },
];

const sceneModes: SceneMode[] = [
  {
    id: "request",
    label: "Заявка",
    title: "Путь клиента не обрывается после формы",
    focusNodeId: "site",
    summary:
      "Сайт фиксирует запрос, Битрикс24 назначает ответственного, коммуникации ложатся в карточку, контроль показывает срок реакции.",
    checkpoints: ["источник и услуга", "ответственный", "следующее действие", "контроль срока"],
    result: "обращение попадает в процесс, а не в личную память менеджера",
  },
  {
    id: "data",
    label: "Данные",
    title: "Учетные данные имеют один маршрут",
    focusNodeId: "onec",
    summary:
      "Цены, остатки, статусы и документы идут между сайтом, CRM и 1С по схеме, где виден источник истины и место ошибки.",
    checkpoints: ["источник истины", "правило обмена", "тестовый заказ", "лог ошибки"],
    result: "команда быстро понимает, где сбой, и не спорит между системами",
  },
  {
    id: "automation",
    label: "Автоматизация",
    title: "Роботы работают как продолжение процесса",
    focusNodeId: "crm",
    summary:
      "Автоматизация привязана к стадиям сделки, действиям клиента и ответственности команды, а не создает шум из лишних уведомлений.",
    checkpoints: ["стадии", "условия", "уведомления", "нагрузка"],
    result: "система ускоряет людей и не превращается в фоновые сигналы",
  },
];

const serviceRoutes = [
  {
    href: "/vnedrenie-bitrix24",
    title: "Битрикс24",
    text: "воронки, права, роботы, отчеты",
    icon: Route,
  },
  {
    href: "/razrabotka-saitov-na-1c-bitrix",
    title: "1С-Битрикс",
    text: "сайт, формы, каталог, SEO-основа",
    icon: MonitorSmartphone,
  },
  {
    href: "/raboty-po-1c-predpriyatie",
    title: "1С и обмены",
    text: "заказы, остатки, цены, статусы",
    icon: ServerCog,
  },
] as const;

const fieldPoints = Array.from({ length: 86 }, (_, index) => ({
  x: ((index * 37) % 100) / 100,
  y: ((index * 53 + 11) % 100) / 100,
  z: 0.25 + (((index * 19) % 100) / 100) * 0.75,
}));

function getNode(id: string) {
  return sceneNodes.find((node) => node.id === id) ?? sceneNodes[1];
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function projectNode(node: SceneNode, width: number, height: number, pointer: PointerPosition) {
  const depth = 0.7 + node.z * 0.44;
  const x = width * node.x + (node.x - 0.5) * pointer.x * width * 0.08 * depth;
  const y = height * node.y + (node.y - 0.5) * pointer.y * height * 0.08 * depth;
  const radius = 12 + node.z * 12;

  return { x, y, radius };
}

function drawScene(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: PointerPosition,
  activeNodeId: string,
  activeModeId: string,
  reducedMotion: boolean,
) {
  const phase = reducedMotion ? 0.42 : time / 1000;
  const centerX = width * 0.5 + pointer.x * 22;
  const centerY = height * 0.54 + pointer.y * 18;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#020306";
  context.fillRect(0, 0, width, height);

  const background = context.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "rgba(7, 19, 26, 0.92)");
  background.addColorStop(0.43, "rgba(3, 5, 10, 0.98)");
  background.addColorStop(1, "rgba(18, 10, 8, 0.92)");
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  if (!reducedMotion) {
    const telemetryAlpha = 0.012 + Math.sin(phase * 1.9) * 0.008;
    context.fillStyle = "rgba(101, 240, 255, " + telemetryAlpha + ")";
    context.fillRect(0, 0, width, height);
  }

  context.save();
  context.translate(centerX, centerY);
  context.rotate(-0.16 + pointer.x * 0.02);
  context.strokeStyle = "rgba(184, 255, 235, 0.055)";
  context.lineWidth = 1;
  for (let index = -10; index <= 10; index += 1) {
    const offset = index * Math.max(width, height) * 0.08 + ((phase * 18) % 42);
    context.beginPath();
    context.moveTo(-width, offset);
    context.lineTo(width, offset * 0.22);
    context.stroke();
  }
  context.restore();

  context.save();
  for (const point of fieldPoints) {
    const drift = reducedMotion ? 0 : Math.sin(phase * (0.25 + point.z) + point.x * 12) * 6;
    const x = width * point.x + pointer.x * point.z * 26;
    const y = height * point.y + pointer.y * point.z * 20 + drift;
    const size = 0.8 + point.z * 1.5;
    context.fillStyle = `rgba(210, 246, 255, ${0.08 + point.z * 0.18})`;
    context.fillRect(x, y, size, size);
  }
  context.restore();

  const projected = new Map(sceneNodes.map((node) => [node.id, projectNode(node, width, height, pointer)]));

  for (const link of sceneLinks) {
    const fromNode = getNode(link.from);
    const toNode = getNode(link.to);
    const from = projected.get(link.from);
    const to = projected.get(link.to);
    if (!from || !to) continue;

    const isActive = link.modes.includes(activeModeId) || link.from === activeNodeId || link.to === activeNodeId;
    const midX = (from.x + to.x) / 2 + pointer.x * 18;
    const midY = (from.y + to.y) / 2 - 72 * (0.6 + Math.abs(fromNode.z - toNode.z));
    const gradient = context.createLinearGradient(from.x, from.y, to.x, to.y);
    gradient.addColorStop(0, hexToRgba(fromNode.tone, isActive ? 0.68 : 0.16));
    gradient.addColorStop(1, hexToRgba(toNode.tone, isActive ? 0.58 : 0.14));

    context.save();
    context.strokeStyle = gradient;
    context.lineWidth = isActive ? 2.2 : 1;
    context.setLineDash(isActive ? [16, 18] : [4, 16]);
    context.lineDashOffset = reducedMotion ? 0 : -phase * (isActive ? 42 : 12);
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.quadraticCurveTo(midX, midY, to.x, to.y);
    context.stroke();
    context.restore();

    if (isActive) {
      const packet = (phase * 0.18 + link.from.length * 0.071) % 1;
      const packetX = from.x * (1 - packet) + to.x * packet;
      const packetY = from.y * (1 - packet) + to.y * packet - Math.sin(packet * Math.PI) * 54;
      context.beginPath();
      context.arc(packetX, packetY, 3.6, 0, Math.PI * 2);
      context.fillStyle = "rgba(255, 255, 255, 0.92)";
      context.shadowColor = hexToRgba(toNode.tone, 0.9);
      context.shadowBlur = 18;
      context.fill();
      context.shadowBlur = 0;
    }
  }

  context.save();
  context.translate(centerX, centerY);
  for (let index = 0; index < 4; index += 1) {
    const radius = Math.max(1, Math.min(width, height) * (0.16 + index * 0.09) + Math.sin(phase + index) * 3);
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.strokeStyle = `rgba(255, 244, 164, ${0.09 - index * 0.014})`;
    context.lineWidth = 1;
    context.stroke();
  }
  context.restore();

  for (const node of sceneNodes) {
    const point = projected.get(node.id);
    if (!point) continue;
    const isActive = node.id === activeNodeId;
    const pulse = reducedMotion ? 1 : 1 + Math.sin(phase * 2.4 + node.x * 9) * 0.08;

    context.beginPath();
    context.arc(point.x, point.y, point.radius * (isActive ? 3.2 : 2.1) * pulse, 0, Math.PI * 2);
    context.fillStyle = hexToRgba(node.tone, isActive ? 0.11 : 0.045);
    context.fill();

    context.beginPath();
    context.arc(point.x, point.y, point.radius * (isActive ? 1.35 : 0.92), 0, Math.PI * 2);
    context.fillStyle = hexToRgba(node.tone, isActive ? 0.82 : 0.52);
    context.shadowColor = hexToRgba(node.tone, 0.82);
    context.shadowBlur = isActive ? 26 : 12;
    context.fill();
    context.shadowBlur = 0;
  }
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

export function ImmersiveItConcept() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<PointerPosition>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState("crm");
  const [activeModeIndex, setActiveModeIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  const activeMode = sceneModes[activeModeIndex] ?? sceneModes[0];
  const activeNode = useMemo(() => getNode(activeNodeId), [activeNodeId]);
  const ActiveNodeIcon = activeNode.icon;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return undefined;

    let animationFrame = 0;
    let disposed = false;
    let viewportWidth = 0;
    let viewportHeight = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      viewportWidth = Math.max(1, rect.width);
      viewportHeight = Math.max(1, rect.height);
      canvas.width = Math.floor(viewportWidth * dpr);
      canvas.height = Math.floor(viewportHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (time: number) => {
      drawScene(
        context,
        viewportWidth,
        viewportHeight,
        time,
        pointerRef.current,
        activeNodeId,
        activeMode.id,
        reducedMotion,
      );

      if (!disposed && !reducedMotion) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const observer = new ResizeObserver(() => {
      resize();
      render(0);
    });

    observer.observe(canvas);
    resize();
    render(0);

    return () => {
      disposed = true;
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [activeMode.id, activeNodeId, reducedMotion]);

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    pointerRef.current = { x, y };
    event.currentTarget.style.setProperty("--pointer-x", x.toFixed(3));
    event.currentTarget.style.setProperty("--pointer-y", y.toFixed(3));
  }

  function resetPointer(event: ReactPointerEvent<HTMLDivElement>) {
    pointerRef.current = { x: 0, y: 0 };
    event.currentTarget.style.setProperty("--pointer-x", "0");
    event.currentTarget.style.setProperty("--pointer-y", "0");
  }

  function selectMode(index: number) {
    const mode = sceneModes[index] ?? sceneModes[0];
    setActiveModeIndex(index);
    setActiveNodeId(mode.focusNodeId);
  }

  return (
    <div
      className={`${styles.shell} obx-it-exhibit`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" data-testid="it-exhibit-canvas" />
      <div className={styles.texture} aria-hidden="true" />

      <header className={styles.topbar}>
        <Link className={styles.brand} href="/" aria-label="Ониксбит, на главную">
          <span>ONIXBIT</span>
          <strong>systems exhibit</strong>
        </Link>
        <nav className={styles.topnav} aria-label="Навигация концепта">
          <Link href="/">Текущий сайт</Link>
          <a href="#lead" data-obx-lead-open>
            Бриф
          </a>
        </nav>
      </header>

      <main className={styles.exhibit} aria-labelledby="it-exhibit-title">
        <section className={styles.intro}>
          <span className={styles.kicker}>immersive IT experience / concept v2</span>
          <h1 id="it-exhibit-title">Сайт, Битрикс24 и 1С в одном живом контуре</h1>
          <p>
            Не блок с преимуществами, а интерактивная модель системы: как обращение,
            данные, коммуникации и контроль проходят через реальный B2B-процесс.
          </p>

          <div className={styles.intentLine} aria-label="Фокус концепта">
            <span>CRM</span>
            <i aria-hidden="true" />
            <span>сайт</span>
            <i aria-hidden="true" />
            <span>1С</span>
            <i aria-hidden="true" />
            <span>контроль</span>
          </div>

          <div className={styles.modeSwitch} role="tablist" aria-label="Сценарии IT-контура">
            {sceneModes.map((mode, index) => {
              const isActive = activeMode.id === mode.id;
              return (
                <button
                  key={mode.id}
                  id={`it-exhibit-mode-${mode.id}`}
                  className={styles.modeButton}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="it-exhibit-mode-panel"
                  data-active={isActive}
                  onClick={() => selectMode(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{mode.label}</strong>
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.stage} aria-label="Интерактивная карта IT-системы Onixbit">
          <div className={styles.core} aria-hidden="true">
            <Network size={38} />
            <span>Onixbit</span>
          </div>

          <div className={styles.nodeLayer}>
            {sceneNodes.map((node) => {
              const Icon = node.icon;
              const isActive = activeNodeId === node.id;
              const style: NodeStyle = {
                "--node-x": `${node.x * 100}%`,
                "--node-y": `${node.y * 100}%`,
                "--node-tone": node.tone,
                "--node-depth": node.z,
              };

              return (
                <button
                  className={styles.nodeButton}
                  key={node.id}
                  style={style}
                  type="button"
                  aria-pressed={isActive}
                  data-active={isActive}
                  onClick={() => setActiveNodeId(node.id)}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{node.title}</span>
                  <small>{node.short}</small>
                </button>
              );
            })}
          </div>
        </section>

        <aside className={styles.readout} aria-live="polite">
          <div className={styles.readoutHeader}>
            <ActiveNodeIcon size={22} aria-hidden="true" />
            <span>{activeNode.descriptor}</span>
          </div>
          <h2>{activeNode.title}</h2>
          <p>{activeNode.detail}</p>
          <strong>{activeNode.metric}</strong>
        </aside>

        <section
          className={styles.modePanel}
          id="it-exhibit-mode-panel"
          role="tabpanel"
          aria-labelledby={`it-exhibit-mode-${activeMode.id}`}
        >
          <div className={styles.panelHeader}>
            <Radar size={19} aria-hidden="true" />
            <span>{activeMode.label}</span>
          </div>
          <h2>{activeMode.title}</h2>
          <p>{activeMode.summary}</p>
          <ul>
            {activeMode.checkpoints.map((checkpoint) => (
              <li key={checkpoint}>{checkpoint}</li>
            ))}
          </ul>
          <strong>{activeMode.result}</strong>
        </section>

        <section className={styles.routeRail} aria-label="Связанные направления Onixbit">
          <div className={styles.routeLead}>
            <Sparkles size={18} aria-hidden="true" />
            <span>Из сцены в проект</span>
          </div>
          {serviceRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <Link className={styles.routeLink} href={route.href} key={route.href}>
                <Icon size={19} aria-hidden="true" />
                <span>
                  <strong>{route.title}</strong>
                  <small>{route.text}</small>
                </span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            );
          })}
          <a className={styles.primaryAction} href="#lead" data-obx-lead-open>
            <span>Обсудить контур</span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </section>

        <div className={styles.statusStack} aria-hidden="true">
          <span>
            <ShieldCheck size={14} /> noindex
          </span>
          <span>
            <Gauge size={14} /> realtime scene
          </span>
        </div>
      </main>
    </div>
  );
}
