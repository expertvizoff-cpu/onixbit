"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { type MouseEvent, useEffect, useState } from "react";
import { company, directions, mainNav } from "@/data/site";
import { LeadButton } from "./Buttons";
import { MessengerLinks } from "./Messengers";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function scrollToDocumentTop(behavior: ScrollBehavior = "smooth") {
  const run = (scrollBehavior: ScrollBehavior) => {
    const scrollingElement = document.scrollingElement || document.documentElement;
    window.scrollTo({ top: 0, left: 0, behavior: scrollBehavior });
    scrollingElement.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  run(behavior);
  window.requestAnimationFrame(() => run("auto"));
  [80, 180, 360, 720, 1200, 1800].forEach((delay) => {
    window.setTimeout(() => run("auto"), delay);
  });
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const sync = () => setIsScrolled(window.scrollY > 12);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  useEffect(() => {
    scrollToDocumentTop("auto");
  }, [pathname]);

  const handleHeaderLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);

    if (pathname === href) {
      event.preventDefault();
      scrollToDocumentTop();
      return;
    }

    event.preventDefault();
    router.push(href, { scroll: true });
    window.setTimeout(() => scrollToDocumentTop("auto"), 120);
    window.setTimeout(() => scrollToDocumentTop("auto"), 520);
  };

  return (
    <header className={`ob-header ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="ob-header__inner">
        <Link
          className="ob-header__brand"
          href="/"
          aria-label="Ониксбит"
          onClick={(event) => handleHeaderLinkClick(event, "/")}
        >
          <Image
            src="/brand/onixbit-logo-header.png"
            alt="Ониксбит"
            width={150}
            height={45}
            priority
          />
        </Link>

        <nav className="ob-header__nav" aria-label="Основное меню">
          <div className="ob-header__nav-item">
            <Link
              className={`ob-header__nav-link ob-header__nav-link--dropdown ${
                directions.some((direction) => isActivePath(pathname, direction.href))
                  ? "is-active"
                  : ""
              }`}
              href={directions[0].href}
              onClick={(event) => handleHeaderLinkClick(event, directions[0].href)}
            >
              <span>Услуги</span>
              <ChevronDown size={15} aria-hidden="true" />
            </Link>
            <div className="ob-header__mega" aria-label="Направления услуг">
              {directions.map((direction) => (
                <Link
                  className="ob-header__mega-card"
                  href={direction.href}
                  key={direction.id}
                  onClick={(event) => handleHeaderLinkClick(event, direction.href)}
                >
                  <strong>{direction.menuTitle}</strong>
                  <span>{direction.eyebrow}</span>
                  <em>{direction.badge}</em>
                </Link>
              ))}
            </div>
          </div>

          {mainNav.map((item) => (
            <Link
              className={`ob-header__nav-link ${
                isActivePath(pathname, item.href) ? "is-active" : ""
              }`}
              href={item.href}
              key={item.href}
              onClick={(event) => handleHeaderLinkClick(event, item.href)}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="ob-header__right">
          <a className="ob-header__phone" href={company.phoneHref}>
            <Phone size={16} aria-hidden="true" />
            <span>{company.phone}</span>
          </a>
          <MessengerLinks className="ob-header__messengers" />
          <LeadButton className="ob-header__cta">Обсудить проект</LeadButton>
          <button
            className="ob-header__burger"
            type="button"
            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <nav
        className={`ob-header__mobile ${isOpen ? "is-open" : ""}`}
        aria-label="Мобильное меню"
        onClick={(event) => {
          if ((event.target as Element).closest("a")) setIsOpen(false);
        }}
      >
        <Link
          className="ob-header__mobile-link"
          href="/"
          onClick={(event) => handleHeaderLinkClick(event, "/")}
        >
          Главная
        </Link>
        {directions.map((direction) => (
          <Link
            className="ob-header__mobile-link"
            href={direction.href}
            key={direction.id}
            onClick={(event) => handleHeaderLinkClick(event, direction.href)}
          >
            {direction.menuTitle}
          </Link>
        ))}
        {mainNav.map((item) => (
          <Link
            className="ob-header__mobile-link"
            href={item.href}
            key={item.href}
            onClick={(event) => handleHeaderLinkClick(event, item.href)}
          >
            {item.title}
          </Link>
        ))}
        <div className="ob-header__mobile-footer">
          <a className="ob-header__mobile-phone" href={company.phoneHref}>
            {company.phone}
          </a>
          <MessengerLinks className="ob-header__mobile-messengers" />
          <LeadButton>Обсудить проект</LeadButton>
        </div>
      </nav>
    </header>
  );
}
