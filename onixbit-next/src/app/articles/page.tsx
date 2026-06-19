import type { Metadata } from "next";
import { ArticlesPreview, LeadSection } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Статьи",
  description: "Статьи Onixbit о Битрикс24, 1С-Битрикс, 1С и интеграциях.",
};

export default function ArticlesPage() {
  return (
    <>
      <section className="ob-page-hero ob-section">
        <div className="ob-container">
          <span className="ob-kicker">Экспертность</span>
          <h1>Статьи для тех, кто выбирает систему, а не подрядчика наугад</h1>
          <p>
            Этот раздел будем развивать как библиотеку материалов для
            директоров, руководителей продаж, маркетинга и IT.
          </p>
        </div>
      </section>
      <ArticlesPreview full />
      <LeadSection />
    </>
  );
}
