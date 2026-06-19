import type { Metadata } from "next";
import { LeadSection, LicenseGrid } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Тарифы лицензий",
  description:
    "Подбор лицензий Битрикс24, 1С-Битрикс и сервисов коммуникаций.",
};

export default function TariffsPage() {
  return (
    <>
      <section className="ob-page-hero ob-section">
        <div className="ob-container">
          <span className="ob-kicker">Лицензии</span>
          <h1>Подберём тариф под задачу, а не под красивую таблицу</h1>
          <p>
            Лицензии часто выбирают по цене, а потом доплачивают временем
            команды. Мы смотрим на пользователей, процессы, интеграции и рост.
          </p>
        </div>
      </section>
      <LicenseGrid />
      <LeadSection />
    </>
  );
}
