import type { Metadata } from "next";
import { ServicePage } from "@/components/Sections";
import { directions, onecFaqItems } from "@/data/site";

const direction = directions.find((item) => item.id === "onec")!;
const baseUrl = "https://onixbit.ru";

function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function OneCStructuredData() {
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Работы по 1С:Предприятие",
    serviceType: "Интеграции 1С с Битрикс24, сайтами на 1С-Битрикс и типовыми модулями обмена",
    provider: {
      "@type": "Organization",
      name: "Ониксбит",
      url: baseUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "Россия",
    },
    url: baseUrl + "/raboty-po-1c-predpriyatie",
    description:
      "Интеграции и обмены 1С с Битрикс24 и сайтами: товары, цены, остатки, заказы, статусы, контроль ошибок и границы 1С-разработки.",
    audience: {
      "@type": "BusinessAudience",
      audienceType: "B2B-компании, руководители, IT-специалисты, маркетологи и отделы продаж",
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
        name: "Работы по 1С:Предприятие",
        item: baseUrl + "/raboty-po-1c-predpriyatie",
      },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: onecFaqItems.map((item) => ({
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
  title: "Интеграции 1С с Битрикс24 и сайтами на 1С-Битрикс",
  description:
    "Ониксбит помогает связать 1С:Предприятие с Битрикс24 и сайтами на 1С-Битрикс: заказы, остатки, цены, статусы, обмены и контроль ошибок.",
  keywords: [
    "работы по 1С Предприятие",
    "интеграция 1С с Битрикс24",
    "интеграция 1С с сайтом",
    "обмен 1С Битрикс24",
    "обмен 1С и 1С-Битрикс",
    "1С остатки цены заказы статусы",
    "Scloud 1С",
  ],
  alternates: {
    canonical: "/raboty-po-1c-predpriyatie",
  },
  openGraph: {
    title: "Интеграции 1С | Ониксбит",
    description:
      "Обмены 1С, CRM и сайта: заказы, остатки, цены, статусы и управляемая поддержка.",
    url: "/raboty-po-1c-predpriyatie",
    type: "website",
    images: ["/brand/onixbit-og.png"],
  },
};

export default function OnecPage() {
  return (
    <>
      <OneCStructuredData />
      <ServicePage direction={direction} />
    </>
  );
}
