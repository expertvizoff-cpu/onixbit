"use client";

import { ChevronUp } from "lucide-react";
import { shouldHideGlobalChrome } from "./previewRoutes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ScrollTopButton() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const hideGlobalChrome = shouldHideGlobalChrome(pathname);

  useEffect(() => {
    if (hideGlobalChrome) return;

    const sync = () => setVisible(window.scrollY > 12);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, [hideGlobalChrome]);

  if (hideGlobalChrome) return null;

  return (
    <button
      className={`ob-scroll-top ${visible ? "is-visible" : ""}`}
      type="button"
      aria-label="Наверх"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ChevronUp size={22} aria-hidden="true" />
    </button>
  );
}
