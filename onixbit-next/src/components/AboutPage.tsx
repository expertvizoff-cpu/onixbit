import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Handshake,
  Mail,
  Network,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { articles, directions } from "@/data/site";
import { LeadButton } from "./Buttons";
import { MessengerLinks } from "./Messengers";
import { PartnerCertificatesBlock } from "./PartnerCertificatesBlock";
import { LeadSection, SectionIntro } from "./Sections";

const founderFacts = [
  { value: "14 лет", label: "в разработке, внедрениях и интеграциях" },
  { value: "B2B", label: "фокус на управляемые проекты, а не разовые настройки" },
  { value: "Gold", label: "партнёрские статусы Битрикс24 и 1С-Битрикс" },
];

const orbitItems = ["CRM", "Сайт", "1С", "API"];

const responsibilityCards = [
  {
    icon: UserRoundCheck,
    title: "Личная ответственность основателя",
    text: "Сложные задачи не уходят в безымянную очередь. На старте проекта есть человек, который понимает бизнес-контекст и технические ограничения.",
  },
  {
    icon: Network,
    title: "Система вместо разрозненных настроек",
    text: "CRM, сайт, 1С, коммуникации и отчёты рассматриваем как связанную инфраструктуру, а не набор отдельных инструментов.",
  },
  {
    icon: ShieldCheck,
    title: "Честные границы компетенций",
    text: "Берём сильную интеграционную зону, а сложные 1С-задачи усиливаем партнёрской экспертизой, не обещая лишнего.",
  },
];

const roleCards = [
  {
    title: "Основатель и архитектор решения",
    text: "Разбирает задачу, фиксирует маршрут проекта и отвечает за техническую логику связки.",
  },
  {
    title: "Аналитика CRM и процессов",
    text: "Описывает роли, воронки, точки потерь, регламенты и требования к отчётности.",
  },
  {
    title: "Разработка Битрикс24",
    text: "Настраивает CRM, роботов, права, приложения, интеграции и нестандартные сценарии.",
  },
  {
    title: "Разработка на 1С-Битрикс",
    text: "Собирает сайты, каталоги, интернет-магазины, формы, личные кабинеты и обмены.",
  },
  {
    title: "Интеграции с 1С",
    text: "Настраивает обмены заказов, остатков, цен и статусов между сайтом, CRM и учётом.",
  },
  {
    title: "UX, контент и поддержка",
    text: "Помогает сделать интерфейс понятным, а развитие системы — управляемым после запуска.",
  },
];

const publicFormats = [
  {
    icon: BookOpen,
    title: "Статьи от первого лица",
    text: "Начинаем серию материалов про CRM, сайты, 1С-интеграции и типовые ошибки внедрения от лица основателя.",
  },
  {
    icon: FileText,
    title: "Кейсы и разборы",
    text: "Готовим структуру кейсов так, чтобы каждый разбор показывал задачу, решение, ограничения и измеримый результат.",
  },
  {
    icon: Handshake,
    title: "Фото и отзывы клиентов",
    text: "Публикуем только те фото, видео и отзывы, которые можно согласовать с клиентом и подтвердить реальным проектом.",
  },
];

export function AboutPageContent() {
  return (
    <>
      <section className="ob-about-hero ob-section">
        <div className="ob-container ob-about-hero__grid">
          <div className="ob-about-hero__content">
            <span className="ob-kicker">О компании</span>
            <h1 className="ob-about-hero__title">
              <span>Onixbit — интегратор</span>
              <span>для B2B-проектов,</span>
              <span>где отвечает основатель</span>
            </h1>
            <p>
              Меня зовут Александр Тужилкин. Я основатель Onixbit и эксперт по
              Битрикс24, сайтам на 1С-Битрикс и интеграциям с 1С. Помогаю B2B-компаниям
              связывать продажи, сайт, учёт и коммуникации в рабочую систему.
            </p>
            <div className="ob-actions">
              <LeadButton>Обсудить проект</LeadButton>
              <a
                className="ob-btn ob-btn--secondary"
                href="mailto:expert@onixbit.ru?subject=%D0%9B%D0%B8%D1%87%D0%BD%D0%BE%D0%B5%20%D0%BE%D0%B1%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20Onixbit"
              >
                <span>Написать лично</span>
                <Mail size={18} aria-hidden="true" />
              </a>
            </div>
            <MessengerLinks className="ob-about-hero__messengers" />
            <div className="ob-about-hero__facts" aria-label="Факты об Onixbit">
              {founderFacts.map((fact) => (
                <div key={fact.label}>
                  <strong>{fact.value}</strong>
                  <span>{fact.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ob-about-hero__visual" aria-label="Александр Тужилкин">
            <div className="ob-about-hero__orbit" aria-hidden="true">
              {orbitItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="ob-about-hero__portrait">
              <Image
                src="/media/team/founder-alexander-site.webp"
                alt="Александр Тужилкин, основатель Onixbit"
                width={900}
                height={900}
                priority
              />
            </div>
            <div className="ob-about-hero__badge ob-about-hero__badge--top">
              <Award size={18} aria-hidden="true" />
              <span>Партнёрские статусы и сертификаты</span>
            </div>
            <div className="ob-about-hero__badge ob-about-hero__badge--bottom">
              <BriefcaseBusiness size={18} aria-hidden="true" />
              <span>Личный разбор B2B-задач</span>
            </div>
            <div className="ob-about-hero__signal" aria-hidden="true">
              <span>маршрут проекта</span>
              <strong>CRM → сайт → 1С</strong>
              <i />
            </div>
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container">
          <SectionIntro
            kicker="Позиция"
            title="Мы не прячем ответственность за абстрактной командой"
            text="Пока нет настоящей командной фотосессии, честнее показывать не выдуманных людей, а понятную систему работы: кто отвечает за архитектуру, какие роли подключаются и где усиливаемся партнёрами."
          />
          <div className="ob-card-grid ob-card-grid--3">
            {responsibilityCards.map((card) => {
              const Icon = card.icon;
              return (
                <article className="ob-about-card" key={card.title}>
                  <Icon size={26} aria-hidden="true" />
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ob-section">
        <div className="ob-container ob-about-system">
          <div>
            <span className="ob-kicker">Как устроена работа</span>
            <h2>Проектная команда собирается под задачу, а не ради красивой витрины</h2>
            <p>
              В проект подключаются профильные специалисты: аналитика, разработка,
              интеграции, дизайн, коммуникации и поддержка. Такой формат помогает не
              раздувать смету и давать нужную экспертизу там, где она действительно нужна.
            </p>
          </div>
          <div className="ob-about-role-grid">
            {roleCards.map((role, index) => (
              <article className="ob-about-role" key={role.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{role.title}</h3>
                <p>{role.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container">
          <SectionIntro
            kicker="Компетенции"
            title="Три направления, которые должны работать вместе"
            text="Главная ценность Onixbit — не отдельная настройка CRM или сайта, а связка инструментов вокруг реального процесса компании."
          />
          <div className="ob-card-grid ob-card-grid--3">
            {directions.map((direction) => (
              <Link className="ob-direction-card" href={direction.href} key={direction.id}>
                <span>{direction.badge}</span>
                <strong>{direction.title}</strong>
                <p>{direction.description}</p>
                <em>
                  Подробнее <ArrowRight size={16} aria-hidden="true" />
                </em>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-about-public">
          <div>
            <span className="ob-kicker">Публичная экспертность</span>
            <h2>Onixbit будет говорить человеческим лицом, а не только логотипом</h2>
            <p>
              Статьи, видео и разборы будут развивать доверие вокруг реального опыта.
              Сначала — личная позиция основателя, затем — подтверждённые кейсы,
              отзывы и фото с заказчиками.
            </p>
          </div>
          <div className="ob-about-public__grid">
            {publicFormats.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title}>
                  <Icon size={24} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <PartnerCertificatesBlock />

      <section className="ob-section ob-section--tight">
        <div className="ob-container">
          <SectionIntro
            kicker="Материалы"
            title="Редакционный план будущих материалов"
            text="Показываем темы, которые уже готовим. После публикации карточки станут полноценными статьями и разборами."
          />
          <div className="ob-card-grid ob-card-grid--3">
            {articles.map((article) => (
              <article className="ob-article-card ob-article-card--soon" key={article.title}>
                <div>
                  <span>{article.category}</span>
                  <em>{article.minutes}</em>
                </div>
                <h3>{article.title}</h3>
                <p>{article.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-about-note">
          <CheckCircle2 size={28} aria-hidden="true" />
          <div>
            <h2>Командный раздел соберём на реальных материалах</h2>
            <p>
              Пока показываем основателя, роли, партнёрства, сертификаты и процесс.
              После фотосессии и согласованных публикаций здесь появятся живые люди,
              а не постановочная картинка ради заполнения места.
            </p>
          </div>
        </div>
      </section>

      <LeadSection />
    </>
  );
}
