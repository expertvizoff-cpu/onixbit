import type { Metadata } from "next";
import { ButtonLink, LeadButton } from "@/components/Buttons";
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

const certificateJsonLdItems = [
  {
    name: "Золотой партнёр Битрикс24",
    image: "https://onixbit.ru/media/certificates/Золотой партнёр Битрикс24.jpg",
    description: "Партнёрский статус Ониксбит по Битрикс24.",
  },
  {
    name: "Золотой партнёр 1С-Битрикс",
    image: "https://onixbit.ru/media/certificates/Золотой партнёр 1С-Битрикс.jpg",
    description: "Партнёрский статус Ониксбит по разработке сайтов на 1С-Битрикс.",
  },
  {
    name: "Компетенция CRM",
    image: "https://onixbit.ru/media/certificates/Компетенция CRM.jpg",
    description: "Подтверждение компетенции по CRM и управлению продажами.",
  },
  {
    name: "Компетенция Интеграция с 1С",
    image: "https://onixbit.ru/media/certificates/Компетенция Интеграция с 1С.jpg",
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
  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }}
          key={index}
          type="application/ld+json"
        />
      ))}
      <section className="ob-page-hero ob-section ob-cert-hero">
        <div className="ob-container">
          <span className="ob-kicker">Доверие</span>
          <h1>Сертификаты, партнёрства и подтверждение компетенций</h1>
          <p>
            Здесь собраны партнёрские статусы и документы, которые помогают заранее проверить подрядчика по Битрикс24, 1С-Битрикс, CRM и интеграциям с 1С.
          </p>
          <div className="ob-page-hero__actions">
            <LeadButton>Обсудить проект</LeadButton>
            <ButtonLink href="#certificates" variant="secondary">
              Смотреть документы
            </ButtonLink>
          </div>
          <div className="ob-cert-hero__signals" aria-label="Что подтверждают сертификаты">
            <span>
              <strong>Официально</strong>
              партнёрские статусы и компетенции
            </span>
            <span>
              <strong>Проверяемо</strong>
              документы открываются крупнее
            </span>
            <span>
              <strong>Практично</strong>
              понятно, какую часть проекта усиливает статус
            </span>
          </div>
        </div>
      </section>
      <CertificatesGrid />
      <LeadSection />
    </>
  );
}
