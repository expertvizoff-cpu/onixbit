import type { Metadata } from "next";
import { Building2, Cloud, ServerCog, ShoppingCart, Workflow } from "lucide-react";
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
    text: "Для структуры компании, услуг, посадочных страниц, форм заявок и контента.",
    fit: "когда нужен управляемый сайт",
  },
  {
    title: "Каталог или магазин",
    text: "Для товаров, фильтров, корзины, заказов, обменов с 1С и CRM-сценариев.",
    fit: "когда сайт участвует в продажах",
  },
  {
    title: "Энтерпрайз-контур",
    text: "Для высокой нагрузки, сложной архитектуры, личных кабинетов и расширенной интеграции.",
    fit: "когда важна масштабируемость",
  },
];

export default function TariffsPage() {
  return (
    <>
      <section className="ob-page-hero ob-section ob-page-hero--tariffs">
        <div className="ob-container ob-rich-hero">
          <div>
            <span className="ob-kicker">Лицензии</span>
            <h1>Подбираем тариф под задачу, а не под красивую таблицу</h1>
            <p>
              Сначала разбираем пользователей, отделы, права, интеграции, отчёты и инфраструктуру. После этого понятно,
              что выгоднее: облако, коробка или лицензия 1С-Битрикс под сайт.
            </p>
          </div>
          <div className="ob-page-status-card ob-page-status-card--solid">
            <strong>Перед покупкой сверяем прайс</strong>
            <span>Цены и состав тарифов могут меняться. Финальный расчёт делаем по актуальным условиям в день покупки.</span>
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
        <div className="ob-container ob-bitrix-site-license">
          <div>
            <span className="ob-kicker">1С-Битрикс</span>
            <h2>Для сайта считаем не только лицензию, но и будущую архитектуру</h2>
            <p>
              Одна и та же платформа может быть корпоративным сайтом, каталогом, интернет-магазином или сложным личным кабинетом.
              Поэтому тариф выбирается после понимания каталога, интеграций, ролей и нагрузки.
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

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-tariff-method">
          <Workflow size={30} aria-hidden="true" />
          <div>
            <h2>Как мы подбираем тариф</h2>
            <p>
              Фиксируем сценарии: кто работает в системе, какие каналы подключаются, какие данные идут между сайтом, CRM и 1С,
              какие отчёты нужны руководителю и что должно масштабироваться через год.
            </p>
          </div>
        </div>
      </section>

      <LicenseGrid />
      <LeadSection />
    </>
  );
}
