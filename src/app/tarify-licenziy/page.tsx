import type { Metadata } from "next";
import { ArrowRight, Cloud, ServerCog } from "lucide-react";
import { LeadSection, LicenseGrid } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Тарифы лицензий",
  description: "Подбор облачных и коробочных тарифов Битрикс24 под задачи B2B-компании.",
};

const licenseRoutes = [
  {
    title: "Битрикс24 облако",
    text: "CRM, задачи и коммуникации запускаются быстро.\nСервер и обновления остаются на стороне сервиса.\nПлатите подписку и масштабируете пользователей.",
    points: ["подписка", "быстрый старт", "обновления на стороне сервиса"],
    icon: Cloud,
  },
  {
    title: "Битрикс24 коробка",
    text: "Портал живёт на вашей инфраструктуре.\nМожно глубже дорабатывать права и интеграции.\nКонтур данных остаётся под вашим контролем.",
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
              <div className="ob-tariffs-hero__license-tabs">
                <span className="is-active">Облако</span>
                <span>Коробка</span>
              </div>
              <div className="ob-tariffs-hero__meter">
                <span>Команда растёт</span>
                <strong>5 → 250+</strong>
              </div>
              <div className="ob-tariffs-hero__compare">
                <article className="is-active">
                  <Cloud size={19} aria-hidden="true" />
                  <span>Быстрый старт</span>
                  <strong>подписка</strong>
                </article>
                <article>
                  <ServerCog size={19} aria-hidden="true" />
                  <span>Свой контур</span>
                  <strong>сервер</strong>
                </article>
              </div>
              <div className="ob-tariffs-hero__route">
                <span>Люди</span>
                <ArrowRight size={17} aria-hidden="true" />
                <span>Права</span>
                <ArrowRight size={17} aria-hidden="true" />
                <span>Лимиты</span>
              </div>
              <div className="ob-tariffs-hero__decision">
                <span>Рекомендация</span>
                <strong>подобрать тариф после короткого разбора</strong>
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

      <LicenseGrid />

      <LeadSection />
    </>
  );
}
