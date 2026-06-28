"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BadgeCheck, CheckCircle2, FileCheck2, ShieldCheck, Workflow } from "lucide-react";

type CertGroup = "all" | "status" | "bitrix24" | "bitrix" | "integration";

type CertificateItem = {
  group: Exclude<CertGroup, "all">;
  type: string;
  title: string;
  text: string;
  image: string;
  width: number;
  height: number;
};

type TrustScenario = {
  id: string;
  tab: string;
  label: string;
  title: string;
  text: string;
  proof: string[];
  metric: string;
};

const certificateBase = "/media/certificates";
const cert = (name: string) => encodeURI(certificateBase + "/" + name + ".jpg");
const partnerImage = cert("Золотой партнёр Битрикс24");
const bitrixGoldImage = cert("Золотой партнёр 1С-Битрикс");

const certificates: CertificateItem[] = [
  {
    group: "status",
    type: "Партнёр",
    title: "Золотой партнёр 1С-Битрикс",
    text: "Подтверждение партнёрского статуса по разработке сайтов и решений на 1С-Битрикс.",
    image: bitrixGoldImage,
    width: 2560,
    height: 1810,
  },
  {
    group: "status",
    type: "Качество",
    title: "Качество внедрений",
    text: "Участие в программе мониторинга качества внедрений Битрикс24.",
    image: cert("Участник Программы мониторинга качества внедрений"),
    width: 1500,
    height: 1171,
  },
  {
    group: "bitrix24",
    type: "CRM",
    title: "Компетенция CRM",
    text: "Подтверждение экспертизы в настройке CRM и управлении продажами.",
    image: cert("Компетенция CRM"),
    width: 1060,
    height: 1500,
  },
  {
    group: "bitrix24",
    type: "Процессы",
    title: "Бизнес-процессы",
    text: "Автоматизация регламентов, задач, согласований и контрольных сценариев.",
    image: cert("Компетенция Бизнес-процессы"),
    width: 1060,
    height: 1500,
  },
  {
    group: "integration",
    type: "1С",
    title: "Интеграция с 1С",
    text: "Связка Битрикс24 с учётными системами, счетами, документами и статусами.",
    image: cert("Компетенция Интеграция с 1С"),
    width: 911,
    height: 1287,
  },
  {
    group: "bitrix24",
    type: "Внедрение",
    title: "Внедрение Битрикс24",
    text: "Сертификат по основным настройкам системы и базовой логике внедрения.",
    image: cert("Сертификат Внедрение Битрикс24 Основные настройки системы"),
    width: 1500,
    height: 1061,
  },
  {
    group: "integration",
    type: "Коробка",
    title: "Коробочная версия",
    text: "Компетенция для проектов с расширенной инфраструктурой и особыми требованиями.",
    image: cert("Компетенция Коробочная версия"),
    width: 910,
    height: 1285,
  },
  {
    group: "status",
    type: "Партнёр",
    title: "Бизнес-партнёр Битрикс24",
    text: "Дополнительное подтверждение партнёрского статуса и работы с платформой.",
    image: cert("Бизнес-партнёр Битрикс24"),
    width: 1500,
    height: 1171,
  },
  {
    group: "bitrix",
    type: "Право",
    title: "Авторизационное письмо 1С-Битрикс",
    text: "Подтверждение права работать с продуктами и решениями 1С-Битрикс.",
    image: cert("Авторизационное письмо 1С-Битрикс"),
    width: 1060,
    height: 1500,
  },
];

const filters: Array<{ id: CertGroup; title: string }> = [
  { id: "all", title: "Все" },
  { id: "status", title: "Статусы" },
  { id: "bitrix24", title: "Битрикс24" },
  { id: "bitrix", title: "1С-Битрикс" },
  { id: "integration", title: "Интеграции" },
];

const trustScenarios: TrustScenario[] = [
  {
    id: "crm",
    tab: "CRM",
    label: "Внедрение Битрикс24",
    title: "Проверяем не только статус, но и готовность к процессам продаж",
    text: "Компетенции CRM, бизнес-процессов и качества внедрений показывают, что подрядчик понимает воронки, роли, контроль и сопровождение после запуска.",
    proof: ["CRM", "бизнес-процессы", "качество внедрений"],
    metric: "меньше риска формальной CRM",
  },
  {
    id: "site",
    tab: "Сайт",
    label: "1С-Битрикс",
    title: "Для сайта важен официальный контур платформы и право работать с продуктом",
    text: "Партнёрский статус 1С-Битрикс и авторизационное письмо помогают до договора понять, что сайт будет развиваться на поддерживаемой базе.",
    proof: ["золотой партнёр", "право работы", "платформа сайта"],
    metric: "понятнее зона ответственности",
  },
  {
    id: "integration",
    tab: "1С",
    label: "Интеграции",
    title: "Связки с 1С требуют доказательств по обменам, а не только красивого интерфейса",
    text: "Компетенции по интеграции с 1С и коробочной версии важны, когда проект затрагивает обмены, инфраструктуру, документы и статусы заказов.",
    proof: ["интеграция с 1С", "коробочная версия", "обмены"],
    metric: "меньше ручных сверок",
  },
];

const proofIcons = [ShieldCheck, FileCheck2, Workflow] as const;

export function PartnerCertificatesBlock() {
  const [filter, setFilter] = useState<CertGroup>("all");
  const [modal, setModal] = useState<CertificateItem | null>(null);
  const [activeScenario, setActiveScenario] = useState(0);
  const [paused, setPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const modalPanelRef = useRef<HTMLDivElement | null>(null);
  const modalCloseRef = useRef<HTMLButtonElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const setModalCloseButton = useCallback((node: HTMLButtonElement | null) => {
    modalCloseRef.current = node;
    if (!node) return;

    window.requestAnimationFrame(() => {
      node.focus({ preventScroll: true });
    });
  }, []);

  const closeCertificate = useCallback(() => {
    setModal(null);
    window.setTimeout(() => {
      lastTriggerRef.current?.focus({ preventScroll: true });
    }, 0);
  }, []);

  useEffect(() => {
    if (paused || shouldReduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveScenario((value) => (value + 1) % trustScenarios.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [paused, shouldReduceMotion]);

  useLayoutEffect(() => {
    if (!modal) return;

    const original = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const focusCloseButton = () => {
      const closeButton = modalCloseRef.current ?? document.querySelector<HTMLButtonElement>(".obx-certs__modal-close");
      closeButton?.focus({ preventScroll: true });
    };

    focusCloseButton();
    const focusTimer = window.setTimeout(focusCloseButton, 40);

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCertificate();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = modalPanelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
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

    return () => {
      window.clearTimeout(focusTimer);
      document.documentElement.style.overflow = original;
      document.removeEventListener("keydown", handleKey);
    };
  }, [closeCertificate, modal]);

  const visibleCertificates = certificates.filter((item) => filter === "all" || item.group === filter);
  const activeTrust = trustScenarios[activeScenario];

  const openCertificate = (item: CertificateItem, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setModal(item);
  };

  return (
    <section className="obx-certs" id="certificates">
      <div className="obx-certs__inner">
        <div className="obx-certs__head">
          <div>
            <div className="obx-certs__eyebrow">Статус партнёра</div>
            <h2 className="obx-certs__title">Сертификаты Ониксбит, которые можно открыть и проверить</h2>
          </div>
          <p className="obx-certs__lead">
            Для B2B-клиента важна проверяемость: партнёрские статусы, компетенции Битрикс24, 1С-Битрикс, интеграции и качество внедрений собраны в одном месте.
          </p>
        </div>

        <div
          className="obx-certs__assurance"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="obx-certs__assurance-copy">
            <span className="obx-certs__badge">Интерактивная проверка</span>
            <h2 id="obx-certs-assurance-title">Как сертификаты уменьшают риск проекта</h2>
            <p>
              Выберите сценарий и посмотрите, какие документы важны не как украшение, а как подтверждение компетенции перед стартом работ.
            </p>
            <div className="obx-certs__assurance-tabs" role="tablist" aria-label="Сценарии проверки сертификатов">
              {trustScenarios.map((scenario, index) => (
                <button
                  aria-controls={"obx-cert-scenario-" + scenario.id}
                  aria-selected={activeScenario === index}
                  className={activeScenario === index ? "is-active" : ""}
                  key={scenario.id}
                  onClick={() => setActiveScenario(index)}
                  role="tab"
                  type="button"
                >
                  <span>{scenario.tab}</span>
                  <small>{scenario.label}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="obx-certs__assurance-stage" aria-labelledby="obx-certs-assurance-title">
            <div className="obx-certs__risk-flow" aria-hidden="true">
              <span>Запрос</span>
              <span>Статус</span>
              <span>Компетенция</span>
              <span>Риск ниже</span>
              <i />
              <motion.b
                animate={shouldReduceMotion ? { x: 0 } : { x: [0, 96, 192, 288, 0] }}
                className="obx-certs__flow-cursor"
                transition={{ duration: 5.2, ease: "easeInOut", repeat: Infinity }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="obx-certs__scenario-panel"
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -14 }}
                id={"obx-cert-scenario-" + activeTrust.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
                key={activeTrust.id}
                role="tabpanel"
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <span>{activeTrust.label}</span>
                <strong>{activeTrust.title}</strong>
                <p>{activeTrust.text}</p>
                <div className="obx-certs__scenario-proof" aria-label="Какие подтверждения важны">
                  {activeTrust.proof.map((item, index) => {
                    const Icon = proofIcons[index] ?? BadgeCheck;
                    return (
                      <em key={item}>
                        <Icon size={16} aria-hidden="true" />
                        {item}
                      </em>
                    );
                  })}
                </div>
                <div className="obx-certs__scenario-metric">
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <b>{activeTrust.metric}</b>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="obx-certs__proof-strip" aria-label="Как читать сертификаты Ониксбит">
          <article>
            <strong>1. Сначала статус</strong>
            <span>Подтверждает официальную работу с платформой и партнёрской экосистемой.</span>
          </article>
          <article>
            <strong>2. Затем компетенция</strong>
            <span>Показывает, какая часть проекта закрывается: CRM, процессы, коробка или 1С.</span>
          </article>
          <article>
            <strong>3. Потом границы</strong>
            <span>Помогает заранее понять, где Ониксбит ведёт работу сам, а где подключает партнёров.</span>
          </article>
        </div>

        <div className="obx-certs__layout">
          <aside className="obx-certs__partner">
            <span className="obx-certs__badge">Главное подтверждение</span>
            <button
              aria-label="Открыть сертификат: Золотой партнёр Битрикс24"
              className="obx-certs__showcase"
              type="button"
              onClick={(event) => openCertificate({
                group: "status",
                type: "Партнёр",
                title: "Золотой партнёр Битрикс24",
                text: "Главный партнёрский статус по Битрикс24.",
                image: partnerImage,
                width: 1608,
                height: 1137,
              }, event.currentTarget)}
            >
              <span className="obx-certs__showcase-frame">
                <Image
                  className="obx-certs__showcase-image"
                  src={partnerImage}
                  alt="Золотой партнёр Битрикс24"
                  width={1608}
                  height={1137}
                  sizes="(max-width: 1180px) 100vw, 330px"
                  quality={74}
                />
              </span>
              <span className="obx-certs__showcase-zoom">Открыть крупнее</span>
            </button>
            <h3 className="obx-certs__partner-title">Золотой партнёр Битрикс24</h3>
            <p className="obx-certs__partner-text">
              Главный статус показывает, что подрядчик работает с платформой официально, понимает партнёрскую экосистему и может сопровождать внедрение не как разовую настройку, а как управляемый проект.
            </p>
            <div className="obx-certs__partner-facts" aria-label="Что подтверждает главный документ">
              <div>
                <strong>Статус</strong>
                <span>официальное партнёрство</span>
              </div>
              <div>
                <strong>Проекты</strong>
                <span>внедрение и развитие Битрикс24</span>
              </div>
              <div>
                <strong>Контур</strong>
                <span>CRM, процессы, интеграции</span>
              </div>
            </div>
          </aside>

          <div className="obx-certs__catalog">
            <div className="obx-certs__catalog-top">
              <div className="obx-certs__filters" aria-label="Фильтр сертификатов" role="toolbar">
                {filters.map((item) => (
                  <button
                    className={filter === item.id ? "is-active" : ""}
                    type="button"
                    aria-pressed={filter === item.id}
                    key={item.id}
                    onClick={() => setFilter(item.id)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              <span className="obx-certs__filter-count" aria-live="polite">
                Показано {visibleCertificates.length} из {certificates.length}
              </span>
            </div>

            <motion.div className="obx-certs__grid" layout>
              <AnimatePresence mode="popLayout">
                {visibleCertificates.map((item) => (
                  <motion.article
                    animate={{ opacity: 1, y: 0 }}
                    className="obx-certs__card obx-certs__card--horizontal"
                    exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                    key={item.title + "-" + item.type}
                    layout
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <span className="obx-certs__type">{item.type}</span>
                    <div className="obx-certs__frame">
                      <button
                        aria-label={"Открыть сертификат: " + item.title}
                        className="obx-certs__preview"
                        type="button"
                        onClick={(event) => openCertificate(item, event.currentTarget)}
                      >
                        <Image
                          className="obx-certs__image"
                          src={item.image}
                          alt={item.title}
                          width={item.width}
                          height={item.height}
                          sizes="(max-width: 760px) 84vw, (max-width: 1180px) 240px, 176px"
                          quality={68}
                        />
                      </button>
                    </div>
                    <h3 className="obx-certs__card-title">{item.title}</h3>
                    <p className="obx-certs__card-text">{item.text}</p>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <div className="obx-certs__note">
          <strong>Документы доступны для проверки:</strong> сертификаты собраны рядом с пояснением, какую часть проекта
          подтверждает каждый документ. Если нужно, покажем релевантные документы до обсуждения договора.
        </div>
      </div>

      <div
        className={"obx-certs__modal " + (modal ? "is-open" : "")}
        aria-hidden={!modal}
        onMouseDown={closeCertificate}
      >
        {modal && (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-labelledby="obx-certs-modal-title"
            aria-modal="true"
            className="obx-certs__modal-dialog"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96, y: shouldReduceMotion ? 0 : 12 }}
            ref={modalPanelRef}
            role="dialog"
            transition={{ duration: 0.22, ease: "easeOut" }}
            onAnimationComplete={() => {
              modalCloseRef.current?.focus({ preventScroll: true });
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              autoFocus
              className="obx-certs__modal-close"
              type="button"
              aria-label="Закрыть сертификат"
              onClick={closeCertificate}
              ref={setModalCloseButton}
            />
            <Image
              className="obx-certs__modal-image"
              src={modal.image}
              alt={modal.title}
              width={modal.width}
              height={modal.height}
              sizes="94vw"
              quality={82}
            />
            <div className="obx-certs__modal-title" id="obx-certs-modal-title">{modal.title}</div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
