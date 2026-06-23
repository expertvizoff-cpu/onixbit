"use client";

import Link from "next/link";
import { BriefcaseBusiness, FileText, Home, LayoutGrid, Send } from "lucide-react";

export function MobileDock() {
  return (
    <nav className="ob-mobile-dock" aria-label="Быстрая мобильная навигация">
      <Link href="/" aria-label="Главная">
        <Home size={19} />
        <span>Главная</span>
      </Link>
      <Link href="/vnedrenie-bitrix24" aria-label="Услуги">
        <LayoutGrid size={19} />
        <span>Услуги</span>
      </Link>
      <Link href="/cases" aria-label="Кейсы">
        <BriefcaseBusiness size={19} />
        <span>Кейсы</span>
      </Link>
      <Link href="/tarify-licenziy" aria-label="Тарифы">
        <FileText size={19} />
        <span>Тарифы</span>
      </Link>
      <a href="#lead" data-obx-lead-open aria-label="Заявка">
        <Send size={19} />
        <span>Заявка</span>
      </a>
    </nav>
  );
}
