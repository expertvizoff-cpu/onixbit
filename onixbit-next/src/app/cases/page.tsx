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
          <h1>Типовые проекты: CRM, сайты и интеграции</h1>
          <p>
            Собрали сценарии задач, с которыми чаще всего приходят B2B-команды: продажи, сайт, обмены с 1С и управленческая прозрачность.
          </p>
        </div>
      </section>
      <CasesPreview full />
      <LeadSection />
    </>
  );
}
