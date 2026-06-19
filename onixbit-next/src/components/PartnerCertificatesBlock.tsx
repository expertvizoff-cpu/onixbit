"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";

type CertGroup = "all" | "status" | "crm" | "process" | "integration";

type CertificateItem = {
  group: Exclude<CertGroup, "all">;
  type: string;
  title: string;
  text: string;
  image: string;
};

const partnerImage =
  "https://onixbit.su/upload/onixbitru/sertifikat/%D0%97%D0%BE%D0%BB%D0%BE%D1%82%D0%BE%D0%B9%20%D0%BF%D0%B0%D1%80%D1%82%D0%BD%D1%91%D1%80%20%D0%91%D0%B8%D1%82%D1%80%D0%B8%D0%BA%D1%8124.jpg";

const certificates: CertificateItem[] = [
  {
    group: "status",
    type: "Качество",
    title: "Качество внедрений",
    text: "Участие в программе мониторинга качества внедрений Битрикс24.",
    image:
      "https://onixbit.su/upload/onixbitru/sertifikat/%D0%A3%D1%87%D0%B0%D1%81%D1%82%D0%BD%D0%B8%D0%BA%20%D0%9F%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D1%8B%20%D0%BC%D0%BE%D0%BD%D0%B8%D1%82%D0%BE%D1%80%D0%B8%D0%BD%D0%B3%D0%B0%20%D0%BA%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B0%20%D0%B2%D0%BD%D0%B5%D0%B4%D1%80%D0%B5%D0%BD%D0%B8%D0%B9.jpg",
  },
  {
    group: "crm",
    type: "CRM",
    title: "Компетенция CRM",
    text: "Подтверждение экспертизы в настройке CRM и управлении продажами.",
    image:
      "https://onixbit.su/upload/onixbitru/sertifikat/%D0%9A%D0%BE%D0%BC%D0%BF%D0%B5%D1%82%D0%B5%D0%BD%D1%86%D0%B8%D1%8F%20CRM.jpg",
  },
  {
    group: "process",
    type: "Процессы",
    title: "Бизнес-процессы",
    text: "Автоматизация регламентов, задач, согласований и контрольных сценариев.",
    image:
      "https://onixbit.su/upload/onixbitru/sertifikat/%D0%9A%D0%BE%D0%BC%D0%BF%D0%B5%D1%82%D0%B5%D0%BD%D1%86%D0%B8%D1%8F%20%D0%91%D0%B8%D0%B7%D0%BD%D0%B5%D1%81-%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D1%8B.jpg",
  },
  {
    group: "integration",
    type: "1С",
    title: "Интеграция с 1С",
    text: "Связка Битрикс24 с учётными системами, счетами, документами и статусами.",
    image:
      "https://onixbit.su/upload/onixbitru/sertifikat/%D0%9A%D0%BE%D0%BC%D0%BF%D0%B5%D1%82%D0%B5%D0%BD%D1%86%D0%B8%D1%8F%20%D0%98%D0%BD%D1%82%D0%B5%D0%B3%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D1%81%201%D0%A1.jpg",
  },
  {
    group: "process",
    type: "Внедрение",
    title: "Внедрение Битрикс24",
    text: "Сертификат по основным настройкам системы и базовой логике внедрения.",
    image:
      "https://onixbit.su/upload/onixbitru/sertifikat/%D0%A1%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%20%D0%92%D0%BD%D0%B5%D0%B4%D1%80%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%91%D0%B8%D1%82%D1%80%D0%B8%D0%BA%D1%8124%20%D0%9E%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5%20%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B8%20%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B.jpg",
  },
  {
    group: "integration",
    type: "Коробка",
    title: "Коробочная версия",
    text: "Компетенция для проектов с расширенной инфраструктурой и особыми требованиями.",
    image:
      "https://onixbit.su/upload/onixbitru/sertifikat/%D0%9A%D0%BE%D0%BC%D0%BF%D0%B5%D1%82%D0%B5%D0%BD%D1%86%D0%B8%D1%8F%20%D0%9A%D0%BE%D1%80%D0%BE%D0%B1%D0%BE%D1%87%D0%BD%D0%B0%D1%8F%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F.jpg",
  },
  {
    group: "status",
    type: "Партнёр",
    title: "Бизнес-партнёр Битрикс24",
    text: "Дополнительное подтверждение партнёрского статуса и работы с платформой.",
    image:
      "https://onixbit.su/upload/onixbitru/sertifikat/%D0%91%D0%B8%D0%B7%D0%BD%D0%B5%D1%81-%D0%BF%D0%B0%D1%80%D1%82%D0%BD%D1%91%D1%80%20%D0%91%D0%B8%D1%82%D1%80%D0%B8%D0%BA%D1%8124.jpg",
  },
  {
    group: "status",
    type: "Право",
    title: "Авторизационное письмо",
    text: "Подтверждение права работать с продуктами и решениями 1С-Битрикс.",
    image:
      "https://onixbit.su/upload/onixbitru/sertifikat/%D0%90%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D0%BE%D0%B5%20%D0%BF%D0%B8%D1%81%D1%8C%D0%BC%D0%BE%201%D0%A1-%D0%91%D0%B8%D1%82%D1%80%D0%B8%D0%BA%D1%81.jpg",
  },
];

const filters: Array<{ id: CertGroup; title: string }> = [
  { id: "all", title: "Все" },
  { id: "status", title: "Статус" },
  { id: "crm", title: "CRM" },
  { id: "process", title: "Процессы" },
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
            <h2 className="obx-certs__title">Документы партнёра Битрикс24, которые можно открыть и проверить</h2>
          </div>
          <p className="obx-certs__lead">
            Для внедрения важен не только красивый сайт, но и подтверждённая компетенция: CRM, процессы, 1С, коробка,
            качество внедрений и партнёрский статус.
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
                <img className="obx-certs__showcase-image" src={partnerImage} alt="Золотой партнёр Битрикс24" loading="lazy" />
              </span>
              <span className="obx-certs__showcase-zoom">Открыть крупнее</span>
            </button>
            <h3 className="obx-certs__partner-title">Золотой партнёр Битрикс24</h3>
            <p className="obx-certs__partner-text">
              Статус нужен не для украшения страницы. Он показывает, что подрядчик работает с платформой официально и
              может вести проект внедрения как часть партнёрской экосистемы.
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
        <div className="obx-certs__modal-dialog" role="dialog" aria-modal="true" aria-label="Просмотр сертификата" onMouseDown={(event) => event.stopPropagation()}>
          <button className="obx-certs__modal-close" type="button" aria-label="Закрыть" onClick={() => setModal(null)} />
          {modal && <img className="obx-certs__modal-image" src={modal.image} alt={modal.title} />}
          <div className="obx-certs__modal-title">{modal?.title}</div>
        </div>
      </div>
    </section>
  );
}
