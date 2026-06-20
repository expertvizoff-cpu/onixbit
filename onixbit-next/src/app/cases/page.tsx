import type { Metadata } from "next";
import { CasesPreview, LeadSection } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Кейсы",
  description: "Будущие кейсы Ониксбит по CRM, сайтам, 1С-Битрикс и интеграциям: готовим публичные разборы реальных проектов.",
};

export default function CasesPage() {
  return (
    <>
      <section className="ob-page-hero ob-section">
        <div className="ob-container">
          <span className="ob-kicker">Кейсы</span>
          <h1>Готовим реальные кейсы: CRM, сайты и интеграции</h1>
          <p>
            Здесь появятся публичные разборы проектов после согласования с клиентами. Пока показываем направления будущих кейсов и формат, в котором будем раскрывать задачи.
          </p>
        </div>
      </section>
      <CasesPreview full />
      <LeadSection />
    </>
  );
}
