"use client";

import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

const consentKey = "onixbitPrivacyConsent";

export type PrivacyConsentValue = "accepted" | "essential";

export function readPrivacyConsent(): PrivacyConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(consentKey);
  return value === "accepted" || value === "essential" ? value : null;
}

function saveConsent(value: PrivacyConsentValue) {
  window.localStorage.setItem(consentKey, value);
  window.dispatchEvent(new CustomEvent("onixbit:privacy-consent", { detail: value }));
}

export function PrivacyConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(!readPrivacyConsent());
    }, 900);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const accept = (value: PrivacyConsentValue) => {
    saveConsent(value);
    setVisible(false);
  };

  return (
    <aside className="ob-privacy-consent" aria-label="Согласие на обработку данных">
      <div className="ob-privacy-consent__icon" aria-hidden="true">
        <ShieldCheck size={22} />
      </div>
      <div className="ob-privacy-consent__content">
        <strong>Сайт использует формы, аналитику и cookies</strong>
        <p>
          Мы обрабатываем данные из форм и технические данные сайта, чтобы отвечать
          на обращения, улучшать интерфейс и понимать эффективность страниц.
          Подробности — в <Link href="/privacy">политике конфиденциальности</Link>.
        </p>
      </div>
      <div className="ob-privacy-consent__actions">
        <button type="button" className="ob-privacy-consent__accept" onClick={() => accept("accepted")}>
          Принять
        </button>
        <button type="button" className="ob-privacy-consent__ghost" onClick={() => accept("essential")}>
          Только обязательные
        </button>
      </div>
      <button
        type="button"
        className="ob-privacy-consent__close"
        aria-label="Закрыть уведомление"
        onClick={() => accept("essential")}
      >
        <X size={16} />
      </button>
    </aside>
  );
}
