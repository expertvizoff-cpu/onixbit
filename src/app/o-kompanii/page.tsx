import type { Metadata } from "next";
import { AboutPageContent } from "@/components/AboutPage";

export const metadata: Metadata = {
  title: "О компании Ониксбит: основатель, подход, сертификаты и B2B-интеграции",
  description:
    "Ониксбит — B2B-интегратор по Битрикс24, 1С-Битрикс и интеграциям с 1С. Александр Тужилкин, 14 лет опыта, партнёрские статусы, Тула и удалённая работа по России.",
  alternates: {
    canonical: "/o-kompanii",
  },
  openGraph: {
    title: "О компании Ониксбит",
    description:
      "Основатель, подход, сертификаты, реквизиты и B2B-экспертиза Ониксбит по Битрикс24, 1С-Битрикс и 1С-интеграциям.",
    url: "/o-kompanii",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
