import type { Metadata } from "next";
import { ServicePage } from "@/components/Sections";
import { directions, sitesFaqItems } from "@/data/site";

const direction = directions.find((item) => item.id === "sites")!;
const baseUrl = "https://onixbit.ru";

function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function SitesStructuredData() {
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Разработка сайтов на 1С-Битрикс",
    serviceType: "Корпоративные сайты, каталоги, интернет-магазины и интеграции на 1С-Битрикс",
    provider: {
      "@type": "Organization",
      name: "Ониксбит",
      url: baseUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "Россия",
    },
    url: `${baseUrl}/razrabotka-saitov-na-1c-bitrix`,
    description:
      "Разработка и развитие сайтов на 1С-Битрикс: структура, каталог, формы, SEO-основа, интеграции с Битрикс24 и 1С.",
    audience: {
      "@type": "BusinessAudience",
      audienceType: "B2B-компании, руководители, маркетологи, IT-специалисты и отделы продаж",
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
        name: "Разработка сайтов на 1С-Битрикс",
        item: `${baseUrl}/razrabotka-saitov-na-1c-bitrix`,
      },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sitesFaqItems.map((item) => ({
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
  title: "Разработка сайтов на 1С-Битрикс с CRM и 1С-интеграциями",
  description:
    "Ониксбит проектирует корпоративные сайты, каталоги и интернет-магазины на 1С-Битрикс: структура, формы, SEO-основа, CRM, 1С и поддержка развития.",
  keywords: [
    "разработка сайтов на 1С-Битрикс",
    "сайт на 1С-Битрикс",
    "интернет-магазин на 1С-Битрикс",
    "корпоративный сайт Битрикс",
    "интеграция сайта с Битрикс24",
    "интеграция сайта с 1С",
    "ASPRO 1С-Битрикс",
  ],
  alternates: {
    canonical: "/razrabotka-saitov-na-1c-bitrix",
  },
  openGraph: {
    title: "Сайты на 1С-Битрикс | Ониксбит",
    description:
      "Корпоративные сайты, каталоги, e-commerce и интеграции с Битрикс24 и 1С.",
    url: "/razrabotka-saitov-na-1c-bitrix",
    type: "website",
    images: ["/brand/onixbit-og.png"],
  },
};

export default function SitesPage() {
  return (
    <>
      <SitesStructuredData />
      <ServicePage direction={direction} />
    </>
  );
}
