import type { Metadata } from "next";
import { ArrowRight, Building2, Cloud, DatabaseZap, ServerCog, ShoppingCart } from "lucide-react";
import { LeadSection, LicenseGrid } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Тарифы лицензий",
  description: "Подбор лицензий Битрикс24, коробочной версии и 1С-Битрикс под задачи B2B-компании.",
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
  {
    title: "1С-Битрикс",
    text: "Лицензия для сайта, каталога или интернет-магазина с дальнейшими интеграциями с CRM и 1С.",
    points: ["сайт", "e-commerce", "интеграции"],
    icon: ShoppingCart,
  },
];

const bitrixSitePlans = [
  {
    title: "Корпоративный сайт",
    text: "Для структуры компании, услуг, посадочных страниц, форм заявок, статей и SEO-контента.",
    fit: "когда сайт должен управляться командой",
  },
  {
    title: "Каталог или магазин",
    text: "Для товаров, фильтров, корзины, заказов, обменов с 1С и передачи заявок в CRM.",
    fit: "когда сайт участвует в продажах",
  },
  {
    title: "Личный кабинет",
    text: "Для B2B-клиентов, статусов заказов, документов, персональных цен и закрытых разделов.",
    fit: "когда клиентский сервис уходит в онлайн",
  },
  {
    title: "Энтерпрайз-контур",
    text: "Для высокой нагрузки, сложной архитектуры, интеграций, разделения ролей и масштабирования.",
    fit: "когда важен запас по развитию",
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
              что выгоднее: облако, коробка или лицензия 1С-Битрикс под сайт.
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
                <span>CRM</span>
                <ArrowRight size={17} aria-hidden="true" />
                <span>1С</span>
                <ArrowRight size={17} aria-hidden="true" />
                <span>BI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-license-router">
          <div className="ob-page-section-head">
            <span className="ob-kicker">Выбор контура</span>
            <h2>Три разных сценария покупки лицензии</h2>
            <p>Ошибка в тарифе обычно проявляется позже: не хватает прав, отчётов, обменов, пользователей или контроля инфраструктуры.</p>
          </div>
          <div className="ob-card-grid ob-card-grid--3 ob-license-route-grid">
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
        <div className="ob-container ob-tariff-method ob-tariff-method--bright">
          <div className="ob-tariff-method__content">
            <span className="ob-kicker">Методика</span>
            <h2>Как мы подбираем тариф</h2>
            <p>
              Фиксируем сценарии: кто работает в системе, какие каналы подключаются, какие данные идут между сайтом,
              CRM и 1С, какие отчёты нужны руководителю и что должно масштабироваться через год.
            </p>
          </div>
          <div className="ob-tariff-method__visual" aria-label="Схема данных между CRM, сайтом, 1С и отчётами">
            <DatabaseZap size={42} aria-hidden="true" />
            <div className="ob-tariff-method__nodes">
              <span>CRM</span>
              <span>Сайт</span>
              <span>1С</span>
              <span>BI</span>
            </div>
          </div>
        </div>
      </section>

      <LicenseGrid />

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-bitrix-site-license ob-bitrix-site-license--bottom">
          <div>
            <span className="ob-kicker">1С-Битрикс</span>
            <h2>Лицензию для сайта выбираем после архитектуры</h2>
            <p>
              Для сайта важна не только редакция платформы. Сначала смотрим каталог, корзину, формы, роли, интеграции,
              SEO-структуру, личные кабинеты и обмены с 1С или Битрикс24.
            </p>
          </div>
          <div className="ob-bitrix-site-license__cards">
            {bitrixSitePlans.map((item) => (
              <article key={item.title}>
                <Building2 size={22} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span>{item.fit}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LeadSection />
    </>
  );
}
