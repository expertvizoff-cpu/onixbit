import type { Metadata } from "next";
import { ServicePage } from "@/components/Sections";
import { bitrix24FaqItems, directions } from "@/data/site";

const direction = directions.find((item) => item.id === "bitrix24")!;
const baseUrl = "https://onixbit.ru";

function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function Bitrix24StructuredData() {
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Внедрение Битрикс24",
    serviceType: "CRM, автоматизация продаж, коммуникации и интеграции Битрикс24",
    provider: {
      "@type": "Organization",
      name: "Ониксбит",
      url: baseUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "Россия",
    },
    url: `${baseUrl}/vnedrenie-bitrix24`,
    description:
      "Внедрение Битрикс24 под продажи, процессы, роботов, права, отчёты, коммуникации и интеграции с сайтом и 1С.",
    audience: {
      "@type": "BusinessAudience",
      audienceType: "B2B-компании, отделы продаж, руководители и IT-специалисты",
    },
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Внедрение Битрикс24",
        item: `${baseUrl}/vnedrenie-bitrix24`,
      },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: bitrix24FaqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      {[service, breadcrumbs, faq].map((item, index) => (
        <script
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }}
          key={index}
          type="application/ld+json"
        />
      ))}
    </>
  );
}

export const metadata: Metadata = {
  title: "Внедрение Битрикс24 под продажи, процессы и интеграции",
  description:
    "Ониксбит внедряет Битрикс24: CRM, воронки, роботы, права, отчёты, коммуникации, интеграции с сайтом, 1С и поддержка запуска.",
  keywords: [
    "внедрение Битрикс24",
    "настройка CRM Битрикс24",
    "аудит Битрикс24",
    "роботы Битрикс24",
    "интеграция Битрикс24 с 1С",
    "Битрикс24 Тула",
  ],
  alternates: {
    canonical: "/vnedrenie-bitrix24",
  },
  openGraph: {
    title: "Внедрение Битрикс24 | Ониксбит",
    description:
      "CRM, автоматизация продаж, коммуникации, отчёты и интеграции Битрикс24 для B2B-команд.",
    url: "/vnedrenie-bitrix24",
    type: "website",
    images: ["/brand/onixbit-og.png"],
  },
};

export default function Bitrix24Page() {
  return (
    <>
      <Bitrix24StructuredData />
      <ServicePage direction={direction} />
    </>
  );
}
