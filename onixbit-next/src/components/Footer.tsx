import Image from "next/image";
import Link from "next/link";
import { company, directions, mainNav } from "@/data/site";
import { MessengerLinks } from "./Messengers";

export function Footer() {
  return (
    <footer className="ob-footer" id="contacts">
      <div className="ob-footer__inner">
        <div className="ob-footer__brand">
          <Link className="ob-footer__logo" href="/" aria-label="Ониксбит">
            <Image
              src="/brand/onixbit-logo-footer.png"
              alt="Ониксбит"
              width={150}
              height={45}
            />
          </Link>
          <p>
            Ониксбит помогает B2B-компаниям связывать продажи, сайт, учёт и
            коммуникации в одну рабочую систему: Битрикс24, 1С-Битрикс,
            1С:Предприятие и интеграции.
          </p>
          <div className="ob-footer__contacts">
            <a href={company.phoneHref}>
              <span>Телефон</span>
              {company.phone}
            </a>
            <a href={company.emailHref}>
              <span>E-mail</span>
              {company.email}
            </a>
          </div>
          <MessengerLinks className="ob-footer__messengers" />
        </div>

        <nav className="ob-footer__nav" aria-label="Нижнее меню">
          {directions.map((direction) => (
            <Link href={direction.href} key={direction.id}>
              {direction.menuTitle}
            </Link>
          ))}
          {mainNav.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="ob-footer__bottom">
        <span>
          © 2026 Ониксбит. Разработка, внедрение и интеграции для B2B-команд.
        </span>
        <Link href="/privacy">Политика конфиденциальности</Link>
      </div>
    </footer>
  );
}
