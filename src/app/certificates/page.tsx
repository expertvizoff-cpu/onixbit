import type { Metadata } from "next";
import { CertificatesExperience } from "@/components/CertificatesExperience";
import { LeadSection } from "@/components/Sections";
import { getCertificateDashboard } from "@/lib/certificate-assets";

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

const certificateImage = (path: string) => "https://onixbit.ru" + encodeURI(path);

const certificateJsonLdItems = [
  {
    name: "Золотой партнёр Битрикс24",
    image: certificateImage("/media/certificates/Битрикс24 сертификаты/Золотой партнёр Битрикс24.jpg"),
    description: "Партнёрский статус Ониксбит по Битрикс24.",
  },
  {
    name: "Золотой партнёр 1С-Битрикс",
    image: certificateImage("/media/certificates/1С-Битрикс сертификаты/Золотой партнёр 1С-Битрикс.jpg"),
    description: "Партнёрский статус Ониксбит по разработке сайтов на 1С-Битрикс.",
  },
  {
    name: "Компетенция CRM",
    image: certificateImage("/media/certificates/Битрикс24 компетенции/Компетенция CRM.jpg"),
    description: "Подтверждение компетенции по CRM и управлению продажами.",
  },
  {
    name: "Компетенция Интеграция с 1С",
    image: certificateImage("/media/certificates/Битрикс24 компетенции/Компетенция Интеграция с 1С.jpg"),
    description: "Подтверждение компетенции по интеграции Битрикс24 с 1С.",
  },
];

function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: "https://onixbit.ru",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Сертификаты",
        item: "https://onixbit.ru/certificates",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Сертификаты и партнёрские статусы Ониксбит",
    url: "https://onixbit.ru/certificates",
    inLanguage: "ru-RU",
    about: {
      "@type": "Organization",
      name: "Ониксбит",
      url: "https://onixbit.ru",
    },
    hasPart: {
      "@type": "ItemList",
      itemListElement: certificateJsonLdItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: item.name,
          image: item.image,
          description: item.description,
          publisher: {
            "@type": "Organization",
            name: "Ониксбит",
          },
        },
      })),
    },
  },
];

export default function CertificatesPage() {
  const dashboard = getCertificateDashboard();

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }}
          key={index}
          type="application/ld+json"
        />
      ))}
      <CertificatesExperience dashboard={dashboard} />
      <LeadSection />
    </>
  );
}
