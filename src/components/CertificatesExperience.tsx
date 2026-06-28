"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BookOpenCheck,
  Cable,
  CheckCircle2,
  FileCheck2,
  FolderCheck,
  Layers3,
  MessageCircle,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { ButtonLink, LeadButton } from "./Buttons";
import type { CertificateArea, CertificateAsset, CertificateDashboard, CertificateGroupId } from "@/types/certificates";

type CertificatesExperienceProps = {
  dashboard: CertificateDashboard;
};

type EcosystemArea = {
  id: Exclude<CertificateArea, "training">;
  label: string;
  title: string;
  text: string;
  result: string;
  nodes: string[];
  icon: typeof Workflow;
};

const ecosystemAreas: EcosystemArea[] = [
  {
    id: "bitrix24",
    label: "CRM и коммуникации",
    title: "Битрикс24 связывает продажи, процессы и мессенджеры",
    text: "Партнёрские статусы и компетенции закрывают CRM, бизнес-процессы, коробочную версию и интеграции. Wazzup и ChatApp добавляют живые каналы общения.",
    result: "заявки, чаты и контроль в одной CRM-логике",
    nodes: ["CRM", "роботы", "бизнес-процессы", "Wazzup", "ChatApp"],
    icon: MessageCircle,
  },
  {
    id: "bitrix",
    label: "Сайты и 1С-Битрикс",
    title: "Сайт строится на платформе, компетенциях и готовых решениях",
    text: "Партнёрство 1С-Битрикс, компетенции, АСПРО и КОНЦЕПТ показывают, что сайт можно развивать не как разовый макет, а как поддерживаемый продукт.",
    result: "сайт, каталог и обмены развиваются предсказуемо",
    nodes: ["1С-Битрикс", "композит", "интеграция с 1С", "ASPRO", "КОНЦЕПТ"],
    icon: Layers3,
  },
  {
    id: "onec",
    label: "1С и облако",
    title: "Учётный контур держится рядом с CRM и сайтом",
    text: "Scloud усиливает направление 1С: когда в проекте появляются обмены, документы, статусы заказов и облачная инфраструктура, связка не остаётся без ответственного контура.",
    result: "обмены, документы и учёт не выпадают из проекта",
    nodes: ["Scloud", "1С", "обмены", "статусы", "облако"],
    icon: Cable,
  },
];

const proofIcons = [ShieldCheck, Workflow, FileCheck2, BookOpenCheck] as const;

function filterTitle(id: CertificateGroupId) {
  if (id === "all") return "Все";
  if (id === "bitrix24-status") return "Битрикс24";
  if (id === "bitrix24-competency") return "CRM-компетенции";
  if (id === "bitrix24-extra") return "Мессенджеры";
  if (id === "bitrix-status") return "1С-Битрикс";
  if (id === "bitrix-competency") return "Компетенции сайтов";
  if (id === "bitrix-extra") return "Шаблоны";
  if (id === "onec") return "1С";
  return "Обучение";
}

function cardClass(item: CertificateAsset) {
  if (item.kind === "pdf" && item.height > item.width) return "is-portrait";
  if (item.group === "training") return "is-training";
  return "is-landscape";
}

function useModalFocus(modal: CertificateAsset | null, close: () => void) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    if (!modal) return;

    const original = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const focusClose = () => closeRef.current?.focus({ preventScroll: true });
    const timer = window.setTimeout(focusClose, 30);

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    focusClose();

    return () => {
      window.clearTimeout(timer);
      document.documentElement.style.overflow = original;
      document.removeEventListener("keydown", handleKey);
    };
  }, [close, modal]);

  return { panelRef, closeRef };
}

export function CertificatesExperience({ dashboard }: CertificatesExperienceProps) {
  const [activeArea, setActiveArea] = useState<EcosystemArea["id"]>("bitrix24");
  const [filter, setFilter] = useState<CertificateGroupId>("all");
  const [modal, setModal] = useState<CertificateAsset | null>(null);
  const [paused, setPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const activeEcosystem = ecosystemAreas.find((area) => area.id === activeArea) ?? ecosystemAreas[0];

  const closeModal = useCallback(() => {
    setModal(null);
    window.setTimeout(() => {
      lastTriggerRef.current?.focus({ preventScroll: true });
    }, 0);
  }, []);
  const { panelRef, closeRef } = useModalFocus(modal, closeModal);

  useEffect(() => {
    if (paused || shouldReduceMotion) return;

    const timer = window.setInterval(() => {
      setActiveArea((current) => {
        const index = ecosystemAreas.findIndex((area) => area.id === current);
        return ecosystemAreas[(index + 1) % ecosystemAreas.length].id;
      });
    }, 6200);

    return () => window.clearInterval(timer);
  }, [paused, shouldReduceMotion]);

  const activeItems = useMemo(
    () => dashboard.items.filter((item) => item.area === activeArea).slice(0, 5),
    [activeArea, dashboard.items],
  );
  const heroStack = activeItems.slice(0, 3);
  const filterIds: CertificateGroupId[] = ["all", ...dashboard.groups.map((group) => group.id)];
  const visibleItems = dashboard.items.filter((item) => filter === "all" || item.group === filter);

  const openCertificate = (item: CertificateAsset, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setModal(item);
  };

  return (
    <>
      <section
        className="ob-section ob-cert-command"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="ob-container ob-cert-command__grid">
          <div className="ob-cert-command__copy">
            <span className="ob-kicker">Штаб компетенций</span>
            <h1>Сертификаты показывают, из каких узлов собирается проект</h1>
            <p>
              Не просто папка с документами: партнёрства, компетенции, обучение основателя и смежные сервисы собраны в карту,
              где видно, чем команда усиливает CRM, сайт, 1С и коммуникации.
            </p>
            <div className="ob-page-hero__actions">
              <LeadButton>Обсудить проект</LeadButton>
              <ButtonLink href="#certificates" variant="secondary">Смотреть документы</ButtonLink>
            </div>
            <div className="ob-cert-command__stats" aria-label="Сколько подтверждений собрано">
              <span><strong>{dashboard.stats.total}</strong>документов и сертификатов</span>
              <span><strong>{dashboard.stats.bitrix24}</strong>по Битрикс24 и коммуникациям</span>
              <span><strong>{dashboard.stats.bitrix}</strong>по сайтам и 1С-Битрикс</span>
              <span><strong>{dashboard.stats.training}</strong>курсов основателя</span>
            </div>
          </div>

          <div className="ob-cert-command__stage" aria-label="Интерактивная карта компетенций">
            <div className="ob-cert-command__switcher" role="tablist" aria-label="Направления компетенций">
              {ecosystemAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <button
                    aria-selected={activeArea === area.id}
                    className={activeArea === area.id ? "is-active" : ""}
                    key={area.id}
                    onClick={() => setActiveArea(area.id)}
                    role="tab"
                    type="button"
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span>{area.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="ob-cert-command__map">
              <div className="ob-cert-command__core">
                <ScanLine size={22} aria-hidden="true" />
                <strong>Onixbit</strong>
                <span>команда + партнёры</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="ob-cert-command__detail"
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
                  key={activeEcosystem.id}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <span>{activeEcosystem.label}</span>
                  <h2>{activeEcosystem.title}</h2>
                  <p>{activeEcosystem.text}</p>
                  <div className="ob-cert-command__nodes">
                    {activeEcosystem.nodes.map((node, index) => {
                      const Icon = proofIcons[index % proofIcons.length];
                      return (
                        <em key={node}>
                          <Icon size={15} aria-hidden="true" />
                          {node}
                        </em>
                      );
                    })}
                  </div>
                  <div className="ob-cert-command__result">
                    <CheckCircle2 size={18} aria-hidden="true" />
                    <b>{activeEcosystem.result}</b>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="ob-cert-command__stack" aria-hidden="true">
                {heroStack.map((item, index) => (
                  <motion.div
                    animate={{ opacity: 1, y: shouldReduceMotion ? 0 : [0, index === 1 ? 6 : -6, 0] }}
                    className={"ob-cert-command__doc is-doc-" + index}
                    key={item.id}
                    transition={{ duration: 5.8 + index, ease: "easeInOut", repeat: shouldReduceMotion ? 0 : Infinity }}
                  >
                    <Image src={item.preview} alt="" fill sizes="(max-width: 760px) 34vw, 170px" />
                    <span>{item.type}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="obx-certs" id="certificates">
        <div className="obx-certs__inner">
          <div className="obx-certs__head">
            <div>
              <div className="obx-certs__eyebrow">Документы и партнёрства</div>
              <h2 className="obx-certs__title">Каталог сертификатов Ониксбит по направлениям</h2>
            </div>
            <p className="obx-certs__lead">
              Сертификаты сгруппированы так же, как живёт проект: CRM, сайт, 1С, смежные партнёры и обучение основателя.
              Новые документы можно добавлять в папки, а страница подхватит их при сборке.
            </p>
          </div>

          <div className="obx-certs__proof-strip" aria-label="Как читать сертификаты Ониксбит">
            {ecosystemAreas.map((area) => (
              <article key={area.id}>
                <strong>{area.label}</strong>
                <span>{area.result}</span>
              </article>
            ))}
            <article>
              <strong>Обучение основателя</strong>
              <span>Подтверждает постоянную практику в продуктах и сценариях Битрикс24.</span>
            </article>
          </div>

          <div className="obx-certs__catalog-top">
            <div className="obx-certs__filters" aria-label="Фильтр сертификатов" role="toolbar">
              {filterIds.map((id) => (
                <button
                  aria-pressed={filter === id}
                  className={filter === id ? "is-active" : ""}
                  key={id}
                  onClick={() => setFilter(id)}
                  type="button"
                >
                  {filterTitle(id)}
                </button>
              ))}
            </div>
            <span className="obx-certs__filter-count" aria-live="polite">
              Показано {visibleItems.length} из {dashboard.items.length}
            </span>
          </div>

          <motion.div className="obx-certs__grid obx-certs__grid--ecosystem" layout>
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item) => (
                <motion.article
                  animate={{ opacity: 1, y: 0 }}
                  className={"obx-certs__card " + cardClass(item)}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
                  key={item.id}
                  layout
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <span className="obx-certs__type">{item.type}</span>
                  <div className="obx-certs__frame">
                    <button
                      aria-label={"Открыть сертификат: " + item.title}
                      className="obx-certs__preview"
                      onClick={(event) => openCertificate(item, event.currentTarget)}
                      type="button"
                    >
                      <Image
                        className="obx-certs__image"
                        src={item.preview}
                        alt={item.title}
                        fill
                        sizes="(max-width: 760px) 82vw, (max-width: 1180px) 240px, 220px"
                      />
                    </button>
                  </div>
                  <h3 className="obx-certs__card-title">{item.title}</h3>
                  <p className="obx-certs__card-text">{item.text}</p>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="obx-certs__note">
            <FolderCheck size={18} aria-hidden="true" />
            <span>
              <strong>Структура пополняемая:</strong> новые сертификаты можно добавлять в соответствующие папки,
              а PDF-превью перегенерировать командой <code>node scripts/generate-certificate-previews.mjs</code>.
            </span>
          </div>
        </div>

        <div
          aria-hidden={!modal}
          className={"obx-certs__modal " + (modal ? "is-open" : "")}
          onMouseDown={closeModal}
        >
          {modal && (
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              aria-labelledby="obx-certs-modal-title"
              aria-modal="true"
              className="obx-certs__modal-dialog"
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96, y: shouldReduceMotion ? 0 : 12 }}
              ref={panelRef}
              role="dialog"
              transition={{ duration: 0.22, ease: "easeOut" }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button
                aria-label="Закрыть сертификат"
                className="obx-certs__modal-close"
                onClick={closeModal}
                ref={closeRef}
                type="button"
              >
                <X size={20} aria-hidden="true" />
              </button>
              <div className="obx-certs__modal-media">
                <Image className="obx-certs__modal-image" src={modal.preview} alt={modal.title} fill sizes="94vw" />
              </div>
              <div className="obx-certs__modal-title" id="obx-certs-modal-title">
                <Sparkles size={17} aria-hidden="true" />
                {modal.title}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
