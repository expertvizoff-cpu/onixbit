import { company, directions, messengers } from "@/data/site";

const baseUrl = "https://onixbit.ru";

function serialize(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: baseUrl,
    logo: `${baseUrl}/brand/onixbit-logo-header.png`,
    image: `${baseUrl}/brand/onixbit-og.png`,
    email: company.email,
    telephone: company.phone,
    description: company.summary,
    sameAs: messengers.map((item) => item.href),
    areaServed: "RU",
    address: {
      "@type": "PostalAddress",
      addressCountry: "RU",
    },
    makesOffer: {
      "@type": "OfferCatalog",
      name: "Услуги Ониксбит",
      itemListElement: directions.map((direction) => ({
        "@type": "Offer",
        name: direction.title,
        url: `${baseUrl}${direction.href}`,
        description: direction.description,
        itemOffered: {
          "@type": "Service",
          name: direction.title,
          serviceType: direction.eyebrow,
          provider: {
            "@type": "Organization",
            name: company.name,
          },
        },
      })),
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.name,
    url: baseUrl,
    inLanguage: "ru-RU",
    publisher: {
      "@type": "Organization",
      name: company.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(website) }}
      />
    </>
  );
}
