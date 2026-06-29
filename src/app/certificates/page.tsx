import type { Metadata } from "next";
import { CertificatesExperience } from "@/components/CertificatesExperience";
import { LeadSection } from "@/components/Sections";
import { getCertificateDashboard } from "@/lib/certificate-assets";
import type { CertificateDashboard } from "@/types/certificates";

export const metadata: Metadata = {
  title: "Сертификаты: Битрикс24, 1С-Битрикс, 1С и партнёры",
  description:
    "Партнёрские статусы, компетенции и сертификаты обучения Ониксбит по Битрикс24, 1С-Битрикс, 1С, мессенджерам, сайтам и интеграциям.",
  alternates: {
    canonical: "/certificates",
  },
  openGraph: {
    title: "Сертификаты и компетенции Ониксбит",
    description:
      "Проверяемые партнёрские статусы, компетенции и обучение по Битрикс24, 1С-Битрикс, 1С и смежным сервисам.",
    url: "/certificates",
    images: ["/brand/onixbit-og.png"],
    type: "website",
  },
};

const certificateFaqItems = [
  {
    question: "Что подтверждают сертификаты Ониксбит?",
    answer:
      "Они показывают партнёрские статусы, компетенции и обучение по Битрикс24, 1С-Битрикс, 1С и смежным сервисам, которые участвуют в проектах клиентов.",
  },
  {
    question: "Зачем на странице есть Wazzup, ChatApp, АСПРО, КОНЦЕПТ и Scloud?",
    answer:
      "Это партнёры и сервисы, которые усиливают отдельные части проектов: мессенджеры в Битрикс24, шаблоны и решения для сайтов, облачную инфраструктуру и задачи вокруг 1С.",
  },
  {
    question: "Как проверить актуальность документа?",
    answer:
      "Перед стартом проекта можно запросить у менеджера подтверждение по конкретному документу. Если у сертификата есть QR-код или партнёрская проверка, используется официальный канал проверки.",
  },
  {
    question: "Нужны ли сертификаты обучения основателя?",
    answer:
      "Да, они помогают показать, что экспертиза поддерживается не только партнёрскими статусами, но и регулярным обучением по продуктам и сценариям Битрикс24.",
  },
] as const;

const certificateImage = (path: string) => "https://onixbit.ru" + encodeURI(path);

function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function buildJsonLd(dashboard: CertificateDashboard) {
  return [
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
      name: "Сертификаты, компетенции и партнёрства Ониксбит",
      description:
        "Каталог партнёрских статусов, компетенций, дополнительных партнёрств и сертификатов обучения Ониксбит по Битрикс24, 1С-Битрикс, 1С и смежным сервисам.",
      url: "https://onixbit.ru/certificates",
      inLanguage: "ru-RU",
      about: [
        {
          "@type": "Organization",
          name: "Ониксбит",
          url: "https://onixbit.ru",
        },
        { "@type": "Thing", name: "Битрикс24" },
        { "@type": "Thing", name: "1С-Битрикс" },
        { "@type": "Thing", name: "1С" },
      ],
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: dashboard.items.length,
        itemListElement: dashboard.items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: item.title,
            image: certificateImage(item.preview),
            description: item.text,
            isPartOf: item.folder,
            publisher: {
              "@type": "Organization",
              name: "Ониксбит",
              url: "https://onixbit.ru",
            },
          },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: certificateFaqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];
}

export default function CertificatesPage() {
  const dashboard = getCertificateDashboard();
  const jsonLd = buildJsonLd(dashboard);

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
