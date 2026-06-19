import type { Metadata } from "next";
import { CasesPreview, LeadSection } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Кейсы",
  description: "Кейсы Onixbit по CRM, сайтам, 1С-Битрикс и интеграциям.",
};

export default function CasesPage() {
  return (
    <>
      <section className="ob-page-hero ob-section">
        <div className="ob-container">
          <span className="ob-kicker">Кейсы</span>
          <h1>Страница кейсов уже готова под реальные истории</h1>
          <p>
            Сейчас здесь demo-наполнение для визуальной структуры. После этого
            заменим карточки на реальные проекты, цифры, ограничения и
            согласованные результаты.
          </p>
        </div>
      </section>
      <CasesPreview full />
      <LeadSection />
    </>
  );
}
