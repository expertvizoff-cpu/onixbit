"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { readPrivacyConsent } from "./PrivacyConsent";

declare global {
  interface Window {
    ym?: (counterId: number, action: string, ...args: unknown[]) => void;
  }
}

export function YandexMetrika({ counterId }: { counterId?: string }) {
  const pathname = usePathname();
  const numericId = Number(counterId);
  const didSendInitialHit = useRef(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const syncConsent = () => setAllowed(readPrivacyConsent() === "accepted");
    syncConsent();
    window.addEventListener("onixbit:privacy-consent", syncConsent);
    window.addEventListener("storage", syncConsent);
    return () => {
      window.removeEventListener("onixbit:privacy-consent", syncConsent);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);

  useEffect(() => {
    if (!allowed || !Number.isFinite(numericId) || !window.ym) return;

    if (!didSendInitialHit.current) {
      didSendInitialHit.current = true;
      return;
    }

    window.ym(numericId, "hit", pathname);
  }, [allowed, numericId, pathname]);

  if (!allowed || !Number.isFinite(numericId) || numericId <= 0) return null;

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(${numericId}, "init", {
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: true
            });
          `,
        }}
      />
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${numericId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
