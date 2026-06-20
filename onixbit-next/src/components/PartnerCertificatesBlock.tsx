"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";

type CertGroup = "all" | "status" | "bitrix24" | "bitrix" | "integration";

type CertificateItem = {
  group: Exclude<CertGroup, "all">;
  type: string;
  title: string;
  text: string;
  image: string;
};

const certificateBase = "/media/certificates";
const cert = (name: string) => encodeURI(`${certificateBase}/${name}.jpg`);
const partnerImage = cert("Золотой партнёр Битрикс24");
const bitrixGoldImage = cert("Золотой партнёр 1С-Битрикс");

const certificates: CertificateItem[] = [
  {
    group: "status",
    type: "Партнёр",
    title: "Золотой партнёр 1С-Битрикс",
    text: "Подтверждение партнёрского статуса по разработке сайтов и решений на 1С-Битрикс.",
    image: bitrixGoldImage,
  },
  {
    group: "status",
    type: "Качество",
    title: "Качество внедрений",
    text: "Участие в программе мониторинга качества внедрений Битрикс24.",
    image: cert("Участник Программы мониторинга качества внедрений"),
  },
  {
    group: "bitrix24",
    type: "CRM",
    title: "Компетенция CRM",
    text: "Подтверждение экспертизы в настройке CRM и управлении продажами.",
    image: cert("Компетенция CRM"),
  },
  {
    group: "bitrix24",
    type: "Процессы",
    title: "Бизнес-процессы",
    text: "Автоматизация регламентов, задач, согласований и контрольных сценариев.",
    image: cert("Компетенция Бизнес-процессы"),
  },
  {
    group: "integration",
    type: "1С",
    title: "Интеграция с 1С",
    text: "Связка Битрикс24 с учётными системами, счетами, документами и статусами.",
    image: cert("Компетенция Интеграция с 1С"),
  },
  {
    group: "bitrix24",
    type: "Внедрение",
    title: "Внедрение Битрикс24",
    text: "Сертификат по основным настройкам системы и базовой логике внедрения.",
    image: cert("Сертификат Внедрение Битрикс24 Основные настройки системы"),
  },
  {
    group: "integration",
    type: "Коробка",
    title: "Коробочная версия",
    text: "Компетенция для проектов с расширенной инфраструктурой и особыми требованиями.",
    image: cert("Компетенция Коробочная версия"),
  },
  {
    group: "status",
    type: "Партнёр",
    title: "Бизнес-партнёр Битрикс24",
    text: "Дополнительное подтверждение партнёрского статуса и работы с платформой.",
    image: cert("Бизнес-партнёр Битрикс24"),
  },
  {
    group: "bitrix",
    type: "Право",
    title: "Авторизационное письмо 1С-Битрикс",
    text: "Подтверждение права работать с продуктами и решениями 1С-Битрикс.",
    image: cert("Авторизационное письмо 1С-Битрикс"),
  },
];

const filters: Array<{ id: CertGroup; title: string }> = [
  { id: "all", title: "Все" },
  { id: "status", title: "Статусы" },
  { id: "bitrix24", title: "Битрикс24" },
  { id: "bitrix", title: "1С-Битрикс" },
  { id: "integration", title: "Интеграции" },
];

export function PartnerCertificatesBlock() {
  const [filter, setFilter] = useState<CertGroup>("all");
  const [modal, setModal] = useState<{ image: string; title: string } | null>(null);

  useEffect(() => {
    if (!modal) return;
    const original = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModal(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.documentElement.style.overflow = original;
      document.removeEventListener("keydown", handleKey);
    };
  }, [modal]);

  const visibleCertificates = certificates.filter((item) => filter === "all" || item.group === filter);

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

        <div className="obx-certs__layout">
          <aside className="obx-certs__partner">
            <span className="obx-certs__badge">Главное подтверждение</span>
            <button
              className="obx-certs__showcase"
              type="button"
              onClick={() => setModal({ image: partnerImage, title: "Золотой партнёр Битрикс24" })}
            >
              <span className="obx-certs__showcase-frame">
                <img
                  className="obx-certs__showcase-image"
                  src={partnerImage}
                  alt="Золотой партнёр Битрикс24"
                  loading="lazy"
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
            <div className="obx-certs__filters" aria-label="Фильтр сертификатов">
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

            <div className="obx-certs__grid">
              {visibleCertificates.map((item) => (
                <article className="obx-certs__card obx-certs__card--horizontal" key={`${item.title}-${item.type}`}>
                  <span className="obx-certs__type">{item.type}</span>
                  <div className="obx-certs__frame">
                    <button
                      className="obx-certs__preview"
                      type="button"
                      onClick={() => setModal({ image: item.image, title: item.title })}
                    >
                      <img className="obx-certs__image" src={item.image} alt={item.title} loading="lazy" />
                    </button>
                  </div>
                  <h3 className="obx-certs__card-title">{item.title}</h3>
                  <p className="obx-certs__card-text">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="obx-certs__note">
          <strong>Документы доступны для проверки:</strong> сертификаты собраны рядом с пояснением, какую часть проекта
          подтверждает каждый документ.
        </div>
      </div>

      <div className={`obx-certs__modal ${modal ? "is-open" : ""}`} aria-hidden={!modal} onMouseDown={() => setModal(null)}>
        <div
          className="obx-certs__modal-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр сертификата"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button className="obx-certs__modal-close" type="button" aria-label="Закрыть" onClick={() => setModal(null)} />
          {modal && <img className="obx-certs__modal-image" src={modal.image} alt={modal.title} />}
          <div className="obx-certs__modal-title">{modal?.title}</div>
        </div>
      </div>
    </section>
  );
}
