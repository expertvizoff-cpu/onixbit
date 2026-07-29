"use client";

import { ArrowRight, Play, X } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { readPrivacyConsent } from "./PrivacyConsent";

const TEST_VIDEO_SRC =
  "https://app.getreview.io/static/website-videos/video5.mp4";

function subscribePrivacyConsent(callback: () => void) {
  window.addEventListener("onixbit:privacy-consent", callback);

  return () => {
    window.removeEventListener("onixbit:privacy-consent", callback);
  };
}

function getPrivacyOpenSnapshot() {
  return !readPrivacyConsent();
}

function getServerPrivacyOpenSnapshot() {
  return false;
}

export function VideoTrustWidget() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const privacyOpen = useSyncExternalStore(
    subscribePrivacyConsent,
    getPrivacyOpenSnapshot,
    getServerPrivacyOpenSnapshot,
  );

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      restoreFocusRef.current?.focus();
    };
  }, [open]);

  if (hidden) return null;

  const handleDialogTab = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <aside
        className={privacyOpen ? "ob-video-widget ob-video-widget--privacy-open" : "ob-video-widget"}
        aria-label="Временный тест видеовиджета"
      >
        <button
          className="ob-video-widget__teaser"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span className="ob-video-widget__preview" aria-hidden="true">
            <video
              className="ob-video-widget__preview-video"
              src={TEST_VIDEO_SRC}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              tabIndex={-1}
            />
            <span className="ob-video-widget__play">
              <Play size={18} fill="currentColor" />
            </span>
            <span className="ob-video-widget__shine" />
          </span>
          <span className="ob-video-widget__copy">
            <span>Временный тест</span>
            <strong>Видео от команды</strong>
            <small>Живое обращение на сайте</small>
          </span>
        </button>
        <button
          className="ob-video-widget__hide"
          type="button"
          aria-label="Скрыть временный видеовиджет"
          onClick={() => setHidden(true)}
        >
          <X size={16} aria-hidden="true" />
        </button>
      </aside>

      {open ? (
        <div
          className="ob-video-widget__overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ob-video-widget-title"
          onMouseDown={() => setOpen(false)}
          onKeyDown={handleDialogTab}
        >
          <div
            ref={dialogRef}
            className="ob-video-widget__dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="ob-video-widget__dialog-top">
              <span>Тестовый формат</span>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Закрыть видеовиджет"
                onClick={() => setOpen(false)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <video
              className="ob-video-widget__video"
              controls
              muted
              autoPlay
              playsInline
              preload="none"
              aria-label="Тестовое видео для видеовиджета Onixbit"
            >
              <source src={TEST_VIDEO_SRC} type="video/mp4" />
              Ваш браузер не поддерживает воспроизведение видео.
            </video>

            <div className="ob-video-widget__dialog-copy">
              <p id="ob-video-widget-title">Живое видео вместо безликой плашки</p>
              <span>
                Сейчас стоит нейтральный тестовый ролик. Позже сюда можно поставить
                короткое обращение Ониксбит или настоящий видеоотзыв клиента.
              </span>
            </div>

            <a
              className="ob-video-widget__cta"
              href="#lead"
              data-obx-lead-open
              onClick={() => setOpen(false)}
            >
              <span>Получить разбор системы</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
