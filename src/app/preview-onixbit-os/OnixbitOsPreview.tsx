"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  DatabaseZap,
  Globe2,
  MessageSquareText,
  Mouse,
  Orbit,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import styles from "./preview.module.css";

type SceneId = "overview" | "request" | "site" | "crm" | "exchange" | "control";

type NodeId = "client" | "site" | "crm" | "bitrix" | "onec" | "control" | "onixbit";

type SceneNode = {
  id: NodeId;
  label: string;
  detail: string;
  anchor: number;
  kind: "person" | "system" | "core" | "control";
  x: number;
  y: number;
  size: number;
};

const scenes = [
  {
    id: "overview",
    marker: "00",
    eyebrow: "не страница, а ролик",
    title: "Система бизнеса раскрывается во весь экран",
    text: "Прокрутка двигает камеру: интерфейс не уезжает вниз, а перестраивается как кинематографичная сцена.",
  },
  {
    id: "request",
    marker: "01",
    eyebrow: "вход обращения",
    title: "Клиентский сигнал входит в контур",
    text: "Заявка, звонок или сообщение появляются не как отдельный блок, а как световой поток с контекстом.",
  },
  {
    id: "site",
    marker: "02",
    eyebrow: "сайт и 1С-Битрикс",
    title: "Сайт передаёт смысл, а не просто форму",
    text: "Каталог, заказ, форма и источник становятся частью маршрута, который дальше понимает CRM.",
  },
  {
    id: "crm",
    marker: "03",
    eyebrow: "Битрикс24",
    title: "CRM запускает работу вокруг заявки",
    text: "Сделка, задача, ответственный, робот и коммуникация собираются в один управляемый сценарий.",
  },
  {
    id: "exchange",
    marker: "04",
    eyebrow: "1С и обмены",
    title: "Данные проходят между системами световыми потоками",
    text: "Остатки, цены, статусы и заказы движутся по правилам, без ручного дубляжа и спорных версий.",
  },
  {
    id: "control",
    marker: "05",
    eyebrow: "контроль",
    title: "Руководитель видит целую систему, а не набор сервисов",
    text: "В финале остаётся одна сцена: сайт, CRM, 1С, обмены и контроль связаны в рабочую ОС бизнеса.",
  },
] as const satisfies ReadonlyArray<{
  id: SceneId;
  marker: string;
  eyebrow: string;
  title: string;
  text: string;
}>;

const nodes: SceneNode[] = [
  { id: "client", label: "Клиент", detail: "сигнал / запрос", anchor: 1, kind: "person", x: -36, y: 6, size: 0.92 },
  { id: "site", label: "Сайт", detail: "форма / заказ / каталог", anchor: 2, kind: "system", x: -12, y: -18, size: 0.96 },
  { id: "crm", label: "Битрикс24", detail: "сделка / задача / робот", anchor: 3, kind: "system", x: 22, y: -15, size: 1.02 },
  { id: "bitrix", label: "1С-Битрикс", detail: "витрина / контент / заказ", anchor: 2.45, kind: "system", x: -6, y: 24, size: 0.88 },
  { id: "onec", label: "1С", detail: "цены / остатки / статусы", anchor: 4, kind: "system", x: 34, y: 18, size: 0.98 },
  { id: "control", label: "Контроль", detail: "ошибки / отчёты / рост", anchor: 5, kind: "control", x: 6, y: -34, size: 0.9 },
  { id: "onixbit", label: "Onixbit", detail: "архитектура системы", anchor: 0, kind: "core", x: 0, y: 0, size: 1.2 },
];

const rails = [
  { label: "заявка", from: "client", to: "site", phase: 0.13 },
  { label: "контекст", from: "site", to: "crm", phase: 0.31 },
  { label: "заказ", from: "bitrix", to: "crm", phase: 0.45 },
  { label: "статусы", from: "crm", to: "onec", phase: 0.63 },
  { label: "остатки", from: "onec", to: "bitrix", phase: 0.72 },
  { label: "контроль", from: "crm", to: "control", phase: 0.86 },
] as const;

const hudSignals = ["сайт", "CRM", "1С", "обмены", "контроль"];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = clamp((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
}

function nodeStyle(node: SceneNode, virtualScene: number, progress: number): CSSProperties {
  const distance = node.anchor - virtualScene;
  const focus = 1 - clamp(Math.abs(distance) / 1.65);
  const orbit = progress * Math.PI * 2;
  const driftX = Math.sin(orbit + node.anchor * 0.9) * 3.6;
  const driftY = Math.cos(orbit * 0.72 + node.anchor) * 2.8;
  const x = node.x + distance * 22 + driftX;
  const y = node.y + distance * 5 + driftY;
  const depth = 1 + focus * 0.34 - Math.abs(distance) * 0.08;
  const opacity = node.kind === "core" ? 1 : 0.28 + focus * 0.72;
  const blur = Math.max(0, Math.abs(distance) - 1.05) * 5;

  return {
    "--x": `${x}vw`,
    "--y": `${y}vh`,
    "--scale": `${node.size * depth}`,
    "--opacity": opacity,
    "--blur": `${blur}px`,
    "--focus": focus,
  } as CSSProperties;
}

function railStyle(index: number, progress: number): CSSProperties {
  const shift = (progress * 0.92 + rails[index].phase) % 1;

  return {
    "--flow-progress": `${shift * 100}%`,
    "--delay": `${index * -0.55}s`,
  } as CSSProperties;
}

function sceneOpacity(index: number, virtualScene: number) {
  return smoothstep(index - 0.72, index - 0.08, virtualScene) * (1 - smoothstep(index + 0.1, index + 0.78, virtualScene));
}

export function OnixbitOsPreview() {
  const filmRef = useRef<HTMLElement | null>(null);
  const [motion, setMotion] = useState({ progress: 0, active: 0, local: 0 });

  useEffect(() => {
    let frame = 0;

    const update = () => {
      if (!filmRef.current) return;

      const rect = filmRef.current.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / scrollable);
      const virtual = progress * (scenes.length - 1);
      const active = Math.min(scenes.length - 1, Math.max(0, Math.round(virtual)));
      const local = clamp(virtual - Math.floor(virtual));

      setMotion((current) => {
        if (
          current.active === active &&
          Math.abs(current.progress - progress) < 0.004 &&
          Math.abs(current.local - local) < 0.008
        ) {
          return current;
        }

        return { progress, active, local };
      });
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const virtualScene = motion.progress * (scenes.length - 1);
  const activeScene = scenes[motion.active] ?? scenes[0];
  const worldStyle = useMemo(
    () =>
      ({
        "--p": motion.progress,
        "--local": motion.local,
        "--camera-x": `${(0.5 - motion.progress) * 34}vw`,
        "--camera-y": `${Math.sin(motion.progress * Math.PI) * -8}vh`,
        "--camera-scale": `${1 + motion.progress * 0.42}`,
        "--camera-rotate": `${(motion.progress - 0.5) * -9}deg`,
      }) as CSSProperties,
    [motion.local, motion.progress],
  );

  return (
    <div className={styles.page}>
      <section className={styles.film} ref={filmRef} aria-labelledby="motion-title">
        <div className={styles.stage} style={worldStyle} data-active={activeScene.id}>
          <div className={styles.depthGrid} aria-hidden="true" />
          <div className={styles.aurora} aria-hidden="true" />
          <div className={styles.scan} aria-hidden="true" />

          <div className={styles.introHud} aria-hidden={motion.progress > 0.16}>
            <span>
              <Sparkles size={16} aria-hidden="true" />
              motion prototype 02
            </span>
            <h1 id="motion-title">Нужен вот такой принцип: экран стоит, система движется</h1>
            <p>Сейчас проверяем механику, не финальную графику. Скроль: камера, объекты и связи должны работать как короткий ролик.</p>
          </div>

          <div className={styles.world} aria-hidden="true">
            <svg className={styles.threadMap} viewBox="0 0 1600 900" preserveAspectRatio="none">
              <defs>
                <filter id="softThreadGlow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
                <linearGradient id="threadBlue" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="rgba(237, 28, 36, 0)" />
                  <stop offset="46%" stopColor="rgba(255, 212, 90, 0.96)" />
                  <stop offset="100%" stopColor="rgba(140, 239, 255, 0.62)" />
                </linearGradient>
              </defs>
              <path className={styles.thread} d="M190 520 C330 245 540 240 760 430 S1120 570 1410 270" />
              <path className={styles.thread} d="M250 275 C470 165 620 310 760 430 S1035 215 1302 420" />
              <path className={styles.threadSoft} d="M420 735 C590 555 740 530 880 628 S1115 706 1320 626" />
              <path className={styles.threadSoft} d="M760 430 C742 210 902 130 1092 125" />
            </svg>

            {rails.map((rail, index) => (
              <span
                className={styles.flowParticle}
                data-rail={index}
                key={`${rail.from}-${rail.to}`}
                style={railStyle(index, motion.progress)}
              >
                <span>{rail.label}</span>
              </span>
            ))}

            <div className={styles.coreHalo} />

            {nodes.map((node) => {
              const Icon =
                node.id === "client"
                  ? MessageSquareText
                  : node.id === "site" || node.id === "bitrix"
                    ? Globe2
                    : node.id === "crm"
                      ? Workflow
                      : node.id === "onec"
                        ? DatabaseZap
                        : node.id === "control"
                          ? BarChart3
                          : Orbit;

              return (
                <div
                  className={styles.node}
                  data-kind={node.kind}
                  data-node={node.id}
                  key={node.id}
                  style={nodeStyle(node, virtualScene, motion.progress)}
                >
                  <span className={styles.nodeIcon}>
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <strong>{node.label}</strong>
                  <small>{node.detail}</small>
                </div>
              );
            })}

            <div className={styles.personLayer}>
              <div className={styles.person} data-role="expert">
                <span />
                <strong>эксперт</strong>
              </div>
              <div className={styles.person} data-role="client">
                <span />
                <strong>клиент</strong>
              </div>
            </div>
          </div>

          <div className={styles.sceneHud}>
            <span className={styles.marker}>{activeScene.marker}</span>
            <span className={styles.eyebrow}>{activeScene.eyebrow}</span>
            <h2>{activeScene.title}</h2>
            <p>{activeScene.text}</p>
          </div>

          <div className={styles.sceneGhosts} aria-hidden="true">
            {scenes.map((scene, index) => (
              <span
                className={styles.sceneGhost}
                key={scene.id}
                style={{ "--scene-opacity": sceneOpacity(index, virtualScene) } as CSSProperties}
              >
                {scene.title}
              </span>
            ))}
          </div>

          <div className={styles.signalStrip} aria-hidden="true">
            {hudSignals.map((signal, index) => (
              <span key={signal} data-lit={index <= motion.active || motion.active === scenes.length - 1}>
                {signal}
              </span>
            ))}
          </div>

          <div className={styles.progressRail} aria-hidden="true">
            <span style={{ transform: `scaleX(${Math.max(0.03, motion.progress)})` }} />
          </div>

          <div className={styles.scrollHint} aria-hidden={motion.progress > 0.08}>
            <Mouse size={16} aria-hidden="true" />
            <span>скроль двигает сцену</span>
          </div>

          <a className={styles.cta} href="#lead" data-obx-lead-open data-visible={motion.progress > 0.82}>
            <ShieldCheck size={18} aria-hidden="true" />
            <span>Обсудить такую систему</span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
