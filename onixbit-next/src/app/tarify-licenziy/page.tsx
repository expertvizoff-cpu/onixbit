import type { Metadata } from "next";
import { ArrowRight, Cloud, DatabaseZap, ServerCog, SlidersHorizontal, UsersRound } from "lucide-react";
import { LeadSection, LicenseGrid } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Тарифы лицензий",
  description: "Подбор облачных и коробочных тарифов Битрикс24 под задачи B2B-компании.",
};

const licenseRoutes = [
  {
    title: "Битрикс24 облако",
    text: "Быстрый запуск CRM, коммуникаций, задач и отчётов без собственного сервера.",
    points: ["подписка", "быстрый старт", "обновления на стороне сервиса"],
    icon: Cloud,
  },
  {
    title: "Битрикс24 коробка",
    text: "Собственная инфраструктура, глубокие доработки, сложные права и корпоративный контур.",
    points: ["свой сервер", "доработки", "контроль инфраструктуры"],
    icon: ServerCog,
  },
];

export default function TariffsPage() {
  return (
    <>
      <section className="ob-page-hero ob-section ob-page-hero--tariffs">
        <div className="ob-container ob-rich-hero ob-tariffs-hero">
          <div className="ob-tariffs-hero__copy">
            <span className="ob-kicker">Лицензии</span>
            <h1>Подбираем тариф под задачу, а не под красивую таблицу</h1>
            <p>
              Сначала разбираем пользователей, отделы, права, интеграции, отчёты и инфраструктуру. После этого понятно,
              что выгоднее для Битрикс24: облако, коробка, стандартный тариф или энтерпрайз-контур.
            </p>
          </div>
          <div className="ob-tariffs-hero__visual" aria-label="Интерактивная схема подбора лицензии">
            <div className="ob-tariffs-hero__orb ob-tariffs-hero__orb--red" />
            <div className="ob-tariffs-hero__orb ob-tariffs-hero__orb--yellow" />
            <div className="ob-tariffs-hero__screen">
              <div className="ob-tariffs-hero__topline">
                <span />
                <span />
                <span />
              </div>
              <div className="ob-tariffs-hero__meter">
                <span>Нагрузка портала</span>
                <strong>50 → 250+</strong>
              </div>
              <div className="ob-tariffs-hero__choice is-active">
                <Cloud size={19} aria-hidden="true" />
                <strong>Облако</strong>
                <em>5-250+</em>
              </div>
              <div className="ob-tariffs-hero__choice">
                <ServerCog size={19} aria-hidden="true" />
                <strong>Коробка</strong>
                <em>50-500</em>
              </div>
              <div className="ob-tariffs-hero__route">
                <span>Права</span>
                <ArrowRight size={17} aria-hidden="true" />
                <span>Диск</span>
                <ArrowRight size={17} aria-hidden="true" />
                <span>Отчёты</span>
              </div>
              <div className="ob-tariffs-hero__mini-grid" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-license-router">
          <div className="ob-page-section-head">
            <span className="ob-kicker">Выбор контура</span>
            <h2>Два сценария покупки Битрикс24</h2>
            <p>Ошибка в тарифе обычно проявляется позже: не хватает прав, отчётов, обменов, пользователей или контроля инфраструктуры.</p>
          </div>
          <div className="ob-card-grid ob-license-route-grid ob-license-route-grid--2">
            {licenseRoutes.map((item) => {
              const Icon = item.icon;
              return (
                <article className="ob-license-route" key={item.title}>
                  <Icon size={30} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <div>
                    {item.points.map((point) => <span key={point}>{point}</span>)}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-tariff-method ob-tariff-method--bright ob-tariff-method--selector">
          <div className="ob-tariff-method__content">
            <span className="ob-kicker">Методика</span>
            <h2>Как мы подбираем тариф</h2>
            <p>
              Фиксируем сценарии: кто работает в системе, какие каналы подключаются, какие данные идут между сайтом,
              CRM и 1С, какие отчёты нужны руководителю и что должно масштабироваться через год.
            </p>
          </div>
          <div className="ob-tariff-method__visual" aria-label="Схема подбора тарифа по команде, правам, контуру и запасу роста">
            <div className="ob-tariff-method__dial">
              <DatabaseZap size={36} aria-hidden="true" />
              <strong>Тариф</strong>
            </div>
            <div className="ob-tariff-method__flow">
              <span><UsersRound size={17} aria-hidden="true" />Команда</span>
              <span><SlidersHorizontal size={17} aria-hidden="true" />Права</span>
              <span><Cloud size={17} aria-hidden="true" />Контур</span>
              <span><ServerCog size={17} aria-hidden="true" />Запас роста</span>
            </div>
          </div>
        </div>
      </section>

      <LicenseGrid />

      <LeadSection />
    </>
  );
}
