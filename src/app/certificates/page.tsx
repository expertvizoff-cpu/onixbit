import type { Metadata } from "next";
import { CertificatesGrid, LeadSection } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Сертификаты Ониксбит: партнёрства Битрикс24 и 1С-Битрикс",
  description:
    "Сертификаты, партнёрские статусы и компетенции Ониксбит по Битрикс24, 1С-Битрикс, CRM, бизнес-процессам, коробке и интеграции с 1С.",
  alternates: {
    canonical: "/certificates",
  },
  openGraph: {
    title: "Сертификаты Ониксбит",
    description:
      "Проверяемые партнёрские статусы и компетенции по Битрикс24, 1С-Битрикс и интеграциям.",
    url: "/certificates",
    type: "website",
  },
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
