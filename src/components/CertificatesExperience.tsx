"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BookOpenCheck,
  Cable,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  FolderCheck,
  Layers3,
  MessageCircle,
  PauseCircle,
  PlayCircle,
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

const projectEvidence = [
  {
    href: "/vnedrenie-bitrix24",
    label: "CRM и продажи",
    title: "Когда выбираете интегратора Битрикс24",
    text: "Смотрите партнёрство, CRM-компетенции, коробку, бизнес-процессы и связку с мессенджерами.",
    icon: MessageCircle,
  },
  {
    href: "/razrabotka-saitov-na-1c-bitrix",
    label: "Сайт и e-commerce",
    title: "Когда нужен сайт на 1С-Битрикс",
    text: "Важны партнёрский статус, компетенции по композиту, интеграции с 1С и проверенные шаблонные решения.",
    icon: Layers3,
  },
  {
    href: "/raboty-po-1c-predpriyatie",
    label: "Учёт и обмены",
    title: "Когда проект цепляется за 1С",
    text: "Ищите подтверждения по 1С-направлению, облаку, обменам и ответственности за данные между системами.",
    icon: Cable,
  },
] as const;

const verificationSteps = [
  {
    title: "Понять контур проекта",
    text: "CRM, сайт, 1С и коммуникации проверяются разными документами. Важна связка, а не один красивый статус.",
    icon: Workflow,
  },
  {
    title: "Сверить официальный след",
    text: "Если у документа есть QR-код или партнёрская проверка, статус можно подтвердить отдельно перед договором.",
    icon: ScanLine,
  },
  {
    title: "Спросить про практику",
    text: "Сертификат полезен, когда рядом есть сценарий: что именно команда будет делать в CRM, сайте, 1С или мессенджерах.",
    icon: ShieldCheck,
  },
] as const;

const certificateFaqItems = [
  {
    question: "Что подтверждают сертификаты Ониксбит?",
    answer:
      "Они показывают партнёрские статусы, компетенции и обучение по Битрикс24, 1С-Битрикс, 1С и смежным сервисам, которые участвуют в проектах клиентов.",
  },
  {
    question: "Зачем на странице есть Wazzup, ChatApp, АСПРО, КОНЦЕПТ и Scloud?",
    answer:
      "Это партнёры и сервисы, которые усиливают отдельные части проектов: мессенджеры в Битрикс24, шаблоны и решения для сайтов, облачную инфраструктуру и задачи вокруг 1С.",
  },
  {
    question: "Как проверить актуальность документа?",
    answer:
      "Перед стартом проекта можно запросить у менеджера подтверждение по конкретному документу. Если у сертификата есть QR-код или партнёрская проверка, используем официальный канал проверки.",
  },
  {
    question: "Нужны ли сертификаты обучения основателя?",
    answer:
      "Да, они помогают показать, что экспертиза поддерживается не только партнёрскими статусами, но и регулярным обучением по продуктам и сценариям Битрикс24.",
  },
] as const;

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
  const [manualPaused, setManualPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const catalogRef = useRef<HTMLElement | null>(null);
  const activeEcosystem = ecosystemAreas.find((area) => area.id === activeArea) ?? ecosystemAreas[0];

  const closeModal = useCallback(() => {
    setModal(null);
    window.setTimeout(() => {
      lastTriggerRef.current?.focus({ preventScroll: true });
    }, 0);
  }, []);
  const { panelRef, closeRef } = useModalFocus(modal, closeModal);

  useEffect(() => {
    catalogRef.current?.setAttribute("data-hydrated", "true");
  }, []);

  useEffect(() => {
    if (manualPaused || interactionPaused || shouldReduceMotion) return;

    const timer = window.setInterval(() => {
      setActiveArea((current) => {
        const index = ecosystemAreas.findIndex((area) => area.id === current);
        return ecosystemAreas[(index + 1) % ecosystemAreas.length].id;
      });
    }, 6200);

    return () => window.clearInterval(timer);
  }, [manualPaused, interactionPaused, shouldReduceMotion]);

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
        onBlurCapture={(event) => {
          const nextFocus = event.relatedTarget;

          if (!(nextFocus instanceof Node) || !event.currentTarget.contains(nextFocus)) {
            setInteractionPaused(false);
          }
        }}
        onFocusCapture={() => setInteractionPaused(true)}
        onMouseEnter={() => setInteractionPaused(true)}
        onMouseLeave={() => setInteractionPaused(false)}
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
            <div className="ob-cert-command__answer">
              <ShieldCheck size={20} aria-hidden="true" />
              <div>
                <strong>Сертификаты здесь работают как карта доверия.</strong>
                <span>Они показывают, какие части проекта команда закрывает сама, а где подключает проверенные партнёрские сервисы.</span>
              </div>
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
                    aria-controls={"cert-area-panel-" + area.id}
                    aria-selected={activeArea === area.id}
                    className={activeArea === area.id ? "is-active" : ""}
                    id={"cert-area-tab-" + area.id}
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
            <button
              aria-pressed={manualPaused}
              className="ob-cert-command__pause"
              onClick={() => setManualPaused((value) => !value)}
              type="button"
            >
              {manualPaused ? <PlayCircle size={18} aria-hidden="true" /> : <PauseCircle size={18} aria-hidden="true" />}
              <span>{manualPaused ? "Продолжить" : "Пауза"}</span>
            </button>

            <div className="ob-cert-command__map">
              <div className="ob-cert-command__core">
                <ScanLine size={22} aria-hidden="true" />
                <strong>Onixbit</strong>
                <span>команда + партнёры</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  aria-labelledby={"cert-area-tab-" + activeEcosystem.id}
                  className="ob-cert-command__detail"
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
                  id={"cert-area-panel-" + activeEcosystem.id}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
                  key={activeEcosystem.id}
                  role="tabpanel"
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

      <section className="obx-certs" data-hydrated="false" id="certificates" ref={catalogRef}>
        <div className="obx-certs__inner">
          <div className="obx-certs__head">
            <div>
              <div className="obx-certs__eyebrow">Документы и партнёрства</div>
              <h2 className="obx-certs__title">Каталог сертификатов Ониксбит по направлениям</h2>
            </div>
            <p className="obx-certs__lead">
              Сертификаты сгруппированы так же, как живёт проект: CRM, сайт, 1С, смежные партнёры и обучение основателя.
              Так проще понять, какие подтверждения важны именно для вашей задачи.
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

          <section className="obx-certs__decision" aria-labelledby="obx-certs-decision-title">
            <div className="obx-certs__decision-copy">
              <span className="obx-certs__badge">Как читать документы</span>
              <h2 id="obx-certs-decision-title">Сертификат полезен, когда понятно, какой риск он закрывает</h2>
              <p>
                Для руководителя это не коллекция дипломов, а способ быстро проверить: команда понимает платформу,
                умеет связать её с процессом и не оставит смежные сервисы без ответственности.
              </p>
              <LeadButton>Запросить подтверждения под проект</LeadButton>
            </div>
            <div className="obx-certs__decision-steps">
              {verificationSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <article key={step.title}>
                    <Icon size={20} aria-hidden="true" />
                    <strong>{step.title}</strong>
                    <span>{step.text}</span>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="obx-certs__routes" aria-label="Какие сертификаты важны для разных задач">
            {projectEvidence.map((item) => {
              const Icon = item.icon;

              return (
                <Link className="obx-certs__route" href={item.href} key={item.href}>
                  <span>
                    <Icon size={18} aria-hidden="true" />
                    {item.label}
                  </span>
                  <strong>{item.title}</strong>
                  <em>{item.text}</em>
                </Link>
              );
            })}
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
                      onPointerDown={(event) => openCertificate(item, event.currentTarget)}
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

          <section className="obx-certs__faq" aria-labelledby="obx-certs-faq-title">
            <div>
              <span className="obx-certs__badge">Вопросы перед выбором подрядчика</span>
              <h2 id="obx-certs-faq-title">Что важно понять по сертификатам</h2>
            </div>
            <div className="obx-certs__faq-list">
              {certificateFaqItems.map((item) => (
                <details key={item.question}>
                  <summary>
                    <span>{item.question}</span>
                    <ChevronDown size={18} aria-hidden="true" />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="obx-certs__note">
            <FolderCheck size={18} aria-hidden="true" />
            <span>
              <strong>Страница пополняется:</strong> новые документы появляются в своих направлениях,
              а для проверки конкретного статуса можно запросить официальный способ подтверждения перед стартом проекта.
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
