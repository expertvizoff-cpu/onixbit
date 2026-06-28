"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, MapPin, MousePointer2 } from "lucide-react";

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

type YandexCoords = [number, number];

type YandexPlacemark = {
  options: {
    set: (options: Record<string, unknown>) => void;
  };
};

type YandexMap = {
  destroy: () => void;
  setCenter: (coords: YandexCoords, zoom?: number, options?: Record<string, unknown>) => void;
  setBounds: (bounds: [YandexCoords, YandexCoords], options?: Record<string, unknown>) => unknown;
  behaviors: {
    disable: (behavior: string) => void;
  };
  geoObjects: {
    add: (object: YandexPlacemark) => void;
  };
};

type YandexMapsApi = {
  ready: (callback: () => void) => void;
  Map: new (node: HTMLElement, state: Record<string, unknown>, options?: Record<string, unknown>) => YandexMap;
  Placemark: new (
    coords: YandexCoords,
    properties: Record<string, unknown>,
    options: Record<string, unknown>,
  ) => YandexPlacemark;
};

declare global {
  interface Window {
    ymaps?: YandexMapsApi;
    __onixbitYmapsPromise?: Promise<YandexMapsApi>;
  }
}

const YMAPS_SRC = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";

const yandexPoint = (office: ContactOffice) =>
  `https://yandex.ru/maps/?ll=${office.coords.lon},${office.coords.lat}&z=16&pt=${office.coords.lon},${office.coords.lat},pm2rdm&text=${encodeURIComponent(office.address)}`;

function loadYandexMaps() {
  if (typeof window === "undefined") return Promise.reject(new Error("browser-only map"));
  if (window.ymaps) return Promise.resolve(window.ymaps);
  if (window.__onixbitYmapsPromise) return window.__onixbitYmapsPromise;

  window.__onixbitYmapsPromise = new Promise<YandexMapsApi>((resolve, reject) => {
    const complete = () => {
      if (!window.ymaps) {
        reject(new Error("Yandex Maps API did not expose ymaps"));
        return;
      }

      window.ymaps.ready(() => resolve(window.ymaps as YandexMapsApi));
    };

    const existing = document.querySelector<HTMLScriptElement>('script[data-onixbit-ymaps="true"]');
    if (existing) {
      existing.addEventListener("load", complete, { once: true });
      existing.addEventListener("error", () => reject(new Error("Yandex Maps API failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = YMAPS_SRC;
    script.async = true;
    script.dataset.onixbitYmaps = "true";
    script.addEventListener("load", complete, { once: true });
    script.addEventListener("error", () => reject(new Error("Yandex Maps API failed to load")), { once: true });
    document.head.appendChild(script);
  });

  return window.__onixbitYmapsPromise;
}

function getBounds(offices: ContactOffice[]): [YandexCoords, YandexCoords] | null {
  if (offices.length < 2) return null;

  const lats = offices.map((office) => office.coords.lat);
  const lons = offices.map((office) => office.coords.lon);

  return [
    [Math.min(...lats), Math.min(...lons)],
    [Math.max(...lats), Math.max(...lons)],
  ];
}

function getCoords(office: ContactOffice): YandexCoords {
  return [office.coords.lat, office.coords.lon];
}

function patchYandexMapAccessibility(node: HTMLElement) {
  node.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    if (!link.textContent?.trim() && !link.getAttribute("aria-label")) {
      link.setAttribute("aria-label", "Яндекс.Карты");
    }

    if (link.getAttribute("href") === "") {
      link.setAttribute("href", "https://yandex.ru/maps/");
    }
  });
}

export function ContactMapSwitcher({ offices }: ContactMapSwitcherProps) {
  const [activeId, setActiveId] = useState(offices[0]?.city ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<YandexMap | null>(null);
  const placemarksRef = useRef<Record<string, YandexPlacemark>>({});
  const mapA11yObserverRef = useRef<MutationObserver | null>(null);

  const views = useMemo(() => {
    return offices.map((office) => ({
      id: office.city,
      label: office.city,
      title: office.label,
      subtitle: office.address,
      note: office.note,
      href: yandexPoint(office),
      office,
    }));
  }, [offices]);

  const active = (views.find((view) => view.id === activeId) ?? views[0])!;

  useEffect(() => {
    const node = mapNodeRef.current;
    const firstOffice = offices[0];
    if (!node || !firstOffice) return;

    let cancelled = false;
    setStatus("loading");

    loadYandexMaps()
      .then((ymaps) => {
        if (cancelled || !mapNodeRef.current) return;

        const map = new ymaps.Map(
          mapNodeRef.current,
          {
            center: getCoords(firstOffice),
            zoom: offices.length > 1 ? 9 : 16,
            controls: ["zoomControl"],
          },
          {
            suppressMapOpenBlock: true,
            yandexMapDisablePoiInteractivity: true,
          },
        );

        map.behaviors.disable("scrollZoom");
        mapRef.current = map;

        const nextPlacemarks: Record<string, YandexPlacemark> = {};
        offices.forEach((office) => {
          const isActive = office.city === firstOffice.city;
          const placemark = new ymaps.Placemark(
            getCoords(office),
            {
              iconContent: office.city,
              hintContent: `${office.label}: ${office.address}`,
              balloonContentHeader: office.label,
              balloonContentBody: office.address,
            },
            {
              preset: isActive ? "islands#redStretchyIcon" : "islands#blackStretchyIcon",
              hideIconOnBalloonOpen: false,
            },
          );

          nextPlacemarks[office.city] = placemark;
          map.geoObjects.add(placemark);
        });
        placemarksRef.current = nextPlacemarks;

        const bounds = getBounds(offices);
        if (bounds) {
          map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 84 });
        }

        patchYandexMapAccessibility(mapNodeRef.current);
        const observer = new MutationObserver(() => patchYandexMapAccessibility(mapNodeRef.current as HTMLElement));
        observer.observe(mapNodeRef.current, { childList: true, subtree: true, attributes: true });
        mapA11yObserverRef.current = observer;

        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      placemarksRef.current = {};
      mapA11yObserverRef.current?.disconnect();
      mapA11yObserverRef.current = null;
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, [offices]);

  useEffect(() => {
    if (!active?.office || !mapRef.current) return;

    const coords = getCoords(active.office);
    mapRef.current.setCenter(coords, 16, { duration: 260 });

    Object.entries(placemarksRef.current).forEach(([city, placemark]) => {
      placemark.options.set({
        preset: city === active.id ? "islands#redStretchyIcon" : "islands#blackStretchyIcon",
      });
    });
  }, [active]);

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
          <div className="ob-contact-map__canvas" ref={mapNodeRef} />
          {status !== "ready" ? (
            <div className="ob-contact-map__fallback" role={status === "error" ? "alert" : "status"}>
              <MapPin size={22} aria-hidden="true" />
              <strong>{status === "error" ? "Карта не загрузилась" : "Загружаем карту"}</strong>
              <span>Адреса и ссылки на Яндекс.Карты доступны справа.</span>
            </div>
          ) : null}
          <div className="ob-contact-map__hint">
            <MousePointer2 size={15} aria-hidden="true" />
            <span>Масштаб колёсиком отключён</span>
          </div>
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
            Открыть адрес в Яндекс.Картах <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </aside>
      </div>
    </div>
  );
}
