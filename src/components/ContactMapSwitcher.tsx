"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";

export type ContactOffice = {
  city: string;
  label: string;
  address: string;
  note: string;
  coords: { lat: number; lon: number };
};

type ContactMapSwitcherProps = {
  offices: ContactOffice[];
};

const mapPoint = (office: ContactOffice) =>
  `https://yandex.ru/map-widget/v1/?ll=${office.coords.lon},${office.coords.lat}&z=16&pt=${office.coords.lon},${office.coords.lat},pm2rdm`;

const yandexPoint = (office: ContactOffice) =>
  `https://yandex.ru/maps/?ll=${office.coords.lon},${office.coords.lat}&z=16&pt=${office.coords.lon},${office.coords.lat},pm2rdm&text=${encodeURIComponent(office.address)}`;

export function ContactMapSwitcher({ offices }: ContactMapSwitcherProps) {
  const [activeId, setActiveId] = useState(offices[0]?.city ?? "");

  const views = useMemo(() => {
    return offices.map((office) => ({
      id: office.city,
      label: office.city,
      title: office.label,
      subtitle: office.address,
      note: office.note,
      src: mapPoint(office),
      href: yandexPoint(office),
    }));
  }, [offices]);

  const active = (views.find((view) => view.id === activeId) ?? views[0])!;

  return (
    <div className="ob-contact-map" aria-label="Адреса Ониксбит на карте">
      <div className="ob-contact-map__tabs" aria-label="Выбор адреса на карте">
        <span className="ob-contact-map__tabs-label">Адрес на карте</span>
        {views.map((view) => {
          return (
            <button
              className={active.id === view.id ? "is-active" : ""}
              type="button"
              aria-pressed={active.id === view.id}
              key={view.id}
              onClick={() => setActiveId(view.id)}
            >
              <MapPin size={16} aria-hidden="true" />
              <span>{view.label}</span>
            </button>
          );
        })}
      </div>

      <div className="ob-contact-map__layout">
        <div className="ob-contact-map__frame">
          <iframe
            key={active.id}
            title={`Яндекс.Карта: ${active.title}`}
            src={active.src}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <aside className="ob-contact-map__panel">
          <div className="ob-contact-map__active" aria-live="polite">
            <span>{active.title}</span>
            <h3>{active.label}</h3>
            <strong>{active.subtitle}</strong>
            <p>{active.note}</p>
          </div>

          <div className="ob-contact-map__addresses" aria-label="Выберите адрес">
            {offices.map((office) => (
              <button
                className={active.id === office.city ? "is-active" : ""}
                type="button"
                aria-pressed={active.id === office.city}
                key={office.city}
                onClick={() => setActiveId(office.city)}
              >
                <MapPin size={17} aria-hidden="true" />
                <span>
                  <strong>{office.city}</strong>
                  <em>{office.label}</em>
                  <small>{office.address}</small>
                </span>
              </button>
            ))}
          </div>

          <a href={active.href} target="_blank" rel="noreferrer">
            Открыть в Яндекс.Картах <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </aside>
      </div>
    </div>
  );
}
