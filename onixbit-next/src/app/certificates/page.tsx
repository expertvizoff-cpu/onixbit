import type { Metadata } from "next";
import { CertificatesGrid, LeadSection } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Сертификаты",
  description: "Сертификаты и партнёрские статусы Ониксбит.",
};

export default function CertificatesPage() {
  return (
    <>
      <section className="ob-page-hero ob-section">
        <div className="ob-container">
          <span className="ob-kicker">Доверие</span>
          <h1>Сертификаты, партнёрства и подтверждение компетенций</h1>
          <p>
            Здесь собраны партнёрские статусы и документы, которые подтверждают компетенции по Битрикс24, 1С-Битрикс и интеграциям.
          </p>
        </div>
      </section>
      <CertificatesGrid />
      <LeadSection />
    </>
  );
}
