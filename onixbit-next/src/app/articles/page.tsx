import type { Metadata } from "next";
import { ArticlesPreview, LeadSection } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Статьи Onixbit",
  description: "Будущие статьи Onixbit о Битрикс24, 1С-Битрикс, 1С и интеграциях для B2B-руководителей.",
};

export default function ArticlesPage() {
  return (
    <>
      <section className="ob-page-hero ob-section">
        <div className="ob-container">
          <span className="ob-kicker">Экспертность</span>
          <h1>Готовим статьи для тех, кто выбирает систему, а не подрядчика наугад</h1>
          <p>
            Материалы будут выходить от лица основателя: для директоров, руководителей продаж, маркетинга и IT, которым важно принять решение без лишнего риска.
          </p>
        </div>
      </section>
      <ArticlesPreview full />
      <LeadSection />
    </>
  );
}
